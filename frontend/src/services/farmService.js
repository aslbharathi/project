// Mock farm service for development
export const farmService = {
  // Farm data operations
  async getFarmData() {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Check localStorage for farm data
      const localData = localStorage.getItem('krishiSakhiFarmData')
      return localData ? JSON.parse(localData) : null
    } catch (error) {
      console.error('Failed to load farm data:', error)
      return null
    }
  },

  async saveFarmData(farmData) {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Save to localStorage
      localStorage.setItem('krishiSakhiFarmData', JSON.stringify(farmData))
      return { success: true, data: farmData }
    } catch (error) {
      console.error('Failed to save farm data:', error)
      // Still save locally
      localStorage.setItem('krishiSakhiFarmData', JSON.stringify(farmData))
      throw error
    }
  },

  // Activity operations
  async getActivities() {
    try {
      await new Promise(resolve => setTimeout(resolve, 300))
      
      const localActivities = localStorage.getItem('krishiSakhiActivities')
      return localActivities ? JSON.parse(localActivities) : []
    } catch (error) {
      console.error('Failed to load activities:', error)
      return []
    }
  },

  async addActivity(activity) {
    try {
      await new Promise(resolve => setTimeout(resolve, 300))
      
      const localActivities = JSON.parse(localStorage.getItem('krishiSakhiActivities') || '[]')
      const newActivity = { 
        ...activity, 
        id: Date.now(), 
        timestamp: new Date().toISOString() 
      }
      const updatedActivities = [newActivity, ...localActivities]
      localStorage.setItem('krishiSakhiActivities', JSON.stringify(updatedActivities))
      
      return { success: true, data: newActivity }
    } catch (error) {
      console.error('Failed to add activity:', error)
      throw error
    }
  },

  // Chat operations
  async getChatHistory() {
    try {
      await new Promise(resolve => setTimeout(resolve, 200))
      
      const localHistory = localStorage.getItem('krishiSakhiChatHistory')
      return localHistory ? JSON.parse(localHistory) : []
    } catch (error) {
      console.error('Failed to load chat history:', error)
      return []
    }
  },

  async sendMessage(messageData) {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock AI response based on message content
      const message = messageData.message || messageData
      const lowerMessage = message.toLowerCase()
      
      let response = ''
      
      if (lowerMessage.includes('pest') || lowerMessage.includes('കീടം')) {
        response = 'നിങ്ങളുടെ വിളയിൽ കീടങ്ങളെ നിയന്ത്രിക്കാൻ നീം എണ്ണ സ്പ്രേ ഉപയോഗിക്കുക. വൈകുന്നേരം സ്പ്രേ ചെയ്യുക.'
      } else if (lowerMessage.includes('weather') || lowerMessage.includes('കാലാവസ്ഥ')) {
        response = 'ഇന്ന് മഴയ്ക്ക് സാധ്യത ഉണ്ട്. വളം ഇടുന്നത് ഒഴിവാക്കുക.'
      } else if (lowerMessage.includes('fertilizer') || lowerMessage.includes('വളം')) {
        response = 'ജൈവ വളങ്ങൾ ഉപയോഗിക്കുക. രാവിലെ അല്ലെങ്കിൽ വൈകുന്നേരം വളം ഇടുക.'
      } else {
        response = 'നിങ്ങളുടെ ചോദ്യം മനസ്സിലായി. കൂടുതൽ വിവരങ്ങൾക്ക് കൃഷി വിദഗ്ധരെ സമീപിക്കുക.'
      }
      
      return {
        success: true,
        data: {
          ai_message: {
            content: response,
            timestamp: new Date().toISOString()
          }
        }
      }
    } catch (error) {
      console.error('Failed to send message:', error)
      return {
        success: true,
        data: {
          ai_message: {
            content: 'ക്ഷമിക്കണം, ഇപ്പോൾ പ്രശ്നമുണ്ട്. പിന്നീട് വീണ്ടും ശ്രമിക്കുക.',
            timestamp: new Date().toISOString()
          }
        }
      }
    }
  },

  // Alerts operations
  async getAlerts() {
    try {
      await new Promise(resolve => setTimeout(resolve, 300))
      
      // Return mock alerts
      return [
        {
          id: 1,
          type: 'weather',
          priority: 'high',
          title: 'കാലാവസ്ഥാ മുന്നറിയിപ്പ്',
          message: 'ഇന്ന് കനത്ത മഴ പ്രതീക്ഷിക്കുന്നു. വളം ഇടുന്നത് ഒഴിവാക്കുക.',
          timestamp: new Date().toISOString(),
          isRead: false
        },
        {
          id: 2,
          type: 'pest',
          priority: 'medium',
          title: 'കീട മുന്നറിയിപ്പ്',
          message: 'സമീപ പ്രദേശങ്ങളിൽ തവിട്ട് ചാടി പ്രവർത്തനം റിപ്പോർട്ട് ചെയ്തിട്ടുണ്ട്.',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          isRead: true
        }
      ]
    } catch (error) {
      console.error('Failed to load alerts:', error)
      return []
    }
  },

  // Image upload (mock)
  async uploadImages(files) {
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Mock uploaded images
      return files.map((file, index) => ({
        url: URL.createObjectURL(file),
        public_id: `mock_${Date.now()}_${index}`,
        width: 800,
        height: 600,
        size: file.size,
        format: file.type.split('/')[1]
      }))
    } catch (error) {
      console.error('Image upload error:', error)
      throw error
    }
  }
}