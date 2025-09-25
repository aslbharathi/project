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
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 py-1">
      <div className="flex justify-around">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
              location.pathname === item.path 
                ? 'text-green-600 bg-green-50' 
                : 'text-gray-500 hover:text-green-600'
            }`}
          >
            <span className="text-xl mb-1">{item.icon}</span>
            <span className="text-xs font-medium">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  )
}

export default BottomNavigation