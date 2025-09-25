export const formatDate = (dateString, language = 'en') => {
  const date = new Date(dateString)
  return date.toLocaleDateString(language === 'ml' ? 'ml-IN' : 'en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export const formatTimeAgo = (timestamp, language = 'en') => {
  const date = new Date(timestamp)
  const now = new Date()
  const diffInHours = Math.floor((now - date) / (1000 * 60 * 60))
  
  if (diffInHours < 1) {
    return language === 'ml' ? 'ഇപ്പോൾ' : 'Just now'
  } else if (diffInHours < 24) {
    return language === 'ml' ? `${diffInHours} മണിക്കൂർ മുമ്പ്` : `${diffInHours} hours ago`
  } else {
    const diffInDays = Math.floor(diffInHours / 24)
    return language === 'ml' ? `${diffInDays} ദിവസം മുമ്പ്` : `${diffInDays} days ago`
  }
}

export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

export const debounce = (func, wait) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

export const validateFarmData = (data) => {
  const errors = {}
  
  if (!data.name?.trim()) {
    errors.name = 'Name is required'
  }
  
  if (!data.location?.trim()) {
    errors.location = 'Location is required'
  }
  
  if (!data.landSize || data.landSize <= 0) {
    errors.landSize = 'Valid land size is required'
  }
  
  if (!data.currentCrop) {
    errors.currentCrop = 'Current crop is required'
  }
  
  if (!data.soilType) {
    errors.soilType = 'Soil type is required'
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}