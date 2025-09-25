import React, { useState, useEffect } from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import { useFarmData } from '../contexts/FarmDataContext'
import { Bell, AlertTriangle, DollarSign, Calendar, Cloud, Droplets, Sun } from 'lucide-react'

const AlertsReminders = () => {
  const { language, toggleLanguage, t } = useLanguage()
  const { farmData } = useFarmData()
  const [alerts, setAlerts] = useState([])

  useEffect(() => {
    // Generate sample alerts based on farm data
    const generateAlerts = () => {
      const currentDate = new Date()
      const crop = farmData.currentCrop

      const sampleAlerts = [
        {
          id: 1,
          type: 'weather',
          priority: 'high',
          icon: Cloud,
          title: language === 'ml' ? 'കാലാവസ്ഥ മുന്നറിയിപ്പ്' : 'Weather Alert',
          message: t('weatherAlert'),
          timestamp: new Date(currentDate.getTime() - 2 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 2,
          type: 'price',
          priority: 'medium',
          icon: DollarSign,
          title: language === 'ml' ? 'വില അപ്ഡേറ്റ്' : 'Price Update',
          message: t('priceAlert'),
          timestamp: new Date(currentDate.getTime() - 4 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 3,
          type: 'scheme',
          priority: 'high',
          icon: Calendar,
          title: language === 'ml' ? 'സർക്കാർ പദ്ധതി' : 'Government Scheme',
          message: t('schemeAlert'),
          timestamp: new Date(currentDate.getTime() - 6 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 4,
          type: 'irrigation',
          priority: 'medium',
          icon: Droplets,
          title: language === 'ml' ? 'ജലസേചന ഓർമ്മപ്പെടുത്തൽ' : 'Irrigation Reminder',
          message: language === 'ml' ? 
            `നിങ്ങളുടെ ${t(crop)} വിളയ്ക്ക് ഇന്ന് രാവിലെ ജലം നൽകാൻ മറന്നുപോയോ?` :
            `Did you forget to water your ${t(crop)} crop this morning?`,
          timestamp: new Date(currentDate.getTime() - 8 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 5,
          type: 'pest',
          priority: 'high',
          icon: AlertTriangle,
          title: language === 'ml' ? 'കീട മുന്നറിയിപ്പ്' : 'Pest Alert',
          message: language === 'ml' ? 
            `നിങ്ങളുടെ പ്രദേശത്ത് ${t(crop)} വിളയിൽ കീടബാധ റിപ്പോർട്ട് ചെയ്യപ്പെട്ടിട്ടുണ്ട്. പരിശോധിക്കുക.` :
            `Pest infestation reported in ${t(crop)} crops in your area. Please check.`,
          timestamp: new Date(currentDate.getTime() - 12 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 6,
          type: 'fertilizer',
          priority: 'low',
          icon: Sun,
          title: language === 'ml' ? 'വള ഓർമ്മപ്പെടുത്തൽ' : 'Fertilizer Reminder',
          message: language === 'ml' ? 
            `${t(crop)} വിളയ്ക്ക് അടുത്ത ആഴ്ച വളം ഇടാൻ സമയമാകുന്നു.` :
            `Time to apply fertilizer to your ${t(crop)} crop next week.`,
          timestamp: new Date(currentDate.getTime() - 24 * 60 * 60 * 1000).toISOString()
        }
      ]

      setAlerts(sampleAlerts)
    }

    generateAlerts()
  }, [language, farmData.currentCrop, t])

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'alert-error'
      case 'medium': return 'alert-warning'
      case 'low': return 'alert-info'
      default: return 'alert-info'
    }
  }

  const getPriorityText = (priority) => {
    switch (priority) {
      case 'high': return language === 'ml' ? 'അടിയന്തിരം' : 'Urgent'
      case 'medium': return language === 'ml' ? 'സാധാരണം' : 'Normal'
      case 'low': return language === 'ml' ? 'കുറഞ്ഞ പ്രാധാന്യം' : 'Low Priority'
      default: return language === 'ml' ? 'സാധാരണം' : 'Normal'
    }
  }

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60))
    
    if (diffInHours < 1) {
      return language === 'ml' ? 'ഇപ്പോൾ' : 'Just now'
    } else if (diffInHours < 24) {
      return language === 'ml' ? `${diffInHours} മണിക്കൂർ മുമ്പ്` : `${diffInHours} hours ago`
    } else {
      const diffInDays = Math.floor(diffInHours / 24)
      return language === 'ml' ? `${diffInDays} ദിവസം മുമ്പ്` : `${diffInDays} days ago`
    }
  }

  const markAsRead = (alertId) => {
    setAlerts(prevAlerts => 
      prevAlerts.map(alert => 
        alert.id === alertId ? { ...alert, read: true } : alert
      )
    )
  }

  const unreadCount = alerts.filter(alert => !alert.read).length

  return (
    <div className="container">
      <button 
        className="language-toggle"
        onClick={toggleLanguage}
      >
        {language === 'ml' ? 'English' : 'മലയാളം'}
      </button>

      <div style={{ paddingTop: '2rem', paddingBottom: '6rem' }}>
        {/* Header */}
        <div className="text-center mb-4 fade-in">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Bell size={24} className="text-primary" />
            {unreadCount > 0 && (
              <span className="bg-error text-white rounded-full px-2 py-1 text-sm font-bold">
                {unreadCount}
              </span>
            )}
          </div>
          <h1 className="font-bold text-primary mb-2" style={{ fontSize: '1.5rem' }}>
            {t('alerts')}
          </h1>
          <p className="text-gray">
            {language === 'ml' ? 
              'നിങ്ങളുടെ കൃഷിയുമായി ബന്ധപ്പെട്ട അറിയിപ്പുകൾ' : 
              'Notifications related to your farming'
            }
          </p>
        </div>

        {/* Alerts List */}
        <div className="space-y-3">
          {alerts.map((alert) => {
            const IconComponent = alert.icon
            return (
              <div 
                key={alert.id} 
                className={`card slide-up ${!alert.read ? 'border-l-4 border-primary' : ''}`}
                onClick={() => markAsRead(alert.id)}
                style={{ cursor: 'pointer' }}
              >
                <div className="flex items-start gap-3">
                  <div className={`flex-shrink-0 p-2 rounded-lg ${
                    alert.priority === 'high' ? 'bg-red-100' :
                    alert.priority === 'medium' ? 'bg-yellow-100' : 'bg-blue-100'
                  }`}>
                    <IconComponent 
                      size={20} 
                      className={
                        alert.priority === 'high' ? 'text-error' :
                        alert.priority === 'medium' ? 'text-warning' : 'text-info'
                      } 
                    />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold mb-0">
                        {alert.title}
                      </h3>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          alert.priority === 'high' ? 'bg-red-100 text-error' :
                          alert.priority === 'medium' ? 'bg-yellow-100 text-warning' : 'bg-blue-100 text-info'
                        }`}>
                          {getPriorityText(alert.priority)}
                        </span>
                        {!alert.read && (
                          <div className="w-2 h-2 bg-primary rounded-full"></div>
                        )}
                      </div>
                    </div>
                    
                    <p className="text-gray mb-2">
                      {alert.message}
                    </p>
                    
                    <p className="text-muted text-sm mb-0">
                      {formatTimestamp(alert.timestamp)}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Empty State */}
        {alerts.length === 0 && (
          <div className="text-center text-muted p-4">
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔔</div>
            <p>
              {language === 'ml' ? 
                'പുതിയ അറിയിപ്പുകൾ ഇല്ല' : 
                'No new alerts'
              }
            </p>
          </div>
        )}

        {/* Summary Card */}
        <div className="card mt-4 bg-light">
          <h3 className="font-semibold text-primary mb-3">
            {language === 'ml' ? 'ഇന്നത്തെ സംഗ്രഹം' : 'Today\'s Summary'}
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center p-3 bg-white rounded-lg">
              <div className="font-bold text-primary text-lg">
                {alerts.filter(a => a.priority === 'high').length}
              </div>
              <div className="text-sm text-muted">
                {language === 'ml' ? 'അടിയന്തിര' : 'Urgent'}
              </div>
            </div>
            <div className="text-center p-3 bg-white rounded-lg">
              <div className="font-bold text-warning text-lg">
                {alerts.filter(a => a.priority === 'medium').length}
              </div>
              <div className="text-sm text-muted">
                {language === 'ml' ? 'സാധാരണം' : 'Normal'}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card mt-4">
          <h3 className="font-semibold text-primary mb-3">
            {language === 'ml' ? 'വേഗത്തിലുള്ള പ്രവർത്തനങ്ങൾ' : 'Quick Actions'}
          </h3>
          <div className="flex gap-2 flex-wrap">
            <button className="btn btn-secondary flex-1">
              {language === 'ml' ? 'കാലാവസ്ഥ പരിശോധിക്കുക' : 'Check Weather'}
            </button>
            <button className="btn btn-secondary flex-1">
              {language === 'ml' ? 'വില പരിശോധിക്കുക' : 'Check Prices'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AlertsReminders