const User = require('./User');
const District = require('./District');
const Destination = require('./Destination');
const Comment = require('./Comment');
const Rating = require('./Rating');

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

module.exports = {
  User,
  District,
  Destination,
  Comment,
  Rating
};
