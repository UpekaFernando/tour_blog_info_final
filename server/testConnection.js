const mysql = require('mysql2/promise');
require('dotenv').config();

async function testConnection() {
  try {
    console.log('Testing connection with the following parameters:');
    console.log(`Host: ${process.env.DB_HOST || 'localhost'}`);
    console.log(`User: ${process.env.DB_USER || 'root'}`);
    console.log(`Password: "${process.env.DB_PASSWORD || ''}"`);
    console.log(`Port: ${process.env.DB_PORT || 3306}`);
      const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      port: process.env.DB_PORT || 3306
    });
    
    console.log('Connection successful!');
    
    // Check if database exists
    const [rows] = await connection.execute(`SHOW DATABASES LIKE '${process.env.DB_NAME || 'sri_lanka_travel'}'`);
    
    if (rows.length === 0) {
      console.log(`Database '${process.env.DB_NAME || 'sri_lanka_travel'}' doesn't exist, creating it...`);
      await connection.execute(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME || 'sri_lanka_travel'} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
      console.log('Database created successfully!');
    } else {
      console.log(`Database '${process.env.DB_NAME || 'sri_lanka_travel'}' already exists.`);
    }
    
    await connection.end();
  } catch (error) {
    console.error('Connection error:', error);
  }
}

testConnection();
