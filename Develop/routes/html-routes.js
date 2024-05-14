const express = require('express');
const path = require('path');

const router = express.Router();

// Route to serve the notes page
router.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'notes.html'));
});

// Default route - serve the homepage
router.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

module.exports = router;
