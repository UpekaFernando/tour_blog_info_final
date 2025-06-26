import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Button,
  Typography,
  Box
} from '@mui/material';
import { LocationOn, AccessTime } from '@mui/icons-material';

const DestinationCard = ({ destination }) => {
  const navigate = useNavigate();
  const [imgError, setImgError] = useState(false);

  // Handle image loading error by setting a default image
  const handleImageError = () => {
    setImgError(true);
  };

  // Get the first image or use a default one
  const imageUrl = destination.images && destination.images.length > 0
    ? `http://localhost:5000${destination.images[0]}`
    : 'https://via.placeholder.com/400x250?text=No+Image+Available';

  return (
    <Card sx={{ 
      maxWidth: 345, 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      transition: 'transform 0.2s',
      '&:hover': {
        transform: 'scale(1.02)'
      }
    }}>
      <CardActionArea onClick={() => navigate(`/destination/${destination._id}`)}>
        <CardMedia
          component="img"
          height="180"
          image={imgError ? 'https://via.placeholder.com/400x250?text=No+Image+Available' : imageUrl}
          alt={destination.title}
          onError={handleImageError}
        />
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography gutterBottom variant="h5" component="div" noWrap>
            {destination.title}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <LocationOn fontSize="small" sx={{ mr: 0.5, color: 'primary.main' }} />
            <Typography variant="body2" color="text.secondary">
              {destination.district?.name || 'Unknown District'}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <AccessTime fontSize="small" sx={{ mr: 0.5, color: 'primary.main' }} />
            <Typography variant="body2" color="text.secondary">
              {destination.bestTimeToVisit}
            </Typography>
          </Box>
          
          <Typography variant="body2" color="text.secondary" sx={{
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}>
            {destination.description}
          </Typography>
        </CardContent>
      </CardActionArea>
      
      <CardActions sx={{ mt: 'auto', pt: 0 }}>
        <Button 
          size="small" 
          color="primary" 
          onClick={() => navigate(`/destination/${destination._id}`)}
        >
          Learn More
        </Button>
      </CardActions>
    </Card>
  );
};

export default DestinationCard;
