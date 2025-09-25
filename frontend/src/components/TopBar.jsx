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
    <div className="top-bar">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div style={{ fontSize: '1.5rem' }}>🌾</div>
          <div>
            <h1 className="font-bold text-primary" style={{ fontSize: '1.2rem' }}>
              {language === 'en' ? 'Krishi Sakhi' : 'കൃഷി സഖി'}
            </h1>
            <p className="text-muted" style={{ fontSize: '0.7rem' }}>
              {language === 'en' ? 'Kerala Agriculture Dept.' : 'കേരള കൃഷി വകുപ്പ്'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isAdmin && (
            <span 
              className="text-xs px-2 py-1 rounded"
              style={{ 
                backgroundColor: 'var(--warning)',
                color: 'white',
                fontWeight: '600'
              }}
            >
              {language === 'en' ? 'ADMIN' : 'അഡ്മിൻ'}
            </span>
          )}
          
          <div className="text-right">
            <p className="font-medium" style={{ fontSize: '0.875rem' }}>
              {user?.name}
            </p>
            <button
              onClick={handleLogout}
              className="text-error"
              style={{ fontSize: '0.75rem' }}
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