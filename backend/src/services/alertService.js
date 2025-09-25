export const generateLocationBasedAlerts = async (farm) => {
  const alerts = []
  const currentDate = new Date()
  
  // Weather-based alerts
  alerts.push({
    type: 'weather',
    priority: 'high',
    title: 'Weather Alert',
    message: `Rain expected in ${farm.location} area. Avoid applying fertilizers or pesticides today.`,
    location: farm.location,
    crop: farm.currentCrop
  })
  
  // Crop-specific alerts based on current crop
  switch (farm.currentCrop) {
    case 'paddy':
      alerts.push({
        type: 'irrigation',
        priority: 'medium',
        title: 'Irrigation Reminder',
        message: 'Maintain water level in paddy fields. Check for proper drainage.',
        location: farm.location,
        crop: farm.currentCrop
      })
      break
      
    case 'coconut':
      alerts.push({
        type: 'pest',
        priority: 'medium',
        title: 'Pest Alert',
        message: 'Check coconut trees for red palm weevil infestation. Look for holes in trunk.',
        location: farm.location,
        crop: farm.currentCrop
      })
      break
      
    case 'brinjal':
      alerts.push({
        type: 'pest',
        priority: 'high',
        title: 'Pest Alert',
        message: 'Brinjal shoot and fruit borer activity reported in your area. Check plants regularly.',
        location: farm.location,
        crop: farm.currentCrop
      })
      break
  }
  
  // Soil-specific alerts
  if (farm.soilType === 'laterite') {
    alerts.push({
      type: 'fertilizer',
      priority: 'medium',
      title: 'Soil Management',
      message: 'Laterite soil requires organic matter. Consider adding compost or green manure.',
      location: farm.location,
      crop: farm.currentCrop
    })
  }
  
  // Seasonal alerts (simplified)
  const month = currentDate.getMonth()
  if (month >= 5 && month <= 9) { // Monsoon season
    alerts.push({
      type: 'weather',
      priority: 'medium',
      title: 'Monsoon Advisory',
      message: 'Monsoon season: Ensure proper drainage and watch for fungal diseases.',
      location: farm.location,
      crop: farm.currentCrop
    })
  }
  
  // Government scheme alerts (sample)
  alerts.push({
    type: 'scheme',
    priority: 'low',
    title: 'Government Scheme',
    message: 'Kerala Farmer Assistance Scheme applications are open. Apply before the deadline.',
    location: farm.location,
    crop: farm.currentCrop
  })
  
  return alerts
}

export const generatePriceAlerts = async (crop, location) => {
  // This would integrate with actual market price APIs
  return {
    type: 'price',
    priority: 'medium',
    title: 'Price Update',
    message: `${crop} prices have increased in ${location} market. Good time to sell.`,
    location,
    crop
  }
}