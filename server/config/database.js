const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME || 'tour_blog',
  process.env.DB_USER || 'root', 
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    retry: {
      max: 3,
    },
    dialectOptions: {
      connectTimeout: 60000,
    },
  }
);

const connectDB = async () => {
  try {
    console.log('🔄 Attempting to connect to MySQL database...');
    console.log(`📋 Connection details: ${process.env.DB_USER}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`);
    
    await sequelize.authenticate();
    console.log('✅ MySQL database connection established successfully');
    
    // Test a simple query
    const [results] = await sequelize.query('SELECT 1 + 1 as result');
    console.log('📊 Database query test passed:', results[0].result === 2 ? 'OK' : 'FAILED');
    
  } catch (error) {
    console.error('❌ Unable to connect to MySQL database:');
    console.error(`Error: ${error.message}`);
    
    // Provide specific error guidance
    if (error.original?.code === 'ECONNREFUSED') {
      console.error('🔍 Connection refused - MySQL server may not be running');
      console.error('💡 Try: Start MySQL service or check if port 3306 is blocked');
    } else if (error.original?.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('🔍 Access denied - Check username/password in .env file');
    } else if (error.original?.code === 'ER_BAD_DB_ERROR') {
      console.error('🔍 Database does not exist - Create the database first');
      console.error(`💡 Run: CREATE DATABASE ${process.env.DB_NAME || 'tour_blog'};`);
    } else if (error.original?.code === 'ENOTFOUND') {
      console.error('🔍 Host not found - Check DB_HOST in .env file');
    }
    
    throw error;
  }
};

module.exports = { sequelize, connectDB };
