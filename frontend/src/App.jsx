import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import AuthProvider, { useAuth } from './contexts/AuthContext'
import WelcomeScreen from './components/WelcomeScreen'
import Login from './components/Login'
import Signup from './components/Signup'
import FarmSetup from './components/FarmSetup'
import Dashboard from './components/Dashboard'
import ChatInterface from './components/ChatInterface'
import ActivityLog from './components/ActivityLog'
import AlertsReminders from './components/AlertsReminders'
import MarketBoard from './components/MarketBoard'
import AdminDashboard from './components/AdminDashboard'
import BottomNavigation from './components/BottomNavigation'
import TopBar from './components/TopBar'
import LanguageProvider from './contexts/LanguageContext'
import FarmDataProvider from './contexts/FarmDataContext'
import { farmService } from './services/farmService'

const AppContent = () => {
  const { isAuthenticated, isLoading: authLoading, isAdmin } = useAuth()
  const [isSetupComplete, setIsSetupComplete] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      checkSetupStatus()
    } else if (!authLoading) {
      setIsLoading(false)
    }
  }, [isAuthenticated, authLoading])

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

  if (authLoading || isLoading) {
    return (
      <div className="container flex items-center justify-center" style={{ minHeight: '100vh' }}>
        <div className="text-center">
          <div className="loading-spinner mb-3" />
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  // If not authenticated, show auth routes
  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/" element={<WelcomeScreen />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    )
  }

  // If admin, show admin dashboard
  if (isAdmin) {
    return (
      <>
        <TopBar />
        <Routes>
          <Route path="/" element={<AdminDashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </>
    )
  }

  // Regular farmer routes
  return (
    <>
      <TopBar />
      <Routes>
        <Route 
          path="/" 
          element={
            isSetupComplete ? 
            <Navigate to="/dashboard" replace /> : 
            <Navigate to="/setup" replace />
          } 
        />
        <Route 
          path="/setup" 
          element={<FarmSetup onComplete={() => setIsSetupComplete(true)} />} 
        />
        <Route 
          path="/dashboard" 
          element={
            isSetupComplete ? 
            <Dashboard /> : 
            <Navigate to="/setup" replace />
          } 
        />
        <Route 
          path="/chat" 
          element={
            isSetupComplete ? 
            <ChatInterface /> : 
            <Navigate to="/setup" replace />
          } 
        />
        <Route 
          path="/activity" 
          element={
            isSetupComplete ? 
            <ActivityLog /> : 
            <Navigate to="/setup" replace />
          } 
        />
        <Route 
          path="/alerts" 
          element={
            isSetupComplete ? 
            <AlertsReminders /> : 
            <Navigate to="/setup" replace />
          } 
        />
        <Route 
          path="/market" 
          element={
            isSetupComplete ? 
            <MarketBoard /> : 
            <Navigate to="/setup" replace />
          } 
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      
      {isSetupComplete && <BottomNavigation />}
    </>
  )
}

function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <FarmDataProvider>
          <Router>
            <div className="app">
              <AppContent />
            </div>
          </Router>
        </FarmDataProvider>
      </LanguageProvider>
    </AuthProvider>
  )
}

export default App

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