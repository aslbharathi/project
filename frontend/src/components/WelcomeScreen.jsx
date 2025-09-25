import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'

const WelcomeScreen = () => {
  const navigate = useNavigate()
  const { language, toggleLanguage, t } = useLanguage()

  const handleGetStarted = () => {
    navigate('/signup')
  }

  const handleLogin = () => {
    navigate('/login')
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
          <p className="text-muted" style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>
            {language === 'en' 
              ? 'Kerala Government Agriculture Department'
              : 'കേരള സർക്കാർ കൃഷി വകുപ്പ്'
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
              <span style={{ fontSize: '1.5rem' }}>🏛️</span>
              <div>
                <h3 className="font-semibold">
                  {language === 'en' ? 'Government Schemes' : 'സർക്കാർ പദ്ധതികൾ'}
                </h3>
                <p className="text-muted" style={{ fontSize: '0.9rem' }}>
                  {language === 'en' 
                    ? 'Auto-eligibility for PM-KISAN and Kerala schemes'
                    : 'പിഎം-കിസാൻ, കേരള പദ്ധതികൾക്കുള്ള യോഗ്യത പരിശോധന'
                  }
                </p>
              </div>
            </div>
          </div>

          <div className="card" style={{ textAlign: 'left' }}>
            <div className="flex items-center gap-3 mb-3">
              <span style={{ fontSize: '1.5rem' }}>💰</span>
              <div>
                <h3 className="font-semibold">
                  {language === 'en' ? 'Market Price Board' : 'മാർക്കറ്റ് വില ബോർഡ്'}
                </h3>
                <p className="text-muted" style={{ fontSize: '0.9rem' }}>
                  {language === 'en' 
                    ? 'Live prices and sell your crops directly'
                    : 'തത്സമയ വിലകളും നേരിട്ട് വിളകൾ വിൽക്കാനും'
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
        </div>

        <div className="space-y-3">
          <button 
            className="btn btn-primary w-full"
            onClick={handleGetStarted}
            style={{ fontSize: '1.1rem', padding: '1rem 2rem' }}
          >
            {language === 'en' ? 'Get Started - Sign Up' : 'ആരംഭിക്കുക - സൈൻ അപ്പ്'}
          </button>

          <button 
            className="btn btn-secondary w-full"
            onClick={handleLogin}
            style={{ fontSize: '1rem', padding: '0.875rem 2rem' }}
          >
            {language === 'en' ? 'Already have account? Login' : 'ഇതിനകം അക്കൗണ്ട് ഉണ്ടോ? ലോഗിൻ'}
          </button>
        </div>

        <p className="text-muted mt-4" style={{ fontSize: '0.85rem' }}>
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