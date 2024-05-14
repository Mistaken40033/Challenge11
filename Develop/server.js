const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to serve static files from the 'public' directory
app.use(express.static('public'));
// Middleware to parse JSON bodies
app.use(express.json());

// Routes
app.get('/notes', (req, res) => {
  // Return the notes.html file
  res.sendFile(path.join(__dirname, 'public', 'notes.html'));
});

// Default route for all other GET requests
app.get('*', (req, res) => {
  // Return the index.html file
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
