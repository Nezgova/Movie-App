const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',      // Host where the MySQL server is running
  user: 'root',           // Replace with your MySQL username
  password: '',           // Replace with your MySQL password (blank if none)
  database: 'movieapp',   // Replace with your database name
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
  } else {
    console.log('Connected to the database');
  }
});

module.exports = db;
