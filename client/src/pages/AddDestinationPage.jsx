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
      lat: 7.8731,
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
      const totalImages = [...images, ...newImages].slice(0, 10);
      setImages(totalImages);
      
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
    URL.revokeObjectURL(updatedPreviews[index]);
    updatedPreviews.splice(index, 1);
    setImagePreviewUrls(updatedPreviews);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (images.length === 0) {
      setError('Please upload at least one image');
      return;
    }
    
    if (!isAuthenticated || !currentUser) {
      setError('You must be logged in to add a destination');
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const formDataToSend = new FormData();
      
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('districtId', formData.districtId);
      formDataToSend.append('location', JSON.stringify(formData.location));
      formDataToSend.append('bestTimeToVisit', formData.bestTimeToVisit);
      formDataToSend.append('travelTips', formData.travelTips);
      
      images.forEach((image) => {
        formDataToSend.append('images', image);
      });
      
      console.log('Submitting destination data:', {
        title: formData.title,
        description: formData.description,
        districtId: formData.districtId,
        location: formData.location,
        bestTimeToVisit: formData.bestTimeToVisit,
        travelTips: formData.travelTips,
        imageCount: images.length,
        userToken: currentUser.token ? 'Present' : 'Missing'
      });
      
      const newDestination = await createDestination(formDataToSend, currentUser.token);
      
      setSuccess('Destination added successfully!');
      setLoading(false);
      setTimeout(() => {
        navigate(`/destination/${newDestination.id}`);
      }, 1500);
    } catch (err) {
      console.error('Error creating destination:', err);
      setError(err.response?.data?.message || err.message || 'Failed to add destination');
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper 
        elevation={4} 
        sx={{ 
          p: { xs: 4, md: 6 }, 
          borderRadius: 4,
          background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
        }}
      >
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography 
            variant="h3" 
            component="h1" 
            gutterBottom 
            sx={{ 
              fontWeight: 'bold',
              color: '#2e7d32',
              mb: 2,
              fontSize: { xs: '2.5rem', md: '3.5rem' }
            }}
          >
            Add New Destination
          </Typography>
          <Typography 
            variant="h6" 
            color="text.secondary"
            sx={{ maxWidth: 700, mx: 'auto', fontSize: '1.2rem' }}
          >
            Share a beautiful destination in Sri Lanka with fellow travelers
          </Typography>
        </Box>
        
        {error && (
          <Alert severity="error" sx={{ mb: 4, fontSize: '1.1rem', p: 2 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mb: 4, fontSize: '1.1rem', p: 2 }}>
            {success}
          </Alert>
        )}        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={5}>
            
            {/* Title Section */}
            <Grid size={12}>
              <Box sx={{ 
                p: 4, 
                bgcolor: '#f8f9fa', 
                borderRadius: 3, 
                border: '2px solid #e9ecef',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
              }}>
                <Typography variant="h5" gutterBottom color="primary" sx={{ 
                  fontWeight: 'bold', 
                  mb: 3,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2
                }}>
                  📍 Basic Information
                </Typography>
                <TextField
                  fullWidth
                  label="Destination Title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  variant="outlined"
                  size="large"
                  sx={{ 
                    '& .MuiOutlinedInput-root': {
                      fontSize: '1.2rem',
                      bgcolor: 'white',
                      borderRadius: 2,
                      '& fieldset': {
                        borderWidth: 2,
                      },
                      '&:hover fieldset': {
                        borderColor: '#2e7d32',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#2e7d32',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      fontSize: '1.1rem',
                    }
                  }}
                  placeholder="Enter an attractive title for your destination"
                />
              </Box>
            </Grid>            
            {/* District and Best Time Section */}
            <Grid size={12}>
              <Box sx={{ 
                p: 4, 
                bgcolor: '#f0f7ff', 
                borderRadius: 3, 
                border: '2px solid #e3f2fd',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
              }}>
                <Typography variant="h5" gutterBottom color="primary" sx={{ 
                  fontWeight: 'bold', 
                  mb: 3,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2
                }}>                  🗺️ Location & Timing
                </Typography>
                <Grid container spacing={4}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <FormControl fullWidth required size="large">
                      <InputLabel id="district-label" sx={{ fontSize: '1.2rem' }}>
                        District
                      </InputLabel>
                      <Select
                        labelId="district-label"
                        name="districtId"
                        value={formData.districtId}
                        onChange={handleChange}
                        label="District"
                        sx={{ 
                          bgcolor: 'white',
                          borderRadius: 2,
                          '& .MuiSelect-select': {
                            fontSize: '1.2rem',
                            py: 2
                          },
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderWidth: 2,
                          },
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#2e7d32',
                          },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#2e7d32',
                          },
                        }}
                      >
                        <MenuItem value="" sx={{ fontSize: '1.1rem' }}>
                          <em>Select a district</em>
                        </MenuItem>
                        {districts.map((district) => (
                          <MenuItem key={district.id} value={district.id} sx={{ fontSize: '1.1rem' }}>
                            {district.name} - {district.province}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>                  </Grid>
                  
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      fullWidth
                      label="Best Time to Visit"
                      name="bestTimeToVisit"
                      value={formData.bestTimeToVisit}
                      onChange={handleChange}
                      required
                      variant="outlined"
                      size="large"
                      sx={{ 
                        '& .MuiOutlinedInput-root': {
                          fontSize: '1.2rem',
                          bgcolor: 'white',
                          borderRadius: 2,
                          '& fieldset': {
                            borderWidth: 2,
                          },
                          '&:hover fieldset': {
                            borderColor: '#2e7d32',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#2e7d32',
                          },
                        },
                        '& .MuiInputLabel-root': {
                          fontSize: '1.1rem',
                        }
                      }}
                      placeholder="e.g., December to April"
                    />
                  </Grid>
                </Grid>
              </Box>
            </Grid>            
            {/* Location Coordinates */}
            <Grid size={12}>
              <Box sx={{ 
                p: 4, 
                bgcolor: '#fff3e0', 
                borderRadius: 3, 
                border: '2px solid #ffcc02',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
              }}>
                <Typography variant="h5" gutterBottom color="primary" sx={{ 
                  fontWeight: 'bold', 
                  mb: 3,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2
                }}>                  📍 Location Coordinates
                </Typography>
                <Grid container spacing={4}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      fullWidth
                      label="Latitude"
                      name="location.lat"
                      type="number"
                      value={formData.location.lat}
                      onChange={handleChange}
                      required
                      size="large"
                      inputProps={{ step: 'any' }}
                      sx={{ 
                        '& .MuiOutlinedInput-root': {
                          fontSize: '1.2rem',
                          bgcolor: 'white',
                          borderRadius: 2,
                          '& fieldset': {
                            borderWidth: 2,
                          },
                          '&:hover fieldset': {
                            borderColor: '#2e7d32',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#2e7d32',
                          },
                        },
                        '& .MuiInputLabel-root': {
                          fontSize: '1.1rem',
                        }
                      }}
                    />                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      fullWidth
                      label="Longitude"
                      name="location.lng"
                      type="number"
                      value={formData.location.lng}
                      onChange={handleChange}
                      required
                      size="large"
                      inputProps={{ step: 'any' }}
                      sx={{ 
                        '& .MuiOutlinedInput-root': {
                          fontSize: '1.2rem',
                          bgcolor: 'white',
                          borderRadius: 2,
                          '& fieldset': {
                            borderWidth: 2,
                          },
                          '&:hover fieldset': {
                            borderColor: '#2e7d32',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#2e7d32',
                          },
                        },
                        '& .MuiInputLabel-root': {
                          fontSize: '1.1rem',
                        }
                      }}
                    />
                  </Grid>
                </Grid>
              </Box>
            </Grid>            
            {/* Description Section */}
            <Grid size={12}>
              <Box sx={{ 
                p: 4, 
                bgcolor: '#f3e5f5', 
                borderRadius: 3, 
                border: '2px solid #e1bee7',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
              }}>
                <Typography variant="h5" gutterBottom color="primary" sx={{ 
                  fontWeight: 'bold', 
                  mb: 3,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2
                }}>
                  📝 Description
                </Typography>
                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  multiline
                  rows={6}
                  variant="outlined"
                  sx={{ 
                    '& .MuiOutlinedInput-root': {
                      fontSize: '1.1rem',
                      bgcolor: 'white',
                      borderRadius: 2,
                      '& fieldset': {
                        borderWidth: 2,
                      },
                      '&:hover fieldset': {
                        borderColor: '#2e7d32',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#2e7d32',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      fontSize: '1.1rem',
                    }
                  }}
                  placeholder="Describe what makes this destination special, its history, attractions, and unique features..."
                />
              </Box>
            </Grid>            
            {/* Travel Tips Section */}
            <Grid size={12}>
              <Box sx={{ 
                p: 4, 
                bgcolor: '#e8f5e8', 
                borderRadius: 3, 
                border: '2px solid #c8e6c9',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
              }}>
                <Typography variant="h5" gutterBottom color="primary" sx={{ 
                  fontWeight: 'bold', 
                  mb: 3,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2
                }}>
                  💡 Travel Tips
                </Typography>
                <TextField
                  fullWidth
                  label="Travel Tips"
                  name="travelTips"
                  value={formData.travelTips}
                  onChange={handleChange}
                  required
                  multiline
                  rows={4}
                  variant="outlined"
                  sx={{ 
                    '& .MuiOutlinedInput-root': {
                      fontSize: '1.1rem',
                      bgcolor: 'white',
                      borderRadius: 2,
                      '& fieldset': {
                        borderWidth: 2,
                      },
                      '&:hover fieldset': {
                        borderColor: '#2e7d32',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#2e7d32',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      fontSize: '1.1rem',
                    }
                  }}
                  placeholder="Share useful tips: best routes, entry fees, dress codes, local customs, recommended duration..."
                />
              </Box>
            </Grid>            
            {/* Images Section */}
            <Grid size={12}>
              <Box sx={{ 
                p: 4, 
                bgcolor: '#fff8e1', 
                borderRadius: 3, 
                border: '2px solid #ffecb3',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
              }}>
                <Typography variant="h5" gutterBottom color="primary" sx={{ 
                  fontWeight: 'bold', 
                  mb: 3,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2
                }}>
                  📸 Images (up to 10)
                </Typography>
                
                <Box sx={{ mb: 3 }}>
                  <Button
                    component="label"
                    variant="contained"
                    size="large"
                    startIcon={<PhotoCameraIcon />}
                    disabled={images.length >= 10}
                    sx={{
                      bgcolor: '#2e7d32',
                      fontSize: '1.2rem',
                      py: 2,
                      px: 4,
                      borderRadius: 2,
                      '&:hover': {
                        bgcolor: '#1b5e20',
                      },
                    }}
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
                  <Typography variant="body1" sx={{ mt: 2, color: 'text.secondary', fontSize: '1.1rem' }}>
                    Selected: {images.length}/10 images
                  </Typography>
                </Box>
                
                {imagePreviewUrls.length > 0 && (
                  <ImageList sx={{ height: 400, borderRadius: 2 }} cols={3} rowHeight={164}>
                    {imagePreviewUrls.map((url, index) => (
                      <ImageListItem key={index}>
                        <img
                          src={url}
                          alt={`Preview ${index}`}
                          loading="lazy"
                          style={{ borderRadius: '8px' }}
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
              </Box>
            </Grid>            
            {/* Submit Button */}
            <Grid size={12}>
              <Box sx={{ textAlign: 'center', pt: 4 }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  startIcon={<AddLocationIcon />}
                  disabled={loading}
                  sx={{
                    bgcolor: '#2e7d32',
                    fontSize: '1.4rem',
                    py: 2.5,
                    px: 8,
                    borderRadius: 3,
                    boxShadow: '0 6px 20px rgba(46, 125, 50, 0.3)',
                    '&:hover': {
                      bgcolor: '#1b5e20',
                      boxShadow: '0 8px 25px rgba(46, 125, 50, 0.4)',
                      transform: 'translateY(-2px)',
                    },
                    '&:disabled': {
                      bgcolor: '#c8e6c9',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  {loading ? <CircularProgress size={28} color="inherit" /> : 'ADD DESTINATION'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default AddDestinationPage;
