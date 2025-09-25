import React, { useState, useEffect } from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import { useAuth } from '../contexts/AuthContext'
import { Navigate } from 'react-router-dom'

const AdminDashboard = () => {
  const { language, toggleLanguage } = useLanguage()
  const { user, isAdmin } = useAuth()
  const [activeTab, setActiveTab] = useState('overview')
  const [dashboardData, setDashboardData] = useState({
    farmers: [],
    schemes: [],
    alerts: [],
    analytics: {}
  })
  const [isLoading, setIsLoading] = useState(true)

  // Redirect if not admin
  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />
  }

  useEffect(() => {
    loadAdminData()
  }, [])

  const loadAdminData = async () => {
    try {
      setIsLoading(true)
      
      // Mock admin data
      const mockData = {
        farmers: [
          {
            id: 1,
            name: 'രാജേഷ് കുമാർ',
            mobile: '9876543210',
            district: 'Thrissur',
            crop: 'coconut',
            landSize: 2.5,
            lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            activitiesCount: 15,
            schemesApplied: 2,
            status: 'active'
          },
          {
            id: 2,
            name: 'സുനിത ദേവി',
            mobile: '9876543211',
            district: 'Palakkad',
            crop: 'paddy',
            landSize: 1.8,
            lastActive: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
            activitiesCount: 8,
            schemesApplied: 1,
            status: 'active'
          },
          {
            id: 3,
            name: 'മുരളി നായർ',
            mobile: '9876543212',
            district: 'Kochi',
            crop: 'pepper',
            landSize: 0.75,
            lastActive: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            activitiesCount: 3,
            schemesApplied: 0,
            status: 'inactive'
          }
        ],
        schemes: [
          {
            id: 1,
            name: 'PM-KISAN',
            applications: 1250,
            approved: 1100,
            pending: 150,
            budget: 50000000,
            utilized: 42000000
          },
          {
            id: 2,
            name: 'Kerala Farmer Assistance',
            applications: 850,
            approved: 720,
            pending: 130,
            budget: 25000000,
            utilized: 18000000
          }
        ],
        alerts: [
          {
            id: 1,
            type: 'weather',
            message: 'Heavy rain alert sent to 2,500 farmers in Thrissur',
            timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
            reach: 2500,
            responses: 1800
          },
          {
            id: 2,
            type: 'pest',
            message: 'Brown plant hopper alert for paddy farmers',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            reach: 1200,
            responses: 950
          }
        ],
        analytics: {
          totalFarmers: 15420,
          activeFarmers: 12350,
          totalLandArea: 45680, // in hectares
          averageActivityPerFarmer: 12.5,
          schemeUtilization: 78,
          alertResponseRate: 72
        }
      }
      
      setDashboardData(mockData)
    } catch (error) {
      console.error('Failed to load admin data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'var(--success)'
      case 'inactive': return 'var(--error)'
      default: return 'var(--gray-500)'
    }
  }

  if (isLoading) {
    return (
      <div className="container flex items-center justify-center" style={{ minHeight: '100vh' }}>
        <div className="text-center">
          <div className="loading-spinner mb-3" />
          <p>{language === 'en' ? 'Loading admin dashboard...' : 'അഡ്മിൻ ഡാഷ്‌ബോർഡ് ലോഡ് ചെയ്യുന്നു...'}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container" style={{ paddingBottom: '2rem', paddingTop: '1rem' }}>
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
          🏛️ {language === 'en' ? 'Admin Dashboard' : 'അഡ്മിൻ ഡാഷ്‌ബോർഡ്'}
        </h1>
        <p className="text-gray">
          {language === 'en' 
            ? 'Kerala Agriculture Department - Farmer Progress Monitor'
            : 'കേരള കൃഷി വകുപ്പ് - കർഷക പുരോഗതി നിരീക്ഷണം'
          }
        </p>
        <p className="text-muted" style={{ fontSize: '0.875rem' }}>
          {language === 'en' ? `Welcome, ${user?.name}` : `സ്വാഗതം, ${user?.name}`}
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 mb-4" style={{ overflowX: 'auto' }}>
        {[
          { key: 'overview', label: language === 'en' ? 'Overview' : 'അവലോകനം', icon: '📊' },
          { key: 'farmers', label: language === 'en' ? 'Farmers' : 'കർഷകർ', icon: '👨‍🌾' },
          { key: 'schemes', label: language === 'en' ? 'Schemes' : 'പദ്ധതികൾ', icon: '🏛️' },
          { key: 'alerts', label: language === 'en' ? 'Alerts' : 'മുന്നറിയിപ്പുകൾ', icon: '🔔' }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`btn ${activeTab === tab.key ? 'btn-primary' : 'btn-secondary'}`}
            style={{ 
              padding: '0.5rem 1rem', 
              fontSize: '0.875rem',
              whiteSpace: 'nowrap',
              flexShrink: 0
            }}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-4">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 gap-3">
            <div className="card text-center">
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>👨‍🌾</div>
              <div className="font-bold text-primary" style={{ fontSize: '1.5rem' }}>
                {dashboardData.analytics.totalFarmers.toLocaleString()}
              </div>
              <p className="text-muted" style={{ fontSize: '0.875rem' }}>
                {language === 'en' ? 'Total Farmers' : 'മൊത്തം കർഷകർ'}
              </p>
            </div>

            <div className="card text-center">
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>✅</div>
              <div className="font-bold text-success" style={{ fontSize: '1.5rem' }}>
                {dashboardData.analytics.activeFarmers.toLocaleString()}
              </div>
              <p className="text-muted" style={{ fontSize: '0.875rem' }}>
                {language === 'en' ? 'Active Farmers' : 'സജീവ കർഷകർ'}
              </p>
            </div>

            <div className="card text-center">
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🌾</div>
              <div className="font-bold text-primary" style={{ fontSize: '1.5rem' }}>
                {dashboardData.analytics.totalLandArea.toLocaleString()}
              </div>
              <p className="text-muted" style={{ fontSize: '0.875rem' }}>
                {language === 'en' ? 'Hectares Covered' : 'ഹെക്ടർ പരിധി'}
              </p>
            </div>

            <div className="card text-center">
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📈</div>
              <div className="font-bold text-warning" style={{ fontSize: '1.5rem' }}>
                {dashboardData.analytics.averageActivityPerFarmer}
              </div>
              <p className="text-muted" style={{ fontSize: '0.875rem' }}>
                {language === 'en' ? 'Avg Activities' : 'ശരാശരി പ്രവർത്തനങ്ങൾ'}
              </p>
            </div>
          </div>

          {/* Performance Indicators */}
          <div className="card">
            <h3 className="font-semibold mb-3">
              {language === 'en' ? 'Performance Indicators' : 'പ്രകടന സൂചകങ്ങൾ'}
            </h3>
            
            <div className="space-y-3">
              <div>
                <div className="flex justify-between mb-1">
                  <span>{language === 'en' ? 'Scheme Utilization' : 'പദ്ധതി ഉപയോഗം'}</span>
                  <span className="font-semibold">{dashboardData.analytics.schemeUtilization}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full" 
                    style={{ width: `${dashboardData.analytics.schemeUtilization}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span>{language === 'en' ? 'Alert Response Rate' : 'മുന്നറിയിപ്പ് പ്രതികരണ നിരക്ക്'}</span>
                  <span className="font-semibold">{dashboardData.analytics.alertResponseRate}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-success h-2 rounded-full" 
                    style={{ width: `${dashboardData.analytics.alertResponseRate}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Farmers Tab */}
      {activeTab === 'farmers' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">
              {language === 'en' ? 'Farmer Progress' : 'കർഷക പുരോഗതി'}
            </h2>
            <span className="text-muted" style={{ fontSize: '0.875rem' }}>
              {dashboardData.farmers.length} {language === 'en' ? 'farmers shown' : 'കർഷകർ കാണിച്ചിരിക്കുന്നു'}
            </span>
          </div>

          {dashboardData.farmers.map((farmer) => (
            <div key={farmer.id} className="card">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold">{farmer.name}</h3>
                    <span 
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: getStatusColor(farmer.status) }}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                    <p>📱 {farmer.mobile}</p>
                    <p>📍 {farmer.district}</p>
                    <p>🌾 {farmer.crop}</p>
                    <p>🏞️ {farmer.landSize} hectares</p>
                  </div>
                  
                  <div className="flex items-center gap-4 mt-2 text-xs text-muted">
                    <span>📝 {farmer.activitiesCount} activities</span>
                    <span>🏛️ {farmer.schemesApplied} schemes</span>
                    <span>🕒 Last active: {new Date(farmer.lastActive).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Schemes Tab */}
      {activeTab === 'schemes' && (
        <div className="space-y-3">
          <h2 className="font-semibold">
            {language === 'en' ? 'Government Schemes Analytics' : 'സർക്കാർ പദ്ധതി വിശകലനം'}
          </h2>

          {dashboardData.schemes.map((scheme) => (
            <div key={scheme.id} className="card">
              <h3 className="font-semibold mb-3">{scheme.name}</h3>
              
              <div className="grid grid-cols-2 gap-4 mb-3">
                <div>
                  <p className="text-muted" style={{ fontSize: '0.875rem' }}>
                    {language === 'en' ? 'Applications' : 'അപേക്ഷകൾ'}
                  </p>
                  <p className="font-bold text-primary">{scheme.applications}</p>
                </div>
                <div>
                  <p className="text-muted" style={{ fontSize: '0.875rem' }}>
                    {language === 'en' ? 'Approved' : 'അനുമതി നൽകിയത്'}
                  </p>
                  <p className="font-bold text-success">{scheme.approved}</p>
                </div>
                <div>
                  <p className="text-muted" style={{ fontSize: '0.875rem' }}>
                    {language === 'en' ? 'Pending' : 'തീർപ്പാക്കാത്തത്'}
                  </p>
                  <p className="font-bold text-warning">{scheme.pending}</p>
                </div>
                <div>
                  <p className="text-muted" style={{ fontSize: '0.875rem' }}>
                    {language === 'en' ? 'Success Rate' : 'വിജയ നിരക്ക്'}
                  </p>
                  <p className="font-bold text-primary">
                    {Math.round((scheme.approved / scheme.applications) * 100)}%
                  </p>
                </div>
              </div>

              <div className="border-t pt-3">
                <div className="flex justify-between mb-1">
                  <span className="text-muted" style={{ fontSize: '0.875rem' }}>
                    {language === 'en' ? 'Budget Utilization' : 'ബജറ്റ് ഉപയോഗം'}
                  </span>
                  <span className="font-semibold">
                    {formatCurrency(scheme.utilized)} / {formatCurrency(scheme.budget)}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full" 
                    style={{ width: `${(scheme.utilized / scheme.budget) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Alerts Tab */}
      {activeTab === 'alerts' && (
        <div className="space-y-3">
          <h2 className="font-semibold">
            {language === 'en' ? 'Alert Monitoring' : 'മുന്നറിയിപ്പ് നിരീക്ഷണം'}
          </h2>

          {dashboardData.alerts.map((alert) => (
            <div key={alert.id} className="card">
              <div className="flex items-start gap-3">
                <span style={{ fontSize: '1.5rem' }}>
                  {alert.type === 'weather' ? '🌤️' : 
                   alert.type === 'pest' ? '🐛' : '📢'}
                </span>
                
                <div className="flex-1">
                  <p className="font-medium mb-2">{alert.message}</p>
                  
                  <div className="flex items-center gap-4 text-sm text-muted">
                    <span>📤 {alert.reach} farmers reached</span>
                    <span>📥 {alert.responses} responses</span>
                    <span>📊 {Math.round((alert.responses / alert.reach) * 100)}% response rate</span>
                  </div>
                  
                  <p className="text-xs text-muted mt-1">
                    {new Date(alert.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default AdminDashboard