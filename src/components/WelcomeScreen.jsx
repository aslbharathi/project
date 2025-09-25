import React from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import { Sprout, Leaf } from 'lucide-react'

const WelcomeScreen = () => {
  const { language, toggleLanguage, t } = useLanguage()

  return (
    <div className="container">
      <button 
        className="language-toggle"
        onClick={toggleLanguage}
      >
        {language === 'ml' ? 'English' : 'മലയാളം'}
      </button>

      <div className="flex flex-col items-center justify-center" style={{ minHeight: '100vh', padding: '2rem 0' }}>
        <div className="text-center mb-5 fade-in">
          {/* Logo */}
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="relative">
              <Sprout size={48} className="text-primary" />
              <Leaf size={24} className="text-secondary" style={{ position: 'absolute', top: '-8px', right: '-8px' }} />
            </div>
          </div>
          
          {/* App Name */}
          <h1 className="font-bold mb-3" style={{ fontSize: '2.5rem', color: 'var(--primary-green)' }}>
            {t('appName')}
          </h1>
          
          {/* Tagline */}
          <p className="text-gray mb-4" style={{ fontSize: '1.25rem', lineHeight: '1.5' }}>
            {t('tagline')}
          </p>
          
          {/* Decorative elements */}
          <div className="flex items-center justify-center gap-2 mb-5">
            <span style={{ fontSize: '1.5rem' }}>🌾</span>
            <span style={{ fontSize: '1.5rem' }}>🥥</span>
            <span style={{ fontSize: '1.5rem' }}>🍌</span>
            <span style={{ fontSize: '1.5rem' }}>🌶️</span>
          </div>
        </div>

        {/* Features Preview */}
        <div className="w-full mb-5">
          <div className="card bg-light" style={{ border: '2px dashed var(--primary-green)' }}>
            <div className="text-center">
              <h3 className="font-semibold mb-3 text-primary">
                {language === 'ml' ? 'പ്രധാന സവിശേഷതകൾ' : 'Key Features'}
              </h3>
              <div className="flex justify-center gap-4 mb-3">
                <div className="text-center">
                  <div style={{ fontSize: '2rem' }}>🎤</div>
                  <p className="text-muted" style={{ fontSize: '0.875rem' }}>
                    {language === 'ml' ? 'ശബ്ദ സഹായം' : 'Voice Support'}
                  </p>
                </div>
                <div className="text-center">
                  <div style={{ fontSize: '2rem' }}>📱</div>
                  <p className="text-muted" style={{ fontSize: '0.875rem' }}>
                    {language === 'ml' ? 'എളുപ്പമുള്ള ഉപയോഗം' : 'Easy to Use'}
                  </p>
                </div>
                <div className="text-center">
                  <div style={{ fontSize: '2rem' }}>🌦️</div>
                  <p className="text-muted" style={{ fontSize: '0.875rem' }}>
                    {language === 'ml' ? 'കാലാവസ്ഥ അറിയിപ്പ്' : 'Weather Alerts'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Get Started Button */}
        <Link to="/setup" className="btn btn-primary w-full" style={{ fontSize: '1.125rem' }}>
          <Sprout size={20} />
          {t('getStarted')}
        </Link>

        {/* Offline indicator */}
        <p className="text-muted text-center mt-3" style={{ fontSize: '0.875rem' }}>
          {t('canLogOffline')}
        </p>
      </div>
    </div>
  )
}

export default WelcomeScreen