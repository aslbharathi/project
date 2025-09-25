import Farm from '../models/Farm.js'

export const generateAIResponse = async (message, userId) => {
  try {
    // Get user's farm data for context
    const farm = await Farm.findOne({ userId, isActive: true })
    
    const lowerMessage = message.toLowerCase()
    
    // Pest/Disease related queries
    if (lowerMessage.includes('pest') || lowerMessage.includes('bug') || lowerMessage.includes('insect') || lowerMessage.includes('കീടം') || lowerMessage.includes('പുഴു')) {
      return {
        content: farm ? 
          `For your ${farm.currentCrop} crop, I recommend checking for common pests. Use neem oil spray in the evening. Avoid spraying during rain or strong sunlight. Monitor your plants daily for early detection.` :
          'I recommend checking for common pests in your crops. Use neem oil spray in the evening for natural pest control. Inspect plants regularly and remove affected parts immediately.',
        timestamp: new Date().toISOString()
      }
    }
    
    // Weather related queries
    if (lowerMessage.includes('weather') || lowerMessage.includes('rain') || lowerMessage.includes('കാലാവസ്ഥ') || lowerMessage.includes('മഴ')) {
      return {
        content: 'Based on current weather patterns, I recommend checking the local weather forecast before applying fertilizers or pesticides. Rain can wash away treatments and reduce their effectiveness.',
        timestamp: new Date().toISOString()
      }
    }
    
    // Price related queries
    if (lowerMessage.includes('price') || lowerMessage.includes('market') || lowerMessage.includes('വില')) {
      return {
        content: farm ?
          `Current market prices for ${farm.currentCrop} vary by location. I recommend checking with your local agricultural market or cooperative society for the most accurate pricing information.` :
          'Market prices vary by location and season. Check with your local agricultural market for current rates.',
        timestamp: new Date().toISOString()
      }
    }
    
    // Fertilizer related queries
    if (lowerMessage.includes('fertilizer') || lowerMessage.includes('വളം')) {
      return {
        content: farm ?
          `For your ${farm.currentCrop} crop in ${farm.soilType} soil, I recommend organic fertilizers. Apply during early morning or late evening. Avoid fertilizing before expected rain.` :
          'Organic fertilizers are generally recommended. Apply during cooler parts of the day and avoid application before rain.',
        timestamp: new Date().toISOString()
      }
    }
    
    // Watering/Irrigation related queries
    if (lowerMessage.includes('water') || lowerMessage.includes('irrigation') || lowerMessage.includes('ജലം') || lowerMessage.includes('നനയ്ക്കുക')) {
      return {
        content: farm ?
          `For your ${farm.currentCrop} crop, water early morning or late evening. ${farm.irrigation ? 'Since you have irrigation facilities, maintain consistent moisture levels.' : 'Without irrigation facilities, focus on water conservation techniques like mulching.'}` :
          'Water your crops during early morning or late evening to reduce evaporation. Maintain consistent soil moisture.',
        timestamp: new Date().toISOString()
      }
    }
    
    // Harvesting related queries
    if (lowerMessage.includes('harvest') || lowerMessage.includes('വിളവെടുപ്പ്')) {
      return {
        content: farm ?
          `Harvest timing for ${farm.currentCrop} depends on variety and growing conditions. Look for visual indicators of maturity and harvest during dry weather for better quality.` :
          'Harvest timing varies by crop and variety. Monitor your crops for maturity indicators and choose dry weather for harvesting.',
        timestamp: new Date().toISOString()
      }
    }
    
    // General farming advice
    if (lowerMessage.includes('farming') || lowerMessage.includes('agriculture') || lowerMessage.includes('കൃഷി')) {
      return {
        content: farm ?
          `For successful farming in ${farm.location}, focus on soil health, proper timing of operations, and integrated pest management. Your ${farm.landSize} ${farm.landUnit} of ${farm.soilType} soil has good potential.` :
          'Successful farming requires attention to soil health, proper timing, weather awareness, and sustainable practices. Focus on organic methods when possible.',
        timestamp: new Date().toISOString()
      }
    }
    
    // Default response
    return {
      content: farm ?
        `I understand you're asking about your ${farm.currentCrop} farming. Could you please provide more specific details about your concern? I'm here to help with pest management, fertilization, irrigation, and other farming practices.` :
        'I\'m here to help with your farming questions. Please provide more details about your specific concern - whether it\'s about crops, pests, fertilizers, or other farming practices.',
      timestamp: new Date().toISOString()
    }
  } catch (error) {
    console.error('AI response generation error:', error)
    return {
      content: 'I apologize, but I\'m having trouble processing your request right now. Please try again or contact support if the issue persists.',
      timestamp: new Date().toISOString()
    }
  }
}