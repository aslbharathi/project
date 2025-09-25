import api from './api'

export const farmService = {
  // Farm data operations
  async getFarmData() {
    try {
      const response = await api.get('/farm/profile')
      return response.success ? response.data : response
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
      return response.success ? response.data : response
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
      const response = await api.get('/farm/activities')
      return response.success ? response.data : response
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
      return response.success ? response.data : response
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
      const response = await api.get('/chat/history')
      return response.success ? response.data : response
    } catch (error) {
      const localHistory = localStorage.getItem('krishiSakhiChatHistory')
      return localHistory ? JSON.parse(localHistory) : []
    }
  },

  async sendMessage(messageData) {
    try {
      const response = await api.post('/chat/message', messageData)
      return response
    } catch (error) {
      // Fallback to local AI response
      return this.generateLocalResponse(messageData.message || messageData)
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
      const response = await api.get('/alerts')
      return response.success ? response.data : response
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
  },

  // Image upload operations
  async uploadImages(files) {
    try {
      const formData = new FormData()
      files.forEach((file, index) => {
        formData.append(`images`, file)
      })

      const response = await api.post('/farm/upload-images', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      
      return response.success ? response.data : response
    } catch (error) {
      console.error('Image upload error:', error)
      throw error
    }
  }
}