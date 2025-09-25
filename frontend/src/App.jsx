import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import AuthProvider, { useAuth } from './contexts/AuthContext'
import LanguageProvider from './contexts/LanguageContext'
import FarmDataProvider from './contexts/FarmDataContext'

// Components
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

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth()
  
  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner" />
        <p>Loading...</p>
      </div>
    )
  }
  
  return isAuthenticated ? children : <Navigate to="/" replace />
}

// Main App Layout
const AppLayout = ({ children }) => {
  const { isAuthenticated, isAdmin } = useAuth()
  
  if (!isAuthenticated) {
    return children
  }
  
  return (
    <div className="app-layout">
      <TopBar />
      <main className="main-content">
        {children}
      </main>
      {!isAdmin && <BottomNavigation />}
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <FarmDataProvider>
          <Router>
            <div className="App">
              <AppLayout>
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<WelcomeScreen />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  
                  {/* Protected Routes */}
                  <Route path="/setup" element={
                    <ProtectedRoute>
                      <FarmSetup />
                    </ProtectedRoute>
                  } />
                  <Route path="/dashboard" element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } />
                  <Route path="/chat" element={
                    <ProtectedRoute>
                      <ChatInterface />
                    </ProtectedRoute>
                  } />
                  <Route path="/activity" element={
                    <ProtectedRoute>
                      <ActivityLog />
                    </ProtectedRoute>
                  } />
                  <Route path="/alerts" element={
                    <ProtectedRoute>
                      <AlertsReminders />
                    </ProtectedRoute>
                  } />
                  <Route path="/market" element={
                    <ProtectedRoute>
                      <MarketBoard />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin" element={
                    <ProtectedRoute>
                      <AdminDashboard />
                    </ProtectedRoute>
                  } />
                  
                  {/* Catch all route */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </AppLayout>
            </div>
          </Router>
        </FarmDataProvider>
      </LanguageProvider>
    </AuthProvider>
  )
}

export default App