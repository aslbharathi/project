import React, { useState, useEffect } from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import { useFarmData } from '../contexts/FarmDataContext'
import { farmService } from '../services/farmService'
import { formatTimeAgo } from '../utils/helpers'

const Dashboard = () => {
  const { language, toggleLanguage } = useLanguage()
  const { farmData } = useFarmData()
  const [recentActivities, setRecentActivities] = useState([])
  const [alerts, setAlerts] = useState([])
  const [weather, setWeather] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setIsLoading(true)
      
      // Load recent activities
      const activitiesData = await farmService.getActivities()
      setRecentActivities(Array.isArray(activitiesData) ? activitiesData.slice(0, 3) : [])
      
      // Load alerts
      const alertsData = await farmService.getAlerts()
      setAlerts(Array.isArray(alertsData) ? alertsData.slice(0, 3) : [])
      
      // Mock weather data
      setWeather({
        temperature: 28,
        condition: 'partly_cloudy',
        humidity: 75,
        description: language === 'en' ? 'Partly cloudy' : 'ഭാഗികമായി മേഘാവൃതം'
      })
    } catch (error) {
      console.error('Dashboard data loading error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getActivityIcon = (type) => {
    const icons = {
      sowedSeeds: '🌱',
      appliedFertilizer: '🌿',
      irrigated: '💧',
      pestDisease: '🐛',
      weeding: '🌿',
      harvested: '🌾'
    }
    return icons[type] || '📝'
  }

  const getActivityLabel = (type) => {
    const labels = {
      en: {
        sowedSeeds: 'Sowed Seeds',
        appliedFertilizer: 'Applied Fertilizer',
        irrigated: 'Irrigated',
        pestDisease: 'Pest/Disease',
        weeding: 'Weeding',
        harvested: 'Harvested'
      },
      ml: {
        sowedSeeds: 'വിത്ത് വിതച്ചു',
        appliedFertilizer: 'വളം ഇട്ടു',
        irrigated: 'നനച്ചു',
        pestDisease: 'കീടം/രോഗം',
        weeding: 'കളപറിച്ചു',
        harvested: 'വിളവെടുത്തു'
      }
    }
    return labels[language][type] || type
  }

  if (isLoading) {
    return (
      <div className="container flex items-center justify-center" style={{ minHeight: '100vh' }}>
        <div className="text-center">
          <div className="loading-spinner mb-3" />
          <p>{language === 'en' ? 'Loading dashboard...' : 'ഡാഷ്‌ബോർഡ് ലോഡ് ചെയ്യുന്നു...'}</p>
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
          {language === 'en' ? 'Dashboard' : 'ഡാഷ്‌ബോർഡ്'}
        </h1>
        {farmData && (
          <p className="text-gray">
            {farmData.name} • {farmData.location}
          </p>
        )}
      </div>

      {/* Weather Card */}
      {weather && (
        <div className="card mb-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold mb-1">
                {language === 'en' ? 'Weather' : 'കാലാവസ്ഥ'}
              </h3>
              <p className="text-gray" style={{ fontSize: '0.9rem' }}>
                {weather.description}
              </p>
            </div>
            <div className="text-center">
              <div style={{ fontSize: '2rem' }}>🌤️</div>
              <p className="font-bold">{weather.temperature}°C</p>
            </div>
          </div>
          <div className="flex justify-between mt-3 pt-3" style={{ borderTop: '1px solid var(--gray-200)' }}>
            <span className="text-muted" style={{ fontSize: '0.875rem' }}>
              {language === 'en' ? 'Humidity' : 'ആർദ്രത'}: {weather.humidity}%
            </span>
          </div>
        </div>
      )}

      {/* Farm Overview */}
      {farmData && (
        <div className="card mb-4">
          <h3 className="font-semibold mb-3">
            {language === 'en' ? 'Farm Overview' : 'കൃഷിയിട വിവരണം'}
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-muted" style={{ fontSize: '0.875rem' }}>
                {language === 'en' ? 'Current Crop' : 'നിലവിലെ വിള'}
              </p>
              <p className="font-medium">{farmData.currentCrop}</p>
            </div>
            <div>
              <p className="text-muted" style={{ fontSize: '0.875rem' }}>
                {language === 'en' ? 'Land Size' : 'ഭൂമിയുടെ വലിപ്പം'}
              </p>
              <p className="font-medium">{farmData.landSize} {farmData.landUnit}</p>
            </div>
            <div>
              <p className="text-muted" style={{ fontSize: '0.875rem' }}>
                {language === 'en' ? 'Soil Type' : 'മണ്ണിന്റെ തരം'}
              </p>
              <p className="font-medium">{farmData.soilType}</p>
            </div>
            <div>
              <p className="text-muted" style={{ fontSize: '0.875rem' }}>
                {language === 'en' ? 'Irrigation' : 'ജലസേചനം'}
              </p>
              <p className="font-medium">
                {farmData.irrigation 
                  ? (language === 'en' ? 'Available' : 'ലഭ്യമാണ്')
                  : (language === 'en' ? 'Not Available' : 'ലഭ്യമല്ല')
                }
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Recent Activities */}
      <div className="card mb-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold">
            {language === 'en' ? 'Recent Activities' : 'സമീപകാല പ്രവർത്തനങ്ങൾ'}
          </h3>
          <a href="/activity" className="text-primary" style={{ fontSize: '0.875rem' }}>
            {language === 'en' ? 'View All' : 'എല്ലാം കാണുക'}
          </a>
        </div>
        
        {recentActivities.length > 0 ? (
          <div className="space-y-3">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-center gap-3 p-2 rounded" style={{ backgroundColor: 'var(--gray-50)' }}>
                <span style={{ fontSize: '1.5rem' }}>{getActivityIcon(activity.type)}</span>
                <div className="flex-1">
                  <p className="font-medium" style={{ fontSize: '0.9rem' }}>
                    {getActivityLabel(activity.type)}
                  </p>
                  <p className="text-muted" style={{ fontSize: '0.8rem' }}>
                    {formatTimeAgo(activity.timestamp || activity.createdAt, language)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted text-center py-4">
            {language === 'en' ? 'No recent activities' : 'സമീപകാല പ്രവർത്തനങ്ങളൊന്നുമില്ല'}
          </p>
        )}
      </div>

      {/* Alerts */}
      <div className="card">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold">
            {language === 'en' ? 'Alerts' : 'മുന്നറിയിപ്പുകൾ'}
          </h3>
          <a href="/alerts" className="text-primary" style={{ fontSize: '0.875rem' }}>
            {language === 'en' ? 'View All' : 'എല്ലാം കാണുക'}
          </a>
        </div>
        
        {alerts.length > 0 ? (
          <div className="space-y-3">
            {alerts.map((alert, index) => (
              <div key={index} className={`alert alert-${alert.priority === 'high' ? 'warning' : 'info'}`}>
                <div className="flex items-start gap-2">
                  <span style={{ fontSize: '1.2rem' }}>
                    {alert.type === 'weather' ? '🌤️' : 
                     alert.type === 'pest' ? '🐛' : 
                     alert.type === 'price' ? '💰' : '📢'}
                  </span>
                  <div className="flex-1">
                    <p className="font-medium" style={{ fontSize: '0.9rem' }}>
                      {alert.title}
                    </p>
                    <p style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>
                      {alert.message}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted text-center py-4">
            {language === 'en' ? 'No alerts' : 'മുന്നറിയിപ്പുകളൊന്നുമില്ല'}
          </p>
        )}
      </div>
    </div>
  )
}

export default Dashboard