import { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Tabs,
  Tab,
  Chip,
  Paper,
  LinearProgress,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  WbSunny,
  Thermostat,
  Opacity,
  Air,
  Umbrella,
  BeachAccess,
  Terrain,
  Cloud,
} from '@mui/icons-material';

const WeatherClimatePage = () => {
  const [selectedRegion, setSelectedRegion] = useState(0);

  const regions = [
    {
      id: 0,
      name: 'Colombo & West Coast',
      icon: <BeachAccess sx={{ fontSize: 40, color: '#0288d1' }} />,
      climate: 'Tropical Monsoon',
      avgTemp: '27-30°C',
      bestTime: 'December - March',
      description: 'Warm and humid year-round with two monsoon seasons affecting different parts of the coast.',
      currentWeather: {
        temp: 28,
        feelsLike: 32,
        humidity: 75,
        windSpeed: 12,
        condition: 'Partly Cloudy',
        uvIndex: 8,
      },
      monthlyData: [
        { month: 'Jan', temp: 27, rainfall: 58, humidity: 72, condition: 'Dry' },
        { month: 'Feb', temp: 28, rainfall: 73, humidity: 70, condition: 'Dry' },
        { month: 'Mar', temp: 29, rainfall: 147, humidity: 74, condition: 'Moderate' },
        { month: 'Apr', temp: 30, rainfall: 231, humidity: 78, condition: 'Wet' },
        { month: 'May', temp: 29, rainfall: 371, humidity: 82, condition: 'Very Wet' },
        { month: 'Jun', temp: 28, rainfall: 224, humidity: 81, condition: 'Wet' },
        { month: 'Jul', temp: 28, rainfall: 135, humidity: 79, condition: 'Moderate' },
        { month: 'Aug', temp: 28, rainfall: 109, humidity: 79, condition: 'Moderate' },
        { month: 'Sep', temp: 28, rainfall: 160, humidity: 80, condition: 'Moderate' },
        { month: 'Oct', temp: 28, rainfall: 348, humidity: 82, condition: 'Very Wet' },
        { month: 'Nov', temp: 27, rainfall: 315, humidity: 80, condition: 'Very Wet' },
        { month: 'Dec', temp: 27, rainfall: 147, humidity: 76, condition: 'Moderate' },
      ],
      travelTips: [
        'Best months: December to March (dry season)',
        'Avoid May and October (heaviest rainfall)',
        'Lightweight, breathable clothing recommended',
        'Sun protection essential (SPF 50+)',
        'Umbrella or rain jacket useful year-round',
      ],
    },
    {
      id: 1,
      name: 'Kandy & Hill Country',
      icon: <Terrain sx={{ fontSize: 40, color: '#2e7d32' }} />,
      climate: 'Tropical Highland',
      avgTemp: '20-24°C',
      bestTime: 'January - March',
      description: 'Cooler temperatures due to elevation, with pleasant weather most of the year and distinct wet seasons.',
      currentWeather: {
        temp: 22,
        feelsLike: 22,
        humidity: 82,
        windSpeed: 8,
        condition: 'Misty',
        uvIndex: 6,
      },
      monthlyData: [
        { month: 'Jan', temp: 21, rainfall: 74, humidity: 78, condition: 'Pleasant' },
        { month: 'Feb', temp: 22, rainfall: 58, humidity: 75, condition: 'Dry' },
        { month: 'Mar', temp: 24, rainfall: 89, humidity: 76, condition: 'Moderate' },
        { month: 'Apr', temp: 24, rainfall: 185, humidity: 82, condition: 'Wet' },
        { month: 'May', temp: 24, rainfall: 135, humidity: 85, condition: 'Moderate' },
        { month: 'Jun', temp: 23, rainfall: 89, humidity: 86, condition: 'Moderate' },
        { month: 'Jul', temp: 23, rainfall: 86, humidity: 84, condition: 'Moderate' },
        { month: 'Aug', temp: 23, rainfall: 104, humidity: 84, condition: 'Moderate' },
        { month: 'Sep', temp: 23, rainfall: 142, humidity: 84, condition: 'Moderate' },
        { month: 'Oct', temp: 23, rainfall: 244, humidity: 87, condition: 'Very Wet' },
        { month: 'Nov', temp: 22, rainfall: 244, humidity: 86, condition: 'Very Wet' },
        { month: 'Dec', temp: 21, rainfall: 147, humidity: 82, condition: 'Moderate' },
      ],
      travelTips: [
        'Best months: January to March (dry and cool)',
        'Bring light jacket or sweater for evenings',
        'Can be misty in the mornings',
        'Perfect escape from coastal heat',
        'Great for hiking and outdoor activities',
      ],
    },
    {
      id: 2,
      name: 'Jaffna & North',
      icon: <WbSunny sx={{ fontSize: 40, color: '#f57c00' }} />,
      climate: 'Tropical Dry',
      avgTemp: '28-33°C',
      bestTime: 'December - March',
      description: 'Hot and dry with minimal rainfall most of the year, distinct monsoon pattern from coastal regions.',
      currentWeather: {
        temp: 32,
        feelsLike: 35,
        humidity: 65,
        windSpeed: 15,
        condition: 'Sunny',
        uvIndex: 10,
      },
      monthlyData: [
        { month: 'Jan', temp: 26, rainfall: 109, humidity: 70, condition: 'Moderate' },
        { month: 'Feb', temp: 27, rainfall: 56, humidity: 68, condition: 'Dry' },
        { month: 'Mar', temp: 30, rainfall: 43, humidity: 66, condition: 'Dry' },
        { month: 'Apr', temp: 32, rainfall: 66, humidity: 68, condition: 'Dry' },
        { month: 'May', temp: 33, rainfall: 53, humidity: 70, condition: 'Dry' },
        { month: 'Jun', temp: 33, rainfall: 48, humidity: 72, condition: 'Dry' },
        { month: 'Jul', temp: 32, rainfall: 74, humidity: 74, condition: 'Moderate' },
        { month: 'Aug', temp: 32, rainfall: 89, humidity: 74, condition: 'Moderate' },
        { month: 'Sep', temp: 31, rainfall: 97, humidity: 74, condition: 'Moderate' },
        { month: 'Oct', temp: 29, rainfall: 196, humidity: 78, condition: 'Wet' },
        { month: 'Nov', temp: 27, rainfall: 320, humidity: 80, condition: 'Very Wet' },
        { month: 'Dec', temp: 26, rainfall: 178, humidity: 76, condition: 'Wet' },
      ],
      travelTips: [
        'Best months: February to September',
        'Very hot - stay hydrated',
        'Strong sun - use high SPF sunscreen',
        'Opposite monsoon pattern from south/west',
        'Dry season when rest of island is wet',
      ],
    },
    {
      id: 3,
      name: 'East Coast (Trincomalee, Arugam Bay)',
      icon: <BeachAccess sx={{ fontSize: 40, color: '#d32f2f' }} />,
      climate: 'Tropical Monsoon',
      avgTemp: '27-32°C',
      bestTime: 'May - September',
      description: 'Opposite monsoon pattern from west coast, making it ideal when the rest of the island experiences rain.',
      currentWeather: {
        temp: 30,
        feelsLike: 33,
        humidity: 70,
        windSpeed: 14,
        condition: 'Sunny',
        uvIndex: 9,
      },
      monthlyData: [
        { month: 'Jan', temp: 26, rainfall: 142, humidity: 75, condition: 'Wet' },
        { month: 'Feb', temp: 27, rainfall: 84, humidity: 72, condition: 'Moderate' },
        { month: 'Mar', temp: 29, rainfall: 58, humidity: 70, condition: 'Dry' },
        { month: 'Apr', temp: 31, rainfall: 66, humidity: 71, condition: 'Dry' },
        { month: 'May', temp: 32, rainfall: 58, humidity: 72, condition: 'Dry' },
        { month: 'Jun', temp: 32, rainfall: 56, humidity: 73, condition: 'Dry' },
        { month: 'Jul', temp: 32, rainfall: 66, humidity: 73, condition: 'Dry' },
        { month: 'Aug', temp: 32, rainfall: 71, humidity: 73, condition: 'Dry' },
        { month: 'Sep', temp: 31, rainfall: 89, humidity: 74, condition: 'Moderate' },
        { month: 'Oct', temp: 29, rainfall: 193, humidity: 77, condition: 'Wet' },
        { month: 'Nov', temp: 27, rainfall: 340, humidity: 79, condition: 'Very Wet' },
        { month: 'Dec', temp: 26, rainfall: 234, humidity: 77, condition: 'Very Wet' },
      ],
      travelTips: [
        'Best months: May to September (opposite of west)',
        'Perfect for surfing in Arugam Bay',
        'Avoid November to February (monsoon)',
        'Beautiful beaches and clear waters',
        'Alternative when west coast is wet',
      ],
    },
  ];

  const currentRegion = regions[selectedRegion];

  const getConditionColor = (condition) => {
    const colors = {
      'Dry': '#4caf50',
      'Pleasant': '#8bc34a',
      'Moderate': '#ff9800',
      'Wet': '#ff5722',
      'Very Wet': '#d32f2f',
    };
    return colors[condition] || '#9e9e9e';
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 5 }}>
        <Typography 
          variant="h3" 
          component="h1" 
          gutterBottom
          sx={{ 
            fontWeight: 700,
            background: 'linear-gradient(45deg, #ff9800 30%, #ffd54f 90%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Weather & Climate Guide
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Plan your trip with detailed weather information for each region
        </Typography>
      </Box>

      {/* Region Tabs */}
      <Paper elevation={3} sx={{ mb: 4 }}>
        <Tabs
          value={selectedRegion}
          onChange={(e, newValue) => setSelectedRegion(newValue)}
          variant="scrollable"
          scrollButtons="auto"
        >
          {regions.map((region) => (
            <Tab 
              key={region.id}
              label={region.name}
              icon={region.icon}
              iconPosition="start"
            />
          ))}
        </Tabs>
      </Paper>

      {/* Current Weather */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12}>
          <Card elevation={3}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                {currentRegion.icon}
                <Box sx={{ ml: 2 }}>
                  <Typography variant="h4" fontWeight={600}>
                    {currentRegion.name}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {currentRegion.climate}
                  </Typography>
                </Box>
              </Box>
              
              <Typography variant="body1" paragraph>
                {currentRegion.description}
              </Typography>

              <Divider sx={{ my: 2 }} />

              {/* Current Conditions */}
              <Grid container spacing={2}>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Thermostat color="error" sx={{ fontSize: 40 }} />
                    <Typography variant="h5" fontWeight={600}>
                      {currentRegion.currentWeather.temp}°C
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Temperature
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Opacity color="primary" sx={{ fontSize: 40 }} />
                    <Typography variant="h5" fontWeight={600}>
                      {currentRegion.currentWeather.humidity}%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Humidity
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Air color="action" sx={{ fontSize: 40 }} />
                    <Typography variant="h5" fontWeight={600}>
                      {currentRegion.currentWeather.windSpeed} km/h
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Wind Speed
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Cloud color="action" sx={{ fontSize: 40 }} />
                    <Typography variant="h5" fontWeight={600}>
                      {currentRegion.currentWeather.condition}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Condition
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              <Box sx={{ mt: 3, p: 2, bgcolor: '#e3f2fd', borderRadius: 1 }}>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                  <WbSunny sx={{ verticalAlign: 'middle', mr: 1 }} />
                  Best Time to Visit: {currentRegion.bestTime}
                </Typography>
                <Typography variant="body2">
                  Average Temperature: {currentRegion.avgTemp}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Monthly Climate Data */}
      <Card elevation={3} sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h5" fontWeight={600} gutterBottom>
            Monthly Climate Overview
          </Typography>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell><strong>Month</strong></TableCell>
                  <TableCell align="center"><strong>Temp (°C)</strong></TableCell>
                  <TableCell align="center"><strong>Rainfall (mm)</strong></TableCell>
                  <TableCell align="center"><strong>Humidity (%)</strong></TableCell>
                  <TableCell align="center"><strong>Condition</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentRegion.monthlyData.map((data) => (
                  <TableRow key={data.month}>
                    <TableCell><strong>{data.month}</strong></TableCell>
                    <TableCell align="center">{data.temp}°</TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                        {data.rainfall}
                        <LinearProgress 
                          variant="determinate" 
                          value={Math.min((data.rainfall / 400) * 100, 100)} 
                          sx={{ width: 60, height: 6, borderRadius: 1 }}
                        />
                      </Box>
                    </TableCell>
                    <TableCell align="center">{data.humidity}%</TableCell>
                    <TableCell align="center">
                      <Chip 
                        label={data.condition}
                        size="small"
                        sx={{ 
                          bgcolor: getConditionColor(data.condition),
                          color: 'white',
                          fontWeight: 600,
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Travel Tips */}
      <Card elevation={3}>
        <CardContent>
          <Typography variant="h5" fontWeight={600} gutterBottom>
            <Umbrella sx={{ verticalAlign: 'middle', mr: 1 }} />
            Travel Tips for {currentRegion.name}
          </Typography>
          <Box component="ul" sx={{ pl: 2 }}>
            {currentRegion.travelTips.map((tip, idx) => (
              <Typography key={idx} component="li" variant="body1" sx={{ mb: 1 }}>
                {tip}
              </Typography>
            ))}
          </Box>
        </CardContent>
      </Card>

      {/* Legend */}
      <Paper elevation={1} sx={{ mt: 4, p: 2, bgcolor: '#f5f5f5' }}>
        <Typography variant="subtitle2" fontWeight={600} gutterBottom>
          Condition Legend:
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Chip label="Dry" size="small" sx={{ bgcolor: '#4caf50', color: 'white' }} />
          <Chip label="Pleasant" size="small" sx={{ bgcolor: '#8bc34a', color: 'white' }} />
          <Chip label="Moderate" size="small" sx={{ bgcolor: '#ff9800', color: 'white' }} />
          <Chip label="Wet" size="small" sx={{ bgcolor: '#ff5722', color: 'white' }} />
          <Chip label="Very Wet" size="small" sx={{ bgcolor: '#d32f2f', color: 'white' }} />
        </Box>
      </Paper>
    </Container>
  );
};

export default WeatherClimatePage;
