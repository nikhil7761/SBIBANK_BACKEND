const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config(); // For environment variables

const app = express();
app.use(cors());
app.use(express.json());

// Create connection to MySQL
const db = mysql.createConnection({
  host: process.env.DB_HOST,     // Correct environment variable name
  user: process.env.DB_USER,     // Correct environment variable name
  password: process.env.DB_PASSWORD, // Correct environment variable name
  database: process.env.DB_NAME  // Correct environment variable name
});

db.connect(err => {
  if (err) {
    console.error('Database connection failed:', err.stack);
    return;
  }
  console.log('Connected to database');
});

// Handle login request
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const query = 'SELECT * FROM users WHERE username = ? AND password = ?';
  
  db.query(query, [username, password], (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ error: 'Database query error' });
    }
    if (results.length > 0) {
      res.json({ success: true, message: 'Login successful!' });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  });
},

// Handle sign-up request
app.post('/signup', (req, res) => {
  const { username, password } = req.body;
  const query = 'INSERT INTO users (username, password) VALUES (?, ?)';

  db.query(query, [username, password], (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ success: false, message: 'Sign-up error' });
    }
    res.json({ success: true, message: 'Sign-up successful!' });
  });
}),

// Fetch all users
app.get('/users', (req, res) => {
  const query = 'SELECT * FROM users';

  db.query(query, (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ error: 'Database query error' });
    }
    res.json(results); // Send the list of users as a JSON response
  });
})




);

// Start the server
app.listen(3003, () => {
  console.log('Server running on port 3003');
});
