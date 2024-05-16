const express = require("express");
const router = express.Router();
const path = require("path");

// Route to serve the notes page (for /notes)
router.get("/notes", function (req, res) {
  // Send the notes.html file located in the public directory
  res.sendFile(path.join(__dirname, "../public/notes.html"));
});

// Catch-all route to serve index.html for any unmatched path
router.get("/*", function (req, res) {
  // Send the index.html file for any unmatched path
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

module.exports = router;
