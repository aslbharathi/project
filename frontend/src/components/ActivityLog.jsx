import React, { useState } from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import { useFarmData } from '../contexts/FarmDataContext'

const ACTIVITY_TYPES = [
  { id: 'sowedSeeds', icon: '🌱' },
  { id: 'appliedFertilizer', icon: '🌿' },
  { id: 'irrigated', icon: '💧' },
  { id: 'pestDisease', icon: '🐛' },
  { id: 'weeding', icon: '🌿' },
  { id: 'harvested', icon: '🌾' }
]

const ActivityLog = () => {
  const { language, toggleLanguage } = useLanguage()
  const { activities, addActivity } = useFarmData()
  const [showAddForm, setShowAddForm] = useState(false)
  const [newActivity, setNewActivity] = useState({
    type: '',
    crop: '',
    notes: '',
    location: ''
  })

  const handleAddActivity = async (e) => {
    e.preventDefault()
    
    if (!newActivity.type || !newActivity.crop || !newActivity.location) {
      return
    }

    try {
      await addActivity(newActivity)
      setNewActivity({ type: '', crop: '', notes: '', location: '' })
      setShowAddForm(false)
    } catch (error) {
      console.error('Failed to add activity:', error)
    }
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

  const getActivityIcon = (type) => {
    const activity = ACTIVITY_TYPES.find(a => a.id === type)
    return activity ? activity.icon : '📝'
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
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-green-600">
            {language === 'en' ? 'Activity Log' : 'പ്രവർത്തന രേഖ'}
          </h1>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors"
          >
            {showAddForm ? '✕' : '+'}
          </button>
        </div>

        {/* Add Activity Form */}
        {showAddForm && (
          <div className="bg-white rounded-lg shadow-md p-4 mb-4">
            <h3 className="font-semibold mb-3">
              {language === 'en' ? 'Add New Activity' : 'പുതിയ പ്രവർത്തനം ചേർക്കുക'}
            </h3>
            
            <form onSubmit={handleAddActivity} className="space-y-3">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  {language === 'en' ? 'Activity Type' : 'പ്രവർത്തന തരം'}
                </label>
                <select
                  value={newActivity.type}
                  onChange={(e) => setNewActivity(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
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

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  {language === 'en' ? 'Crop' : 'വിള'}
                </label>
                <input
                  type="text"
                  value={newActivity.crop}
                  onChange={(e) => setNewActivity(prev => ({ ...prev, crop: e.target.value }))}
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
                  placeholder={language === 'en' ? 'Enter crop name' : 'വിളയുടെ പേര് നൽകുക'}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  {language === 'en' ? 'Location' : 'സ്ഥലം'}
                </label>
                <input
                  type="text"
                  value={newActivity.location}
                  onChange={(e) => setNewActivity(prev => ({ ...prev, location: e.target.value }))}
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
                  placeholder={language === 'en' ? 'Field location' : 'വയലിന്റെ സ്ഥലം'}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  {language === 'en' ? 'Notes (Optional)' : 'കുറിപ്പുകൾ (ഓപ്ഷണൽ)'}
                </label>
                <textarea
                  value={newActivity.notes}
                  onChange={(e) => setNewActivity(prev => ({ ...prev, notes: e.target.value }))}
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
                  rows="3"
                  placeholder={language === 'en' ? 'Additional details...' : 'അധിക വിവരങ്ങൾ...'}
                />
              </div>

              <button type="submit" className="w-full bg-green-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-green-700 transition-colors">
                {language === 'en' ? 'Add Activity' : 'പ്രവർത്തനം ചേർക്കുക'}
              </button>
            </form>
          </div>
        )}

        {/* Activities List */}
        <div className="space-y-3">
          {activities.length > 0 ? (
            activities.map((activity, index) => (
              <div key={activity.id || index} className="bg-white rounded-lg shadow-md p-4">
                <div className="flex items-start space-x-3">
                  <span className="text-2xl">{getActivityIcon(activity.type)}</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold">{getActivityLabel(activity.type)}</h3>
                      <span className="text-gray-500 text-sm">
                        {new Date(activity.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <div className="mb-2">
                      <p className="text-gray-600 text-sm">
                        <strong>{language === 'en' ? 'Crop:' : 'വിള:'}</strong> {activity.crop}
                      </p>
                      <p className="text-gray-600 text-sm">
                        <strong>{language === 'en' ? 'Location:' : 'സ്ഥലം:'}</strong> {activity.location}
                      </p>
                    </div>
                    
                    {activity.notes && (
                      <p className="text-gray-600 text-sm italic">{activity.notes}</p>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">📝</div>
              <h3 className="font-semibold mb-2">
                {language === 'en' ? 'No Activities Yet' : 'ഇതുവരെ പ്രവർത്തനങ്ങളൊന്നുമില്ല'}
              </h3>
              <p className="text-gray-600 mb-4">
                {language === 'en' 
                  ? 'Start logging your farming activities to track your progress'
                  : 'നിങ്ങളുടെ പുരോഗതി ട്രാക്ക് ചെയ്യാൻ കൃഷി പ്രവർത്തനങ്ങൾ രേഖപ്പെടുത്താൻ തുടങ്ങുക'
                }
              </p>
              <button
                onClick={() => setShowAddForm(true)}
                className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors"
              >
                {language === 'en' ? 'Add First Activity' : 'ആദ്യ പ്രവർത്തനം ചേർക്കുക'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ActivityLog