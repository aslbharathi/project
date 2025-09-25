import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import { Home, MessageCircle, Plus, Bell } from 'lucide-react'

const BottomNavigation = () => {
  const location = useLocation()
  const { t } = useLanguage()

  const navItems = [
    {
      path: '/dashboard',
      icon: Home,
      label: t('home')
    },
    {
      path: '/chat',
      icon: MessageCircle,
      label: t('chat')
    },
    {
      path: '/activity',
      icon: Plus,
      label: t('activity')
    },
    {
      path: '/alerts',
      icon: Bell,
      label: t('alerts')
    }
  ]

  return (
    <nav className="bottom-nav">
      {navItems.map((item) => {
        const IconComponent = item.icon
        const isActive = location.pathname === item.path
        
        return (
          <Link
            key={item.path}
            to={item.path}
            className={`nav-item ${isActive ? 'active' : ''}`}
          >
            <IconComponent size={20} />
            <span>{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}

export default BottomNavigation