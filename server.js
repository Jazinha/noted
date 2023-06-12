const express = require('express');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));


// HTML Routes
app.get('/notes', (req, res) => {
  res.sendFile(__dirname + '/public/notes.html');
});

app.get('*', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// API Routes
app.get('/api/notes', (req, res) => {
  fs.readFile('db.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'An error occurred while reading the notes.' });
    }

    const notes = JSON.parse(data);
    res.json(notes);
  });
});

app.post('/api/notes', (req, res) => {
  fs.readFile('db.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'An error occurred while reading the notes.' });
    }

    const notes = JSON.parse(data);
    const newNote = {
      id: uuidv4(),
      title: req.body.title,
      text: req.body.text
    };

    notes.push(newNote);

    fs.writeFile('db.json', JSON.stringify(notes), (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'An error occurred while saving the note.' });
      }

      res.json(newNote);
    });
  });
});


// Start the server
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
