const weatherService = require('../services/weatherService');

// Get current weather for a city
exports.getCurrentWeather = async (req, res) => {
  try {
    const { city } = req.params;
    const weather = await weatherService.getCurrentWeather(city);
    res.json(weather);
  } catch (error) {
    console.error('Error getting weather:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get weather by coordinates
exports.getWeatherByCoordinates = async (req, res) => {
  try {
    const { lat, lon } = req.query;
    
    if (!lat || !lon) {
      return res.status(400).json({ message: 'Latitude and longitude are required' });
    }
    
    const weather = await weatherService.getWeatherByCoordinates(parseFloat(lat), parseFloat(lon));
    res.json(weather);
  } catch (error) {
    console.error('Error getting weather:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get 5-day forecast
exports.getForecast = async (req, res) => {
  try {
    const { city } = req.params;
    const forecast = await weatherService.getForecast(city);
    res.json(forecast);
  } catch (error) {
    console.error('Error getting forecast:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get weather for all major Sri Lankan cities
exports.getSriLankaWeather = async (req, res) => {
  try {
    const weather = await weatherService.getSriLankaWeather();
    res.json(weather);
  } catch (error) {
    console.error('Error getting Sri Lanka weather:', error);
    res.status(500).json({ message: error.message });
  }
};
