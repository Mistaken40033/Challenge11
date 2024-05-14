const express = require('express');
const router = express.Router();
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

// Path to the JSON file where notes are stored
const notesFilePath = path.join(__dirname, '../db', 'notes.json');

// Route to get all notes
router.get('/notes', (req, res) => {
    try {
        const notesData = fs.readFileSync(notesFilePath, 'utf8');
        const notes = JSON.parse(notesData);
        res.json(notes);
    } catch (err) {
        console.error('Error reading notes file:', err);
        res.status(500).json({ error: 'Failed to read notes' });
    }
});

// Route to add a new note
router.post('/notes', (req, res) => {
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
        const notesData = fs.readFileSync(notesFilePath, 'utf8');
        const notes = JSON.parse(notesData);
        notes.push(newNote);
        fs.writeFileSync(notesFilePath, JSON.stringify(notes, null, 2));
        res.json(newNote);
    } catch (err) {
        console.error('Error writing to notes file:', err);
        res.status(500).json({ error: 'Failed to save note' });
    }
});

// Route to delete a note by ID
router.delete('/notes/:id', (req, res) => {
    const noteId = req.params.id;

    try {
        let notesData = fs.readFileSync(notesFilePath, 'utf8');
        let notes = JSON.parse(notesData);

        const updatedNotes = notes.filter((note) => note.id !== noteId);

        fs.writeFileSync(notesFilePath, JSON.stringify(updatedNotes, null, 2));
        res.json({ message: 'Note deleted successfully' });
    } catch (err) {
        console.error('Error deleting note:', err);
        res.status(500).json({ error: 'Failed to delete note' });
    }
});

module.exports = router;
