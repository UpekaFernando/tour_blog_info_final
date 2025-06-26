import { useState, useEffect } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Typography,
  Grid,
  Box,
  Button,
  CircularProgress,
  Paper,
  Breadcrumbs,
  Link,
} from '@mui/material';
import { Add as AddIcon, NavigateNext as NavigateNextIcon } from '@mui/icons-material';
import DestinationCard from '../components/DestinationCard';
import { getDistrictById, getDestinations } from '../utils/api';

const DistrictPage = () => {
  const { id } = useParams();
  const [district, setDistrict] = useState(null);
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDistrictData = async () => {
      try {
        setLoading(true);
        
        // Fetch district details
        const districtData = await getDistrictById(id);
        setDistrict(districtData);
        
        // Fetch destinations for this district
        const destinationsData = await getDestinations(id);
        setDestinations(destinationsData);
        
        setLoading(false);
      } catch (err) {
        setError('Failed to load district information');
        setLoading(false);
      }
    };

    fetchDistrictData();
  }, [id]);

  if (loading) {
    return (
      <Container sx={{ py: 8 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error || !district) {
    return (
      <Container sx={{ py: 8 }}>
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h5" color="error" gutterBottom>
            {error || 'District not found'}
          </Typography>
          <Button 
            component={RouterLink} 
            to="/" 
            variant="contained" 
            sx={{ mt: 2 }}
          >
            Return to Homepage
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <>
      {/* District Hero Section */}
      <Box
        sx={{
          position: 'relative',
          height: '40vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          textAlign: 'center',
          mb: 4,
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundImage: `url(http://localhost:5000${district.imageUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'brightness(0.7)'
          }
        }}
      >
        <Box sx={{ position: 'relative', zIndex: 1, px: 4 }}>
          <Typography variant="h2" component="h1" sx={{ fontWeight: 'bold', mb: 2 }}>
            {district.name}
          </Typography>
          <Typography variant="subtitle1" sx={{ fontWeight: 300 }}>
            {district.province} Province
          </Typography>
        </Box>
      </Box>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Breadcrumbs */}
        <Breadcrumbs 
          separator={<NavigateNextIcon fontSize="small" />} 
          aria-label="breadcrumb"
          sx={{ mb: 4 }}
        >
          <Link component={RouterLink} to="/" color="inherit">
            Home
          </Link>
          <Link component={RouterLink} to="/" color="inherit">
            Districts
          </Link>
          <Typography color="text.primary">{district.name}</Typography>
        </Breadcrumbs>

        {/* District Description */}
        <Paper elevation={1} sx={{ p: 4, mb: 6 }}>
          <Typography variant="h4" component="h2" gutterBottom>
            About {district.name}
          </Typography>
          <Typography variant="body1" paragraph>
            {district.description}
          </Typography>
        </Paper>

        {/* Destinations Section */}
        <Box sx={{ mb: 6 }}>
          <Box 
            sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              mb: 4 
            }}
          >
            <Typography variant="h4" component="h3">
              Destinations in {district.name}
            </Typography>
            <Button
              component={RouterLink}
              to="/add-destination"
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
            >
              Add Destination
            </Button>
          </Box>

          {destinations.length === 0 ? (
            <Paper elevation={0} sx={{ p: 4, textAlign: 'center', bgcolor: 'grey.100' }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                No destinations yet in {district.name}
              </Typography>
              <Typography variant="body1" paragraph>
                Be the first to share your experience by adding a destination!
              </Typography>
              <Button
                component={RouterLink}
                to="/add-destination"
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
              >
                Add Destination
              </Button>
            </Paper>
          ) : (
            <Grid container spacing={4}>
              {destinations.map((destination) => (
                <Grid item key={destination._id} xs={12} sm={6} md={4}>
                  <DestinationCard destination={destination} />
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      </Container>
    </>
  );
};

export default DistrictPage;
