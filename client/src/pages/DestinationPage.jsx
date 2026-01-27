import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import { getImageUrl } from '../utils/api';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Button,
  CircularProgress,
  Breadcrumbs,
  Link,
  Divider,
  Chip,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,  DialogTitle,
} from '@mui/material';
import {
  LocationOn,
  AccessTime,
  Edit,
  Delete,
  NavigateNext as NavigateNextIcon,
  PhotoLibrary,
  TipsAndUpdates,
} from '@mui/icons-material';
import { AuthContext } from '../context/AuthContext';
import { getDestinationById, deleteDestination } from '../utils/api';

const DestinationPage = () => {
  const { id } = useParams();
  const [destination, setDestination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  
  const { currentUser, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();  const isAuthor = 
    destination && 
    currentUser && 
    (destination.authorId === currentUser.id || 
     destination.author?.id === currentUser.id || 
     destination.Author?.id === currentUser.id);
  
  const isAuthorOrAdmin = 
    isAuthenticated && 
    (isAuthor || (currentUser && currentUser.isAdmin));  useEffect(() => {
    const fetchDestination = async () => {
      try {
        setLoading(true);
        const destinationData = await getDestinationById(id);
        setDestination(destinationData);
        setLoading(false);
      } catch (err) {
        setError('Failed to load destination information');
        setLoading(false);
      }
    };

    fetchDestination();
  }, [id]);

  const handleDeleteDialog = () => {
    setDeleteDialogOpen(true);
  };
  const handleDeleteConfirm = async () => {
    try {
      await deleteDestination(id, currentUser.token);
      setDeleteDialogOpen(false);
      navigate(`/district/${(destination.district?.id || destination.District?.id || destination.districtId)}`);
    } catch (err) {
      setError('Failed to delete destination');
      setDeleteDialogOpen(false);
    }
  };
  const handleNextImage = () => {
    if (destination?.images?.length) {
      setCurrentImage((prev) => (prev + 1) % destination.images.length);
    }
  };

  const handlePrevImage = () => {
    if (destination?.images?.length) {
      setCurrentImage((prev) => 
        prev === 0 ? destination.images.length - 1 : prev - 1
      );
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

  if (error || !destination) {
    return (
      <Container sx={{ py: 8 }}>
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h5" color="error" gutterBottom>
            {error || 'Destination not found'}
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
    <Container maxWidth="lg" sx={{ py: 6 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs 
        separator={<NavigateNextIcon fontSize="small" />} 
        aria-label="breadcrumb"
        sx={{ mb: 4 }}
      >
        <Link component={RouterLink} to="/" color="inherit">
          Home
        </Link>        <Link 
          component={RouterLink} 
          to={`/district/${(destination.district?.id || destination.District?.id || destination.districtId)}`} 
          color="inherit"
        >
          {(destination.district?.name || destination.District?.name || 'District')}
        </Link>
        <Typography color="text.primary">{destination.title}</Typography>
      </Breadcrumbs>
      
      <Paper elevation={2} sx={{ overflow: 'hidden' }}>
        {/* Destination Header */}
        <Box sx={{ p: 4 }}>          <Grid container spacing={2}>
            <Grid xs={12} md={8}>
              <Typography variant="h3" component="h1" gutterBottom>
                {destination.title}
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>                <LocationOn color="primary" sx={{ mr: 1 }} />
                <Typography variant="subtitle1">
                  {(destination.district?.name || destination.District?.name || 'Unknown District')}, {(destination.district?.province || destination.District?.province || 'Unknown')} Province
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <AccessTime color="primary" sx={{ mr: 1 }} />
                <Typography variant="subtitle1">
                  Best time to visit: {destination.bestTimeToVisit}
                </Typography>
              </Box>            </Grid>
            
            {isAuthorOrAdmin && (
              <Grid xs={12} md={4} sx={{ display: 'flex', justifyContent: { md: 'flex-end' } }}>
                <Button
                  variant="outlined"
                  startIcon={<Edit />}
                  sx={{ mr: 2 }}                  component={RouterLink}
                  to={`/edit-destination/${destination.id || destination._id}`}
                >
                  Edit
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<Delete />}
                  onClick={handleDeleteDialog}
                >
                  Delete
                </Button>
              </Grid>
            )}
          </Grid>
          
          <Divider sx={{ my: 3 }} />
          
          {/* Author Info */}
          <Box sx={{ mb: 2 }}>            <Typography variant="body2" color="text.secondary">
              Added by {(destination.author?.name || destination.Author?.name || 'Unknown Author')} on {destination.createdAt ? new Date(destination.createdAt).toLocaleDateString() : 'Unknown Date'}
            </Typography>
          </Box>
        </Box>
        
        {/* Image Gallery */}
        {destination.images && destination.images.length > 0 && (
          <Box sx={{ position: 'relative', height: 400 }}>
            <img
              src={getImageUrl(destination.images[currentImage])}
              alt={`${destination.title} - image ${currentImage + 1}`}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            
            {destination.images.length > 1 && (
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 16,
                  right: 16,
                  display: 'flex',
                  gap: 1
                }}
              >
                <Chip 
                  icon={<PhotoLibrary />} 
                  label={`${currentImage + 1} / ${destination.images.length}`}
                  color="primary"
                  variant="filled"
                />
                <Button
                  variant="contained"
                  size="small"
                  onClick={handlePrevImage}
                >
                  Prev
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  onClick={handleNextImage}
                >
                  Next
                </Button>
              </Box>
            )}
          </Box>
        )}
        
        {/* Description */}
        <Box sx={{ p: 4 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            About This Destination
          </Typography>
          <Typography variant="body1" paragraph>
            {destination.description}
          </Typography>
          
          <Divider sx={{ my: 4 }} />
          
          {/* Travel Tips */}
          <Box sx={{ mb: 4 }}>
            <Typography 
              variant="h5" 
              component="h2" 
              gutterBottom 
              sx={{ display: 'flex', alignItems: 'center' }}
            >
              <TipsAndUpdates sx={{ mr: 1 }} />
              Travel Tips
            </Typography>
            <Typography variant="body1" paragraph>
              {destination.travelTips}
            </Typography>
          </Box>
        </Box>
      </Paper>
      
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Delete Destination?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete "{destination.title}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default DestinationPage;
