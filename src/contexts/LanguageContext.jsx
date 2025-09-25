import React, { createContext, useContext, useState, useEffect } from 'react'

const LanguageContext = createContext()

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

const translations = {
  ml: {
    // Welcome Screen
    appName: 'കൃഷി സഖി',
    tagline: 'നിങ്ങളുടെ ഡിജിറ്റൽ കൃഷി സഖി',
    getStarted: 'ആരംഭിക്കുക',
    
    // Farm Setup
    setupTitle: 'നിങ്ങളുടെ കൃഷിയിടം സജ്ജീകരിക്കുക',
    name: 'പേര്',
    location: 'സ്ഥലം',
    landSize: 'കൃഷി ഭൂമിയുടെ വിസ്തീർണ്ണം',
    currentCrop: 'ഇപ്പോൾ കൃഷി ചെയ്യുന്ന വിള',
    soilType: 'മണ്ണിന്റെ തരം',
    irrigation: 'ജലസേചന സൗകര്യം',
    saveProfile: 'പ്രൊഫൈൽ സേവ് ചെയ്യുക',
    
    // Crops
    paddy: 'നെല്ല്',
    coconut: 'തെങ്ങ്',
    rubber: 'റബ്ബർ',
    banana: 'വാഴ',
    brinjal: 'വഴുതന',
    pepper: 'കുരുമുളക്',
    cardamom: 'ഏലം',
    ginger: 'ഇഞ്ചി',
    turmeric: 'മഞ്ഞൾ',
    
    // Soil Types
    laterite: 'ലാറ്ററൈറ്റ്',
    alluvial: 'എക്കൽ മണ്ണ്',
    coastal: 'തീരദേശ മണ്ണ്',
    forest: 'വന മണ്ണ്',
    
    // Dashboard
    goodMorning: 'സുപ്രഭാതം',
    goodAfternoon: 'നമസ്കാരം',
    goodEvening: 'സന്ധ്യാ നമസ്കാരം',
    todayReminder: 'ഇന്നത്തെ ഓർമ്മപ്പെടുത്തൽ',
    whatToDo: 'എന്തുചെയ്യണം?',
    logActivity: 'പ്രവർത്തനം ലോഗ് ചെയ്യുക',
    alerts: 'അറിയിപ്പുകൾ',
    
    // Activities
    sowedSeeds: 'വിത്ത് വിതച്ചു',
    appliedFertilizer: 'വളം ഇട്ടു',
    irrigated: 'ജലം കൊടുത്തു',
    pestDisease: 'കീടം/രോഗം',
    harvested: 'വിളവെടുത്തു',
    weeding: 'കളപറിച്ചു',
    
    // Chat
    typeMessage: 'സന്ദേശം ടൈപ്പ് ചെയ്യുക...',
    send: 'അയയ്ക്കുക',
    listening: 'കേൾക്കുന്നു...',
    
    // Common
    yes: 'ഉണ്ട്',
    no: 'ഇല്ല',
    save: 'സേവ് ചെയ്യുക',
    cancel: 'റദ്ദാക്കുക',
    back: 'തിരികെ',
    next: 'അടുത്തത്',
    loading: 'ലോഡ് ചെയ്യുന്നു...',
    
    // Navigation
    home: 'ഹോം',
    chat: 'ചാറ്റ്',
    activity: 'പ്രവർത്തനം',
    
    // Units
    cents: 'സെന്റ്',
    hectares: 'ഹെക്ടർ',
    
    // Sample responses
    pestResponse: 'അടുത്ത 24 മണിക്കൂറിൽ മഴ പെയ്യാൻ സാധ്യതയുണ്ട്. ഇപ്പോൾ സ്പ്രേ ചെയ്യരുത്. ഇന്ന് വൈകുന്നേരം നിങ്ങളുടെ ചുറ്റുമുള്ള 3 കർഷകർക്ക് ഇതേ പ്രശ്നം റിപ്പോർട്ട് ചെയ്തിട്ടുണ്ട്. നീരാവി ഉപയോഗിച്ച് പരിശോധിക്കൂ.',
    weatherAlert: 'ഇന്ന് ഉച്ചയ്ക്ക് ശേഷം മഴ! ഇന്ന് വളം ഇടരുത്.',
    priceAlert: 'കൊച്ചി മാർക്കറ്റിൽ വഴുതനയ്ക്ക് വില കൂടി: ₹45/kg',
    schemeAlert: 'കേരള കർഷക സഹായ പദ്ധതി – അപേക്ഷിക്കാൻ 2 ദിവസം ബാക്കി',
    
    // Offline
    canLogOffline: 'ഓഫ്‌ലൈനായി ലോഗ് ചെയ്യാം'
  },
  en: {
    // Welcome Screen
    appName: 'Krishi Sakhi',
    tagline: 'Your Digital Farming Friend',
    getStarted: 'Get Started',
    
    // Farm Setup
    setupTitle: 'Set Up Your Farm',
    name: 'Name',
    location: 'Location',
    landSize: 'Land Size',
    currentCrop: 'Current Crop',
    soilType: 'Soil Type',
    irrigation: 'Irrigation Facility',
    saveProfile: 'Save Profile',
    
    // Crops
    paddy: 'Paddy',
    coconut: 'Coconut',
    rubber: 'Rubber',
    banana: 'Banana',
    brinjal: 'Brinjal',
    pepper: 'Pepper',
    cardamom: 'Cardamom',
    ginger: 'Ginger',
    turmeric: 'Turmeric',
    
    // Soil Types
    laterite: 'Laterite',
    alluvial: 'Alluvial',
    coastal: 'Coastal',
    forest: 'Forest',
    
    // Dashboard
    goodMorning: 'Good Morning',
    goodAfternoon: 'Good Afternoon',
    goodEvening: 'Good Evening',
    todayReminder: 'Today\'s Reminder',
    whatToDo: 'What to do?',
    logActivity: 'Log Activity',
    alerts: 'Alerts',
    
    // Activities
    sowedSeeds: 'Sowed Seeds',
    appliedFertilizer: 'Applied Fertilizer',
    irrigated: 'Irrigated',
    pestDisease: 'Pest/Disease',
    harvested: 'Harvested',
    weeding: 'Weeding',
    
    // Chat
    typeMessage: 'Type a message...',
    send: 'Send',
    listening: 'Listening...',
    
    // Common
    yes: 'Yes',
    no: 'No',
    save: 'Save',
    cancel: 'Cancel',
    back: 'Back',
    next: 'Next',
    loading: 'Loading...',
    
    // Navigation
    home: 'Home',
    chat: 'Chat',
    activity: 'Activity',
    
    // Units
    cents: 'Cents',
    hectares: 'Hectares',
    
    // Sample responses
    pestResponse: 'Rain is expected in the next 24 hours. Don\'t spray now. 3 farmers around you reported the same issue this evening. Check using neem oil.',
    weatherAlert: 'Rain expected this afternoon! Don\'t apply fertilizer today.',
    priceAlert: 'Brinjal price increased in Kochi market: ₹45/kg',
    schemeAlert: 'Kerala Farmer Assistance Scheme - 2 days left to apply',
    
    // Offline
    canLogOffline: 'Can log offline'
  }
}

const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('ml')

  useEffect(() => {
    const savedLanguage = localStorage.getItem('krishiSakhiLanguage')
    if (savedLanguage) {
      setLanguage(savedLanguage)
    }
  }, [])

  const toggleLanguage = () => {
    const newLanguage = language === 'ml' ? 'en' : 'ml'
    setLanguage(newLanguage)
    localStorage.setItem('krishiSakhiLanguage', newLanguage)
  }

  const t = (key) => {
    return translations[language][key] || key
  }

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export default LanguageProvider