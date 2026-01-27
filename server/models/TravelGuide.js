const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const TravelGuide = sequelize.define('TravelGuide', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  category: {
    type: DataTypes.ENUM(
      'planning',
      'transport',
      'budget',
      'cultural',
      'safety',
      'visa',
      'emergency',
      'language',
      'other'
    ),
    allowNull: false
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  summary: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  tags: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true
  },
  isOfficial: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    comment: 'Official guides from admins vs user-contributed'
  },
  isVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  viewCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  helpfulCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  }
}, {
  tableName: 'travel_guides',
  timestamps: true
});

module.exports = TravelGuide;
