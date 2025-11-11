import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Card,
  CardContent,
  CardMedia,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Button,
  TextField,
  InputAdornment,
  Tabs,
  Tab,
  Rating,
  Avatar,
  Divider,
} from '@mui/material';
import {
  Restaurant as RestaurantIcon,
  Hotel as HotelIcon,
  LocalTaxi as TaxiIcon,
  Search as SearchIcon,
  Star as StarIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Schedule as ScheduleIcon,
  AttachMoney as MoneyIcon,
  Wifi as WifiIcon,
  AcUnit as AcIcon,
  LocalParking as ParkingIcon,
  Pool as PoolIcon,
} from '@mui/icons-material';

const LocalServicesPage = () => {
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [services, setServices] = useState([]);

  // Mock data for local services
  const mockServices = {
    restaurants: [
      {
        id: 1,
        name: "Curry Leaf Restaurant",
        category: "Sri Lankan Cuisine",
        rating: 4.5,
        priceRange: "$$",
        location: "Kandy City Center",
        phone: "+94 81 222 3456",
        image: "/uploads/images-1750785265516.jpg",
        description: "Authentic Sri Lankan dishes in a traditional setting",
        specialties: ["Rice & Curry", "Hoppers", "Kottu Roti"],
        openHours: "6:00 AM - 10:00 PM",
        features: ["Air Conditioning", "Parking", "WiFi"]
      },
      {
        id: 2,
        name: "Galle Face Hotel Restaurant",
        category: "International",
        rating: 4.8,
        priceRange: "$$$",
        location: "Colombo 03",
        phone: "+94 11 254 1010",
        image: "/uploads/images-1750785364426.jpg",
        description: "Fine dining with ocean views at historic hotel",
        specialties: ["Seafood", "Continental", "High Tea"],
        openHours: "7:00 AM - 11:00 PM",
        features: ["Ocean View", "Valet Parking", "Live Music"]
      },
      {
        id: 3,
        name: "Spice Garden",
        category: "Vegetarian",
        rating: 4.3,
        priceRange: "$",
        location: "Galle Fort",
        phone: "+94 91 222 4567",
        image: "/uploads/images-1750785584274.png",
        description: "Healthy vegetarian and vegan options",
        specialties: ["Organic Salads", "Smoothies", "Ayurvedic Food"],
        openHours: "8:00 AM - 9:00 PM",
        features: ["Organic", "WiFi", "Garden Seating"]
      }
    ],
    hotels: [
      {
        id: 4,
        name: "Cinnamon Grand Colombo",
        category: "5-Star Hotel",
        rating: 4.7,
        priceRange: "$$$",
        location: "Colombo 02",
        phone: "+94 11 249 7973",
        image: "/uploads/images-1755800929685.jpg",
        description: "Luxury hotel in the heart of Colombo",
        amenities: ["Swimming Pool", "Spa", "Fitness Center", "Multiple Restaurants"],
        openHours: "24/7",
        features: ["WiFi", "Parking", "Airport Shuttle", "Business Center"]
      },
      {
        id: 5,
        name: "Tea Country Resort",
        category: "Boutique Hotel",
        rating: 4.4,
        priceRange: "$$",
        location: "Nuwara Eliya",
        phone: "+94 52 222 7890",
        image: "/uploads/images-1755800929690.jpg",
        description: "Cozy mountain retreat surrounded by tea plantations",
        amenities: ["Garden Views", "Tea Tasting", "Fireplace", "Library"],
        openHours: "24/7",
        features: ["WiFi", "Parking", "Restaurant", "Room Service"]
      }
    ],
    transport: [
      {
        id: 6,
        name: "Lanka Tours & Travels",
        category: "Tour Operator",
        rating: 4.6,
        priceRange: "$$",
        location: "Multiple Locations",
        phone: "+94 11 258 9630",
        image: "/uploads/images-1750785265516.jpg",
        description: "Professional tour guide services island-wide",
        services: ["Airport Transfers", "Day Tours", "Multi-day Packages", "Cultural Tours"],
        openHours: "6:00 AM - 10:00 PM",
        features: ["English Speaking Guides", "Air Conditioned Vehicles", "Insurance"]
      },
      {
        id: 7,
        name: "PickMe Taxi",
        category: "Ride Hailing",
        rating: 4.2,
        priceRange: "$",
        location: "Island Wide",
        phone: "1212 (Hotline)",
        image: "/uploads/images-1750785364426.jpg",
        description: "Reliable taxi service via mobile app",
        services: ["City Rides", "Airport Transfers", "Delivery", "Car Rentals"],
        openHours: "24/7",
        features: ["GPS Tracking", "Cashless Payment", "Safety Features"]
      }
    ]
  };

  const categories = [
    { label: 'Restaurants', value: 'restaurants', icon: <RestaurantIcon /> },
    { label: 'Hotels', value: 'hotels', icon: <HotelIcon /> },
    { label: 'Transport', value: 'transport', icon: <TaxiIcon /> },
  ];

  useEffect(() => {
    const categoryKey = categories[selectedCategory].value;
    setServices(mockServices[categoryKey] || []);
  }, [selectedCategory]);

  const filteredServices = services.filter(service =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderPriceRange = (priceRange) => {
    const colors = { '$': 'success', '$$': 'warning', '$$$': 'error' };
    return (
      <Chip
        label={priceRange}
        size="small"
        color={colors[priceRange] || 'default'}
        icon={<MoneyIcon />}
      />
    );
  };

  const renderFeatures = (features) => {
    const iconMap = {
      'WiFi': <WifiIcon />,
      'Air Conditioning': <AcIcon />,
      'Parking': <ParkingIcon />,
      'Swimming Pool': <PoolIcon />,
    };

    return (
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
        {features.map((feature, index) => (
          <Chip
            key={index}
            label={feature}
            size="small"
            variant="outlined"
            icon={iconMap[feature]}
          />
        ))}
      </Box>
    );
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Page Header */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom color="primary">
          Local Services
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Discover the best restaurants, hotels, and transport services in Sri Lanka
        </Typography>
      </Box>

      {/* Search and Category Tabs */}
      <Paper sx={{ mb: 4 }}>
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <TextField
            fullWidth
            placeholder="Search services..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Box>
        
        <Tabs
          value={selectedCategory}
          onChange={(event, newValue) => setSelectedCategory(newValue)}
          variant="fullWidth"
        >
          {categories.map((category, index) => (
            <Tab
              key={index}
              icon={category.icon}
              label={category.label}
              iconPosition="start"
            />
          ))}
        </Tabs>
      </Paper>

      {/* Service Cards */}
      <Grid container spacing={3}>
        {filteredServices.map((service) => (
          <Grid item xs={12} md={6} key={service.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardMedia
                component="img"
                height="200"
                image={`http://localhost:5000${service.image}`}
                alt={service.name}
                sx={{ objectFit: 'cover' }}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                  <Typography variant="h6" component="h2">
                    {service.name}
                  </Typography>
                  {renderPriceRange(service.priceRange)}
                </Box>

                <Typography variant="subtitle2" color="primary" gutterBottom>
                  {service.category}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Rating value={service.rating} precision={0.1} size="small" readOnly />
                  <Typography variant="body2" sx={{ ml: 1 }}>
                    {service.rating}
                  </Typography>
                </Box>

                <Typography variant="body2" color="text.secondary" paragraph>
                  {service.description}
                </Typography>

                <List dense>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon>
                      <LocationIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary={service.location} />
                  </ListItem>
                  
                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon>
                      <PhoneIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary={service.phone} />
                  </ListItem>
                  
                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon>
                      <ScheduleIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary={service.openHours} />
                  </ListItem>
                </List>

                {/* Specialties/Services/Amenities */}
                {service.specialties && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Specialties:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {service.specialties.map((specialty, index) => (
                        <Chip key={index} label={specialty} size="small" />
                      ))}
                    </Box>
                  </Box>
                )}

                {service.amenities && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Amenities:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {service.amenities.map((amenity, index) => (
                        <Chip key={index} label={amenity} size="small" />
                      ))}
                    </Box>
                  </Box>
                )}

                {service.services && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Services:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {service.services.map((serviceItem, index) => (
                        <Chip key={index} label={serviceItem} size="small" />
                      ))}
                    </Box>
                  </Box>
                )}

                {/* Features */}
                {service.features && renderFeatures(service.features)}
              </CardContent>

              <Box sx={{ p: 2, pt: 0 }}>
                <Button
                  variant="contained"
                  fullWidth
                  href={`tel:${service.phone}`}
                  startIcon={<PhoneIcon />}
                >
                  Contact
                </Button>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* No Results */}
      {filteredServices.length === 0 && (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No services found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Try adjusting your search terms or browse different categories
          </Typography>
        </Paper>
      )}

      {/* Quick Stats */}
      <Paper sx={{ mt: 4, p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Service Statistics
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="primary">
                {mockServices.restaurants.length}
              </Typography>
              <Typography variant="body2">Restaurants</Typography>
            </Box>
          </Grid>
          <Grid item xs={4}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="secondary">
                {mockServices.hotels.length}
              </Typography>
              <Typography variant="body2">Hotels</Typography>
            </Box>
          </Grid>
          <Grid item xs={4}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="success.main">
                {mockServices.transport.length}
              </Typography>
              <Typography variant="body2">Transport</Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default LocalServicesPage;
