const mysql = require('mysql2/promise');
require('dotenv').config();

async function createDatabase() {
  try {
    // Connect to MySQL without specifying a database
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      port: process.env.DB_PORT || 3306
    });

    console.log('Connected to MySQL server');

    // Create the new database
    const dbName = process.env.DB_NAME || 'Tourbloginfo_prj2';
    
    // Drop database if it exists (optional - remove if you want to keep existing data)
    await connection.execute(`DROP DATABASE IF EXISTS \`${dbName}\``);
    console.log(`Database ${dbName} dropped if existed`);
    
    // Create the new database
    await connection.execute(`CREATE DATABASE \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
    console.log(`Database ${dbName} created successfully`);

    await connection.end();
    console.log('Database setup completed');
    
  } catch (error) {
    console.error('Error creating database:', error);
    process.exit(1);
  }
}

// Run the function
createDatabase();
