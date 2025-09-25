import React, { createContext, useContext, useState, useEffect } from 'react'
import { STORAGE_KEYS } from '../utils/constants'
import { farmService } from '../services/farmService'

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

  useEffect(() => {
    loadFarmData()
  }, [])

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
    updateFarmData,
    clearFarmData,
    loadFarmData
  }

  return (
    <FarmDataContext.Provider value={value}>
      {children}
    </FarmDataContext.Provider>
  )
}

export default FarmDataProvider