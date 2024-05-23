// Express import
const express = require("express");
// File system module import
const fs = require("fs");
// Path import
const path = require("path");
// Helper method for generating unique ids
//const uniqid = require("notes");

// Port
const PORT = process.env.PORT || 3001;

// Creates new app with express
const app = express();

// Middleware
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



app.get("/api/notes", function (req, res) {
  
  let jsonData = fs.readFileSync(path.join(__dirname,'./db/db.json'), 'utf8');
  let parsedData = JSON.parse(jsonData, null, 4);
  console.log(parsedData);
  res.json(parsedData);
  
});

app.post("/api/notes", function (req, res) {
  
  let newNote = req.body
  newNote.id = Math.random().toString()
  let jsonData = fs.readFileSync(path.join(__dirname,'./db/db.json'), 'utf8');
  let parsedData = JSON.parse(jsonData, null, 4);
  parsedData.push(newNote);
  
  console.log(parsedData);
  
  fs.writeFileSync(path.join(__dirname, './db/db.json'), JSON.stringify(parsedData));
  res.json(newNote);
  
});


app.get("/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/notes.html"))
);

app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/index.html"))
);

// App.listen is used to spin up our local server
app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} `)
);
