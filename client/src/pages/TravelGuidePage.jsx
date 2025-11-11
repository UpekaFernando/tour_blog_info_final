import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Card,
  CardContent,
  CardMedia,
  Divider,
  Chip,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  useTheme,
} from '@mui/material';
import {
  Flight as FlightIcon,
  Hotel as HotelIcon,
  Restaurant as RestaurantIcon,
  LocalTaxi as TaxiIcon,
  Train as TrainIcon,
  DirectionsBus as BusIcon,
  LocalGasStation as GasIcon,
  Phone as PhoneIcon,
  Warning as WarningIcon,
  Language as LanguageIcon,
  AccountBalanceWallet as CurrencyIcon,
  Schedule as ClockIcon,
  Thermostat as WeatherIcon,
  ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material';

const TravelGuidePage = () => {
  const theme = useTheme();
  const [selectedTab, setSelectedTab] = useState('planning');

  const emergencyNumbers = [
    { service: 'Police Emergency', number: '119' },
    { service: 'Fire & Rescue', number: '110' },
    { service: 'Accident Service', number: '1990' },
    { service: 'Tourist Hotline', number: '1912' },
  ];

  const transportOptions = [
    {
      type: 'Train',
      icon: <TrainIcon />,
      description: 'Scenic railway journeys connecting major cities',
      pros: ['Affordable', 'Scenic routes', 'Comfortable'],
      cons: ['Limited schedules', 'Can be crowded'],
      tips: 'Book first-class for longer journeys'
    },
    {
      type: 'Bus',
      icon: <BusIcon />,
      description: 'Extensive network covering the entire island',
      pros: ['Very cheap', 'Frequent services', 'Reaches remote areas'],
      cons: ['Can be uncomfortable', 'Traffic delays'],
      tips: 'Use air-conditioned buses for comfort'
    },
    {
      type: 'Tuk-tuk',
      icon: <TaxiIcon />,
      description: 'Three-wheeled vehicles perfect for short distances',
      pros: ['Convenient', 'Negotiable fares', 'Everywhere'],
      cons: ['No meter', 'Weather dependent'],
      tips: 'Always negotiate fare before starting'
    },
    {
      type: 'Taxi/Car Rental',
      icon: <GasIcon />,
      description: 'Private transportation with driver or self-drive',
      pros: ['Comfort', 'Flexible schedule', 'Door-to-door'],
      cons: ['Expensive', 'Traffic in cities'],
      tips: 'Hire with driver for better experience'
    },
  ];

  const budgetGuide = [
    {
      category: 'Budget Traveler',
      range: '$20-40/day',
      accommodation: 'Hostels, guesthouses ($5-15/night)',
      food: 'Local restaurants, street food ($3-8/meal)',
      transport: 'Public buses, trains ($1-5/journey)',
      activities: 'Free attractions, hiking ($0-10/activity)'
    },
    {
      category: 'Mid-range Traveler',
      range: '$40-80/day',
      accommodation: 'Mid-range hotels, B&Bs ($15-40/night)',
      food: 'Restaurant meals ($8-15/meal)',
      transport: 'Tuk-tuks, some private transport ($5-20/journey)',
      activities: 'Paid attractions, tours ($10-25/activity)'
    },
    {
      category: 'Luxury Traveler',
      range: '$80+/day',
      accommodation: 'Luxury hotels, resorts ($40+/night)',
      food: 'Fine dining, hotel restaurants ($15+/meal)',
      transport: 'Private cars, domestic flights ($20+/journey)',
      activities: 'Premium experiences, private guides ($25+/activity)'
    },
  ];

  const culturalTips = [
    {
      title: 'Religious Sites',
      content: 'Remove shoes and hats. Dress modestly. Photography may be restricted.',
      icon: <WarningIcon />
    },
    {
      title: 'Greetings',
      content: 'Ayubowan (ah-yu-bo-wan) means "may you live long" - traditional greeting.',
      icon: <LanguageIcon />
    },
    {
      title: 'Tipping',
      content: '10% at restaurants if service charge not included. Round up for tuk-tuks.',
      icon: <CurrencyIcon />
    },
    {
      title: 'Bargaining',
      content: 'Expected in markets and with tuk-tuk drivers. Start at 50% of asking price.',
      icon: <CurrencyIcon />
    },
  ];

  const weatherSeasons = [
    {
      season: 'Dry Season (December - March)',
      weather: 'Sunny, minimal rainfall',
      temperature: '26-30°C (79-86°F)',
      bestFor: 'Beach activities, hill country, cultural sites',
      regions: 'West and South coasts, hill country'
    },
    {
      season: 'Inter-monsoon (April - May)',
      weather: 'Hot and humid, afternoon showers',
      temperature: '28-32°C (82-90°F)',
      bestFor: 'East coast beaches',
      regions: 'East coast'
    },
    {
      season: 'Southwest Monsoon (June - September)',
      weather: 'Heavy rains in west and south',
      temperature: '25-28°C (77-82°F)',
      bestFor: 'East coast, cultural triangle',
      regions: 'East coast, north central'
    },
    {
      season: 'Northeast Monsoon (October - November)',
      weather: 'Rains in north and east',
      temperature: '26-29°C (79-84°F)',
      bestFor: 'West and south coasts',
      regions: 'West and south coasts'
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Page Header */}
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h3" component="h1" gutterBottom color="primary">
          Sri Lanka Travel Guide
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Everything you need to know for an amazing trip to Sri Lanka
        </Typography>
      </Box>

      {/* Quick Navigation */}
      <Paper sx={{ mb: 4, p: 2 }}>
        <Grid container spacing={2}>
          {[
            { id: 'planning', label: 'Trip Planning', icon: <ClockIcon /> },
            { id: 'transport', label: 'Transportation', icon: <BusIcon /> },
            { id: 'budget', label: 'Budget Guide', icon: <CurrencyIcon /> },
            { id: 'culture', label: 'Cultural Tips', icon: <LanguageIcon /> },
          ].map((tab) => (
            <Grid item xs={6} sm={3} key={tab.id}>
              <Button
                fullWidth
                variant={selectedTab === tab.id ? 'contained' : 'outlined'}
                startIcon={tab.icon}
                onClick={() => setSelectedTab(tab.id)}
                sx={{ py: 1.5 }}
              >
                {tab.label}
              </Button>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Trip Planning Section */}
      {selectedTab === 'planning' && (
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Typography variant="h5" gutterBottom color="primary">
                <WeatherIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Best Time to Visit
              </Typography>
              {weatherSeasons.map((season, index) => (
                <Accordion key={index}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="h6">{season.season}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant="body2" paragraph>
                      <strong>Weather:</strong> {season.weather}
                    </Typography>
                    <Typography variant="body2" paragraph>
                      <strong>Temperature:</strong> {season.temperature}
                    </Typography>
                    <Typography variant="body2" paragraph>
                      <strong>Best for:</strong> {season.bestFor}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Regions:</strong> {season.regions}
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Typography variant="h5" gutterBottom color="primary">
                <PhoneIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Emergency Numbers
              </Typography>
              <List>
                {emergencyNumbers.map((emergency, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <PhoneIcon color="error" />
                    </ListItemIcon>
                    <ListItemText
                      primary={emergency.service}
                      secondary={emergency.number}
                    />
                  </ListItem>
                ))}
              </List>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>
                Useful Apps
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                <Chip label="PickMe (Taxi)" size="small" />
                <Chip label="Uber" size="small" />
                <Chip label="Google Translate" size="small" />
                <Chip label="Maps.me (Offline)" size="small" />
              </Box>
            </Paper>
          </Grid>
        </Grid>
      )}

      {/* Transportation Section */}
      {selectedTab === 'transport' && (
        <Grid container spacing={3}>
          {transportOptions.map((transport, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    {transport.icon}
                    <Typography variant="h5" sx={{ ml: 1 }}>
                      {transport.type}
                    </Typography>
                  </Box>
                  <Typography variant="body1" paragraph>
                    {transport.description}
                  </Typography>
                  
                  <Typography variant="h6" color="success.main" gutterBottom>
                    Pros:
                  </Typography>
                  <List dense>
                    {transport.pros.map((pro, idx) => (
                      <ListItem key={idx} sx={{ py: 0 }}>
                        <Typography variant="body2">• {pro}</Typography>
                      </ListItem>
                    ))}
                  </List>

                  <Typography variant="h6" color="warning.main" gutterBottom>
                    Cons:
                  </Typography>
                  <List dense>
                    {transport.cons.map((con, idx) => (
                      <ListItem key={idx} sx={{ py: 0 }}>
                        <Typography variant="body2">• {con}</Typography>
                      </ListItem>
                    ))}
                  </List>

                  <Paper sx={{ p: 2, mt: 2, bgcolor: 'info.light', color: 'info.contrastText' }}>
                    <Typography variant="body2">
                      <strong>Tip:</strong> {transport.tips}
                    </Typography>
                  </Paper>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Budget Guide Section */}
      {selectedTab === 'budget' && (
        <Grid container spacing={3}>
          {budgetGuide.map((budget, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card 
                sx={{ 
                  height: '100%',
                  border: index === 1 ? `2px solid ${theme.palette.primary.main}` : 'none'
                }}
              >
                <CardContent>
                  <Typography variant="h5" color="primary" gutterBottom>
                    {budget.category}
                  </Typography>
                  <Typography variant="h4" color="success.main" gutterBottom>
                    {budget.range}
                  </Typography>
                  
                  <List>
                    <ListItem>
                      <ListItemIcon><HotelIcon /></ListItemIcon>
                      <ListItemText
                        primary="Accommodation"
                        secondary={budget.accommodation}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><RestaurantIcon /></ListItemIcon>
                      <ListItemText
                        primary="Food"
                        secondary={budget.food}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><BusIcon /></ListItemIcon>
                      <ListItemText
                        primary="Transport"
                        secondary={budget.transport}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><FlightIcon /></ListItemIcon>
                      <ListItemText
                        primary="Activities"
                        secondary={budget.activities}
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Cultural Tips Section */}
      {selectedTab === 'culture' && (
        <Grid container spacing={3}>
          {culturalTips.map((tip, index) => (
            <Grid item xs={12} sm={6} key={index}>
              <Paper sx={{ p: 3, height: '100%' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  {tip.icon}
                  <Typography variant="h6" sx={{ ml: 1 }}>
                    {tip.title}
                  </Typography>
                </Box>
                <Typography variant="body1">
                  {tip.content}
                </Typography>
              </Paper>
            </Grid>
          ))}

          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom color="primary">
                Language Basics
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="h6" gutterBottom>Sinhala Phrases</Typography>
                  <List>
                    <ListItem>
                      <ListItemText primary="Hello" secondary="Ayubowan (ah-yu-bo-wan)" />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Thank you" secondary="Bohoma istuti (bo-ho-ma is-tu-ti)" />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="How much?" secondary="Kiyada? (ki-ya-da)" />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Water" secondary="Watura (wa-tu-ra)" />
                    </ListItem>
                  </List>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="h6" gutterBottom>Tamil Phrases</Typography>
                  <List>
                    <ListItem>
                      <ListItemText primary="Hello" secondary="Vanakkam (va-nak-kam)" />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Thank you" secondary="Nandri (nan-dri)" />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="How much?" secondary="Evvalavu? (ev-va-la-vu)" />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Water" secondary="Thanni (than-ni)" />
                    </ListItem>
                  </List>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      )}
    </Container>
  );
};

export default TravelGuidePage;
