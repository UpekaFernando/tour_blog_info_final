import { useState, useEffect } from 'react';
import { Container, Typography, Box, Grid, Paper, Button, CircularProgress } from '@mui/material';
import { Explore } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import SriLankaMap from '../components/SriLankaMap';
import DestinationCard from '../components/DestinationCard';
import { getDestinations } from '../utils/api';
// Use a placeholder image URL instead of the local file which doesn't exist
const heroImage = 'https://images.unsplash.com/photo-1571424161765-c4080147e8ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80';

const HomePage = () => {
  const [featuredDestinations, setFeaturedDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeaturedDestinations = async () => {
      try {
        const data = await getDestinations();
        // Get the latest 6 destinations as featured
        setFeaturedDestinations(data.slice(0, 6));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching destinations:', error);
        setLoading(false);
      }
    };

    fetchFeaturedDestinations();
  }, []);

  return (
    <>
      {/* Hero Section */}
      <Box
        sx={{
          position: 'relative',
          height: '70vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          textAlign: 'center',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundImage: `url("${heroImage}")`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'brightness(0.7)'
          }
        }}
      >
        <Box sx={{ position: 'relative', zIndex: 1, px: 4 }}>
          <Typography 
            variant="h1" 
            component="h1" 
            sx={{ 
              fontSize: { xs: '2.5rem', md: '4rem' },
              fontWeight: 'bold',
              mb: 2
            }}
          >
            Discover Sri Lanka
          </Typography>
          <Typography 
            variant="h5" 
            component="p" 
            sx={{ 
              mb: 4,
              maxWidth: '800px',
              mx: 'auto',
              fontWeight: 300
            }}
          >
            Explore the pearl of the Indian Ocean with our interactive travel guide
          </Typography>
          <Button 
            variant="contained" 
            size="large" 
            color="secondary" 
            startIcon={<Explore />}
            onClick={() => navigate('/register')}
            sx={{ fontSize: '1.1rem' }}
          >
            Start Exploring
          </Button>
        </Box>
      </Box>

      {/* Interactive Map Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Paper elevation={3} sx={{ p: { xs: 2, md: 4 } }}>
          <SriLankaMap />
        </Paper>
      </Container>

      {/* Featured Destinations Section */}
      <Box sx={{ bgcolor: 'grey.100', py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h4" component="h2" align="center" gutterBottom>
            Featured Destinations
          </Typography>
          <Typography variant="body1" align="center" paragraph sx={{ mb: 6 }}>
            Check out some of the most popular destinations across Sri Lanka
          </Typography>
          
          {loading ? (
            <Box display="flex" justifyContent="center">
              <CircularProgress />
            </Box>
          ) : (            <Grid container spacing={4}>
              {featuredDestinations.map((destination) => (
                <Grid key={destination.id || destination._id} xs={12} sm={6} md={4}>
                  <DestinationCard destination={destination} />
                </Grid>
              ))}
            </Grid>
          )}

          <Box textAlign="center" mt={6}>
            <Button 
              variant="outlined" 
              color="primary" 
              size="large"
              onClick={() => navigate('/districts')}
            >
              View All Destinations
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Why Visit Sri Lanka Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h4" component="h2" align="center" gutterBottom>
          Why Visit Sri Lanka?
        </Typography>
          <Grid container spacing={4} sx={{ mt: 2 }}>
          <Grid xs={12} md={4}>
            <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Rich Cultural Heritage
              </Typography>
              <Typography>                Explore ancient temples, colonial architecture, and vibrant cultural festivals that showcase Sri Lanka's 2,500-year history.
              </Typography>
            </Paper>
          </Grid>
          <Grid xs={12} md={4}>
            <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Stunning Natural Beauty
              </Typography>
              <Typography>                From pristine beaches and lush tea plantations to misty mountains and diverse wildlife, Sri Lanka offers breathtaking landscapes.
              </Typography>
            </Paper>
          </Grid>
          <Grid xs={12} md={4}>
            <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Warm Local Hospitality
              </Typography>
              <Typography>
                Experience the legendary Sri Lankan hospitality with friendly locals always ready to welcome you with a smile and help you explore their beautiful country.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default HomePage;
