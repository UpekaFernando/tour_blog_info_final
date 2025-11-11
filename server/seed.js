require('dotenv').config();
const { sequelize } = require('./config/database');
const { User, District, Destination } = require('./models');
const bcrypt = require('bcryptjs');

// Districts data
const districts = [
  {
    name: 'Colombo',
    description: 'The commercial capital and largest city of Sri Lanka, featuring modern buildings, shopping malls, and colonial architecture.',
    mapCoordinates: { lat: 6.9271, lng: 79.8612 },
    imageUrl: '/uploads/colombo.jpg',
    province: 'Western Province'
  },
  {
    name: 'Kandy',
    description: 'The cultural capital of Sri Lanka, home to the Temple of the Tooth Relic and surrounded by beautiful hills.',
    mapCoordinates: { lat: 7.2906, lng: 80.6337 },
    imageUrl: '/uploads/kandy.jpg',
    province: 'Central Province'
  },
  {
    name: 'Galle',
    description: 'A historic city with a well-preserved Dutch fort, beautiful beaches, and colonial architecture.',
    mapCoordinates: { lat: 6.0535, lng: 80.2210 },
    imageUrl: '/uploads/galle.jpg',
    province: 'Southern Province'
  },
  {
    name: 'Anuradhapura',
    description: 'An ancient city with well-preserved ruins of an ancient Sinhalese civilization.',
    mapCoordinates: { lat: 8.3114, lng: 80.4037 },
    imageUrl: '/uploads/anuradhapura.jpg',
    province: 'North Central Province'
  },
  {
    name: 'Nuwara Eliya',
    description: 'Known as "Little England", a beautiful hill station with tea plantations and cool climate.',
    mapCoordinates: { lat: 6.9497, lng: 80.7891 },
    imageUrl: '/uploads/nuwara_eliya.jpg',
    province: 'Central Province'
  }
];

// Admin user data
const adminUser = {
  name: 'Admin User',
  email: 'admin@example.com',
  password: 'admin123',
  isAdmin: true
};

// Regular user data
const regularUser = {
  name: 'Regular User',
  email: 'user@example.com',
  password: 'user123',
  isAdmin: false
};

// Sample destinations
const sampleDestination = {
  title: 'Temple of the Tooth Relic',
  description: 'The Temple of the Sacred Tooth Relic is a world-famous Buddhist temple located in the city of Kandy, Sri Lanka. It is located in the royal palace complex of the former Kingdom of Kandy, which houses the relic of the tooth of the Buddha.',
  images: ['/uploads/temple_tooth.jpg', '/uploads/temple_tooth2.jpg'],
  location: { lat: 7.2936, lng: 80.6413 },
  bestTimeToVisit: 'July-August during the Esala Perahera festival',
  travelTips: 'Dress modestly with shoulders and knees covered. Remove shoes before entering the temple. Visit early morning or late afternoon to avoid crowds.'
};

// Function to seed the database
const seedDatabase = async () => {
  try {
    // Sync database
    await sequelize.sync({ force: true });
    console.log('Database synced');
    
    // Create admin user (password will be hashed by User model hook)
    const admin = await User.create(adminUser);
    console.log('Admin user created');
    
    // Create regular user (password will be hashed by User model hook)
    const user = await User.create(regularUser);
    console.log('Regular user created');
    
    // Create districts
    const createdDistricts = await District.bulkCreate(districts);
    console.log('Districts created');
    
    // Create a sample destination in Kandy
    const kandyDistrict = createdDistricts.find(district => district.name === 'Kandy');
    
    if (kandyDistrict) {
      await Destination.create({
        ...sampleDestination,
        districtId: kandyDistrict.id,
        authorId: admin.id
      });
      console.log('Sample destination created');
    }
    
    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seed function
seedDatabase();
