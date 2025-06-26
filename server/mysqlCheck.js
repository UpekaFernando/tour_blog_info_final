const mysql = require('mysql2');
require('dotenv').config();

// Create a MySQL connection
const connection = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  port: process.env.DB_PORT || 3306
});

// Connect to MySQL server
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL server:', err);
    return;
  }
  
  console.log('Connected to MySQL server successfully!');
  
  // Check if database exists
  connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME || 'sri_lanka_travel'} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`, (err, results) => {
    if (err) {
      console.error('Error creating database:', err);
      connection.end();
      return;
    }
    
    console.log(`Database "${process.env.DB_NAME || 'sri_lanka_travel'}" created or already exists.`);
    connection.end(() => {
      console.log('MySQL connection closed.');
    });
  });
});
