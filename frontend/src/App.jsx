import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import WelcomeScreen from './components/WelcomeScreen'
import FarmSetup from './components/FarmSetup'
import Dashboard from './components/Dashboard'
import ChatInterface from './components/ChatInterface'
import ActivityLog from './components/ActivityLog'
import AlertsReminders from './components/AlertsReminders'
import BottomNavigation from './components/BottomNavigation'
import LanguageProvider from './contexts/LanguageContext'
import FarmDataProvider from './contexts/FarmDataContext'
import { farmService } from './services/farmService'

function App() {
  const [isSetupComplete, setIsSetupComplete] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkSetupStatus = async () => {
      try {
        const farmData = await farmService.getFarmData()
        setIsSetupComplete(!!farmData)
      } catch (error) {
        console.error('Error checking setup status:', error)
        // Fallback to localStorage check
        const localFarmData = localStorage.getItem('krishiSakhiFarmData')
        setIsSetupComplete(!!localFarmData)
      } finally {
        setIsLoading(false)
      }
    }

    checkSetupStatus()
  }, [])

  if (isLoading) {
    return (
      <div className="container flex items-center justify-center" style={{ minHeight: '100vh' }}>
        <div className="text-center">
          <div className="loading-spinner mb-3" />
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <LanguageProvider>
      <FarmDataProvider>
        <Router>
          <div className="app">
            <Routes>
              <Route 
                path="/" 
                element={
                  isSetupComplete ? 
                  <Navigate to="/dashboard" replace /> : 
                  <WelcomeScreen />
                } 
              />
              <Route 
                path="/setup" 
                element={
                  <FarmSetup onComplete={() => setIsSetupComplete(true)} />
                } 
              />
              <Route 
                path="/dashboard" 
                element={
                  isSetupComplete ? 
                  <Dashboard /> : 
                  <Navigate to="/" replace />
                } 
              />
              <Route 
                path="/chat" 
                element={
                  isSetupComplete ? 
                  <ChatInterface /> : 
                  <Navigate to="/" replace />
                } 
              />
              <Route 
                path="/activity" 
                element={
                  isSetupComplete ? 
                  <ActivityLog /> : 
                  <Navigate to="/" replace />
                } 
              />
              <Route 
                path="/alerts" 
                element={
                  isSetupComplete ? 
                  <AlertsReminders /> : 
                  <Navigate to="/" replace />
                } 
              />
            </Routes>
            
            {isSetupComplete && <BottomNavigation />}
          </div>
        </Router>
      </FarmDataProvider>
    </LanguageProvider>
  )
}

export default App