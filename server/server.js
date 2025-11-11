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
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'], // Allow both Vite and Create React App ports
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Disable caching for API routes
app.use('/api', (req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  next();
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Test route
app.get('/api/test', async (req, res) => {
  try {
    // Test database connection
    await sequelize.authenticate();
    res.json({ 
      message: 'API is working!',
      database: 'Connected',
      status: 'OK'
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'API is working but database connection failed',
      database: 'Disconnected',
      error: error.message,
      status: 'ERROR'
    });
  }
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
    // Start server first
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
    
    // Connect to MySQL with retry logic
    let retries = 3;
    while (retries > 0) {
      try {
        await connectDB();
        console.log('✅ Database connected successfully');
        break;
      } catch (error) {
        retries--;
        console.error(`❌ Database connection attempt failed. Retries left: ${retries}`);
        console.error(`Error: ${error.message}`);
        
        if (retries === 0) {
          throw error;
        }
        
        // Wait 5 seconds before retry
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    }
    
    // Sync all models with database (in development only)
    // Disabled to prevent data loss from foreign key constraint changes
    // if (process.env.NODE_ENV === 'development') {
    //   await sequelize.sync({ alter: true });
    //   console.log('📊 Database synchronized successfully');
    // }
    
    console.log('🎉 Server fully initialized');
    
  } catch (error) {
    console.error(`❌ Server startup error: ${error.message}`);
    console.log('⚠️ Server running in limited mode without database. Some features will not work.');
    
    // Log specific database connection details for debugging
    if (error.name === 'SequelizeConnectionError') {
      console.error('🔍 Database connection details:');
      console.error('- Check if MySQL server is running');
      console.error('- Verify database credentials in .env file');
      console.error('- Ensure database exists');
      console.error('- Check firewall settings');
    }
  }
};

startServer();
