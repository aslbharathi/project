import React, { createContext, useContext, useState, useEffect } from 'react'

const LanguageContext = createContext()

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en')

  useEffect(() => {
    const savedLanguage = localStorage.getItem('krishiSakhiLanguage')
    if (savedLanguage && ['en', 'ml'].includes(savedLanguage)) {
      setLanguage(savedLanguage)
    }
  }, [])

  const toggleLanguage = () => {
    const newLanguage = language === 'en' ? 'ml' : 'en'
    setLanguage(newLanguage)
    localStorage.setItem('krishiSakhiLanguage', newLanguage)
  }

  const t = (key, translations) => {
    return translations[language] || translations.en || key
  }

  const value = {
    language,
    setLanguage,
    toggleLanguage,
    t
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}

export default LanguageProvider