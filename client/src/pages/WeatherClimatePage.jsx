import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Card,
  CardContent,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  LinearProgress,
  Avatar,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  WbSunny as SunnyIcon,
  Cloud as CloudyIcon,
  Grain as RainIcon,
  Thermostat as TempIcon,
  Opacity as HumidityIcon,
  Air as WindIcon,
  Visibility as VisibilityIcon,
  Umbrella as UmbrellaIcon,
  BeachAccess as BeachIcon,
  Terrain as MountainIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import api from '../utils/api';

const WeatherClimatePage = () => {
  const [selectedRegion, setSelectedRegion] = useState(0);
  const [liveWeather, setLiveWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Cities for live weather
  const cities = [
    { name: 'Colombo', displayName: 'Colombo (West Coast)', icon: <BeachIcon />, climate: 'Tropical' },
    { name: 'Kandy', displayName: 'Kandy (Hill Country)', icon: <MountainIcon />, climate: 'Tropical Highland' },
    { name: 'Jaffna', displayName: 'Jaffna (North)', icon: <SunnyIcon />, climate: 'Tropical Dry' },
  ];

  useEffect(() => {
    fetchLiveWeather();
  }, [selectedRegion]);

  const fetchLiveWeather = async () => {
    setLoading(true);
    setError(null);
    try {
      const cityName = cities[selectedRegion].name;
      const response = await api.get(`/weather/current/${cityName}`);
      setLiveWeather(response.data);
    } catch (err) {
      console.error('Error fetching weather:', err);
      setError('Unable to fetch live weather data. Showing static climate information.');
      setLiveWeather(null);
    } finally {
      setLoading(false);
    }
  };

  // Static climate data for reference
  const regions = [
    {
      name: 'Colombo (West Coast)',
      climate: 'Tropical',
      description: 'Warm and humid year-round with two monsoon seasons',
      icon: <BeachIcon />,
      staticWeather: {
        temperature: 28,
        humidity: 75,
        windSpeed: 12,
        conditions: 'Partly Cloudy',
        uvIndex: 8,
        visibility: 10,
      },
      monthlyData: [
        { month: 'Jan', temp: 27, rainfall: 58, humidity: 72 },
        { month: 'Feb', temp: 28, rainfall: 73, humidity: 70 },
        { month: 'Mar', temp: 29, rainfall: 147, humidity: 74 },
        { month: 'Apr', temp: 30, rainfall: 231, humidity: 78 },
        { month: 'May', temp: 29, rainfall: 371, humidity: 82 },
        { month: 'Jun', temp: 28, rainfall: 224, humidity: 81 },
        { month: 'Jul', temp: 28, rainfall: 135, humidity: 79 },
        { month: 'Aug', temp: 28, rainfall: 109, humidity: 79 },
        { month: 'Sep', temp: 28, rainfall: 160, humidity: 80 },
        { month: 'Oct', temp: 28, rainfall: 348, humidity: 82 },
        { month: 'Nov', temp: 27, rainfall: 315, humidity: 80 },
        { month: 'Dec', temp: 27, rainfall: 147, humidity: 76 },
      ],
      bestMonths: ['Dec', 'Jan', 'Feb', 'Mar'],
      wetMonths: ['Apr', 'May', 'Oct', 'Nov'],
    },
    {
      name: 'Kandy (Hill Country)',
      climate: 'Tropical Highland',
      description: 'Cooler temperatures with distinct wet and dry seasons',
      icon: <MountainIcon />,
      staticWeather: {
        temperature: 22,
        humidity: 82,
        windSpeed: 8,
        conditions: 'Light Rain',
        uvIndex: 6,
        visibility: 8,
      },
      monthlyData: [
        { month: 'Jan', temp: 21, rainfall: 74, humidity: 78 },
        { month: 'Feb', temp: 22, rainfall: 58, humidity: 75 },
        { month: 'Mar', temp: 24, rainfall: 89, humidity: 76 },
        { month: 'Apr', temp: 24, rainfall: 185, humidity: 82 },
        { month: 'May', temp: 24, rainfall: 135, humidity: 85 },
        { month: 'Jun', temp: 23, rainfall: 89, humidity: 86 },
        { month: 'Jul', temp: 23, rainfall: 86, humidity: 84 },
        { month: 'Aug', temp: 23, rainfall: 104, humidity: 84 },
        { month: 'Sep', temp: 23, rainfall: 142, humidity: 84 },
        { month: 'Oct', temp: 23, rainfall: 244, humidity: 87 },
        { month: 'Nov', temp: 22, rainfall: 244, humidity: 86 },
        { month: 'Dec', temp: 21, rainfall: 147, humidity: 82 },
      ],
      bestMonths: ['Jan', 'Feb', 'Mar', 'Jul', 'Aug'],
      wetMonths: ['Oct', 'Nov', 'Apr', 'May'],
    },
    {
      name: 'Jaffna (North)',
      climate: 'Tropical Dry',
      description: 'Hot and dry with minimal rainfall most of the year',
      icon: <SunnyIcon />,
      staticWeather: {
        temperature: 32,
        humidity: 65,
        windSpeed: 15,
        conditions: 'Sunny',
        uvIndex: 10,
        visibility: 15,
      },
      monthlyData: [
        { month: 'Jan', temp: 26, rainfall: 109, humidity: 70 },
        { month: 'Feb', temp: 27, rainfall: 56, humidity: 68 },
        { month: 'Mar', temp: 30, rainfall: 43, humidity: 66 },
        { month: 'Apr', temp: 32, rainfall: 66, humidity: 68 },
        { month: 'May', temp: 33, rainfall: 53, humidity: 70 },
        { month: 'Jun', temp: 32, rainfall: 18, humidity: 72 },
        { month: 'Jul', temp: 32, rainfall: 15, humidity: 72 },
        { month: 'Aug', temp: 32, rainfall: 23, humidity: 73 },
        { month: 'Sep', temp: 31, rainfall: 64, humidity: 75 },
        { month: 'Oct', temp: 29, rainfall: 196, humidity: 78 },
        { month: 'Nov', temp: 27, rainfall: 343, humidity: 78 },
        { month: 'Dec', temp: 26, rainfall: 178, humidity: 74 },
      ],
      bestMonths: ['Feb', 'Mar', 'Jun', 'Jul', 'Aug'],
      wetMonths: ['Oct', 'Nov', 'Dec'],
    },
  ];

  const currentRegion = regions[selectedRegion];
  const currentWeather = liveWeather || currentRegion.staticWeather;

  const getWeatherIcon = (conditions) => {
    if (conditions.includes('Rain')) return <RainIcon />;
    if (conditions.includes('Cloud')) return <CloudyIcon />;
    return <SunnyIcon />;
  };

  const getUVColor = (uvIndex) => {
    if (uvIndex <= 2) return 'success';
    if (uvIndex <= 5) return 'warning';
    if (uvIndex <= 7) return 'error';
    return 'error';
  };

  const getHumidityColor = (humidity) => {
    if (humidity <= 60) return 'success';
    if (humidity <= 80) return 'warning';
    return 'error';
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Page Header */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom color="primary">
          Weather & Climate
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Plan your trip with detailed weather information across Sri Lanka
        </Typography>
      </Box>

      {/* Region Selector */}
      <Paper sx={{ mb: 4 }}>
        <Tabs
          value={selectedRegion}
          onChange={(event, newValue) => setSelectedRegion(newValue)}
          variant="fullWidth"
        >
          {cities.map((city, index) => (
            <Tab
              key={index}
              icon={city.icon}
              label={city.displayName}
              iconPosition="start"
            />
          ))}
        </Tabs>
      </Paper>

      {/* Error Message */}
      {error && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Current Weather */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h5">
                  {liveWeather ? 'Live Weather' : 'Climate Information'} - {currentRegion.name}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {liveWeather && (
                    <Chip label="LIVE" color="success" size="small" />
                  )}
                  <Avatar sx={{ bgcolor: 'primary.main' }}>
                    {loading ? <CircularProgress size={24} color="inherit" /> : getWeatherIcon(currentWeather.conditions)}
                  </Avatar>
                </Box>
              </Box>
              
              {loading ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <CircularProgress />
                  <Typography variant="body2" sx={{ mt: 2 }}>Loading weather data...</Typography>
                </Box>
              ) : (
                <Grid container spacing={2}>
                  <Grid item xs={6} sm={3}>
                    <Box sx={{ textAlign: 'center' }}>
                      <TempIcon color="error" sx={{ fontSize: 40 }} />
                      <Typography variant="h4" color="error.main">
                        {currentWeather.temperature}°C
                      </Typography>
                      <Typography variant="body2">Temperature</Typography>
                      {liveWeather?.feelsLike && (
                        <Typography variant="caption" color="text.secondary">
                          Feels like {liveWeather.feelsLike}°C
                        </Typography>
                      )}
                    </Box>
                  </Grid>
                  
                  <Grid item xs={6} sm={3}>
                    <Box sx={{ textAlign: 'center' }}>
                      <HumidityIcon color="info" sx={{ fontSize: 40 }} />
                      <Typography variant="h4" color="info.main">
                        {currentWeather.humidity}%
                      </Typography>
                      <Typography variant="body2">Humidity</Typography>
                    </Box>
                  </Grid>
                
                <Grid item xs={6} sm={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <WindIcon color="success" sx={{ fontSize: 40 }} />
                    <Typography variant="h4" color="success.main">
                      {currentRegion.currentWeather.windSpeed}
                    </Typography>
                    <Typography variant="body2">Wind (km/h)</Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={6} sm={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <VisibilityIcon color="secondary" sx={{ fontSize: 40 }} />
                    <Typography variant="h4" color="secondary.main">
                      {currentRegion.currentWeather.visibility}
                    </Typography>
                    <Typography variant="body2">Visibility (km)</Typography>
                  </Box>
                </Grid>
              </Grid>

              <Box sx={{ mt: 3 }}>
                <Typography variant="body1" gutterBottom>
                  Conditions: <strong>{currentRegion.currentWeather.conditions}</strong>
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Typography variant="body2" sx={{ mr: 2, minWidth: 80 }}>
                    UV Index:
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={(currentRegion.currentWeather.uvIndex / 11) * 100}
                    color={getUVColor(currentRegion.currentWeather.uvIndex)}
                    sx={{ flexGrow: 1, mr: 2 }}
                  />
                  <Typography variant="body2">
                    {currentRegion.currentWeather.uvIndex}/11
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Climate Information
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                <strong>Climate Type:</strong> {currentRegion.climate}
              </Typography>
              <Typography variant="body2" paragraph>
                {currentRegion.description}
              </Typography>
              
              <Typography variant="subtitle2" gutterBottom>
                Best Months to Visit:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                {currentRegion.bestMonths.map((month, index) => (
                  <Chip key={index} label={month} size="small" color="success" />
                ))}
              </Box>
              
              <Typography variant="subtitle2" gutterBottom>
                Wettest Months:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {currentRegion.wetMonths.map((month, index) => (
                  <Chip key={index} label={month} size="small" color="info" />
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Monthly Climate Chart */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Monthly Climate Data for {currentRegion.name}
        </Typography>
        
        <Grid container spacing={1}>
          <Grid item xs={2}>
            <Typography variant="subtitle2" color="text.secondary">
              Month
            </Typography>
          </Grid>
          <Grid item xs={2}>
            <Typography variant="subtitle2" color="text.secondary">
              Temp (°C)
            </Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography variant="subtitle2" color="text.secondary">
              Rainfall (mm)
            </Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography variant="subtitle2" color="text.secondary">
              Humidity (%)
            </Typography>
          </Grid>
          <Grid item xs={2}>
            <Typography variant="subtitle2" color="text.secondary">
              Status
            </Typography>
          </Grid>
        </Grid>

        {currentRegion.monthlyData.map((data, index) => (
          <Grid container spacing={1} key={index} sx={{ py: 1, borderBottom: '1px solid #eee' }}>
            <Grid item xs={2}>
              <Typography variant="body2">{data.month}</Typography>
            </Grid>
            <Grid item xs={2}>
              <Typography variant="body2">{data.temp}°</Typography>
            </Grid>
            <Grid item xs={3}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <LinearProgress
                  variant="determinate"
                  value={Math.min((data.rainfall / 400) * 100, 100)}
                  color="info"
                  sx={{ flexGrow: 1, mr: 1 }}
                />
                <Typography variant="body2" sx={{ minWidth: 40 }}>
                  {data.rainfall}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={3}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <LinearProgress
                  variant="determinate"
                  value={data.humidity}
                  color={getHumidityColor(data.humidity)}
                  sx={{ flexGrow: 1, mr: 1 }}
                />
                <Typography variant="body2" sx={{ minWidth: 40 }}>
                  {data.humidity}%
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={2}>
              {currentRegion.bestMonths.includes(data.month) ? (
                <Chip label="Good" size="small" color="success" />
              ) : currentRegion.wetMonths.includes(data.month) ? (
                <Chip label="Wet" size="small" color="info" />
              ) : (
                <Chip label="OK" size="small" color="default" />
              )}
            </Grid>
          </Grid>
        ))}
      </Paper>

      {/* Travel Tips */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom color="primary">
              Packing Tips
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon><UmbrellaIcon /></ListItemIcon>
                <ListItemText 
                  primary="Rain Gear" 
                  secondary="Always carry umbrella or raincoat during monsoon seasons"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon><SunnyIcon /></ListItemIcon>
                <ListItemText 
                  primary="Sun Protection" 
                  secondary="High SPF sunscreen, hat, and sunglasses essential year-round"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon><TempIcon /></ListItemIcon>
                <ListItemText 
                  primary="Layered Clothing" 
                  secondary="Light, breathable fabrics for coast; warmer clothes for hills"
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom color="primary">
              Health & Safety
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon><HumidityIcon /></ListItemIcon>
                <ListItemText 
                  primary="Stay Hydrated" 
                  secondary="Drink plenty of water in hot, humid conditions"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon><RainIcon /></ListItemIcon>
                <ListItemText 
                  primary="Monsoon Precautions" 
                  secondary="Watch for flood warnings and road closures during heavy rains"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon><WindIcon /></ListItemIcon>
                <ListItemText 
                  primary="Heat Exhaustion" 
                  secondary="Take breaks in shade during hottest parts of the day (11 AM - 3 PM)"
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default WeatherClimatePage;
