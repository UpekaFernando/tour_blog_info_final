import { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Tabs,
  Tab,
  Rating,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Divider,
} from '@mui/material';
import {
  Restaurant,
  Hotel,
  DirectionsCar,
  Phone,
  Language as WebIcon,
  LocationOn,
  RoomService,
} from '@mui/icons-material';

const LocalServicesPage = () => {
  const [selectedTab, setSelectedTab] = useState(0);

  const services = {
    restaurants: [
      {
        id: 1,
        name: 'Ministry of Crab',
        category: 'Fine Dining',
        location: 'Colombo Fort',
        image: 'https://via.placeholder.com/400x250/1976d2/ffffff?text=Ministry+of+Crab',
        rating: 4.8,
        priceRange: '$$$$',
        cuisine: 'Seafood, Sri Lankan',
        phone: '+94 11 234 2722',
        website: 'ministryofcrab.com',
        highlights: ['Fresh Crab', 'Iconic Location', 'Celebrity Chef', 'Lagoon Crab'],
        description: 'World-renowned seafood restaurant specializing in Sri Lankan crab dishes.'
      },
      {
        id: 2,
        name: 'The Gallery Café',
        category: 'Café & Restaurant',
        location: 'Colombo 03',
        image: 'https://via.placeholder.com/400x250/2e7d32/ffffff?text=Gallery+Cafe',
        rating: 4.6,
        priceRange: '$$$',
        cuisine: 'International, Fusion',
        phone: '+94 11 258 2162',
        website: 'paradiseroad.lk',
        highlights: ['Garden Setting', 'Art Gallery', 'Sunday Brunch', 'Designer Venue'],
        description: 'Stylish café in a converted warehouse with art gallery and beautiful garden.'
      },
      {
        id: 3,
        name: 'Upali\'s by Nawaloka',
        category: 'Local Cuisine',
        location: 'Colombo 03',
        image: 'https://via.placeholder.com/400x250/ed6c02/ffffff?text=Upalis',
        rating: 4.5,
        priceRange: '$$',
        cuisine: 'Sri Lankan',
        phone: '+94 11 257 3370',
        highlights: ['Rice & Curry', 'Authentic Flavors', 'Local Favorite', 'Affordable'],
        description: 'Famous for authentic Sri Lankan rice and curry with generous portions.'
      },
      {
        id: 4,
        name: 'Curry Leaf',
        category: 'Hotel Restaurant',
        location: 'Hilton Colombo',
        image: 'https://via.placeholder.com/400x250/9c27b0/ffffff?text=Curry+Leaf',
        rating: 4.7,
        priceRange: '$$$',
        cuisine: 'South Asian',
        phone: '+94 11 249 2492',
        highlights: ['Buffet', 'Live Stations', 'Luxury Setting', 'Variety'],
        description: 'Upscale restaurant offering extensive buffets with Sri Lankan and regional cuisine.'
      }
    ],
    hotels: [
      {
        id: 1,
        name: 'Galle Face Hotel',
        category: '5-Star Heritage',
        location: 'Colombo 03',
        image: 'https://via.placeholder.com/400x250/0288d1/ffffff?text=Galle+Face+Hotel',
        rating: 4.7,
        priceRange: '$$$$',
        phone: '+94 11 254 1010',
        website: 'gallefacehotel.com',
        highlights: ['Ocean View', 'Historic Property', 'Colonial Charm', 'Prime Location'],
        amenities: ['Pool', 'Spa', 'Multiple Restaurants', 'Ocean Facing'],
        description: 'Iconic 1864 hotel with colonial charm and stunning Indian Ocean views.'
      },
      {
        id: 2,
        name: 'Jetwing Lighthouse',
        category: 'Boutique Hotel',
        location: 'Galle',
        image: 'https://via.placeholder.com/400x250/d32f2f/ffffff?text=Jetwing+Lighthouse',
        rating: 4.8,
        priceRange: '$$$$',
        phone: '+94 91 222 3744',
        website: 'jetwinghotels.com',
        highlights: ['Geoffrey Bawa Design', 'Clifftop Views', 'Infinity Pool', 'Fine Dining'],
        amenities: ['Spa', 'Gym', 'Multiple Pools', 'Beach Access'],
        description: 'Stunning clifftop hotel designed by renowned architect Geoffrey Bawa.'
      },
      {
        id: 3,
        name: '98 Acres Resort',
        category: 'Hill Country Resort',
        location: 'Ella',
        image: 'https://via.placeholder.com/400x250/00695c/ffffff?text=98+Acres',
        rating: 4.6,
        priceRange: '$$$',
        phone: '+94 57 222 4040',
        website: '98acresresort.com',
        highlights: ['Mountain Views', 'Tea Plantation', 'Nature Walks', 'Chalets'],
        amenities: ['Restaurant', 'Nature Trails', 'Tea Factory Tours'],
        description: 'Eco-resort nestled in a tea plantation with breathtaking mountain views.'
      },
      {
        id: 4,
        name: 'Cinnamon Lodge Habarana',
        category: 'Wildlife Lodge',
        location: 'Habarana',
        image: 'https://via.placeholder.com/400x250/f57c00/ffffff?text=Cinnamon+Lodge',
        rating: 4.5,
        priceRange: '$$$',
        phone: '+94 66 227 0011',
        website: 'cinnamonhotels.com',
        highlights: ['Near National Parks', 'Safari Access', 'Nature Setting', 'Family Friendly'],
        amenities: ['Large Pool', 'Multiple Restaurants', 'Kids Club', 'Safari Desk'],
        description: 'Perfect base for exploring ancient cities and national parks of the Cultural Triangle.'
      }
    ],
    transport: [
      {
        id: 1,
        name: 'Sri Lanka Railways',
        category: 'Train Service',
        location: 'Island-wide',
        image: 'https://via.placeholder.com/400x250/1976d2/ffffff?text=Railway',
        rating: 4.3,
        priceRange: '$',
        phone: '+94 11 434 2215',
        website: 'railway.gov.lk',
        highlights: ['Scenic Routes', 'Affordable', 'Colombo-Kandy-Ella', 'Coastal Line'],
        description: 'Iconic train journeys including the famous Kandy to Ella scenic route.'
      },
      {
        id: 2,
        name: 'PickMe',
        category: 'Ride-Hailing App',
        location: 'Major Cities',
        image: 'https://via.placeholder.com/400x250/2e7d32/ffffff?text=PickMe',
        rating: 4.5,
        priceRange: '$$',
        phone: '+94 11 760 0600',
        website: 'pickme.lk',
        highlights: ['App-Based', 'Fixed Prices', 'Tuk-Tuks & Cars', 'Safe & Reliable'],
        description: 'Sri Lanka\'s leading ride-hailing service for tuk-tuks, cars, and bikes.'
      },
      {
        id: 3,
        name: 'Malkey Rent A Car',
        category: 'Car Rental with Driver',
        location: 'Colombo',
        image: 'https://via.placeholder.com/400x250/ed6c02/ffffff?text=Car+Rental',
        rating: 4.7,
        priceRange: '$$$',
        phone: '+94 11 269 4469',
        website: 'malkey.lk',
        highlights: ['With Driver', 'Well-Maintained Fleet', 'Airport Pickup', 'Flexible Tours'],
        description: 'Reliable car rental service with professional drivers for touring Sri Lanka.'
      },
      {
        id: 4,
        name: 'Cinnamon Air',
        category: 'Seaplane Service',
        location: 'Colombo & Resorts',
        image: 'https://via.placeholder.com/400x250/9c27b0/ffffff?text=Seaplane',
        rating: 4.9,
        priceRange: '$$$$',
        phone: '+94 11 247 5475',
        website: 'cinnamonair.com',
        highlights: ['Scenic Flights', 'Quick Transfer', 'Luxury Travel', 'Aerial Views'],
        description: 'Luxury seaplane transfers between Colombo and resort destinations.'
      }
    ]
  };

  const tabs = [
    { label: 'Restaurants', icon: <Restaurant />, key: 'restaurants' },
    { label: 'Hotels', icon: <Hotel />, key: 'hotels' },
    { label: 'Transport', icon: <DirectionsCar />, key: 'transport' },
  ];

  const currentServices = services[tabs[selectedTab].key];

  const renderServiceCard = (service) => (
    <Grid item xs={12} md={6} key={service.id}>
      <Card 
        elevation={3}
        sx={{ 
          height: '100%',
          transition: 'all 0.3s',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: 6,
          }
        }}
      >
        <CardMedia
          component="img"
          height="200"
          image={service.image}
          alt={service.name}
        />
        <CardContent>
          {/* Header */}
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 1 }}>
              <Typography variant="h5" component="h3" fontWeight={600}>
                {service.name}
              </Typography>
              <Chip 
                label={service.priceRange} 
                size="small" 
                color="primary"
              />
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Rating value={service.rating} precision={0.1} readOnly size="small" />
              <Typography variant="body2" color="text.secondary">
                {service.rating}
              </Typography>
            </Box>
            <Chip 
              label={service.category} 
              size="small" 
              variant="outlined"
              sx={{ mr: 1 }}
            />
            {service.cuisine && (
              <Chip 
                label={service.cuisine} 
                size="small" 
                variant="outlined"
              />
            )}
          </Box>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {service.description}
          </Typography>

          <Divider sx={{ my: 2 }} />

          {/* Highlights */}
          {service.highlights && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                Highlights:
              </Typography>
              <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                {service.highlights.map((highlight, idx) => (
                  <Chip 
                    key={idx}
                    label={highlight}
                    size="small"
                    sx={{ fontSize: '0.75rem' }}
                  />
                ))}
              </Box>
            </Box>
          )}

          {/* Amenities (for hotels) */}
          {service.amenities && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                Amenities:
              </Typography>
              <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                {service.amenities.map((amenity, idx) => (
                  <Chip 
                    key={idx}
                    label={amenity}
                    size="small"
                    icon={<RoomService />}
                    sx={{ fontSize: '0.75rem' }}
                  />
                ))}
              </Box>
            </Box>
          )}

          {/* Contact Info */}
          <List dense>
            <ListItem disableGutters>
              <ListItemIcon sx={{ minWidth: 36 }}>
                <LocationOn fontSize="small" color="action" />
              </ListItemIcon>
              <ListItemText 
                primary={service.location}
                primaryTypographyProps={{ variant: 'body2' }}
              />
            </ListItem>
            {service.phone && (
              <ListItem disableGutters>
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <Phone fontSize="small" color="action" />
                </ListItemIcon>
                <ListItemText 
                  primary={service.phone}
                  primaryTypographyProps={{ variant: 'body2' }}
                />
              </ListItem>
            )}
            {service.website && (
              <ListItem disableGutters>
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <WebIcon fontSize="small" color="action" />
                </ListItemIcon>
                <ListItemText 
                  primary={service.website}
                  primaryTypographyProps={{ variant: 'body2' }}
                />
              </ListItem>
            )}
          </List>
        </CardContent>
      </Card>
    </Grid>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 5 }}>
        <Typography 
          variant="h3" 
          component="h1" 
          gutterBottom
          sx={{ 
            fontWeight: 700,
            background: 'linear-gradient(45deg, #2e7d32 30%, #66BB6A 90%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Local Services & Recommendations
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Trusted restaurants, hotels, and transport services in Sri Lanka
        </Typography>
      </Box>

      {/* Category Tabs */}
      <Paper elevation={3} sx={{ mb: 4 }}>
        <Tabs
          value={selectedTab}
          onChange={(e, newValue) => setSelectedTab(newValue)}
          centered
          variant="fullWidth"
        >
          {tabs.map((tab, index) => (
            <Tab 
              key={index}
              label={tab.label}
              icon={tab.icon}
              iconPosition="start"
            />
          ))}
        </Tabs>
      </Paper>

      {/* Services Grid */}
      <Grid container spacing={3}>
        {currentServices.map(renderServiceCard)}
      </Grid>

      {/* Info Note */}
      <Paper elevation={1} sx={{ mt: 4, p: 3, bgcolor: '#f5f5f5' }}>
        <Typography variant="body2" color="text.secondary">
          <strong>Note:</strong> These are recommended services based on reputation and customer reviews. 
          Always verify prices, availability, and current offerings before booking. Contact information 
          and prices may change.
        </Typography>
      </Paper>
    </Container>
  );
};

export default LocalServicesPage;
