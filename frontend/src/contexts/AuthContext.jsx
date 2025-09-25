import React, { createContext, useContext, useState, useEffect } from 'react'

export const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [token, setToken] = useState(null)

  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = () => {
    try {
      const savedToken = localStorage.getItem('krishiSakhiToken')
      const savedUser = localStorage.getItem('krishiSakhiUser')
      
      if (savedToken && savedUser) {
        setToken(savedToken)
        setUser(JSON.parse(savedUser))
      }
    } catch (error) {
      console.error('Auth check error:', error)
      logout()
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (credentials) => {
    try {
      // Mock login - replace with actual API call
      const mockUser = {
        id: Date.now().toString(),
        name: credentials.name || 'Test User',
        mobile: credentials.mobile,
        role: credentials.role || 'farmer',
        location: credentials.location || 'Kerala',
        isVerified: true
      }
      
      const mockToken = 'mock-jwt-token-' + Date.now()
      
      setUser(mockUser)
      setToken(mockToken)
      
      localStorage.setItem('krishiSakhiToken', mockToken)
      localStorage.setItem('krishiSakhiUser', JSON.stringify(mockUser))
      
      return { success: true, user: mockUser, token: mockToken }
    } catch (error) {
      console.error('Login error:', error)
      return { success: false, error: error.message }
    }
  }

  const signup = async (userData) => {
    try {
      // Mock signup - replace with actual API call
      const newUser = {
        id: Date.now().toString(),
        name: userData.name,
        mobile: userData.mobile,
        role: 'farmer',
        location: userData.location,
        district: userData.district,
        panchayat: userData.panchayat,
        isVerified: false,
        createdAt: new Date().toISOString()
      }
      
      const mockToken = 'mock-jwt-token-' + Date.now()
      
      setUser(newUser)
      setToken(mockToken)
      
      localStorage.setItem('krishiSakhiToken', mockToken)
      localStorage.setItem('krishiSakhiUser', JSON.stringify(newUser))
      
      return { success: true, user: newUser, token: mockToken }
    } catch (error) {
      console.error('Signup error:', error)
      return { success: false, error: error.message }
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('krishiSakhiToken')
    localStorage.removeItem('krishiSakhiUser')
    localStorage.removeItem('krishiSakhiFarmData')
  }

  const updateUser = (userData) => {
    const updatedUser = { ...user, ...userData }
    setUser(updatedUser)
    localStorage.setItem('krishiSakhiUser', JSON.stringify(updatedUser))
  }

  const value = {
    user,
    token,
    isLoading,
    login,
    signup,
    logout,
    updateUser,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isFarmer: user?.role === 'farmer'
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}