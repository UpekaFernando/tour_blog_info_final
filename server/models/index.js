const User = require('./User');
const District = require('./District');
const Destination = require('./Destination');
const Comment = require('./Comment');
const Rating = require('./Rating');
const LocalService = require('./LocalService');
const TravelGuide = require('./TravelGuide');

// Define relationships
// District - Destination relationship
District.hasMany(Destination, {
  foreignKey: 'districtId',
  as: 'destinations',
  onDelete: 'CASCADE'
});
Destination.belongsTo(District, {
  foreignKey: 'districtId'
});

// User - Destination relationship
User.hasMany(Destination, {
  foreignKey: 'authorId',
  as: 'destinations'
});
Destination.belongsTo(User, {
  foreignKey: 'authorId',
  as: 'author'
});

// User - Comment relationship
User.hasMany(Comment, {
  foreignKey: 'userId',
  as: 'comments'
});
Comment.belongsTo(User, {
  foreignKey: 'userId'
});

// Destination - Comment relationship
Destination.hasMany(Comment, {
  foreignKey: 'destinationId',
  as: 'comments',
  onDelete: 'CASCADE'
});
Comment.belongsTo(Destination, {
  foreignKey: 'destinationId'
});

// User - Rating relationship
User.hasMany(Rating, {
  foreignKey: 'userId',
  as: 'ratings'
});
Rating.belongsTo(User, {
  foreignKey: 'userId'
});

// Destination - Rating relationship
Destination.hasMany(Rating, {
  foreignKey: 'destinationId',
  as: 'ratings',
  onDelete: 'CASCADE'
});
Rating.belongsTo(Destination, {
  foreignKey: 'destinationId'
});

// User - LocalService relationship
User.hasMany(LocalService, {
  foreignKey: 'userId',
  as: 'localServices'
});
LocalService.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});

// User - TravelGuide relationship
User.hasMany(TravelGuide, {
  foreignKey: 'userId',
  as: 'travelGuides'
});
TravelGuide.belongsTo(User, {
  foreignKey: 'userId',
  as: 'author'
});

module.exports = {
  User,
  District,
  Destination,
  Comment,
  Rating,
  LocalService,
  TravelGuide
};
