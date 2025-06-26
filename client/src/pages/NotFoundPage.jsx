import { Container, Typography, Button, Box, Paper } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { Home as HomeIcon } from '@mui/icons-material';

const NotFoundPage = () => {
  return (
    <Container maxWidth="sm" sx={{ py: 12 }}>
      <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h1" component="h1" color="primary.main" sx={{ fontWeight: 'bold', mb: 2 }}>
          404
        </Typography>
        
        <Typography variant="h4" component="h2" gutterBottom>
          Page Not Found
        </Typography>
        
        <Typography variant="body1" color="text.secondary" paragraph>
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </Typography>
        
        <Box sx={{ mt: 4 }}>
          <Button
            component={RouterLink}
            to="/"
            variant="contained"
            startIcon={<HomeIcon />}
            size="large"
          >
            Back to Homepage
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default NotFoundPage;
