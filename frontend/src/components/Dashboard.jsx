import React from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import { useFarmData } from '../contexts/FarmDataContext'

const Dashboard = () => {
  const { language, toggleLanguage } = useLanguage()
  const { farmData } = useFarmData()

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
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-green-600 mb-2">
            {language === 'en' ? 'Dashboard' : 'ഡാഷ്‌ബോർഡ്'}
          </h1>
          {farmData && (
            <p className="text-gray-600">
              {farmData.name} • {farmData.location}
            </p>
          )}
        </div>

        {/* Weather Card */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold mb-1">
                {language === 'en' ? 'Weather' : 'കാലാവസ്ഥ'}
              </h3>
              <p className="text-gray-600 text-sm">
                {language === 'en' ? 'Partly cloudy' : 'ഭാഗികമായി മേഘാവൃതം'}
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-1">🌤️</div>
              <p className="font-bold">28°C</p>
            </div>
          </div>
          <div className="flex justify-between mt-3 pt-3 border-t border-gray-200">
            <span className="text-gray-500 text-sm">
              {language === 'en' ? 'Humidity' : 'ആർദ്രത'}: 75%
            </span>
          </div>
        </div>

        {/* Farm Overview */}
        {farmData && (
          <div className="bg-white rounded-lg shadow-md p-4 mb-4">
            <h3 className="font-semibold mb-3">
              {language === 'en' ? 'Farm Overview' : 'കൃഷിയിട വിവരണം'}
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-gray-500 text-sm">
                  {language === 'en' ? 'Current Crop' : 'നിലവിലെ വിള'}
                </p>
                <p className="font-medium">{farmData.currentCrop}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">
                  {language === 'en' ? 'Land Size' : 'ഭൂമിയുടെ വലിപ്പം'}
                </p>
                <p className="font-medium">{farmData.landSize} {farmData.landUnit}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">
                  {language === 'en' ? 'Soil Type' : 'മണ്ണിന്റെ തരം'}
                </p>
                <p className="font-medium">{farmData.soilType}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">
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

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <h3 className="font-semibold mb-3">
            {language === 'en' ? 'Quick Actions' : 'പെട്ടെന്നുള്ള പ്രവർത്തനങ്ങൾ'}
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <button className="bg-green-100 text-green-700 p-3 rounded-lg text-center">
              <div className="text-2xl mb-1">💬</div>
              <p className="text-sm font-medium">
                {language === 'en' ? 'Ask AI' : 'AI യോട് ചോദിക്കുക'}
              </p>
            </button>
            <button className="bg-blue-100 text-blue-700 p-3 rounded-lg text-center">
              <div className="text-2xl mb-1">📝</div>
              <p className="text-sm font-medium">
                {language === 'en' ? 'Log Activity' : 'പ്രവർത്തനം രേഖപ്പെടുത്തുക'}
              </p>
            </button>
            <button className="bg-yellow-100 text-yellow-700 p-3 rounded-lg text-center">
              <div className="text-2xl mb-1">💰</div>
              <p className="text-sm font-medium">
                {language === 'en' ? 'Market Prices' : 'വിപണി വില'}
              </p>
            </button>
            <button className="bg-red-100 text-red-700 p-3 rounded-lg text-center">
              <div className="text-2xl mb-1">🔔</div>
              <p className="text-sm font-medium">
                {language === 'en' ? 'Alerts' : 'മുന്നറിയിപ്പുകൾ'}
              </p>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard