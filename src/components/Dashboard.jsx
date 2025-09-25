import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import { useFarmData } from '../contexts/FarmDataContext'
import { Mic, Plus, Bell, Sun, Cloud, CloudRain } from 'lucide-react'

const Dashboard = () => {
  const { language, toggleLanguage, t } = useLanguage()
  const { farmData, activities } = useFarmData()
  const [greeting, setGreeting] = useState('')
  const [todayWeather, setTodayWeather] = useState('sunny')

  useEffect(() => {
    const hour = new Date().getHours()
    if (hour < 12) {
      setGreeting(t('goodMorning'))
    } else if (hour < 17) {
      setGreeting(t('goodAfternoon'))
    } else {
      setGreeting(t('goodEvening'))
    }

    // Simulate weather data
    const weatherOptions = ['sunny', 'cloudy', 'rainy']
    setTodayWeather(weatherOptions[Math.floor(Math.random() * weatherOptions.length)])
  }, [language, t])

  const getWeatherIcon = () => {
    switch (todayWeather) {
      case 'sunny': return <Sun size={24} className="text-warning" />
      case 'cloudy': return <Cloud size={24} className="text-gray" />
      case 'rainy': return <CloudRain size={24} className="text-info" />
      default: return <Sun size={24} className="text-warning" />
    }
  }

  const getTodayReminder = () => {
    const crop = farmData.currentCrop
    const reminders = {
      ml: {
        paddy: `ഇന്ന് നിങ്ങളുടെ ${t(crop)} വിളയ്ക്ക് ജലം നൽകാൻ സമയമായി.`,
        coconut: `നിങ്ങളുടെ ${t(crop)} തോട്ടത്തിൽ കളപറിക്കാൻ സമയമായി.`,
        brinjal: `${t(crop)} ചെടികളിൽ കീടങ്ങൾ ഉണ്ടോ എന്ന് പരിശോധിക്കുക.`,
        default: `നിങ്ങളുടെ ${t(crop)} വിളയുടെ പരിചരണം ചെയ്യുക.`
      },
      en: {
        paddy: `Time to water your ${t(crop)} crop today.`,
        coconut: `Time to weed your ${t(crop)} plantation.`,
        brinjal: `Check your ${t(crop)} plants for pests.`,
        default: `Take care of your ${t(crop)} crop.`
      }
    }
    
    return reminders[language][crop] || reminders[language].default
  }

  const recentActivities = activities.slice(0, 3)

  return (
    <div className="container">
      <button 
        className="language-toggle"
        onClick={toggleLanguage}
      >
        {language === 'ml' ? 'English' : 'മലയാളം'}
      </button>

      <div style={{ paddingTop: '2rem', paddingBottom: '6rem' }}>
        {/* Greeting Section */}
        <div className="card-header mb-4 fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold mb-1">
                {greeting}, {farmData.name}!
              </h2>
              <p className="mb-0" style={{ opacity: 0.9 }}>
                {farmData.location} • {farmData.landSize} {t(farmData.landUnit)}
              </p>
            </div>
            {getWeatherIcon()}
          </div>
        </div>

        {/* Today's Reminder */}
        <div className="card mb-4 slide-up">
          <div className="flex items-center gap-3 mb-3">
            <div style={{ fontSize: '1.5rem' }}>📅</div>
            <h3 className="font-semibold text-primary mb-0">
              {t('todayReminder')}
            </h3>
          </div>
          <p className="text-gray mb-0">
            {getTodayReminder()}
          </p>
        </div>

        {/* Quick Actions */}
        <div className="mb-4">
          <div className="flex items-center justify-center mb-4">
            <Link to="/chat" className="btn-voice">
              <Mic size={24} />
            </Link>
          </div>
          <p className="text-center text-muted mb-4">
            {t('whatToDo')}
          </p>
          
          <div className="flex gap-3">
            <Link to="/activity" className="btn btn-secondary flex-1">
              <Plus size={18} />
              {t('logActivity')}
            </Link>
            <Link to="/alerts" className="btn btn-secondary flex-1">
              <Bell size={18} />
              {t('alerts')}
            </Link>
          </div>
        </div>

        {/* Recent Activities */}
        {recentActivities.length > 0 && (
          <div className="card slide-up">
            <h3 className="font-semibold text-primary mb-3">
              {language === 'ml' ? 'സമീപകാല പ്രവർത്തനങ്ങൾ' : 'Recent Activities'}
            </h3>
            <div className="space-y-3">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center gap-3 p-3 bg-light rounded-lg">
                  <div style={{ fontSize: '1.25rem' }}>
                    {activity.type === 'sowedSeeds' && '🌱'}
                    {activity.type === 'appliedFertilizer' && '🌿'}
                    {activity.type === 'irrigated' && '💧'}
                    {activity.type === 'pestDisease' && '🐛'}
                    {activity.type === 'harvested' && '🌾'}
                    {activity.type === 'weeding' && '🌿'}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium mb-0">{t(activity.type)}</p>
                    <p className="text-muted text-sm mb-0">
                      {new Date(activity.timestamp).toLocaleDateString(language === 'ml' ? 'ml-IN' : 'en-IN')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <Link to="/activity" className="btn btn-secondary w-full mt-3">
              {language === 'ml' ? 'എല്ലാം കാണുക' : 'View All'}
            </Link>
          </div>
        )}

        {/* Weather Alert */}
        <div className="alert alert-warning mt-4">
          <div className="flex items-center gap-2">
            <CloudRain size={20} />
            <strong>{language === 'ml' ? 'കാലാവസ്ഥ മുന്നറിയിപ്പ്:' : 'Weather Alert:'}</strong>
          </div>
          <p className="mb-0 mt-1">
            {t('weatherAlert')}
          </p>
        </div>

        {/* Offline Indicator */}
        <div className="text-center mt-4">
          <p className="text-muted" style={{ fontSize: '0.875rem' }}>
            {t('canLogOffline')}
          </p>
        </div>
      </div>
    </div>
  )
}

export default Dashboard