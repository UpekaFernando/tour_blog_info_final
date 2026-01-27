import { useState, useEffect, useContext } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Card,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Alert,
  Snackbar,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  ThumbUp as HelpfulIcon,
  ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';

const TravelGuidePage = () => {
  const { user } = useContext(AuthContext);
  const [guides, setGuides] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingGuide, setEditingGuide] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  
  const [formData, setFormData] = useState({
    title: '',
    category: 'planning',
    content: '',
    summary: '',
    tags: '',
  });
  const [imageFile, setImageFile] = useState(null);

  const categories = [
    { value: '', label: 'All Guides' },
    { value: 'planning', label: 'Trip Planning' },
    { value: 'transport', label: 'Transportation' },
    { value: 'budget', label: 'Budget Tips' },
    { value: 'cultural', label: 'Cultural Tips' },
    { value: 'safety', label: 'Safety' },
    { value: 'visa', label: 'Visa & Entry' },
    { value: 'emergency', label: 'Emergency Info' },
    { value: 'language', label: 'Language' },
    { value: 'other', label: 'Other' },
  ];

  useEffect(() => {
    fetchGuides();
  }, [selectedCategory]);

  const fetchGuides = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/travel-guides${selectedCategory ? `?category=${selectedCategory}` : ''}`);
      setGuides(response.data);
    } catch (error) {
      console.error('Error fetching guides:', error);
      showSnackbar('Error loading travel guides', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleOpenDialog = (guide = null) => {
    if (guide) {
      setEditingGuide(guide);
      setFormData({
        title: guide.title,
        category: guide.category,
        content: guide.content,
        summary: guide.summary || '',
        tags: Array.isArray(guide.tags) ? guide.tags.join(', ') : '',
      });
    } else {
      setEditingGuide(null);
      setFormData({
        title: '',
        category: 'planning',
        content: '',
        summary: '',
        tags: '',
      });
    }
    setImageFile(null);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingGuide(null);
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
      if (key === 'tags') {
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
      if (editingGuide) {
        await api.put(`/travel-guides/${editingGuide.id}`, submitData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        showSnackbar('Travel guide updated successfully!');
      } else {
        await api.post('/travel-guides', submitData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        showSnackbar('Travel guide added successfully!');
      }
      handleCloseDialog();
      fetchGuides();
    } catch (error) {
      console.error('Error saving guide:', error);
      showSnackbar(error.response?.data?.message || 'Error saving guide', 'error');
    }
  };

  const handleDelete = async (guideId) => {
    if (window.confirm('Are you sure you want to delete this guide?')) {
      try {
        await api.delete(`/travel-guides/${guideId}`);
        showSnackbar('Travel guide deleted successfully!');
        fetchGuides();
      } catch (error) {
        console.error('Error deleting guide:', error);
        showSnackbar('Error deleting guide', 'error');
      }
    }
  };

  const handleMarkHelpful = async (guideId) => {
    try {
      await api.post(`/travel-guides/${guideId}/helpful`);
      showSnackbar('Thank you for your feedback!');
      fetchGuides();
    } catch (error) {
      console.error('Error marking helpful:', error);
      showSnackbar('Error submitting feedback', 'error');
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Page Header */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom color="primary">
          Sri Lanka Travel Guides
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Community-contributed guides for traveling in Sri Lanka
        </Typography>
      </Box>

      {/* Add Guide Button */}
      {user && (
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Add Travel Guide
          </Button>
        </Box>
      )}

      {/* Category Filter */}
      <Paper sx={{ mb: 4, p: 2 }}>
        <FormControl fullWidth>
          <InputLabel>Category</InputLabel>
          <Select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            label="Category"
          >
            {categories.map((cat) => (
              <MenuItem key={cat.value} value={cat.value}>
                {cat.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Paper>

      {/* Travel Guides */}
      <Grid container spacing={3}>
        {guides.map((guide) => (
          <Grid item xs={12} key={guide.id}>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', pr: 2 }}>
                  <Box>
                    <Typography variant="h6">{guide.title}</Typography>
                    <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}>
                      <Chip label={categories.find(c => c.value === guide.category)?.label} size="small" color="primary" />
                      {guide.isOfficial && <Chip label="Official" size="small" color="success" />}
                      {guide.isVerified && <Chip label="Verified" size="small" color="info" />}
                      <Chip label={`👁 ${guide.viewCount}`} size="small" variant="outlined" />
                      <Chip label={`👍 ${guide.helpfulCount}`} size="small" variant="outlined" />
                    </Box>
                  </Box>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                {guide.image && (
                  <Box
                    component="img"
                    src={`http://localhost:5000${guide.image}`}
                    alt={guide.title}
                    sx={{ width: '100%', maxHeight: 300, objectFit: 'cover', mb: 2, borderRadius: 1 }}
                  />
                )}
                
                {guide.summary && (
                  <Typography variant="subtitle1" color="text.secondary" paragraph>
                    {guide.summary}
                  </Typography>
                )}

                <Typography variant="body1" paragraph sx={{ whiteSpace: 'pre-line' }}>
                  {guide.content}
                </Typography>

                {guide.tags && guide.tags.length > 0 && (
                  <Box sx={{ mb: 2 }}>
                    {guide.tags.map((tag, index) => (
                      <Chip key={index} label={tag} size="small" sx={{ mr: 0.5, mb: 0.5 }} />
                    ))}
                  </Box>
                )}

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2, pt: 2, borderTop: 1, borderColor: 'divider' }}>
                  <Typography variant="caption" color="text.secondary">
                    By {guide.author?.username || 'Unknown'} • {new Date(guide.createdAt).toLocaleDateString()}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    {user && (
                      <Button
                        size="small"
                        startIcon={<HelpfulIcon />}
                        onClick={() => handleMarkHelpful(guide.id)}
                      >
                        Helpful
                      </Button>
                    )}
                    {user && (user.id === guide.userId || user.role === 'admin') && (
                      <>
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleOpenDialog(guide)}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDelete(guide.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </>
                    )}
                  </Box>
                </Box>
              </AccordionDetails>
            </Accordion>
          </Grid>
        ))}
      </Grid>

      {/* No Results */}
      {!loading && guides.length === 0 && (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No travel guides found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {user ? 'Be the first to share your travel knowledge!' : 'Check back soon for travel guides'}
          </Typography>
        </Paper>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>{editingGuide ? 'Edit Travel Guide' : 'Add New Travel Guide'}</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Guide Title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <InputLabel>Category</InputLabel>
                  <Select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    label="Category"
                  >
                    {categories.filter(c => c.value).map((cat) => (
                      <MenuItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  label="Summary (Optional)"
                  name="summary"
                  value={formData.summary}
                  onChange={handleInputChange}
                  placeholder="Brief overview of the guide"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={10}
                  label="Content"
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  required
                  placeholder="Write your detailed travel guide here..."
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Tags"
                  name="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                  placeholder="Comma-separated, e.g., budget, backpacking, family"
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="outlined"
                  component="label"
                  fullWidth
                >
                  Upload Image (Optional)
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
              {editingGuide ? 'Update' : 'Add'} Guide
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

export default TravelGuidePage;
