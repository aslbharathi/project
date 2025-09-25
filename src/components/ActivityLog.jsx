import React, { useState } from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import { useFarmData } from '../contexts/FarmDataContext'
import { Plus, Calendar, Droplets, Sprout, Bug, Scissors, Wheat } from 'lucide-react'

const ActivityLog = () => {
  const { language, toggleLanguage, t } = useLanguage()
  const { farmData, activities, addActivity } = useFarmData()
  const [selectedActivity, setSelectedActivity] = useState('')
  const [notes, setNotes] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const activityTypes = [
    { id: 'sowedSeeds', icon: '🌱', component: Sprout },
    { id: 'appliedFertilizer', icon: '🌿', component: Droplets },
    { id: 'irrigated', icon: '💧', component: Droplets },
    { id: 'pestDisease', icon: '🐛', component: Bug },
    { id: 'weeding', icon: '🌿', component: Scissors },
    { id: 'harvested', icon: '🌾', component: Wheat }
  ]

  const handleActivitySelect = (activityId) => {
    setSelectedActivity(activityId)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!selectedActivity) {
      alert(language === 'ml' ? 'പ്രവർത്തനം തിരഞ്ഞെടുക്കുക' : 'Please select an activity')
      return
    }

    setIsLoading(true)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))

    addActivity({
      type: selectedActivity,
      crop: farmData.currentCrop,
      notes: notes.trim(),
      location: farmData.location
    })

    // Reset form
    setSelectedActivity('')
    setNotes('')
    setIsLoading(false)

    // Show success message
    alert(language === 'ml' ? 'പ്രവർത്തനം സേവ് ചെയ്തു' : 'Activity saved successfully')
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString(language === 'ml' ? 'ml-IN' : 'en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

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
          <h1 className="font-bold text-primary mb-2" style={{ fontSize: '1.5rem' }}>
            {t('logActivity')}
          </h1>
          <p className="text-gray">
            {language === 'ml' ? 'ഇന്നത്തെ കൃഷി പ്രവർത്തനങ്ങൾ രേഖപ്പെടുത്തുക' : 'Record today\'s farming activities'}
          </p>
        </div>

        {/* Activity Selection */}
        <div className="card mb-4 slide-up">
          <h3 className="font-semibold text-primary mb-3">
            {language === 'ml' ? 'പ്രവർത്തനം തിരഞ്ഞെടുക്കുക' : 'Select Activity'}
          </h3>
          
          <div className="activity-grid">
            {activityTypes.map((activity) => {
              const IconComponent = activity.component
              return (
                <button
                  key={activity.id}
                  type="button"
                  className={`activity-btn ${selectedActivity === activity.id ? 'selected' : ''}`}
                  onClick={() => handleActivitySelect(activity.id)}
                >
                  <div className="activity-icon">
                    <IconComponent size={32} />
                  </div>
                  <span className="activity-label">
                    {t(activity.id)}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Notes Section */}
        {selectedActivity && (
          <div className="card mb-4 slide-up">
            <h3 className="font-semibold text-primary mb-3">
              {language === 'ml' ? 'കുറിപ്പുകൾ (ഓപ്ഷണൽ)' : 'Notes (Optional)'}
            </h3>
            <textarea
              className="form-input"
              rows="3"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={language === 'ml' ? 
                'കൂടുതൽ വിവരങ്ങൾ ചേർക്കുക...' : 
                'Add additional details...'
              }
            />
          </div>
        )}

        {/* Submit Button */}
        {selectedActivity && (
          <button
            onClick={handleSubmit}
            className="btn btn-primary w-full mb-4"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="loading-spinner" />
                {t('loading')}
              </>
            ) : (
              <>
                <Plus size={20} />
                {language === 'ml' ? 'പ്രവർത്തനം സേവ് ചെയ്യുക' : 'Save Activity'}
              </>
            )}
          </button>
        )}

        {/* Recent Activities */}
        <div className="card slide-up">
          <div className="flex items-center gap-2 mb-3">
            <Calendar size={20} className="text-primary" />
            <h3 className="font-semibold text-primary mb-0">
              {language === 'ml' ? 'സമീപകാല പ്രവർത്തനങ്ങൾ' : 'Recent Activities'}
            </h3>
          </div>
          
          {activities.length === 0 ? (
            <div className="text-center text-muted p-4">
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📝</div>
              <p>
                {language === 'ml' ? 
                  'ഇതുവരെ പ്രവർത്തനങ്ങൾ രേഖപ്പെടുത്തിയിട്ടില്ല' : 
                  'No activities recorded yet'
                }
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {activities.slice(0, 10).map((activity) => {
                const activityType = activityTypes.find(type => type.id === activity.type)
                const IconComponent = activityType?.component || Sprout
                
                return (
                  <div key={activity.id} className="flex items-start gap-3 p-3 bg-light rounded-lg">
                    <div className="flex-shrink-0">
                      <IconComponent size={20} className="text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium mb-0">
                          {t(activity.type)}
                        </h4>
                        <span className="text-muted text-sm">
                          {formatDate(activity.timestamp)}
                        </span>
                      </div>
                      <p className="text-muted text-sm mb-1">
                        {t(activity.crop)} • {activity.location}
                      </p>
                      {activity.notes && (
                        <p className="text-gray text-sm mb-0">
                          {activity.notes}
                        </p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
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

export default ActivityLog