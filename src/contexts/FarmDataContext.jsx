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
  const [farmData, setFarmData] = useState({
    name: '',
    location: '',
    landSize: '',
    landUnit: 'cents',
    currentCrop: '',
    soilType: '',
    irrigation: false
  })

  const [activities, setActivities] = useState([])
  const [chatHistory, setChatHistory] = useState([])

  useEffect(() => {
    // Load farm data from localStorage
    const savedFarmData = localStorage.getItem('krishiSakhiFarmData')
    if (savedFarmData) {
      setFarmData(JSON.parse(savedFarmData))
    }

    // Load activities from localStorage
    const savedActivities = localStorage.getItem('krishiSakhiActivities')
    if (savedActivities) {
      setActivities(JSON.parse(savedActivities))
    }

    // Load chat history from localStorage
    const savedChatHistory = localStorage.getItem('krishiSakhiChatHistory')
    if (savedChatHistory) {
      setChatHistory(JSON.parse(savedChatHistory))
    }
  }, [])

  const saveFarmData = (data) => {
    setFarmData(data)
    localStorage.setItem('krishiSakhiFarmData', JSON.stringify(data))
  }

  const addActivity = (activity) => {
    const newActivity = {
      id: Date.now(),
      ...activity,
      timestamp: new Date().toISOString()
    }
    const updatedActivities = [newActivity, ...activities]
    setActivities(updatedActivities)
    localStorage.setItem('krishiSakhiActivities', JSON.stringify(updatedActivities))
  }

  const addChatMessage = (message) => {
    const newMessage = {
      id: Date.now(),
      ...message,
      timestamp: new Date().toISOString()
    }
    const updatedChatHistory = [...chatHistory, newMessage]
    setChatHistory(updatedChatHistory)
    localStorage.setItem('krishiSakhiChatHistory', JSON.stringify(updatedChatHistory))
  }

  return (
    <FarmDataContext.Provider value={{
      farmData,
      saveFarmData,
      activities,
      addActivity,
      chatHistory,
      addChatMessage
    }}>
      {children}
    </FarmDataContext.Provider>
  )
}

export default FarmDataProvider