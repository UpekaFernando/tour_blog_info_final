import { Box, Container, Grid, Typography, Link, IconButton } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import { Link as RouterLink } from 'react-router-dom';
import { getImageUrl } from '../utils/api';

const Footer = () => {
  // Example: fetch destinations and users (replace with real data fetching in production)
  const exampleDestinations = [
    { title: 'Kandy', image: '/uploads/images-1750785265516.jpg' },
    { title: 'Galle', image: '/uploads/images-1750785364426.jpg' },
    { title: 'Jaffna', image: '/uploads/images-1750785584274.png' }
  ];
  const exampleUsers = [
    { name: 'Upeka', profilePicture: '/uploads/images-1755800929685.jpg' },
    { name: 'Fernando', profilePicture: '/uploads/images-1755800929690.jpg' }
  ];

  return (
    <Box
      sx={{
        bgcolor: 'primary.main',
        color: 'white',
        py: 6,
        mt: 'auto'
      }}
      component="footer"
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom>
              Sri Lanka Travel Blog
            </Typography>
            <Typography variant="body2">
              Discover the beauty and culture of Sri Lanka through our interactive travel blog. Explore different districts, find hidden gems, and share your own experiences.
            </Typography>
            {/* Destination Images */}
            <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
              {exampleDestinations.map((dest, idx) => (
                <Box key={idx} sx={{ width: 60, height: 40, overflow: 'hidden', borderRadius: 2, bgcolor: 'grey.300' }}>
                  <img
                    src={getImageUrl(dest.image)}
                    alt={dest.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </Box>
              ))}
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom>
              Quick Links
            </Typography>
            <Typography variant="body2" component="div">
              <Link component={RouterLink} to="/" color="inherit" sx={{ display: 'block', mb: 1 }}>
                Home
              </Link>
              <Link component={RouterLink} to="/about" color="inherit" sx={{ display: 'block', mb: 1 }}>
                About Us
              </Link>
              <Link component={RouterLink} to="/register" color="inherit" sx={{ display: 'block', mb: 1 }}>
                Join Us
              </Link>
            </Typography>
            {/* User Profile Images */}
            <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
              {exampleUsers.map((user, idx) => (
                <Box key={idx} sx={{ width: 40, height: 40, borderRadius: '50%', overflow: 'hidden', bgcolor: 'grey.300' }}>
                  <img
                    src={getImageUrl(user.profilePicture)}
                    alt={user.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </Box>
              ))}
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom>
              Connect With Us
            </Typography>
            <Box>
              <IconButton color="inherit" aria-label="Facebook">
                <FacebookIcon />
              </IconButton>
              <IconButton color="inherit" aria-label="Twitter">
                <TwitterIcon />
              </IconButton>
              <IconButton color="inherit" aria-label="Instagram">
                <InstagramIcon />
              </IconButton>
            </Box>
            <Typography variant="body2" sx={{ mt: 2 }}>
              Email: contact@srilankatravelblog.com
            </Typography>
          </Grid>
        </Grid>
        <Box sx={{ mt: 5, textAlign: 'center' }}>
          <Typography variant="body2">
            &copy; {new Date().getFullYear()} Sri Lanka Travel Blog. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
