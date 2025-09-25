import React, { createContext, useContext, useState, useEffect } from 'react'

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
  const [activities, setActivities] = useState([])

  useEffect(() => {
    loadFarmData()
    loadActivities()
  }, [])

  const loadFarmData = async () => {
    try {
      setIsLoading(true)
      
      // Load from localStorage
      const localData = localStorage.getItem('krishiSakhiFarmData')
      if (localData) {
        try {
          setFarmData(JSON.parse(localData))
        } catch (parseError) {
          console.error('Failed to parse local farm data:', parseError)
          setFarmData(null)
        }
      }
    } catch (error) {
      console.error('Failed to load farm data:', error)
      setFarmData(null)
    } finally {
      setIsLoading(false)
    }
  }

  const loadActivities = async () => {
    try {
      const localActivities = localStorage.getItem('krishiSakhiActivities')
      if (localActivities) {
        try {
          setActivities(JSON.parse(localActivities))
        } catch (parseError) {
          console.error('Failed to parse local activities:', parseError)
          setActivities([])
        }
      }
    } catch (error) {
      console.error('Failed to load activities:', error)
      setActivities([])
    }
  }

  const updateFarmData = async (newData) => {
    try {
      // Update local state immediately
      setFarmData(newData)
      
      // Save to localStorage
      localStorage.setItem('krishiSakhiFarmData', JSON.stringify(newData))
    } catch (error) {
      console.error('Failed to update farm data:', error)
    }
  }

  const addActivity = async (activityData) => {
    try {
      const newActivity = {
        ...activityData,
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        userId: 'current_user'
      }
      
      // Add to local state
      setActivities(prev => [newActivity, ...prev])
      
      // Save to localStorage
      const updatedActivities = [newActivity, ...activities]
      localStorage.setItem('krishiSakhiActivities', JSON.stringify(updatedActivities))
      
      return newActivity
    } catch (error) {
      console.error('Failed to add activity:', error)
      throw error
    }
  }

  const clearFarmData = () => {
    setFarmData(null)
    localStorage.removeItem('krishiSakhiFarmData')
  }

  const value = {
    farmData,
    isLoading,
    activities,
    updateFarmData,
    clearFarmData,
    loadFarmData,
    addActivity
  }

  return (
    <FarmDataContext.Provider value={value}>
      {children}
    </FarmDataContext.Provider>
  )
}

export default FarmDataProvider