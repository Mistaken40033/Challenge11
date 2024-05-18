const router = require('express').Router();
const { createNewNote, updateDb } = require("../../lib/notes");
const { v4: uuidv4 } = require('uuid');
const { notes } = require("../../db/db.json");

// Show all notes in JSON format
router.get("/notes", (req, res) => {
    res.json(notes);
});

// Create a new note
router.post("/notes", (req, res) => {
    req.body.id = uuidv4();
    const newNote = createNewNote(req.body, notes);
    res.json(newNote);
});

// Delete a note by ID
router.delete("/notes/:id", (req, res) => {
    const id = req.params.id;
    const noteIndex = notes.findIndex(note => note.id === id);

    if (noteIndex !== -1) {
        notes.splice(noteIndex, 1);
        updateDb(notes);
        res.sendStatus(204);  // No Content
    } else {
        res.status(404).json({ error: "Note not found" });
    }
});

module.exports = router;
