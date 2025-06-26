import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  CircularProgress,
  Alert,
  IconButton,
  ImageList,
  ImageListItem,
  ImageListItemBar,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  PhotoCamera as PhotoCameraIcon,
  AddLocation as AddLocationIcon,
} from '@mui/icons-material';
import { AuthContext } from '../context/AuthContext';
import { getDistricts, createDestination } from '../utils/api';

const AddDestinationPage = () => {
  const { currentUser, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  const [districts, setDistricts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    districtId: '',
    location: {
      lat: 7.8731, // Default to Sri Lanka's center 
      lng: 80.7718
    },
    bestTimeToVisit: '',
    travelTips: '',
  });

  const [images, setImages] = useState([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState([]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchDistricts = async () => {
      try {
        const data = await getDistricts();
        setDistricts(data);
      } catch (err) {
        setError('Failed to fetch districts');
      }
    };

    fetchDistricts();
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('location.')) {
      const locationField = name.split('.')[1];
      setFormData({
        ...formData,
        location: {
          ...formData.location,
          [locationField]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files);
      
      // Limit to 10 images max
      const totalImages = [...images, ...newImages].slice(0, 10);
      setImages(totalImages);
      
      // Create preview URLs
      const newImagePreviewUrls = totalImages.map(image => 
        URL.createObjectURL(image)
      );
      setImagePreviewUrls(newImagePreviewUrls);
    }
  };

  const removeImage = (index) => {
    const updatedImages = [...images];
    updatedImages.splice(index, 1);
    setImages(updatedImages);
    
    const updatedPreviews = [...imagePreviewUrls];
    URL.revokeObjectURL(updatedPreviews[index]); // Clean up
    updatedPreviews.splice(index, 1);
    setImagePreviewUrls(updatedPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (images.length === 0) {
      setError('Please upload at least one image');
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const formDataToSend = new FormData();
        // Append text fields
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('districtId', formData.districtId);
      formDataToSend.append('location[lat]', formData.location.lat);
      formDataToSend.append('location[lng]', formData.location.lng);
      formDataToSend.append('bestTimeToVisit', formData.bestTimeToVisit);
      formDataToSend.append('travelTips', formData.travelTips);
      
      // Append images
      images.forEach((image) => {
        formDataToSend.append('images', image);
      });
      
      const newDestination = await createDestination(formDataToSend, currentUser.token);
      
      setSuccess('Destination added successfully!');
      setTimeout(() => {
        navigate(`/destination/${newDestination._id}`);
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add destination');
      setLoading(false);
    }
  };
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper 
        elevation={3} 
        sx={{ 
          p: { xs: 3, md: 5 }, 
          borderRadius: 3,
          background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)'
        }}
      >
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography 
            variant="h3" 
            component="h1" 
            gutterBottom 
            sx={{ 
              fontWeight: 'bold',
              color: '#2e7d32',
              mb: 2
            }}
          >
            Add New Destination
          </Typography>
          <Typography 
            variant="h6" 
            color="text.secondary"
            sx={{ maxWidth: 600, mx: 'auto' }}
          >
            Share a beautiful destination in Sri Lanka with fellow travelers
          </Typography>
        </Box>
        
        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}
          <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={4}>
            {/* Title Section */}
            <Grid item xs={12}>
              <Box sx={{ p: 3, bgcolor: '#f8f9fa', borderRadius: 2, mb: 2 }}>
                <Typography variant="h6" gutterBottom color="primary" sx={{ fontWeight: 'bold' }}>
                  Basic Information
                </Typography>
                <TextField
                  fullWidth
                  label="Destination Title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  variant="outlined"
                  sx={{ 
                    '& .MuiOutlinedInput-root': {
                      fontSize: '1.1rem',
                      bgcolor: 'white'
                    }
                  }}
                  placeholder="Enter an attractive title for your destination"
                />
              </Box>            </Grid>
            
            {/* District and Best Time Section */}
            <Grid item xs={12}>
              <Box sx={{ p: 3, bgcolor: '#f0f7ff', borderRadius: 2, mb: 2 }}>
                <Typography variant="h6" gutterBottom color="primary" sx={{ fontWeight: 'bold' }}>
                  Location & Timing
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth required>
                      <InputLabel id="district-label" sx={{ fontSize: '1.1rem' }}>District</InputLabel>
                      <Select
                        labelId="district-label"
                        name="districtId"
                        value={formData.districtId}
                        onChange={handleChange}
                        label="District"
                        sx={{ 
                          bgcolor: 'white',
                          '& .MuiSelect-select': {
                            fontSize: '1.1rem'
                          }
                        }}
                      >
                        <MenuItem value="">
                          <em>Select a district</em>
                        </MenuItem>
                        {districts.map((district) => (
                          <MenuItem key={district.id} value={district.id}>
                            {district.name} - {district.province}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Best Time to Visit"
                name="bestTimeToVisit"
                value={formData.bestTimeToVisit}
                onChange={handleChange}
                required
                placeholder="e.g., December to April"
              />
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Location Coordinates
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Latitude"
                    name="location.lat"
                    type="number"
                    value={formData.location.lat}
                    onChange={handleChange}
                    required
                    inputProps={{
                      step: 'any'
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Longitude"
                    name="location.lng"
                    type="number"
                    value={formData.location.lng}
                    onChange={handleChange}
                    required
                    inputProps={{
                      step: 'any'
                    }}
                  />
                </Grid>
              </Grid>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                multiline
                rows={6}
                placeholder="Describe what makes this destination special..."
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Travel Tips"
                name="travelTips"
                value={formData.travelTips}
                onChange={handleChange}
                required
                multiline
                rows={4}
                placeholder="Share useful tips for travelers visiting this place..."
              />
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Images (up to 10)
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <Button
                  component="label"
                  variant="contained"
                  startIcon={<PhotoCameraIcon />}
                  disabled={images.length >= 10}
                >
                  Upload Images
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    multiple
                    onChange={handleImageChange}
                  />
                </Button>
              </Box>
              
              {imagePreviewUrls.length > 0 && (
                <ImageList sx={{ height: 300 }} cols={3} rowHeight={164}>
                  {imagePreviewUrls.map((url, index) => (
                    <ImageListItem key={index}>
                      <img
                        src={url}
                        alt={`Preview ${index}`}
                        loading="lazy"
                      />
                      <ImageListItemBar
                        position="top"
                        actionIcon={
                          <IconButton
                            sx={{ color: 'white' }}
                            onClick={() => removeImage(index)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        }
                        actionPosition="right"
                      />
                    </ImageListItem>
                  ))}
                </ImageList>
              )}
            </Grid>
            
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                startIcon={<AddLocationIcon />}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Add Destination'}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default AddDestinationPage;
