const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const District = sequelize.define('District', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  mapCoordinates: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: {}
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: false
  },
  province: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  timestamps: true
});

module.exports = District;
