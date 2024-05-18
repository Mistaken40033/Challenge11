const express = require('express');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3001;
const notesFilePath = path.join(__dirname, 'db', 'db.json');

// Middleware to parse JSON body
app.use(express.json());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Route to serve the notes page
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'notes.html'));
});

// Route to get all notes
app.get('/api/notes', (req, res) => {
  try {
    const notesData = fs.readFileSync(notesFilePath, 'utf8');
    const notes = JSON.parse(notesData);
    res.json(notes);
  } catch (error) {
    console.error('Error reading notes file:', error);
    res.status(500).json({ error: 'Failed to read notes' });
  }
});

// Route to add a new note
app.post('/api/notes', (req, res) => {
  const { title, text } = req.body;

  if (!title || !text) {
    return res.status(400).json({ error: 'Title and text are required' });
  }

  const newNote = { id: uuidv4(), title, text };

  try {
    const notesData = fs.readFileSync(notesFilePath, 'utf8');
    const notes = JSON.parse(notesData);

    notes.push(newNote);

    fs.writeFileSync(notesFilePath, JSON.stringify(notes, null, 2));

    res.status(201).json(newNote); // Respond with the newly created note
  } catch (error) {
    console.error('Error saving new note:', error);
    res.status(500).json({ error: 'Failed to save new note' });
  }
});

// Route to delete a note by ID
app.delete('/api/notes/:id', (req, res) => {
  try {
    const noteToDelete = req.params.id;
    const notesData = fs.readFileSync(notesFilePath, 'utf8');
    let notes = JSON.parse(notesData);

    notes = notes.filter(note => note.id !== noteToDelete);

    fs.writeFileSync(notesFilePath, JSON.stringify(notes, null, 2));

    res.json({ message: 'Note deleted successfully' }); // Respond with a success message
  } catch (error) {
    console.error('Error deleting note:', error);
    res.status(500).json({ error: 'Failed to delete note' });
  }
});

// Catch-all route to serve the homepage for any unmatched routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
