import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { AuthContext } from '../context/AuthContext';
import { getDistricts, getDestinationById, updateDestination } from '../utils/api';

const EditDestinationPage = () => {
  const { id } = useParams();
  const { currentUser, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  const [destination, setDestination] = useState(null);
  const [districts, setDistricts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
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

  const [newImages, setNewImages] = useState([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState([]);
  const [existingImages, setExistingImages] = useState([]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch destination data and districts in parallel
        const [destinationData, districtsData] = await Promise.all([
          getDestinationById(id),
          getDistricts()
        ]);

        console.log('Fetched destination for editing:', destinationData);

        // Check if user is authorized to edit
        const isAuthor = destinationData.authorId === currentUser.id || 
                        destinationData.Author?.id === currentUser.id;
        const isAdmin = currentUser.isAdmin;
        
        if (!isAuthor && !isAdmin) {
          setError('You are not authorized to edit this destination');
          setLoading(false);
          return;
        }

        setDestination(destinationData);
        setDistricts(districtsData);
        setExistingImages(destinationData.images || []);

        // Populate form with existing data
        setFormData({
          title: destinationData.title || '',
          description: destinationData.description || '',
          districtId: destinationData.districtId || destinationData.District?.id || '',
          location: destinationData.location || { lat: 7.8731, lng: 80.7718 },
          bestTimeToVisit: destinationData.bestTimeToVisit || '',
          travelTips: destinationData.travelTips || '',
        });

        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load destination data');
        setLoading(false);
      }
    };

    fetchData();
  }, [id, isAuthenticated, navigate, currentUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('location.')) {
      const locationField = name.split('.')[1];
      setFormData({
        ...formData,
        location: {
          ...formData.location,
          [locationField]: parseFloat(value) || value
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
      const selectedImages = Array.from(e.target.files);
      const totalImages = [...newImages, ...selectedImages].slice(0, 10);
      setNewImages(totalImages);
      
      const newPreviewUrls = totalImages.map(image => 
        URL.createObjectURL(image)
      );
      setImagePreviewUrls(newPreviewUrls);
    }
  };

  const removeNewImage = (indexToRemove) => {
    const updatedImages = newImages.filter((_, index) => index !== indexToRemove);
    setNewImages(updatedImages);
    
    const updatedUrls = imagePreviewUrls.filter((_, index) => index !== indexToRemove);
    setImagePreviewUrls(updatedUrls);
  };

  const removeExistingImage = (indexToRemove) => {
    const updatedImages = existingImages.filter((_, index) => index !== indexToRemove);
    setExistingImages(updatedImages);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }
    if (!formData.description.trim()) {
      setError('Description is required');
      return;
    }
    if (!formData.districtId) {
      setError('Please select a district');
      return;
    }
    if (!formData.bestTimeToVisit.trim()) {
      setError('Best time to visit is required');
      return;
    }
    if (!formData.travelTips.trim()) {
      setError('Travel tips are required');
      return;
    }

    try {
      setSubmitting(true);

      console.log('Updating destination with:', formData);

      const updateData = new FormData();
      updateData.append('title', formData.title);
      updateData.append('description', formData.description);
      updateData.append('districtId', formData.districtId);
      updateData.append('location', JSON.stringify(formData.location));
      updateData.append('bestTimeToVisit', formData.bestTimeToVisit);
      updateData.append('travelTips', formData.travelTips);

      // Add existing images that weren't removed
      if (existingImages.length > 0) {
        updateData.append('existingImages', JSON.stringify(existingImages));
      }

      // Add new images
      newImages.forEach((image) => {
        updateData.append('images', image);
      });

      console.log('FormData contents:');
      for (let [key, value] of updateData.entries()) {
        console.log(key, value);
      }

      const result = await updateDestination(id, updateData, currentUser.token);
      console.log('Update result:', result);

      setSuccess('Destination updated successfully!');
      setTimeout(() => {
        navigate(`/destination/${id}`);
      }, 1500);

    } catch (err) {
      console.error('Error updating destination:', err);
      setError(err.response?.data?.message || 'Failed to update destination');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Container sx={{ py: 8 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error && !destination) {
    return (
      <Container sx={{ py: 8 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={() => navigate(-1)}
        >
          Go Back
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={() => navigate(`/destination/${id}`)}
          sx={{ mb: 2 }}
        >
          Back to Destination
        </Button>
        <Typography variant="h4" component="h1" gutterBottom>
          Edit Destination
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Update the information for "{destination?.title}"
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {success}
        </Alert>
      )}

      <Paper elevation={2} sx={{ p: 4 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Basic Information */}
            <Grid size={12}>
              <Typography variant="h6" gutterBottom>
                Basic Information
              </Typography>
            </Grid>

            <Grid size={12}>
              <TextField
                fullWidth
                label="Destination Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="Enter destination name"
              />
            </Grid>

            <Grid size={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                multiline
                rows={4}
                placeholder="Describe this beautiful destination..."
              />
            </Grid>

            <Grid size={12}>
              <FormControl fullWidth required>
                <InputLabel>District</InputLabel>
                <Select
                  name="districtId"
                  value={formData.districtId}
                  onChange={handleChange}
                  label="District"
                >
                  {districts.map((district) => (
                    <MenuItem key={district.id} value={district.id}>
                      {district.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Location */}
            <Grid size={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                <AddLocationIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Location Coordinates
              </Typography>
            </Grid>

            <Grid size={6}>
              <TextField
                fullWidth
                label="Latitude"
                name="location.lat"
                type="number"
                value={formData.location.lat}
                onChange={handleChange}
                inputProps={{ step: 'any' }}
                placeholder="7.8731"
              />
            </Grid>

            <Grid size={6}>
              <TextField
                fullWidth
                label="Longitude"
                name="location.lng"
                type="number"
                value={formData.location.lng}
                onChange={handleChange}
                inputProps={{ step: 'any' }}
                placeholder="80.7718"
              />
            </Grid>

            {/* Additional Information */}
            <Grid size={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Additional Information
              </Typography>
            </Grid>

            <Grid size={12}>
              <TextField
                fullWidth
                label="Best Time to Visit"
                name="bestTimeToVisit"
                value={formData.bestTimeToVisit}
                onChange={handleChange}
                required
                placeholder="e.g., December to March, All year round"
              />
            </Grid>

            <Grid size={12}>
              <TextField
                fullWidth
                label="Travel Tips"
                name="travelTips"
                value={formData.travelTips}
                onChange={handleChange}
                required
                multiline
                rows={3}
                placeholder="Helpful tips for visitors..."
              />
            </Grid>

            {/* Existing Images */}
            {existingImages.length > 0 && (
              <>
                <Grid size={12}>
                  <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                    Current Images
                  </Typography>
                </Grid>
                <Grid size={12}>
                  <ImageList cols={3} gap={8}>
                    {existingImages.map((imageUrl, index) => (
                      <ImageListItem key={index}>
                        <img
                          src={`http://localhost:5000${imageUrl}`}
                          alt={`Existing ${index + 1}`}
                          loading="lazy"
                          style={{ height: 200, objectFit: 'cover' }}
                        />
                        <ImageListItemBar
                          actionIcon={
                            <IconButton
                              sx={{ color: 'rgba(255, 255, 255, 0.75)' }}
                              onClick={() => removeExistingImage(index)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          }
                        />
                      </ImageListItem>
                    ))}
                  </ImageList>
                </Grid>
              </>
            )}

            {/* New Images */}
            <Grid size={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                <PhotoCameraIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Add New Images
              </Typography>
            </Grid>

            <Grid size={12}>
              <Button
                variant="outlined"
                component="label"
                startIcon={<PhotoCameraIcon />}
                fullWidth
                sx={{ p: 2 }}
              >
                Select Images
                <input
                  type="file"
                  hidden
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </Button>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                You can select up to 10 images total. Recommended size: 1200x800 pixels
              </Typography>
            </Grid>

            {imagePreviewUrls.length > 0 && (
              <Grid size={12}>
                <Typography variant="subtitle1" gutterBottom>
                  New Images Preview:
                </Typography>
                <ImageList cols={3} gap={8}>
                  {imagePreviewUrls.map((url, index) => (
                    <ImageListItem key={index}>
                      <img
                        src={url}
                        alt={`Preview ${index + 1}`}
                        loading="lazy"
                        style={{ height: 200, objectFit: 'cover' }}
                      />
                      <ImageListItemBar
                        actionIcon={
                          <IconButton
                            sx={{ color: 'rgba(255, 255, 255, 0.75)' }}
                            onClick={() => removeNewImage(index)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        }
                      />
                    </ImageListItem>
                  ))}
                </ImageList>
              </Grid>
            )}

            {/* Submit Button */}
            <Grid size={12}>
              <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={submitting}
                  sx={{ flex: 1 }}
                >
                  {submitting ? <CircularProgress size={24} /> : 'Update Destination'}
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => navigate(`/destination/${id}`)}
                  disabled={submitting}
                >
                  Cancel
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default EditDestinationPage;
