import crypto from 'crypto'

export const generateUserId = (req) => {
  // Generate a unique user ID based on IP and user agent
  const identifier = `${req.ip}-${req.get('User-Agent')}`
  return crypto.createHash('sha256').update(identifier).digest('hex').substring(0, 16)
}

export const generateSessionId = () => {
  return crypto.randomBytes(16).toString('hex')
}

export const formatDate = (date) => {
  return new Date(date).toISOString().split('T')[0]
}

export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input
  return input.trim().replace(/[<>]/g, '')
}

export const generateRandomString = (length = 10) => {
  return crypto.randomBytes(length).toString('hex').substring(0, length)
}

export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371 // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return R * c // Distance in kilometers
}