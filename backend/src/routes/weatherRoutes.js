import express from 'express'
import { getWeatherData, getWeatherForecast } from '../controllers/weatherController.js'

const router = express.Router()

// Get current weather
router.get('/current', getWeatherData)

// Get weather forecast
router.get('/forecast', getWeatherForecast)

export default router