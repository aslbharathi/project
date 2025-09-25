import React from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useLanguage } from '../contexts/LanguageContext'

const TopBar = () => {
  const { user, logout, isAdmin } = useAuth()
  const { language } = useLanguage()

  const handleLogout = () => {
    if (window.confirm(language === 'en' ? 'Are you sure you want to logout?' : 'നിങ്ങൾ ലോഗൗട്ട് ചെയ്യാൻ ആഗ്രഹിക്കുന്നുണ്ടോ?')) {
      logout()
    }
  }

  return (
    <div className="bg-green-600 text-white p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="text-2xl">🌾</div>
          <div>
            <h1 className="font-bold">
              {language === 'en' ? 'Krishi Sakhi' : 'കൃഷി സഖി'}
            </h1>
            <p className="text-green-100 text-sm">
              {language === 'en' ? 'Kerala Agriculture Dept.' : 'കേരള കൃഷി വകുപ്പ്'}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {isAdmin && (
            <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded font-semibold">
              {language === 'en' ? 'ADMIN' : 'അഡ്മിൻ'}
            </span>
          )}
          
          <div className="text-right">
            <p className="font-medium text-sm">{user?.name}</p>
            <button
              onClick={handleLogout}
              className="text-green-200 hover:text-white text-xs"
            >
              {language === 'en' ? 'Logout' : 'ലോഗൗട്ട്'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TopBar