const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware to parse JSON body
app.use(express.json());

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Path to the 'db.json' file
const dbFilePath = path.join(__dirname, 'db.json');

// Route to serve 'notes.html'
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'notes.html'));
});

// Route to serve 'index.html' for all other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Route to get all notes
app.get('/api/notes', (req, res) => {
    try {
        const notesData = fs.readFileSync(dbFilePath, 'utf8');
        const notes = JSON.parse(notesData);
        res.json(notes);
    } catch (err) {
        console.error('Error reading notes file:', err);
        res.status(500).json({ error: 'Failed to read notes' });
    }
});

// Route to add a new note
app.post('/api/notes', (req, res) => {
    const { title, text } = req.body;

    if (!title || !text) {
        return res.status(400).json({ error: 'Title and text are required' });
    }

    const newNote = {
        id: uuidv4(),
        title,
        text
    };

    try {
        const notesData = fs.readFileSync(dbFilePath, 'utf8');
        const notes = JSON.parse(notesData);
        notes.push(newNote);
        fs.writeFileSync(dbFilePath, JSON.stringify(notes, null, 2));
        res.json(newNote);
    } catch (err) {
        console.error('Error writing to notes file:', err);
        res.status(500).json({ error: 'Failed to save note' });
    }
});

// Route to delete a note by ID
app.delete('/api/notes/:id', (req, res) => {
    const noteId = req.params.id;

    try {
        const notesData = fs.readFileSync(dbFilePath, 'utf8');
        const notes = JSON.parse(notesData);

        const updatedNotes = notes.filter((note) => note.id !== noteId);

        fs.writeFileSync(dbFilePath, JSON.stringify(updatedNotes, null, 2));
        res.json({ message: 'Note deleted successfully' });
    } catch (err) {
        console.error('Error deleting note:', err);
        res.status(500).json({ error: 'Failed to delete note' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
