// Mock weather service - replace with actual weather API integration
export const getWeatherByLocation = async (location, days = 1) => {
  try {
    // This would integrate with actual weather APIs like OpenWeatherMap
    // For now, returning mock data
    
    const mockWeatherData = {
      location: location,
      current: {
        temperature: 28,
        humidity: 75,
        rainfall: 0,
        windSpeed: 12,
        condition: 'partly_cloudy',
        description: 'Partly cloudy with chance of rain'
      },
      forecast: []
    }
    
    // Generate forecast data
    for (let i = 0; i < days; i++) {
      mockWeatherData.forecast.push({
        date: new Date(Date.now() + i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        maxTemp: 30 + Math.random() * 5,
        minTemp: 22 + Math.random() * 3,
        humidity: 70 + Math.random() * 20,
        rainfall: Math.random() * 10,
        condition: ['sunny', 'partly_cloudy', 'cloudy', 'rainy'][Math.floor(Math.random() * 4)]
      })
    }
    
    return mockWeatherData
  } catch (error) {
    console.error('Weather service error:', error)
    throw new Error('Failed to fetch weather data')
  }
}

export const getWeatherAlerts = async (location) => {
  try {
    // Mock weather alerts
    return [
      {
        type: 'rain',
        severity: 'medium',
        message: 'Moderate rain expected in the next 6 hours',
        validUntil: new Date(Date.now() + 6 * 60 * 60 * 1000)
      }
    ]
  } catch (error) {
    console.error('Weather alerts error:', error)
    return []
  }
}