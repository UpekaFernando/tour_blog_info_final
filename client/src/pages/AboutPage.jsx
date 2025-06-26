import { Container, Typography, Box, Paper } from '@mui/material';

const AboutPage = () => {
  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Paper elevation={2} sx={{ p: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom textAlign="center">
          About Us
        </Typography>
        
        <Box sx={{ my: 4 }}>
          {/* This section is left empty for the user to add their own content as requested */}
          <Typography variant="body1" align="center" color="text.secondary" sx={{ fontStyle: 'italic' }}>
            Content for the About Us section will be added by the site owner.
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default AboutPage;
