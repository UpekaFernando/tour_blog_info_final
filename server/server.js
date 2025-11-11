const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const { sequelize, connectDB } = require('./config/database');

// Import routes
const userRoutes = require('./routes/userRoutes');
const destinationRoutes = require('./routes/destinationRoutes');
const districtRoutes = require('./routes/districtRoutes');
const commentRoutes = require('./routes/commentRoutes');
const ratingRoutes = require('./routes/ratingRoutes');

// Config
dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working!' });
});

// Test image serving
app.get('/api/test-image', (req, res) => {
  const fs = require('fs');
  const imagePath = path.join(__dirname, 'uploads', 'profilePicture-1756319966564.jpeg');
  
  console.log('Testing image path:', imagePath);
  console.log('Image exists:', fs.existsSync(imagePath));
  
  res.json({ 
    imagePath,
    exists: fs.existsSync(imagePath),
    staticUrl: '/uploads/profilePicture-1756319966564.jpeg'
  });
});

// Routes
app.use('/api/users', userRoutes);
app.use('/api/destinations', destinationRoutes);
app.use('/api/districts', districtRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/ratings', ratingRoutes);

// Start server and connect to database
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
    
    // Connect to MySQL
    await connectDB();
    
    // Sync all models with database (in development only)
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: true });
      console.log('Database synchronized successfully');
    }
  } catch (error) {
    console.error(`Error: ${error.message}`);
    console.log('Server running in limited mode without database. Some features will not work.');
  }
};

startServer();
