import React from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import { useAuth } from '../contexts/AuthContext'
import { Navigate } from 'react-router-dom'

const AdminDashboard = () => {
  const { language, toggleLanguage } = useLanguage()
  const { user, isAdmin } = useAuth()

  // Redirect if not admin
  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <button 
        className="absolute top-4 right-4 bg-white border-2 border-gray-300 rounded-lg px-3 py-1 text-sm font-semibold shadow-md z-10"
        onClick={toggleLanguage}
      >
        {language === 'en' ? 'മലയാളം' : 'English'}
      </button>

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-green-600 mb-2">
          🏛️ {language === 'en' ? 'Admin Dashboard' : 'അഡ്മിൻ ഡാഷ്‌ബോർഡ്'}
        </h1>
        <p className="text-gray-600">
          {language === 'en' 
            ? 'Kerala Agriculture Department - Farmer Progress Monitor'
            : 'കേരള കൃഷി വകുപ്പ് - കർഷക പുരോഗതി നിരീക്ഷണം'
          }
        </p>
        <p className="text-gray-500 text-sm">
          {language === 'en' ? `Welcome, ${user?.name}` : `സ്വാഗതം, ${user?.name}`}
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-md p-4 text-center">
          <div className="text-3xl mb-2">👨‍🌾</div>
          <div className="font-bold text-green-600 text-xl">15,420</div>
          <p className="text-gray-500 text-sm">
            {language === 'en' ? 'Total Farmers' : 'മൊത്തം കർഷകർ'}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4 text-center">
          <div className="text-3xl mb-2">✅</div>
          <div className="font-bold text-green-600 text-xl">12,350</div>
          <p className="text-gray-500 text-sm">
            {language === 'en' ? 'Active Farmers' : 'സജീവ കർഷകർ'}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4 text-center">
          <div className="text-3xl mb-2">🌾</div>
          <div className="font-bold text-green-600 text-xl">45,680</div>
          <p className="text-gray-500 text-sm">
            {language === 'en' ? 'Hectares Covered' : 'ഹെക്ടർ പരിധി'}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4 text-center">
          <div className="text-3xl mb-2">📈</div>
          <div className="font-bold text-green-600 text-xl">12.5</div>
          <p className="text-gray-500 text-sm">
            {language === 'en' ? 'Avg Activities' : 'ശരാശരി പ്രവർത്തനങ്ങൾ'}
          </p>
        </div>
      </div>

      {/* Performance Indicators */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <h3 className="font-semibold mb-3">
          {language === 'en' ? 'Performance Indicators' : 'പ്രകടന സൂചകങ്ങൾ'}
        </h3>
        
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-1">
              <span>{language === 'en' ? 'Scheme Utilization' : 'പദ്ധതി ഉപയോഗം'}</span>
              <span className="font-semibold">78%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-600 h-2 rounded-full" style={{ width: '78%' }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <span>{language === 'en' ? 'Alert Response Rate' : 'മുന്നറിയിപ്പ് പ്രതികരണ നിരക്ക്'}</span>
              <span className="font-semibold">72%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: '72%' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard