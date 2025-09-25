import React, { createContext, useContext, useState, useEffect } from 'react'
import { STORAGE_KEYS } from '../utils/constants'
import { farmService } from '../services/farmService'
import { GOVERNMENT_SCHEMES } from '../utils/constants'

const FarmDataContext = createContext()

export const useFarmData = () => {
  const context = useContext(FarmDataContext)
  if (!context) {
    throw new Error('useFarmData must be used within a FarmDataProvider')
  }
  return context
}

const FarmDataProvider = ({ children }) => {
  const [farmData, setFarmData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [eligibleSchemes, setEligibleSchemes] = useState([])
  const [activities, setActivities] = useState([])

  useEffect(() => {
    loadFarmData()
    loadActivities()
  }, [])

  useEffect(() => {
    if (farmData) {
      checkSchemeEligibility()
    }
  }, [farmData])

  const loadFarmData = async () => {
    try {
      setIsLoading(true)
      
      // Try to load from API first
      const data = await farmService.getFarmData()
      setFarmData(data)
    } catch (error) {
      console.error('Failed to load farm data:', error)
      
      // Fallback to localStorage
      const localData = localStorage.getItem(STORAGE_KEYS.FARM_DATA)
      if (localData) {
        try {
          setFarmData(JSON.parse(localData))
        } catch (parseError) {
          console.error('Failed to parse local farm data:', parseError)
          setFarmData(null)
        }
      }
    } finally {
      setIsLoading(false)
    }
  }

  const loadActivities = async () => {
    try {
      const data = await farmService.getActivities()
      const activities = data?.data || data || []
      setActivities(Array.isArray(activities) ? activities : [])
    } catch (error) {
      console.error('Failed to load activities:', error)
      // Fallback to localStorage
      const localActivities = localStorage.getItem(STORAGE_KEYS.ACTIVITIES)
      if (localActivities) {
        try {
          setActivities(JSON.parse(localActivities))
        } catch (parseError) {
          console.error('Failed to parse local activities:', parseError)
          setActivities([])
        }
      }
    }
  }

  const checkSchemeEligibility = () => {
    if (!farmData) return

    const eligible = GOVERNMENT_SCHEMES.filter(scheme => {
      return scheme.eligibility.some(criteria => {
        switch (criteria) {
          case 'landowner':
            return farmData.landSize > 0
          case 'small_farmer':
            return farmData.landSize <= 2 // 2 hectares or less
          case 'kerala_resident':
            return true // All users are Kerala residents
          case 'active_farmer':
            return activities.length > 0
          case 'all_farmers':
            return true
          default:
            return false
        }
      })
    })

    setEligibleSchemes(eligible)
  }

  const addActivity = async (activityData) => {
    try {
      const newActivity = {
        ...activityData,
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        userId: 'current_user' // Replace with actual user ID
      }
      
      // Add to local state
      setActivities(prev => [newActivity, ...prev])
      
      // Save to localStorage
      const updatedActivities = [newActivity, ...activities]
      localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(updatedActivities))
      
      // Try to save to API
      await farmService.addActivity(activityData)
      
      // Recheck scheme eligibility
      checkSchemeEligibility()
      
      return newActivity
    } catch (error) {
      console.error('Failed to add activity:', error)
      throw error
    }
  }

  const parseNaturalLanguageActivity = (text, language = 'en') => {
    // Simple NLP parsing - in production, use proper NLP service
    const lowerText = text.toLowerCase()
    
    let activityType = 'other'
    let crop = ''
    let notes = text
    
    // Activity type detection
    if (lowerText.includes('വിത്ത്') || lowerText.includes('seed') || lowerText.includes('sow')) {
      activityType = 'sowedSeeds'
    } else if (lowerText.includes('വളം') || lowerText.includes('fertilizer') || lowerText.includes('യൂറിയ')) {
      activityType = 'appliedFertilizer'
    } else if (lowerText.includes('നനച്ച്') || lowerText.includes('water') || lowerText.includes('irrigat')) {
      activityType = 'irrigated'
    } else if (lowerText.includes('കീടം') || lowerText.includes('pest') || lowerText.includes('spray')) {
      activityType = 'pestDisease'
    } else if (lowerText.includes('കള') || lowerText.includes('weed')) {
      activityType = 'weeding'
    } else if (lowerText.includes('വിളവെടുത്ത്') || lowerText.includes('harvest')) {
      activityType = 'harvested'
    }
    
    // Crop detection
    const crops = {
      'നെല്ല്': 'paddy', 'paddy': 'paddy', 'rice': 'paddy',
      'തെങ്ങ്': 'coconut', 'coconut': 'coconut',
      'കുരുമുളക്': 'pepper', 'pepper': 'pepper',
      'വാഴ': 'banana', 'banana': 'banana',
      'റബ്ബർ': 'rubber', 'rubber': 'rubber'
    }
    
    for (const [key, value] of Object.entries(crops)) {
      if (lowerText.includes(key)) {
        crop = value
        break
      }
    }
    
    return {
      type: activityType,
      crop: crop || 'unknown',
      notes: notes,
      location: farmData?.location || '',
      timestamp: new Date().toISOString()
    }
  }

  const updateFarmData = async (newData) => {
    try {
      // Update local state immediately
      setFarmData(newData)
      
      // Save to localStorage
      localStorage.setItem(STORAGE_KEYS.FARM_DATA, JSON.stringify(newData))
      
      // Try to save to API
      await farmService.saveFarmData(newData)
    } catch (error) {
      console.error('Failed to update farm data:', error)
      // Data is still saved locally, so we don't revert the state
    }
  }

  const clearFarmData = () => {
    setFarmData(null)
    localStorage.removeItem(STORAGE_KEYS.FARM_DATA)
  }

  const value = {
    farmData,
    isLoading,
    eligibleSchemes,
    activities,
    updateFarmData,
    clearFarmData,
    loadFarmData,
    addActivity,
    parseNaturalLanguageActivity,
    checkSchemeEligibility
  }

  return (
    <FarmDataContext.Provider value={value}>
      {children}
    </FarmDataContext.Provider>
  )
}

export default FarmDataProvider