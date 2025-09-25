import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'

const WelcomeScreen = () => {
  const navigate = useNavigate()
  const { language, toggleLanguage, t } = useLanguage()

  const handleGetStarted = () => {
    navigate('/setup')
  }

  return (
    <div className="container" style={{ minHeight: '100vh', paddingTop: '2rem' }}>
      <button 
        className="language-toggle"
        onClick={toggleLanguage}
        aria-label="Toggle Language"
      >
        {language === 'en' ? 'മലയാളം' : 'English'}
      </button>

      <div className="text-center" style={{ paddingTop: '4rem' }}>
        <div className="mb-5">
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🌾</div>
          <h1 className="font-bold" style={{ fontSize: '2rem', marginBottom: '1rem', color: 'var(--primary-green)' }}>
            {language === 'en' ? 'Krishi Sakhi' : 'കൃഷി സഖി'}
          </h1>
          <p className="text-gray" style={{ fontSize: '1.1rem', lineHeight: '1.6' }}>
            {language === 'en' 
              ? 'Your Digital Farming Assistant' 
              : 'നിങ്ങളുടെ ഡിജിറ്റൽ കൃഷി സഖി'
            }
          </p>
        </div>

        <div className="space-y-3 mb-5">
          <div className="card" style={{ textAlign: 'left' }}>
            <div className="flex items-center gap-3 mb-3">
              <span style={{ fontSize: '1.5rem' }}>💬</span>
              <div>
                <h3 className="font-semibold">
                  {language === 'en' ? 'AI Chat Assistant' : 'AI ചാറ്റ് അസിസ്റ്റന്റ്'}
                </h3>
                <p className="text-muted" style={{ fontSize: '0.9rem' }}>
                  {language === 'en' 
                    ? 'Get farming advice in Malayalam or English'
                    : 'മലയാളത്തിലോ ഇംഗ്ലീഷിലോ കൃഷി ഉപദേശം നേടുക'
                  }
                </p>
              </div>
            </div>
          </div>

          <div className="card" style={{ textAlign: 'left' }}>
            <div className="flex items-center gap-3 mb-3">
              <span style={{ fontSize: '1.5rem' }}>🌤️</span>
              <div>
                <h3 className="font-semibold">
                  {language === 'en' ? 'Weather Alerts' : 'കാലാവസ്ഥാ മുന്നറിയിപ്പുകൾ'}
                </h3>
                <p className="text-muted" style={{ fontSize: '0.9rem' }}>
                  {language === 'en' 
                    ? 'Location-based weather notifications'
                    : 'സ്ഥാന അടിസ്ഥാനത്തിലുള്ള കാലാവസ്ഥാ അറിയിപ്പുകൾ'
                  }
                </p>
              </div>
            </div>
          </div>

          <div className="card" style={{ textAlign: 'left' }}>
            <div className="flex items-center gap-3 mb-3">
              <span style={{ fontSize: '1.5rem' }}>📝</span>
              <div>
                <h3 className="font-semibold">
                  {language === 'en' ? 'Activity Tracking' : 'പ്രവർത്തന ട്രാക്കിംഗ്'}
                </h3>
                <p className="text-muted" style={{ fontSize: '0.9rem' }}>
                  {language === 'en' 
                    ? 'Log and track your farming activities'
                    : 'നിങ്ങളുടെ കൃഷി പ്രവർത്തനങ്ങൾ രേഖപ്പെടുത്തുക'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        <button 
          className="btn btn-primary w-full"
          onClick={handleGetStarted}
          style={{ fontSize: '1.1rem', padding: '1rem 2rem' }}
        >
          {language === 'en' ? 'Get Started' : 'ആരംഭിക്കുക'}
        </button>

        <p className="text-muted mt-3" style={{ fontSize: '0.85rem' }}>
          {language === 'en' 
            ? 'Works offline • Voice support • Free to use'
            : 'ഓഫ്‌ലൈനിൽ പ്രവർത്തിക്കുന്നു • വോയ്‌സ് സപ്പോർട്ട് • സൗജന്യം'
          }
        </p>
      </div>
    </div>
  )
}

export default WelcomeScreen