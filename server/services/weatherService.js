const axios = require('axios');

class WeatherService {
  constructor() {
    this.apiKey = process.env.WEATHER_API_KEY || '';
    this.baseUrl = 'https://api.openweathermap.org/data/2.5';
  }

  // Get current weather by city name
  async getCurrentWeather(city, country = 'LK') {
    try {
      const response = await axios.get(`${this.baseUrl}/weather`, {
        params: {
          q: `${city},${country}`,
          appid: this.apiKey,
          units: 'metric'
        }
      });

      return this.formatWeatherData(response.data);
    } catch (error) {
      console.error('Error fetching weather:', error.message);
      throw new Error('Unable to fetch weather data');
    }
  }

  // Get current weather by coordinates
  async getWeatherByCoordinates(lat, lon) {
    try {
      const response = await axios.get(`${this.baseUrl}/weather`, {
        params: {
          lat,
          lon,
          appid: this.apiKey,
          units: 'metric'
        }
      });

      return this.formatWeatherData(response.data);
    } catch (error) {
      console.error('Error fetching weather:', error.message);
      throw new Error('Unable to fetch weather data');
    }
  }

  // Get 5-day forecast
  async getForecast(city, country = 'LK') {
    try {
      const response = await axios.get(`${this.baseUrl}/forecast`, {
        params: {
          q: `${city},${country}`,
          appid: this.apiKey,
          units: 'metric'
        }
      });

      return this.formatForecastData(response.data);
    } catch (error) {
      console.error('Error fetching forecast:', error.message);
      throw new Error('Unable to fetch forecast data');
    }
  }

  // Format weather data
  formatWeatherData(data) {
    return {
      location: data.name,
      country: data.sys.country,
      temperature: Math.round(data.main.temp),
      feelsLike: Math.round(data.main.feels_like),
      humidity: data.main.humidity,
      pressure: data.main.pressure,
      windSpeed: Math.round(data.wind.speed * 3.6), // Convert m/s to km/h
      windDirection: data.wind.deg,
      visibility: data.visibility / 1000, // Convert to km
      cloudiness: data.clouds.all,
      conditions: data.weather[0].main,
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      sunrise: new Date(data.sys.sunrise * 1000),
      sunset: new Date(data.sys.sunset * 1000),
      timestamp: new Date(data.dt * 1000)
    };
  }

  // Format forecast data
  formatForecastData(data) {
    const dailyForecasts = {};
    
    data.list.forEach(item => {
      const date = new Date(item.dt * 1000).toLocaleDateString();
      
      if (!dailyForecasts[date]) {
        dailyForecasts[date] = {
          date,
          temps: [],
          conditions: [],
          humidity: [],
          windSpeed: []
        };
      }
      
      dailyForecasts[date].temps.push(item.main.temp);
      dailyForecasts[date].conditions.push(item.weather[0].main);
      dailyForecasts[date].humidity.push(item.main.humidity);
      dailyForecasts[date].windSpeed.push(item.wind.speed);
    });

    return Object.values(dailyForecasts).slice(0, 5).map(day => ({
      date: day.date,
      tempMax: Math.round(Math.max(...day.temps)),
      tempMin: Math.round(Math.min(...day.temps)),
      avgHumidity: Math.round(day.humidity.reduce((a, b) => a + b) / day.humidity.length),
      avgWindSpeed: Math.round((day.windSpeed.reduce((a, b) => a + b) / day.windSpeed.length) * 3.6),
      conditions: day.conditions[0]
    }));
  }

  // Get weather for multiple Sri Lankan cities
  async getSriLankaWeather() {
    const cities = [
      { name: 'Colombo', region: 'West Coast' },
      { name: 'Kandy', region: 'Hill Country' },
      { name: 'Jaffna', region: 'North' },
      { name: 'Galle', region: 'South Coast' },
      { name: 'Trincomalee', region: 'East Coast' },
      { name: 'Nuwara Eliya', region: 'Hill Country' },
      { name: 'Anuradhapura', region: 'North Central' },
      { name: 'Batticaloa', region: 'East Coast' }
    ];

    try {
      const weatherPromises = cities.map(city =>
        this.getCurrentWeather(city.name)
          .then(weather => ({ ...weather, region: city.region }))
          .catch(error => ({
            location: city.name,
            region: city.region,
            error: 'Unable to fetch data'
          }))
      );

      return await Promise.all(weatherPromises);
    } catch (error) {
      console.error('Error fetching Sri Lanka weather:', error);
      throw error;
    }
  }
}

module.exports = new WeatherService();
