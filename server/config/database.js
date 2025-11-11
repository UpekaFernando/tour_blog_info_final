const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME || 'Tourbloginfo_prj2',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
    port: process.env.DB_PORT || 3306,
    logging: console.log,
    dialectOptions: {
      // For MySQL 8.0+
      charset: 'utf8mb4',
    },
  }
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('MySQL database connected successfully');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    console.log('Server running in limited mode without database. Some features will not work.');
  }
};

module.exports = { sequelize, connectDB };
