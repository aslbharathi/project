import React, { useState } from 'react'
import { useLanguage } from '../contexts/LanguageContext'

const AlertsReminders = () => {
  const { language, toggleLanguage } = useLanguage()
  const [alerts] = useState([
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
      high: '#ef4444',
      medium: '#f59e0b',
      low: '#3b82f6'
    }
    return colors[priority] || colors.medium
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <button 
        className="absolute top-4 right-4 bg-white border-2 border-gray-300 rounded-lg px-3 py-1 text-sm font-semibold shadow-md z-10"
        onClick={toggleLanguage}
      >
        {language === 'en' ? 'മലയാളം' : 'English'}
      </button>

      <div className="p-4">
        {/* Header */}
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-green-600 mb-2">
            {language === 'en' ? 'Alerts & Reminders' : 'മുന്നറിയിപ്പുകളും ഓർമ്മപ്പെടുത്തലുകളും'}
          </h1>
          <p className="text-gray-600">
            {language === 'en' 
              ? 'Stay updated with important farming information'
              : 'പ്രധാനപ്പെട്ട കൃഷി വിവരങ്ങൾ അറിഞ്ഞിരിക്കുക'
            }
          </p>
        </div>

        {/* Alerts List */}
        <div className="space-y-3">
          {alerts.length > 0 ? (
            alerts.map((alert) => (
              <div 
                key={alert.id} 
                className={`bg-white rounded-lg shadow-md p-4 ${!alert.isRead ? 'border-l-4' : ''}`}
                style={{ 
                  borderLeftColor: !alert.isRead ? getPriorityColor(alert.priority) : 'transparent'
                }}
              >
                <div className="flex items-start space-x-3">
                  <span className="text-2xl">{getAlertIcon(alert.type)}</span>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className={`font-semibold ${!alert.isRead ? 'text-green-600' : ''}`}>
                        {alert.title}
                      </h3>
                      <div className="flex items-center space-x-2">
                        {!alert.isRead && (
                          <span 
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: getPriorityColor(alert.priority) }}
                          />
                        )}
                        <span className="text-gray-500 text-sm">
                          {new Date(alert.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-2">{alert.message}</p>
                    
                    <div className="flex items-center justify-between">
                      <span 
                        className="text-xs px-2 py-1 rounded"
                        style={{ 
                          backgroundColor: `${getPriorityColor(alert.priority)}20`,
                          color: getPriorityColor(alert.priority)
                        }}
                      >
                        {alert.priority === 'high' 
                          ? (language === 'en' ? 'High Priority' : 'ഉയർന്ന മുൻഗണന')
                          : alert.priority === 'medium'
                          ? (language === 'en' ? 'Medium' : 'ഇടത്തരം')
                          : (language === 'en' ? 'Low' : 'കുറഞ്ഞത്')
                        }
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">🔔</div>
              <h3 className="font-semibold mb-2">
                {language === 'en' ? 'No Alerts' : 'മുന്നറിയിപ്പുകളൊന്നുമില്ല'}
              </h3>
              <p className="text-gray-600">
                {language === 'en' 
                  ? 'You\'re all caught up! Check back later for updates.'
                  : 'നിങ്ങൾ എല്ലാം കണ്ടു കഴിഞ്ഞു! അപ്‌ഡേറ്റുകൾക്കായി പിന്നീട് വീണ്ടും പരിശോധിക്കുക.'
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AlertsReminders