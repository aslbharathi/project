import React, { useState, useEffect } from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import { farmService } from '../services/farmService'
import { formatTimeAgo } from '../utils/helpers'

const AlertsReminders = () => {
  const { language, toggleLanguage } = useLanguage()
  const [alerts, setAlerts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState('all') // all, unread, high

  useEffect(() => {
    loadAlerts()
  }, [])

  const loadAlerts = async () => {
    try {
      setIsLoading(true)
      const data = await farmService.getAlerts()
      const alerts = data?.data || data || []
      setAlerts(Array.isArray(alerts) ? alerts : [])
    } catch (error) {
      console.error('Failed to load alerts:', error)
      // Add sample alerts for demo
      setAlerts([
        {
          id: 1,
          type: 'weather',
          priority: 'high',
          title: language === 'en' ? 'Weather Alert' : 'കാലാവസ്ഥാ മുന്നറിയിപ്പ്',
          message: language === 'en' 
            ? 'Heavy rain expected today. Avoid applying fertilizers.'
            : 'ഇന്ന് കനത്ത മഴ പ്രതീക്ഷിക്കുന്നു. വളം ഇടുന്നത് ഒഴിവാക്കുക.',
          timestamp: new Date().toISOString(),
          isRead: false
        },
        {
          id: 2,
          type: 'pest',
          priority: 'medium',
          title: language === 'en' ? 'Pest Alert' : 'കീട മുന്നറിയിപ്പ്',
          message: language === 'en'
            ? 'Brown plant hopper activity reported in nearby areas.'
            : 'സമീപ പ്രദേശങ്ങളിൽ തവിട്ട് ചാടി പ്രവർത്തനം റിപ്പോർട്ട് ചെയ്തിട്ടുണ്ട്.',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          isRead: true
        }
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const markAsRead = async (alertId) => {
    try {
      // Update local state immediately
      setAlerts(prev => prev.map(alert => 
        alert.id === alertId ? { ...alert, isRead: true } : alert
      ))
      
      // Try to update on server
      await farmService.markAlertAsRead?.(alertId)
    } catch (error) {
      console.error('Failed to mark alert as read:', error)
    }
  }

  const getAlertIcon = (type) => {
    const icons = {
      weather: '🌤️',
      pest: '🐛',
      price: '💰',
      scheme: '📢',
      irrigation: '💧',
      fertilizer: '🌿',
      harvest: '🌾'
    }
    return icons[type] || '📢'
  }

  const getPriorityColor = (priority) => {
    const colors = {
      high: 'var(--error)',
      medium: 'var(--warning)',
      low: 'var(--info)'
    }
    return colors[priority] || colors.medium
  }

  const filteredAlerts = alerts.filter(alert => {
    if (filter === 'unread') return !alert.isRead
    if (filter === 'high') return alert.priority === 'high'
    return true
  })

  if (isLoading) {
    return (
      <div className="container flex items-center justify-center" style={{ minHeight: '100vh' }}>
        <div className="text-center">
          <div className="loading-spinner mb-3" />
          <p>{language === 'en' ? 'Loading alerts...' : 'മുന്നറിയിപ്പുകൾ ലോഡ് ചെയ്യുന്നു...'}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container" style={{ paddingBottom: '100px', paddingTop: '1rem' }}>
      <button 
        className="language-toggle"
        onClick={toggleLanguage}
        aria-label="Toggle Language"
      >
        {language === 'en' ? 'മലയാളം' : 'English'}
      </button>

      {/* Header */}
      <div className="mb-4">
        <h1 className="font-bold text-primary" style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
          {language === 'en' ? 'Alerts & Reminders' : 'മുന്നറിയിപ്പുകളും ഓർമ്മപ്പെടുത്തലുകളും'}
        </h1>
        <p className="text-gray">
          {language === 'en' 
            ? 'Stay updated with important farming information'
            : 'പ്രധാനപ്പെട്ട കൃഷി വിവരങ്ങൾ അറിഞ്ഞിരിക്കുക'
          }
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-4" style={{ overflowX: 'auto' }}>
        {[
          { key: 'all', label: language === 'en' ? 'All' : 'എല്ലാം' },
          { key: 'unread', label: language === 'en' ? 'Unread' : 'വായിക്കാത്തവ' },
          { key: 'high', label: language === 'en' ? 'High Priority' : 'ഉയർന്ന മുൻഗണന' }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`btn ${filter === tab.key ? 'btn-primary' : 'btn-secondary'}`}
            style={{ 
              padding: '0.5rem 1rem', 
              fontSize: '0.875rem',
              whiteSpace: 'nowrap',
              flexShrink: 0
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Alerts List */}
      <div className="space-y-3">
        {filteredAlerts.length > 0 ? (
          filteredAlerts.map((alert) => (
            <div 
              key={alert.id} 
              className={`card ${!alert.isRead ? 'border-l-4' : ''}`}
              style={{ 
                borderLeftColor: !alert.isRead ? getPriorityColor(alert.priority) : 'transparent',
                opacity: alert.isRead ? 0.8 : 1
              }}
              onClick={() => !alert.isRead && markAsRead(alert.id)}
            >
              <div className="flex items-start gap-3">
                <span style={{ fontSize: '1.5rem', flexShrink: 0 }}>
                  {getAlertIcon(alert.type)}
                </span>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className={`font-semibold ${!alert.isRead ? 'text-primary' : ''}`}>
                      {alert.title}
                    </h3>
                    <div className="flex items-center gap-2">
                      {!alert.isRead && (
                        <span 
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: getPriorityColor(alert.priority) }}
                        />
                      )}
                      <span className="text-muted" style={{ fontSize: '0.8rem' }}>
                        {formatTimeAgo(alert.timestamp, language)}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-gray" style={{ fontSize: '0.9rem', lineHeight: '1.4' }}>
                    {alert.message}
                  </p>
                  
                  <div className="flex items-center justify-between mt-2">
                    <span 
                      className="text-xs px-2 py-1 rounded"
                      style={{ 
                        backgroundColor: `${getPriorityColor(alert.priority)}20`,
                        color: getPriorityColor(alert.priority),
                        fontWeight: '500'
                      }}
                    >
                      {alert.priority === 'high' 
                        ? (language === 'en' ? 'High Priority' : 'ഉയർന്ന മുൻഗണന')
                        : alert.priority === 'medium'
                        ? (language === 'en' ? 'Medium' : 'ഇടത്തരം')
                        : (language === 'en' ? 'Low' : 'കുറഞ്ഞത്')
                      }
                    </span>
                    
                    {!alert.isRead && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          markAsRead(alert.id)
                        }}
                        className="text-primary"
                        style={{ fontSize: '0.8rem' }}
                      >
                        {language === 'en' ? 'Mark as read' : 'വായിച്ചതായി അടയാളപ്പെടുത്തുക'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔔</div>
            <h3 className="font-semibold mb-2">
              {filter === 'unread' 
                ? (language === 'en' ? 'No Unread Alerts' : 'വായിക്കാത്ത മുന്നറിയിപ്പുകളൊന്നുമില്ല')
                : filter === 'high'
                ? (language === 'en' ? 'No High Priority Alerts' : 'ഉയർന്ന മുൻഗണനയുള്ള മുന്നറിയിപ്പുകളൊന്നുമില്ല')
                : (language === 'en' ? 'No Alerts' : 'മുന്നറിയിപ്പുകളൊന്നുമില്ല')
              }
            </h3>
            <p className="text-gray">
              {language === 'en' 
                ? 'You\'re all caught up! Check back later for updates.'
                : 'നിങ്ങൾ എല്ലാം കണ്ടു കഴിഞ്ഞു! അപ്‌ഡേറ്റുകൾക്കായി പിന്നീട് വീണ്ടും പരിശോധിക്കുക.'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default AlertsReminders