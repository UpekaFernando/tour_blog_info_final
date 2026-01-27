import { useState, useEffect } from 'react';
import { getImageUrl } from '../utils/api';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Card,
  CardContent,
  CardMedia,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  ImageList,
  ImageListItem,
  Chip,
  IconButton,
  Fab,
  TextField,
  Avatar,
} from '@mui/material';
import {
  PhotoCamera as PhotoIcon,
  Upload as UploadIcon,
  Close as CloseIcon,
  Favorite as FavoriteIcon,
  Share as ShareIcon,
  Download as DownloadIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const PhotoGalleryPage = () => {
  const { currentUser, isAuthenticated } = useContext(AuthContext);
  const [photos, setPhotos] = useState([]);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [photoDescription, setPhotoDescription] = useState('');
  const [photoLocation, setPhotoLocation] = useState('');
  const [filter, setFilter] = useState('all');

  // Mock photos data (in real app, fetch from API)
  const mockPhotos = [
    {
      id: 1,
      url: '/uploads/images-1750785265516.jpg',
      title: 'Sunset at Sigiriya',
      description: 'Beautiful sunset view from the top of Sigiriya Rock',
      location: 'Sigiriya, Central Province',
      photographer: 'John Doe',
      likes: 24,
      category: 'landscape',
      uploadedAt: new Date('2024-01-15'),
    },
    {
      id: 2,
      url: '/uploads/images-1750785364426.jpg',
      title: 'Galle Fort Walls',
      description: 'Historic fortifications overlooking the Indian Ocean',
      location: 'Galle, Southern Province',
      photographer: 'Jane Smith',
      likes: 18,
      category: 'architecture',
      uploadedAt: new Date('2024-01-20'),
    },
    {
      id: 3,
      url: '/uploads/images-1750785584274.png',
      title: 'Tea Plantation',
      description: 'Lush green tea gardens in the hill country',
      location: 'Nuwara Eliya, Central Province',
      photographer: 'Mike Johnson',
      likes: 31,
      category: 'nature',
      uploadedAt: new Date('2024-01-25'),
    },
    {
      id: 4,
      url: '/uploads/images-1755800929685.jpg',
      title: 'Temple of the Tooth',
      description: 'Sacred Buddhist temple in Kandy',
      location: 'Kandy, Central Province',
      photographer: 'Sarah Wilson',
      likes: 42,
      category: 'culture',
      uploadedAt: new Date('2024-02-01'),
    },
    {
      id: 5,
      url: '/uploads/images-1755800929690.jpg',
      title: 'Beach Paradise',
      description: 'Crystal clear waters and golden sand',
      location: 'Mirissa, Southern Province',
      photographer: 'David Lee',
      likes: 37,
      category: 'beach',
      uploadedAt: new Date('2024-02-05'),
    },
  ];

  const categories = [
    { value: 'all', label: 'All Photos' },
    { value: 'landscape', label: 'Landscapes' },
    { value: 'architecture', label: 'Architecture' },
    { value: 'nature', label: 'Nature' },
    { value: 'culture', label: 'Culture' },
    { value: 'beach', label: 'Beaches' },
    { value: 'wildlife', label: 'Wildlife' },
    { value: 'food', label: 'Food' },
  ];

  useEffect(() => {
    // In real app, fetch photos from API
    setPhotos(mockPhotos);
  }, []);

  const filteredPhotos = filter === 'all' 
    ? photos 
    : photos.filter(photo => photo.category === filter);

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    setSelectedFiles(files);
  };

  const handleUpload = async () => {
    // In real app, upload to server
    console.log('Uploading photos:', selectedFiles);
    console.log('Description:', photoDescription);
    console.log('Location:', photoLocation);
    
    // Mock upload success
    setUploadDialogOpen(false);
    setSelectedFiles([]);
    setPhotoDescription('');
    setPhotoLocation('');
  };

  const handleLike = (photoId) => {
    setPhotos(photos.map(photo => 
      photo.id === photoId 
        ? { ...photo, likes: photo.likes + 1 }
        : photo
    ));
  };

  const handleShare = (photo) => {
    if (navigator.share) {
      navigator.share({
        title: photo.title,
        text: photo.description,
        url: window.location.href,
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const handleDownload = (photo) => {
    const link = document.createElement('a');
    link.href = getImageUrl(photo.url);
    link.download = photo.title;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Page Header */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom color="primary">
          Photo Gallery
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
          Capture and share the beauty of Sri Lanka
        </Typography>

        {/* Category Filters */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center', mb: 3 }}>
          {categories.map((category) => (
            <Chip
              key={category.value}
              label={category.label}
              variant={filter === category.value ? 'filled' : 'outlined'}
              color={filter === category.value ? 'primary' : 'default'}
              onClick={() => setFilter(category.value)}
              clickable
            />
          ))}
        </Box>
      </Box>

      {/* Stats */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={6} sm={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h4" color="primary">
              {photos.length}
            </Typography>
            <Typography variant="body2">Total Photos</Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h4" color="secondary">
              {photos.reduce((sum, photo) => sum + photo.likes, 0)}
            </Typography>
            <Typography variant="body2">Total Likes</Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h4" color="success.main">
              {new Set(photos.map(p => p.photographer)).size}
            </Typography>
            <Typography variant="body2">Contributors</Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h4" color="warning.main">
              {filteredPhotos.length}
            </Typography>
            <Typography variant="body2">Filtered Results</Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Photo Grid */}
      <ImageList variant="masonry" cols={3} gap={8}>
        {filteredPhotos.map((photo) => (
          <ImageListItem
            key={photo.id}
            sx={{
              cursor: 'pointer',
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'scale(1.02)',
              },
            }}
            onClick={() => setSelectedPhoto(photo)}
          >
            <img
              src={`${getImageUrl(photo.url)}?w=248&fit=crop&auto=format`}
              srcSet={`${getImageUrl(photo.url)}?w=248&fit=crop&auto=format&dpr=2 2x`}
              alt={photo.title}
              loading="lazy"
              style={{
                borderRadius: 8,
                display: 'block',
                width: '100%',
              }}
            />
            <Box
              sx={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                color: 'white',
                p: 1,
                borderRadius: '0 0 8px 8px',
              }}
            >
              <Typography variant="subtitle2" noWrap>
                {photo.title}
              </Typography>
              <Typography variant="caption" display="block">
                by {photo.photographer}
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 0.5 }}>
                <Typography variant="caption">
                  {photo.location}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <FavoriteIcon sx={{ fontSize: 14, mr: 0.5 }} />
                  <Typography variant="caption">{photo.likes}</Typography>
                </Box>
              </Box>
            </Box>
          </ImageListItem>
        ))}
      </ImageList>

      {/* Upload FAB */}
      {isAuthenticated && (
        <Fab
          color="primary"
          aria-label="upload photo"
          sx={{
            position: 'fixed',
            bottom: 16,
            right: 16,
          }}
          onClick={() => setUploadDialogOpen(true)}
        >
          <AddIcon />
        </Fab>
      )}

      {/* Photo Detail Dialog */}
      <Dialog
        open={!!selectedPhoto}
        onClose={() => setSelectedPhoto(null)}
        maxWidth="md"
        fullWidth
      >
        {selectedPhoto && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h5">{selectedPhoto.title}</Typography>
                <IconButton onClick={() => setSelectedPhoto(null)}>
                  <CloseIcon />
                </IconButton>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Box sx={{ textAlign: 'center', mb: 2 }}>
                <img
                  src={getImageUrl(selectedPhoto.url)}
                  alt={selectedPhoto.title}
                  style={{
                    maxWidth: '100%',
                    maxHeight: '60vh',
                    objectFit: 'contain',
                    borderRadius: 8,
                  }}
                />
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ mr: 2 }}>{selectedPhoto.photographer[0]}</Avatar>
                <Box>
                  <Typography variant="subtitle1">{selectedPhoto.photographer}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {selectedPhoto.uploadedAt.toLocaleDateString()}
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body1" paragraph>
                {selectedPhoto.description}
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                📍 {selectedPhoto.location}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <Chip label={selectedPhoto.category} size="small" />
                <Chip
                  icon={<FavoriteIcon />}
                  label={`${selectedPhoto.likes} likes`}
                  size="small"
                  variant="outlined"
                />
              </Box>
            </DialogContent>
            <DialogActions>
              <Button
                startIcon={<FavoriteIcon />}
                onClick={() => handleLike(selectedPhoto.id)}
                color="error"
              >
                Like
              </Button>
              <Button
                startIcon={<ShareIcon />}
                onClick={() => handleShare(selectedPhoto)}
              >
                Share
              </Button>
              <Button
                startIcon={<DownloadIcon />}
                onClick={() => handleDownload(selectedPhoto)}
              >
                Download
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Upload Dialog */}
      <Dialog
        open={uploadDialogOpen}
        onClose={() => setUploadDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Upload Photos</DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 3 }}>
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="photo-upload"
              multiple
              type="file"
              onChange={handleFileSelect}
            />
            <label htmlFor="photo-upload">
              <Button
                variant="outlined"
                component="span"
                startIcon={<PhotoIcon />}
                fullWidth
                sx={{ mb: 2, py: 2 }}
              >
                Select Photos
              </Button>
            </label>
            {selectedFiles.length > 0 && (
              <Typography variant="body2" color="text.secondary">
                {selectedFiles.length} file(s) selected
              </Typography>
            )}
          </Box>
          
          <TextField
            fullWidth
            label="Description"
            multiline
            rows={3}
            value={photoDescription}
            onChange={(e) => setPhotoDescription(e.target.value)}
            sx={{ mb: 2 }}
          />
          
          <TextField
            fullWidth
            label="Location"
            value={photoLocation}
            onChange={(e) => setPhotoLocation(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUploadDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleUpload}
            variant="contained"
            startIcon={<UploadIcon />}
            disabled={selectedFiles.length === 0}
          >
            Upload
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default PhotoGalleryPage;
