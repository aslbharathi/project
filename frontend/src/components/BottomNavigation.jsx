import React from 'react'
import { useLocation, Link } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'

const BottomNavigation = () => {
  const location = useLocation()
  const { language } = useLanguage()

  const navItems = [
    {
      path: '/dashboard',
      icon: '🏠',
      label: language === 'en' ? 'Home' : 'ഹോം'
    },
    {
      path: '/chat',
      icon: '💬',
      label: language === 'en' ? 'Chat' : 'ചാറ്റ്'
    },
    {
      path: '/activity',
      icon: '📝',
      label: language === 'en' ? 'Activity' : 'പ്രവർത്തനം'
    },
    {
      path: '/market',
      icon: '💰',
      label: language === 'en' ? 'Market' : 'മാർക്കറ്റ്'
    },
    {
      path: '/alerts',
      icon: '🔔',
      label: language === 'en' ? 'Alerts' : 'മുന്നറിയിപ്പുകൾ'
    }
  ]

  return (
    <nav className="bottom-nav">
      {navItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
        >
          <span style={{ fontSize: '1.2rem' }}>{item.icon}</span>
          <span>{item.label}</span>
        </Link>
      ))}
    </nav>
  )
}

export default BottomNavigation