import { useState, useEffect, useContext } from 'react';
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Alert,
  Snackbar,
} from '@mui/material';
import {
  Restaurant as RestaurantIcon,
  Hotel as HotelIcon,
  LocalTaxi as TaxiIcon,
  Search as SearchIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Schedule as ScheduleIcon,
  AttachMoney as MoneyIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Email as EmailIcon,
} from '@mui/icons-material';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';

const LocalServicesPage = () => {
  const { user } = useContext(AuthContext);
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  
  const [formData, setFormData] = useState({
    name: '',
    category: 'restaurant',
    subcategory: '',
    description: '',
    location: '',
    district: '',
    address: '',
    phone: '',
    email: '',
    website: '',
    priceRange: '$$',
    openHours: '',
    features: '',
    specialties: '',
    amenities: '',
    services: '',
  });
  const [imageFile, setImageFile] = useState(null);

  const categories = [
    { label: 'All', value: '', icon: <SearchIcon /> },
    { label: 'Restaurants', value: 'restaurant', icon: <RestaurantIcon /> },
    { label: 'Hotels', value: 'hotel', icon: <HotelIcon /> },
    { label: 'Transport', value: 'transport', icon: <TaxiIcon /> },
  ];

  useEffect(() => {
    fetchServices();
  }, [selectedCategory]);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const categoryValue = categories[selectedCategory].value;
      const response = await api.get(`/local-services${categoryValue ? `?category=${categoryValue}` : ''}`);
      setServices(response.data);
    } catch (error) {
      console.error('Error fetching services:', error);
      showSnackbar('Error loading services', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleOpenDialog = (service = null) => {
    if (service) {
      setEditingService(service);
      setFormData({
        name: service.name,
        category: service.category,
        subcategory: service.subcategory || '',
        description: service.description,
        location: service.location,
        district: service.district || '',
        address: service.address || '',
        phone: service.phone || '',
        email: service.email || '',
        website: service.website || '',
        priceRange: service.priceRange || '$$',
        openHours: service.openHours || '',
        features: Array.isArray(service.features) ? service.features.join(', ') : '',
        specialties: Array.isArray(service.specialties) ? service.specialties.join(', ') : '',
        amenities: Array.isArray(service.amenities) ? service.amenities.join(', ') : '',
        services: Array.isArray(service.services) ? service.services.join(', ') : '',
      });
    } else {
      setEditingService(null);
      setFormData({
        name: '',
        category: 'restaurant',
        subcategory: '',
        description: '',
        location: '',
        district: '',
        address: '',
        phone: '',
        email: '',
        website: '',
        priceRange: '$$',
        openHours: '',
        features: '',
        specialties: '',
        amenities: '',
        services: '',
      });
    }
    setImageFile(null);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingService(null);
    setImageFile(null);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const submitData = new FormData();
    Object.keys(formData).forEach(key => {
      if (key === 'features' || key === 'specialties' || key === 'amenities' || key === 'services') {
        const arrayValue = formData[key].split(',').map(item => item.trim()).filter(item => item);
        submitData.append(key, JSON.stringify(arrayValue));
      } else {
        submitData.append(key, formData[key]);
      }
    });
    
    if (imageFile) {
      submitData.append('image', imageFile);
    }

    try {
      if (editingService) {
        await api.put(`/local-services/${editingService.id}`, submitData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        showSnackbar('Service updated successfully!');
      } else {
        await api.post('/local-services', submitData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        showSnackbar('Service added successfully!');
      }
      handleCloseDialog();
      fetchServices();
    } catch (error) {
      console.error('Error saving service:', error);
      showSnackbar(error.response?.data?.message || 'Error saving service', 'error');
    }
  };

  const handleDelete = async (serviceId) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        await api.delete(`/local-services/${serviceId}`);
        showSnackbar('Service deleted successfully!');
        fetchServices();
      } catch (error) {
        console.error('Error deleting service:', error);
        showSnackbar('Error deleting service', 'error');
      }
    }
  };

  const filteredServices = services.filter(service =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderPriceRange = (priceRange) => {
    const colors = { '$': 'success', '$$': 'warning', '$$$': 'error', '$$$$': 'error' };
    return (
      <Chip
        label={priceRange}
        size="small"
        color={colors[priceRange] || 'default'}
        icon={<MoneyIcon />}
      />
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
          Discover and share the best services in Sri Lanka
        </Typography>
      </Box>

      {/* Add Service Button */}
      {user && (
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Add Service
          </Button>
        </Box>
      )}

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
              {service.image && (
                <CardMedia
                  component="img"
                  height="200"
                  image={`http://localhost:5000${service.image}`}
                  alt={service.name}
                  sx={{ objectFit: 'cover' }}
                />
              )}
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                  <Typography variant="h6" component="h2">
                    {service.name}
                  </Typography>
                  {service.priceRange && renderPriceRange(service.priceRange)}
                </Box>

                <Typography variant="subtitle2" color="primary" gutterBottom>
                  {service.subcategory || service.category}
                </Typography>

                {service.rating > 0 && (
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Rating value={service.rating} precision={0.1} size="small" readOnly />
                    <Typography variant="body2" sx={{ ml: 1 }}>
                      {service.rating}
                    </Typography>
                  </Box>
                )}

                <Typography variant="body2" color="text.secondary" paragraph>
                  {service.description}
                </Typography>

                <List dense>
                  {service.location && (
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon>
                        <LocationIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary={service.location} secondary={service.district} />
                    </ListItem>
                  )}
                  
                  {service.phone && (
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon>
                        <PhoneIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary={service.phone} />
                    </ListItem>
                  )}
                  
                  {service.email && (
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon>
                        <EmailIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary={service.email} />
                    </ListItem>
                  )}
                  
                  {service.openHours && (
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon>
                        <ScheduleIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary={service.openHours} />
                    </ListItem>
                  )}
                </List>

                {/* Specialties/Services/Amenities */}
                {service.specialties && service.specialties.length > 0 && (
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

                {service.amenities && service.amenities.length > 0 && (
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

                {service.features && service.features.length > 0 && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Features:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {service.features.map((feature, index) => (
                        <Chip key={index} label={feature} size="small" variant="outlined" />
                      ))}
                    </Box>
                  </Box>
                )}

                <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 2 }}>
                  Added by {service.user?.username || 'User'}
                </Typography>
              </CardContent>

              <Box sx={{ p: 2, pt: 0, display: 'flex', gap: 1 }}>
                {service.phone && (
                  <Button
                    variant="contained"
                    fullWidth
                    href={`tel:${service.phone}`}
                    startIcon={<PhoneIcon />}
                  >
                    Contact
                  </Button>
                )}
                {user && (user.id === service.userId || user.role === 'admin') && (
                  <>
                    <IconButton
                      color="primary"
                      onClick={() => handleOpenDialog(service)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(service.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </>
                )}
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* No Results */}
      {!loading && filteredServices.length === 0 && (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No services found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {user ? 'Be the first to add a service!' : 'Try adjusting your search terms'}
          </Typography>
        </Paper>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>{editingService ? 'Edit Service' : 'Add New Service'}</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Service Name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Category</InputLabel>
                  <Select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    label="Category"
                  >
                    <MenuItem value="restaurant">Restaurant</MenuItem>
                    <MenuItem value="hotel">Hotel</MenuItem>
                    <MenuItem value="transport">Transport</MenuItem>
                    <MenuItem value="tour-operator">Tour Operator</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Subcategory"
                  name="subcategory"
                  value={formData.subcategory}
                  onChange={handleInputChange}
                  placeholder="e.g., Italian, 5-Star, etc."
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Price Range</InputLabel>
                  <Select
                    name="priceRange"
                    value={formData.priceRange}
                    onChange={handleInputChange}
                    label="Price Range"
                  >
                    <MenuItem value="$">$ - Budget</MenuItem>
                    <MenuItem value="$$">$$ - Moderate</MenuItem>
                    <MenuItem value="$$$">$$$ - Expensive</MenuItem>
                    <MenuItem value="$$$$">$$$$ - Very Expensive</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="District"
                  name="district"
                  value={formData.district}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Website"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Open Hours"
                  name="openHours"
                  value={formData.openHours}
                  onChange={handleInputChange}
                  placeholder="e.g., 9:00 AM - 10:00 PM"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Specialties"
                  name="specialties"
                  value={formData.specialties}
                  onChange={handleInputChange}
                  placeholder="Comma-separated, e.g., Pizza, Pasta, Seafood"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Amenities"
                  name="amenities"
                  value={formData.amenities}
                  onChange={handleInputChange}
                  placeholder="Comma-separated, e.g., Pool, Spa, Gym"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Features"
                  name="features"
                  value={formData.features}
                  onChange={handleInputChange}
                  placeholder="Comma-separated, e.g., WiFi, Parking, AC"
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="outlined"
                  component="label"
                  fullWidth
                >
                  Upload Image
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </Button>
                {imageFile && (
                  <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                    Selected: {imageFile.name}
                  </Typography>
                )}
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button type="submit" variant="contained">
              {editingService ? 'Update' : 'Add'} Service
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default LocalServicesPage;
