const express = require('express');
const router = express.Router();
const weatherController = require('../controllers/weatherController');

// All weather routes are public
router.get('/current/:city', weatherController.getCurrentWeather);
router.get('/coordinates', weatherController.getWeatherByCoordinates);
router.get('/forecast/:city', weatherController.getForecast);
router.get('/sri-lanka', weatherController.getSriLankaWeather);

module.exports = router;
