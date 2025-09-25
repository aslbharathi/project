export const CROPS = [
  'paddy', 'coconut', 'rubber', 'banana', 'brinjal', 
  'pepper', 'cardamom', 'ginger', 'turmeric'
]

export const SOIL_TYPES = ['laterite', 'alluvial', 'coastal', 'forest']

export const ACTIVITY_TYPES = [
  { id: 'sowedSeeds', icon: '🌱' },
  { id: 'appliedFertilizer', icon: '🌿' },
  { id: 'irrigated', icon: '💧' },
  { id: 'pestDisease', icon: '🐛' },
  { id: 'weeding', icon: '🌿' },
  { id: 'harvested', icon: '🌾' }
]

export const ALERT_PRIORITIES = {
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low'
}

export const STORAGE_KEYS = {
  FARM_DATA: 'krishiSakhiFarmData',
  ACTIVITIES: 'krishiSakhiActivities',
  CHAT_HISTORY: 'krishiSakhiChatHistory',
  LANGUAGE: 'krishiSakhiLanguage',
  TOKEN: 'krishiSakhiToken'
}