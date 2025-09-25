import { generateUserId } from '../utils/helpers.js'
import { getWeatherByLocation } from '../services/weatherService.js'

// Get current weather data
export const getWeatherData = async (req, res) => {
  try {
    const { location, lat, lon } = req.query

    if (!location && (!lat || !lon)) {
      return res.status(400).json({
        success: false,
        message: 'Location or coordinates are required'
      })
    }

    const weatherData = await getWeatherByLocation(location || `${lat},${lon}`)

    res.json({
      success: true,
      data: weatherData
    })
  } catch (error) {
    console.error('Get weather data error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch weather data'
    })
  }
}

// Get weather forecast
export const getWeatherForecast = async (req, res) => {
  try {
    const { location, lat, lon, days = 5 } = req.query

    if (!location && (!lat || !lon)) {
      return res.status(400).json({
        success: false,
        message: 'Location or coordinates are required'
      })
    }

    const forecastData = await getWeatherByLocation(location || `${lat},${lon}`, days)

    res.json({
      success: true,
      data: forecastData
    })
  } catch (error) {
    console.error('Get weather forecast error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch weather forecast'
    })
  }
}