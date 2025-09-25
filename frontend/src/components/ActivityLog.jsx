import React, { useState, useEffect } from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import { farmService } from '../services/farmService'
import { ACTIVITY_TYPES } from '../utils/constants'
import { formatTimeAgo } from '../utils/helpers'

const ActivityLog = () => {
  const { language, toggleLanguage } = useLanguage()
  const [activities, setActivities] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newActivity, setNewActivity] = useState({
    type: '',
    crop: '',
    notes: '',
    location: ''
  })

  useEffect(() => {
    loadActivities()
  }, [])

  const loadActivities = async () => {
    try {
      setIsLoading(true)
      const data = await farmService.getActivities()
      setActivities(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Failed to load activities:', error)
      setActivities([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddActivity = async (e) => {
    e.preventDefault()
    
    if (!newActivity.type || !newActivity.crop || !newActivity.location) {
      return
    }

    try {
      await farmService.addActivity(newActivity)
      setNewActivity({ type: '', crop: '', notes: '', location: '' })
      setShowAddForm(false)
      loadActivities()
    } catch (error) {
      console.error('Failed to add activity:', error)
    }
  }

  const getActivityIcon = (type) => {
    const activity = ACTIVITY_TYPES.find(a => a.id === type)
    return activity ? activity.icon : '📝'
  }

  const getActivityLabel = (type) => {
    const labels = {
      en: {
        sowedSeeds: 'Sowed Seeds',
        appliedFertilizer: 'Applied Fertilizer',
        irrigated: 'Irrigated',
        pestDisease: 'Pest/Disease Treatment',
        weeding: 'Weeding',
        harvested: 'Harvested'
      },
      ml: {
        sowedSeeds: 'വിത്ത് വിതച്ചു',
        appliedFertilizer: 'വളം ഇട്ടു',
        irrigated: 'നനച്ചു',
        pestDisease: 'കീടം/രോഗ ചികിത്സ',
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
          <p>{language === 'en' ? 'Loading activities...' : 'പ്രവർത്തനങ്ങൾ ലോഡ് ചെയ്യുന്നു...'}</p>
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
      <div className="flex items-center justify-between mb-4">
        <h1 className="font-bold text-primary" style={{ fontSize: '1.5rem' }}>
          {language === 'en' ? 'Activity Log' : 'പ്രവർത്തന രേഖ'}
        </h1>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="btn btn-primary"
          style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}
        >
          {showAddForm ? '✕' : '+'}
        </button>
      </div>

      {/* Add Activity Form */}
      {showAddForm && (
        <div className="card mb-4">
          <h3 className="font-semibold mb-3">
            {language === 'en' ? 'Add New Activity' : 'പുതിയ പ്രവർത്തനം ചേർക്കുക'}
          </h3>
          
          <form onSubmit={handleAddActivity} className="space-y-3">
            <div className="form-group">
              <label className="form-label">
                {language === 'en' ? 'Activity Type' : 'പ്രവർത്തന തരം'}
              </label>
              <select
                value={newActivity.type}
                onChange={(e) => setNewActivity(prev => ({ ...prev, type: e.target.value }))}
                className="form-input form-select"
                required
              >
                <option value="">{language === 'en' ? 'Select activity' : 'പ്രവർത്തനം തിരഞ്ഞെടുക്കുക'}</option>
                {ACTIVITY_TYPES.map(activity => (
                  <option key={activity.id} value={activity.id}>
                    {activity.icon} {getActivityLabel(activity.id)}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">
                {language === 'en' ? 'Crop' : 'വിള'}
              </label>
              <input
                type="text"
                value={newActivity.crop}
                onChange={(e) => setNewActivity(prev => ({ ...prev, crop: e.target.value }))}
                className="form-input"
                placeholder={language === 'en' ? 'Enter crop name' : 'വിളയുടെ പേര് നൽകുക'}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                {language === 'en' ? 'Location' : 'സ്ഥലം'}
              </label>
              <input
                type="text"
                value={newActivity.location}
                onChange={(e) => setNewActivity(prev => ({ ...prev, location: e.target.value }))}
                className="form-input"
                placeholder={language === 'en' ? 'Field location' : 'വയലിന്റെ സ്ഥലം'}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                {language === 'en' ? 'Notes (Optional)' : 'കുറിപ്പുകൾ (ഓപ്ഷണൽ)'}
              </label>
              <textarea
                value={newActivity.notes}
                onChange={(e) => setNewActivity(prev => ({ ...prev, notes: e.target.value }))}
                className="form-input"
                rows="3"
                placeholder={language === 'en' ? 'Additional details...' : 'അധിക വിവരങ്ങൾ...'}
              />
            </div>

            <button type="submit" className="btn btn-primary w-full">
              {language === 'en' ? 'Add Activity' : 'പ്രവർത്തനം ചേർക്കുക'}
            </button>
          </form>
        </div>
      )}

      {/* Activities List */}
      <div className="space-y-3">
        {activities.length > 0 ? (
          activities.map((activity, index) => (
            <div key={activity.id || index} className="card">
              <div className="flex items-start gap-3">
                <span style={{ fontSize: '1.5rem', flexShrink: 0 }}>
                  {getActivityIcon(activity.type)}
                </span>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold">
                      {getActivityLabel(activity.type)}
                    </h3>
                    <span className="text-muted" style={{ fontSize: '0.8rem' }}>
                      {formatTimeAgo(activity.timestamp || activity.createdAt, language)}
                    </span>
                  </div>
                  
                  <div className="mb-2">
                    <p className="text-gray" style={{ fontSize: '0.9rem' }}>
                      <strong>{language === 'en' ? 'Crop:' : 'വിള:'}</strong> {activity.crop}
                    </p>
                    <p className="text-gray" style={{ fontSize: '0.9rem' }}>
                      <strong>{language === 'en' ? 'Location:' : 'സ്ഥലം:'}</strong> {activity.location}
                    </p>
                  </div>
                  
                  {activity.notes && (
                    <p className="text-gray" style={{ fontSize: '0.85rem', fontStyle: 'italic' }}>
                      {activity.notes}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📝</div>
            <h3 className="font-semibold mb-2">
              {language === 'en' ? 'No Activities Yet' : 'ഇതുവരെ പ്രവർത്തനങ്ങളൊന്നുമില്ല'}
            </h3>
            <p className="text-gray mb-4">
              {language === 'en' 
                ? 'Start logging your farming activities to track your progress'
                : 'നിങ്ങളുടെ പുരോഗതി ട്രാക്ക് ചെയ്യാൻ കൃഷി പ്രവർത്തനങ്ങൾ രേഖപ്പെടുത്താൻ തുടങ്ങുക'
              }
            </p>
            <button
              onClick={() => setShowAddForm(true)}
              className="btn btn-primary"
            >
              {language === 'en' ? 'Add First Activity' : 'ആദ്യ പ്രവർത്തനം ചേർക്കുക'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default ActivityLog