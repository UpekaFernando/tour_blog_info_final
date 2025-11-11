const { sequelize, connectDB } = require('./config/database');
const { User, District, Destination, Comment, Rating } = require('./models');

async function seedDatabase() {
  try {
    console.log('Connecting to database...');
    await connectDB();
    
    console.log('Syncing database models...');
    await sequelize.sync({ force: true });
    console.log('Database models synchronized');

    console.log('Creating initial data...');

    // Create districts
    const districts = await District.bulkCreate([
      { name: 'Colombo', description: 'The commercial capital of Sri Lanka', imageUrl: 'https://example.com/colombo.jpg', province: 'Western' },
      { name: 'Kandy', description: 'The cultural capital and former royal kingdom', imageUrl: 'https://example.com/kandy.jpg', province: 'Central' },
      { name: 'Galle', description: 'Historic coastal city with Dutch colonial heritage', imageUrl: 'https://example.com/galle.jpg', province: 'Southern' },
      { name: 'Anuradhapura', description: 'Ancient capital with Buddhist temples', imageUrl: 'https://example.com/anuradhapura.jpg', province: 'North Central' },
      { name: 'Polonnaruwa', description: 'Medieval capital with archaeological sites', imageUrl: 'https://example.com/polonnaruwa.jpg', province: 'North Central' },
      { name: 'Nuwara Eliya', description: 'Hill country tea plantation region', imageUrl: 'https://example.com/nuwara-eliya.jpg', province: 'Central' },
      { name: 'Ella', description: 'Scenic hill town with mountain views', imageUrl: 'https://example.com/ella.jpg', province: 'Uva' },
      { name: 'Sigiriya', description: 'Ancient rock fortress and UNESCO World Heritage site', imageUrl: 'https://example.com/sigiriya.jpg', province: 'Central' },
      { name: 'Negombo', description: 'Coastal city near the international airport', imageUrl: 'https://example.com/negombo.jpg', province: 'Western' },
      { name: 'Trincomalee', description: 'Eastern coast port city with beaches', imageUrl: 'https://example.com/trincomalee.jpg', province: 'Eastern' },
      { name: 'Jaffna', description: 'Northern peninsula with Tamil culture', imageUrl: 'https://example.com/jaffna.jpg', province: 'Northern' },
      { name: 'Batticaloa', description: 'Eastern coastal city with lagoons', imageUrl: 'https://example.com/batticaloa.jpg', province: 'Eastern' },
      { name: 'Ratnapura', description: 'Gem mining city in hill country', imageUrl: 'https://example.com/ratnapura.jpg', province: 'Sabaragamuwa' },
      { name: 'Matara', description: 'Southern coastal city', imageUrl: 'https://example.com/matara.jpg', province: 'Southern' },
      { name: 'Hikkaduwa', description: 'Popular beach destination', imageUrl: 'https://example.com/hikkaduwa.jpg', province: 'Southern' },
      { name: 'Mirissa', description: 'Whale watching and beach town', imageUrl: 'https://example.com/mirissa.jpg', province: 'Southern' },
      { name: 'Yala', description: 'National park and wildlife sanctuary', imageUrl: 'https://example.com/yala.jpg', province: 'Southern' },
      { name: 'Udawalawe', description: 'Elephant sanctuary and national park', imageUrl: 'https://example.com/udawalawe.jpg', province: 'Sabaragamuwa' },
      { name: 'Horton Plains', description: 'Highland plateau national park', imageUrl: 'https://example.com/horton-plains.jpg', province: 'Central' },
      { name: 'Arugam Bay', description: 'Surfing destination on the east coast', imageUrl: 'https://example.com/arugam-bay.jpg', province: 'Eastern' }
    ]);

    console.log('Districts created successfully');

    // Create admin user
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@tourbloginfo.com',
      password: 'admin123',
      isAdmin: true
    });

    console.log('Admin user created successfully');

    // Create some sample destinations
    const destinations = await Destination.bulkCreate([
      {
        title: 'Lotus Tower',
        description: 'The tallest free-standing structure in South Asia, offering panoramic views of Colombo city.',
        location: { lat: 6.9271, lng: 79.8612 },
        districtId: districts[0].id,
        authorId: adminUser.id,
        images: ['https://example.com/lotus-tower.jpg'],
        bestTimeToVisit: 'Year-round',
        travelTips: 'Visit during sunset for the best views. Book tickets online to avoid queues.'
      },
      {
        title: 'Temple of the Sacred Tooth Relic',
        description: 'A Buddhist temple housing the relic of the tooth of Buddha, located in the royal palace complex.',
        location: { lat: 7.2906, lng: 80.6337 },
        districtId: districts[1].id,
        authorId: adminUser.id,
        images: ['https://example.com/tooth-temple.jpg'],
        bestTimeToVisit: 'December to April',
        travelTips: 'Dress modestly and remove shoes before entering. Photography inside is not allowed.'
      },
      {
        title: 'Galle Fort',
        description: 'A UNESCO World Heritage site, this 17th-century fort built by the Dutch is a must-visit historical landmark.',
        location: { lat: 6.0215, lng: 80.2168 },
        districtId: districts[2].id,
        authorId: adminUser.id,
        images: ['https://example.com/galle-fort.jpg'],
        bestTimeToVisit: 'December to March',
        travelTips: 'Walk along the fort walls during sunset. Explore the boutique shops and cafes inside.'
      },
      {
        title: 'Sigiriya Rock Fortress',
        description: 'Ancient palace ruins built on top of a 200-meter high rock, known as the Eighth Wonder of the World.',
        location: { lat: 7.9569, lng: 80.7603 },
        districtId: districts[7].id,
        authorId: adminUser.id,
        images: ['https://example.com/sigiriya.jpg'],
        bestTimeToVisit: 'December to April',
        travelTips: 'Start early morning to avoid heat and crowds. Wear comfortable climbing shoes.'
      },
      {
        title: 'Nine Arches Bridge',
        description: 'A scenic railway bridge in the hill country, perfect for photography and train spotting.',
        location: { lat: 6.8821, lng: 81.0462 },
        districtId: districts[6].id,
        authorId: adminUser.id,
        images: ['https://example.com/nine-arches.jpg'],
        bestTimeToVisit: 'April to September',
        travelTips: 'Visit during train times (around 6:20 AM, 11:50 AM, and 4:20 PM) for the best experience.'
      }
    ]);

    console.log('Sample destinations created successfully');

    // Create sample comments
    await Comment.bulkCreate([
      {
        content: 'Amazing place with breathtaking views! Highly recommend visiting during sunset.',
        userId: adminUser.id,
        destinationId: destinations[0].id
      },
      {
        content: 'Very peaceful and spiritual atmosphere. The architecture is stunning.',
        userId: adminUser.id,
        destinationId: destinations[1].id
      },
      {
        content: 'Great historical significance and well preserved. Perfect for history enthusiasts.',
        userId: adminUser.id,
        destinationId: destinations[2].id
      }
    ]);

    console.log('Sample comments created successfully');

    // Create sample ratings
    await Rating.bulkCreate([
      {
        value: 5,
        userId: adminUser.id,
        destinationId: destinations[0].id
      },
      {
        value: 5,
        userId: adminUser.id,
        destinationId: destinations[1].id
      },
      {
        value: 4,
        userId: adminUser.id,
        destinationId: destinations[2].id
      },
      {
        value: 5,
        userId: adminUser.id,
        destinationId: destinations[3].id
      },
      {
        value: 4,
        userId: adminUser.id,
        destinationId: destinations[4].id
      }
    ]);

    console.log('Sample ratings created successfully');

    console.log('\n=== Database Seeding Completed Successfully ===');
    console.log(`Admin User Email: admin@tourbloginfo.com`);
    console.log(`Admin User Password: admin123`);
    console.log(`Districts created: ${districts.length}`);
    console.log(`Destinations created: ${destinations.length}`);
    console.log(`Comments created: 3`);
    console.log(`Ratings created: 5`);

    await sequelize.close();
    process.exit(0);

  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

// Run the seeding function
seedDatabase();
