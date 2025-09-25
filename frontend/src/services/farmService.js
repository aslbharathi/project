import api from './api'

export const farmService = {
  // Farm data operations
  async getFarmData() {
    try {
      return await api.get('/farm/profile')
    } catch (error) {
      // Fallback to localStorage for offline support
      const localData = localStorage.getItem('krishiSakhiFarmData')
      return localData ? JSON.parse(localData) : null
    }
  },

  async saveFarmData(farmData) {
    try {
      const response = await api.post('/farm/profile', farmData)
      // Also save locally for offline support
      localStorage.setItem('krishiSakhiFarmData', JSON.stringify(farmData))
      return response
    } catch (error) {
      // Save locally if API fails
      localStorage.setItem('krishiSakhiFarmData', JSON.stringify(farmData))
      throw error
    }
  },

  async updateFarmData(farmData) {
    try {
      const response = await api.put('/farm/profile', farmData)
      localStorage.setItem('krishiSakhiFarmData', JSON.stringify(farmData))
      return response
    } catch (error) {
      localStorage.setItem('krishiSakhiFarmData', JSON.stringify(farmData))
      throw error
    }
  },

  // Activity operations
  async getActivities() {
    try {
      return await api.get('/farm/activities')
    } catch (error) {
      const localActivities = localStorage.getItem('krishiSakhiActivities')
      return localActivities ? JSON.parse(localActivities) : []
    }
  },

  async addActivity(activity) {
    try {
      const response = await api.post('/farm/activities', activity)
      // Update local storage
      const localActivities = JSON.parse(localStorage.getItem('krishiSakhiActivities') || '[]')
      const newActivity = { ...activity, id: Date.now(), timestamp: new Date().toISOString() }
      const updatedActivities = [newActivity, ...localActivities]
      localStorage.setItem('krishiSakhiActivities', JSON.stringify(updatedActivities))
      return response
    } catch (error) {
      // Save locally if API fails
      const localActivities = JSON.parse(localStorage.getItem('krishiSakhiActivities') || '[]')
      const newActivity = { ...activity, id: Date.now(), timestamp: new Date().toISOString() }
      const updatedActivities = [newActivity, ...localActivities]
      localStorage.setItem('krishiSakhiActivities', JSON.stringify(updatedActivities))
      throw error
    }
  },

  // Chat operations
  async getChatHistory() {
    try {
      return await api.get('/chat/history')
    } catch (error) {
      const localHistory = localStorage.getItem('krishiSakhiChatHistory')
      return localHistory ? JSON.parse(localHistory) : []
    }
  },

  async sendMessage(message) {
    try {
      return await api.post('/chat/message', { message })
    } catch (error) {
      // Fallback to local AI response
      return this.generateLocalResponse(message)
    }
  },

  generateLocalResponse(message) {
    // Simple local AI response logic
    const lowerMessage = message.toLowerCase()
    
    if (lowerMessage.includes('pest') || lowerMessage.includes('കീടം')) {
      return {
        response: 'Based on your query about pests, I recommend checking your crops regularly and using neem oil as a natural pesticide.',
        timestamp: new Date().toISOString()
      }
    }
    
    if (lowerMessage.includes('weather') || lowerMessage.includes('കാലാവസ്ഥ')) {
      return {
        response: 'Please check the weather forecast before applying fertilizers or pesticides.',
        timestamp: new Date().toISOString()
      }
    }
    
    return {
      response: 'I understand your query. For detailed assistance, please ensure you have an internet connection.',
      timestamp: new Date().toISOString()
    }
  },

  // Alerts operations
  async getAlerts() {
    try {
      return await api.get('/alerts')
    } catch (error) {
      // Return sample alerts for offline mode
      return this.getSampleAlerts()
    }
  },

  getSampleAlerts() {
    return [
      {
        id: 1,
        type: 'weather',
        priority: 'high',
        title: 'Weather Alert',
        message: 'Rain expected this afternoon! Don\'t apply fertilizer today.',
        timestamp: new Date().toISOString()
      }
    ]
  }
}