import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  TextField,
  InputAdornment,
  Chip,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Rating,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  LocationOn as LocationIcon,
  Star as StarIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { getDestinations, getDistricts } from '../utils/api';

const ExplorePage = () => {
  const navigate = useNavigate();
  const [destinations, setDestinations] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [filteredDestinations, setFilteredDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [favorites, setFavorites] = useState([]);

  const categories = [
    'Historical Sites',
    'Natural Beauty',
    'Adventure',
    'Cultural',
    'Beaches',
    'Wildlife',
    'Religious',
    'Urban Attractions'
  ];

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterDestinations();
  }, [searchTerm, selectedDistrict, selectedCategory, destinations]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [destinationsData, districtsData] = await Promise.all([
        getDestinations(),
        getDistricts()
      ]);
      setDestinations(destinationsData);
      setDistricts(districtsData);
      setFilteredDestinations(destinationsData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const filterDestinations = () => {
    let filtered = destinations;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(dest =>
        dest.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dest.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // District filter
    if (selectedDistrict) {
      filtered = filtered.filter(dest => dest.districtId === selectedDistrict);
    }

    // Category filter (this would need to be added to your destination model)
    if (selectedCategory) {
      filtered = filtered.filter(dest => dest.category === selectedCategory);
    }

    setFilteredDestinations(filtered);
  };

  const toggleFavorite = (destinationId) => {
    setFavorites(prev =>
      prev.includes(destinationId)
        ? prev.filter(id => id !== destinationId)
        : [...prev, destinationId]
    );
  };

  const getImageUrl = (destination) => {
    if (destination.images && destination.images.length > 0) {
      const firstImage = destination.images[0];
      return firstImage.startsWith('http')
        ? firstImage
        : `http://localhost:5000${firstImage}`;
    }
    return 'https://via.placeholder.com/400x250?text=No+Image';
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Page Header */}
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h3" component="h1" gutterBottom color="primary">
          Explore Sri Lanka
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Discover amazing destinations across the Pearl of the Indian Ocean
        </Typography>
      </Box>

      {/* Search and Filters */}
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder="Search destinations..."
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
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>District</InputLabel>
              <Select
                value={selectedDistrict}
                label="District"
                onChange={(e) => setSelectedDistrict(e.target.value)}
              >
                <MenuItem value="">All Districts</MenuItem>
                {districts.map((district) => (
                  <MenuItem key={district.id || district._id} value={district.id || district._id}>
                    {district.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={selectedCategory}
                label="Category"
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <MenuItem value="">All Categories</MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<FilterIcon />}
              onClick={() => {
                setSearchTerm('');
                setSelectedDistrict('');
                setSelectedCategory('');
              }}
            >
              Clear Filters
            </Button>
          </Grid>
        </Grid>
      </Box>

      {/* Results Count */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="body1" color="text.secondary">
          Found {filteredDestinations.length} destinations
        </Typography>
      </Box>

      {/* Destinations Grid */}
      {loading ? (
        <Box display="flex" justifyContent="center" py={8}>
          <Typography>Loading destinations...</Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {filteredDestinations.map((destination) => (
            <Grid item xs={12} sm={6} md={4} key={destination.id || destination._id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4,
                  },
                  cursor: 'pointer',
                }}
                onClick={() => navigate(`/destination/${destination.id || destination._id}`)}
              >
                <Box sx={{ position: 'relative' }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={getImageUrl(destination)}
                    alt={destination.title}
                    sx={{ objectFit: 'cover' }}
                  />
                  <Tooltip title={favorites.includes(destination.id || destination._id) ? "Remove from favorites" : "Add to favorites"}>
                    <IconButton
                      sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        bgcolor: 'rgba(255, 255, 255, 0.9)',
                        '&:hover': { bgcolor: 'rgba(255, 255, 255, 1)' },
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(destination.id || destination._id);
                      }}
                    >
                      {favorites.includes(destination.id || destination._id) ? (
                        <FavoriteIcon color="error" />
                      ) : (
                        <FavoriteBorderIcon />
                      )}
                    </IconButton>
                  </Tooltip>
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 8,
                      left: 8,
                      bgcolor: 'rgba(0, 0, 0, 0.7)',
                      color: 'white',
                      px: 1,
                      py: 0.5,
                      borderRadius: 1,
                      fontSize: '0.75rem',
                    }}
                  >
                    <LocationIcon sx={{ fontSize: 16, mr: 0.5 }} />
                    {districts.find(d => (d.id || d._id) === destination.districtId)?.name || 'Unknown'}
                  </Box>
                </Box>
                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <Typography gutterBottom variant="h6" component="h2" noWrap>
                    {destination.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      flexGrow: 1,
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      mb: 2,
                    }}
                  >
                    {destination.description}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Rating value={4} size="small" readOnly />
                      <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                        (4.0)
                      </Typography>
                    </Box>
                    {destination.bestTimeToVisit && (
                      <Chip
                        label={destination.bestTimeToVisit}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* No Results */}
      {!loading && filteredDestinations.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No destinations found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Try adjusting your search or filter criteria
          </Typography>
          <Button
            variant="contained"
            onClick={() => {
              setSearchTerm('');
              setSelectedDistrict('');
              setSelectedCategory('');
            }}
          >
            Clear All Filters
          </Button>
        </Box>
      )}
    </Container>
  );
};

export default ExplorePage;
