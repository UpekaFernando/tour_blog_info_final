import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { getImageUrl } from '../utils/api';
import {
  Container,
  Typography,
  Box,
  Paper,
  Avatar,
  Button,
  TextField,
  Grid,
  CircularProgress,
  Alert,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Chip,
} from '@mui/material';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  PhotoCamera as PhotoCameraIcon,
  Visibility as VisibilityIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { AuthContext } from '../context/AuthContext';
import { getUserProfile, updateUserProfile, getDestinations, deleteDestination } from '../utils/api';

const ProfilePage = () => {
  const { currentUser, login, updateUser, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [userDestinations, setUserDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editing, setEditing] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [destinationToDelete, setDestinationToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [profilePicture, setProfilePicture] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchProfileData = async () => {
      try {
        setLoading(true);
        
        // Fetch user profile
        const userProfile = await getUserProfile(currentUser.token);
        setProfile(userProfile);
        
        // Set form data
        setFormData({
          name: userProfile.name,
          email: userProfile.email,
          password: '',
          confirmPassword: '',
        });        // Fetch user's destinations
        const allDestinations = await getDestinations();
        
        const userDests = allDestinations.filter(dest => {
          // Check multiple possible author ID fields
          const authorId = dest.authorId || dest.author?.id || dest.Author?.id;
          const userId = currentUser.id || currentUser._id;
          return authorId === userId;
        });
        
        setUserDestinations(userDests);
        
        setLoading(false);
      } catch (err) {
        setError('Failed to load profile information');
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [currentUser, isAuthenticated, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleProfilePictureChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setProfilePicture(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('email', formData.email);
      
      if (formData.password) {
        formDataToSend.append('password', formData.password);
      }
      
      if (profilePicture) {
        formDataToSend.append('profilePicture', profilePicture);
      }
      
      console.log('Updating profile with data:', Array.from(formDataToSend.entries()));
      const updatedUser = await updateUserProfile(formDataToSend, currentUser.token);
      console.log('Received updated user data:', updatedUser);
      
      // Update context with new user data, preserving the token
      updateUser({
        ...updatedUser,
        token: currentUser.token,
      });
      
      // Update local profile state with new data
      setProfile(updatedUser);
      
      // Force a small delay to ensure state updates properly
      setTimeout(() => {
        // Reset file input
        setProfilePicture(null);
        
        setSuccess('Profile updated successfully');
        setEditing(false);
        setLoading(false);
        
        // Reset password fields
        setFormData({
          ...formData,
          password: '',
          confirmPassword: '',
        });
      }, 100);    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
      setLoading(false);
    }
  };

  const handleDeleteDestination = (destination) => {
    setDestinationToDelete(destination);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!destinationToDelete) return;

    try {
      setDeleting(true);
      await deleteDestination(destinationToDelete.id || destinationToDelete._id, currentUser.token);
      
      // Remove destination from the list
      setUserDestinations(userDestinations.filter(
        dest => (dest.id || dest._id) !== (destinationToDelete.id || destinationToDelete._id)
      ));
      
      setSuccess('Destination deleted successfully');
      setDeleteDialogOpen(false);
      setDestinationToDelete(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete destination');
    } finally {
      setDeleting(false);
    }
  };
  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setDestinationToDelete(null);
  };

  const refreshDestinations = async () => {
    try {
      const allDestinations = await getDestinations();
      const userDests = allDestinations.filter(dest => {
        const authorId = dest.authorId || dest.author?.id || dest.Author?.id;
        const userId = currentUser.id || currentUser._id;
        return authorId === userId;
      });
      setUserDestinations(userDests);
    } catch (err) {
      console.error('Failed to refresh destinations:', err);
    }
  };

  if (loading && !profile) {
    return (
      <Container sx={{ py: 8 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Grid container spacing={4}>
          {/* Profile Info Section */}
          <Grid item xs={12} md={4} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Avatar
              src={
                profilePicture
                  ? URL.createObjectURL(profilePicture)
                  : profile?.profilePicture
                  ? (() => {
                      const imageUrl = profile.profilePicture.startsWith('/uploads') 
                        ? `${getImageUrl(profile.profilePicture)}?t=${Date.now()}`
                        : `${getImageUrl(`/uploads/${profile.profilePicture}`)}?t=${Date.now()}`;
                      console.log('Profile image URL:', imageUrl);
                      return imageUrl;
                    })()
                  : undefined
              }
              sx={{ width: 120, height: 120, mb: 2 }}
            />
            
            {editing && (
              <Button
                component="label"
                variant="outlined"
                startIcon={<PhotoCameraIcon />}
                sx={{ mb: 2 }}
              >
                Change Photo
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleProfilePictureChange}
                />
              </Button>
            )}
            
            <Typography variant="h5" gutterBottom>
              {profile?.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Member since {new Date(profile?.createdAt).toLocaleDateString()}
            </Typography>
          </Grid>
          
          {/* Profile Form Section */}
          <Grid item xs={12} md={8}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h5" component="h2">
                {editing ? 'Edit Profile' : 'Profile Information'}
              </Typography>
              
              {!editing ? (
                <Button
                  variant="outlined"
                  startIcon={<EditIcon />}
                  onClick={() => setEditing(true)}
                >
                  Edit Profile
                </Button>
              ) : (
                <Box>
                  <IconButton
                    color="primary"
                    onClick={() => {
                      setEditing(false);
                      setError('');
                      setFormData({
                        name: profile.name,
                        email: profile.email,
                        password: '',
                        confirmPassword: '',
                      });
                      setProfilePicture(null);
                    }}
                  >
                    <CancelIcon />
                  </IconButton>
                </Box>
              )}
            </Box>
            
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
            
            {editing ? (
              <Box component="form" onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="New Password"
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleChange}
                      helperText="Leave blank to keep current password"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Confirm New Password"
                      name="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      startIcon={<SaveIcon />}
                      disabled={loading}
                    >
                      {loading ? <CircularProgress size={24} /> : 'Save Changes'}
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            ) : (
              <Box>
                <Typography variant="body1">
                  <strong>Name:</strong> {profile?.name}
                </Typography>
                <Typography variant="body1" sx={{ mt: 2 }}>
                  <strong>Email:</strong> {profile?.email}
                </Typography>
              </Box>
            )}
          </Grid>
        </Grid>
          {/* User's Destinations Section */}
        <Box sx={{ mt: 6 }}>
          <Divider sx={{ mb: 4 }} />
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5" component="h3">
              My Destinations ({userDestinations.length})
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate('/add-destination')}
            >
              Add New Destination
            </Button>
          </Box>
          
          {userDestinations.length === 0 ? (
            <Paper elevation={0} sx={{ p: 4, textAlign: 'center', bgcolor: 'grey.100' }}>
              <Typography variant="body1" paragraph>
                You haven't added any destinations yet.
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate('/add-destination')}
              >
                Add Your First Destination
              </Button>
            </Paper>
          ) : (            <List>
              {userDestinations.map((dest) => (
                <ListItem
                  key={dest.id || dest._id}
                  sx={{ 
                    borderBottom: '1px solid', 
                    borderColor: 'divider',
                    '&:hover': { bgcolor: 'action.hover' }
                  }}
                >
                  <ListItemAvatar>
                    <Avatar
                      src={
                        dest.images && dest.images.length > 0
                          ? getImageUrl(dest.images[0])
                          : undefined
                      }
                      alt={dest.title}
                      sx={{ width: 56, height: 56 }}
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography variant="h6" component="div">
                        {dest.title}
                      </Typography>
                    }
                    secondary={
                      <Box sx={{ mt: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                          {(dest.district?.name || dest.District?.name || 'Unknown District')} - Added on {new Date(dest.createdAt).toLocaleDateString()}
                        </Typography>
                        <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
                          <Chip 
                            label={dest.bestTimeToVisit} 
                            size="small" 
                            variant="outlined" 
                          />
                          <Chip 
                            label={`${dest.images?.length || 0} image(s)`} 
                            size="small" 
                            variant="outlined" 
                          />
                        </Box>
                      </Box>
                    }
                  />
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, ml: 2 }}>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<VisibilityIcon />}
                      onClick={() => navigate(`/destination/${dest.id || dest._id}`)}
                    >
                      View
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<EditIcon />}
                      onClick={() => navigate(`/edit-destination/${dest.id || dest._id}`)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      color="error"
                      startIcon={<DeleteIcon />}
                      onClick={() => handleDeleteDestination(dest)}
                    >
                      Delete
                    </Button>
                  </Box>
                </ListItem>
              ))}
            </List>          )}
        </Box>
      </Paper>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">
          Delete Destination
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete "{destinationToDelete?.title}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={handleDeleteCancel} 
            disabled={deleting}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteConfirm} 
            color="error" 
            variant="contained"
            disabled={deleting}
          >
            {deleting ? <CircularProgress size={20} /> : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ProfilePage;
