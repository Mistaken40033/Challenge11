const express = require("express");
const router = express.Router();
const uuid = require("uuid");
// Assuming DB module handles note operations
const DB = require('./api-routes'); // Make sure to define and export DB methods

// Route to get all notes
router.get("/api/notes", async function (req, res) {
  try {
    const notes = await DB.readNotes();
    return res.json(notes);
  } catch (error) {
    console.error("Error fetching notes:", error);
    return res.status(500).json({ error: "Failed to fetch notes" });
  }
});

// Route to add a new note
router.post("/api/notes", async function (req, res) {
  try {
    const currentNotes = await DB.readNotes();
    const newNote = {
      id: uuid(),
      title: req.body.title,
      text: req.body.text,
    };

    await DB.addNote([...currentNotes, newNote]);

    return res.status(201).json(newNote); // Send the new note with a 201 Created status
  } catch (error) {
    console.error("Error adding new note:", error);
    return res.status(500).json({ error: "Failed to add new note" });
  }
});

// Route to delete a note by ID
router.delete("/api/notes/:id", async function (req, res) {
  try {
    const noteToDelete = req.params.id;
    const currentNotes = await DB.readNotes();
    const newNoteData = currentNotes.filter((note) => note.id !== noteToDelete);

    await DB.deleteNote(newNoteData);

    return res.json(newNoteData); // Send the updated list of notes after deletion
  } catch (error) {
    console.error("Error deleting note:", error);
    return res.status(500).json({ error: "Failed to delete note" });
  }
});

module.exports = router;
