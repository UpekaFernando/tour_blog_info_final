import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Paper, CircularProgress, Tooltip } from '@mui/material';
import { getDistricts } from '../utils/api';

// Using MUI styles instead of styled-components for simpler implementation
// No need to import mapbox-gl for the static map implementation

const SriLankaMap = () => {
  const [districts, setDistricts] = useState([]);
  const [loading, setLoading] = useState(false); // Set to false initially for demo
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
  // Sample district data for demo
  const sampleDistricts = [
    { _id: '1', name: 'Colombo', mapCoordinates: { lat: 6.9271, lng: 79.8612 } },
    { _id: '2', name: 'Kandy', mapCoordinates: { lat: 7.2906, lng: 80.6337 } },
    { _id: '3', name: 'Galle', mapCoordinates: { lat: 6.0535, lng: 80.2210 } },
    { _id: '4', name: 'Jaffna', mapCoordinates: { lat: 9.6615, lng: 80.0255 } },
    { _id: '5', name: 'Trincomalee', mapCoordinates: { lat: 8.5874, lng: 81.2152 } }
  ];

  useEffect(() => {
    // For demo, use sample data instead of API call
    setDistricts(sampleDistricts);
    
    // When API is ready, uncomment this:
    /*
    const fetchDistricts = async () => {
      try {
        setLoading(true);
        const data = await getDistricts();
        setDistricts(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch districts data');
        setLoading(false);
      }
    };
    fetchDistricts();
    */
  }, []);

  const handleDistrictClick = (districtId) => {
    navigate(`/district/${districtId}`);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Paper elevation={3} sx={{ p: 3, my: 2, textAlign: 'center', color: 'error.main' }}>
        <Typography variant="h6">{error}</Typography>
        <Typography>Please try again later.</Typography>
      </Paper>
    );
  }

  // For demo purposes, showing a simple static map instead of Mapbox
  return (
    <>
      <Typography variant="h4" component="h2" textAlign="center" gutterBottom>
        Explore Sri Lanka by Districts
      </Typography>
      <Typography variant="body1" textAlign="center" paragraph>
        Click on any district on the map to discover its unique attractions and destinations.
      </Typography>
        <Box
        sx={{
          width: '100%',
          height: '500px',
          borderRadius: '8px',
          overflow: 'hidden',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          mb: 2,
          position: 'relative'
        }}
      >
        <Box
          sx={{
            position: 'relative', 
            width: '100%', 
            height: '100%', 
            backgroundColor: '#e6f7ff',
            backgroundImage: 'url("https://upload.wikimedia.org/wikipedia/commons/9/91/Sri_Lanka_%28orthographic_projection%29.svg")',
            backgroundSize: 'contain',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        >
          {sampleDistricts.map((district) => (
            <Tooltip key={district._id} title={district.name} arrow>
              <Box
                className="district-marker"
                onClick={() => handleDistrictClick(district._id)}
                sx={{
                  position: 'absolute',
                  transform: 'translate(-50%, -50%)',
                  left: `${50 + (district.mapCoordinates.lng - 80) * 30}%`,
                  top: `${50 + (district.mapCoordinates.lat - 7.8) * -30}%`,
                  width: '15px',
                  height: '15px',
                  backgroundColor: 'secondary.main',
                  borderRadius: '50%',
                  border: '2px solid white',
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'scale(1.5)',
                  },
                }}
              />
            </Tooltip>
          ))}
        </Box>
      </Box>
      
      <Typography variant="body2" textAlign="center" color="text.secondary" sx={{ mb: 4 }}>
        
      </Typography>
      
    </>
  );
};

export default SriLankaMap;
