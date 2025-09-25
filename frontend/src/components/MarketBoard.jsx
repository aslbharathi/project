import React, { useState } from 'react'
import { useLanguage } from '../contexts/LanguageContext'

const MarketBoard = () => {
  const { language, toggleLanguage } = useLanguage()
  const [activeTab, setActiveTab] = useState('prices')
  const [marketPrices] = useState([
    {
      crop: 'coconut',
      price: 85,
      unit: 'piece',
      market: 'Thrissur',
      change: '+5%',
      trend: 'up'
    },
    {
      crop: 'paddy',
      price: 2800,
      unit: 'quintal',
      market: 'Palakkad',
      change: '+2%',
      trend: 'up'
    },
    {
      crop: 'pepper',
      price: 650,
      unit: 'kg',
      market: 'Kochi',
      change: '-3%',
      trend: 'down'
    }
  ])

  const getCropName = (crop) => {
    const cropNames = {
      en: {
        coconut: 'Coconut',
        paddy: 'Paddy',
        pepper: 'Pepper',
        banana: 'Banana',
        rubber: 'Rubber'
      },
      ml: {
        coconut: 'തെങ്ങ്',
        paddy: 'നെല്ല്',
        pepper: 'കുരുമുളക്',
        banana: 'വാഴ',
        rubber: 'റബ്ബർ'
      }
    }
    return cropNames[language][crop] || crop
  }

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up': return '📈'
      case 'down': return '📉'
      default: return '➡️'
    }
  }

  const getTrendColor = (trend) => {
    switch (trend) {
      case 'up': return '#10b981'
      case 'down': return '#ef4444'
      default: return '#6b7280'
    }
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
            💰 {language === 'en' ? 'Market Board' : 'മാർക്കറ്റ് ബോർഡ്'}
          </h1>
          <p className="text-gray-600">
            {language === 'en' 
              ? 'Live prices and sell your crops'
              : 'തത്സമയ വിലകളും നിങ്ങളുടെ വിളകൾ വിൽക്കാനും'
            }
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-2 mb-4">
          {[
            { key: 'prices', label: language === 'en' ? 'Market Prices' : 'മാർക്കറ്റ് വിലകൾ', icon: '📊' },
            { key: 'sell', label: language === 'en' ? 'Sell Crops' : 'വിളകൾ വിൽക്കുക', icon: '🛒' }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 py-2 px-4 rounded-lg font-semibold text-sm ${
                activeTab === tab.key 
                  ? 'bg-green-600 text-white' 
                  : 'bg-white text-gray-600 border border-gray-300'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Market Prices Tab */}
        {activeTab === 'prices' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold">
                {language === 'en' ? 'Today\'s Prices' : 'ഇന്നത്തെ വിലകൾ'}
              </h2>
              <span className="text-gray-500 text-sm">
                {language === 'en' ? 'Live Updates' : 'തത്സമയ അപ്‌ഡേറ്റുകൾ'}
              </span>
            </div>

            {marketPrices.map((item, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-semibold">{getCropName(item.crop)}</h3>
                      <span style={{ color: getTrendColor(item.trend) }}>
                        {getTrendIcon(item.trend)}
                      </span>
                    </div>
                    <p className="text-gray-500 text-sm">{item.market}</p>
                  </div>
                  
                  <div className="text-right">
                    <div className="font-bold text-green-600 text-lg">
                      ₹{item.price}
                    </div>
                    <div className="text-gray-500 text-sm">
                      per {item.unit}
                    </div>
                    <div 
                      className="font-medium text-sm"
                      style={{ color: getTrendColor(item.trend) }}
                    >
                      {item.change}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <div className="bg-green-100 rounded-lg p-4">
              <div className="text-center">
                <h3 className="font-semibold mb-2">
                  💡 {language === 'en' ? 'Price Alert' : 'വില മുന്നറിയിപ്പ്'}
                </h3>
                <p className="text-sm">
                  {language === 'en' 
                    ? 'Coconut prices are up 5% this week. Good time to sell!'
                    : 'ഈ ആഴ്ച തെങ്ങിന്റെ വില 5% കൂടി. വിൽക്കാൻ നല്ല സമയം!'
                  }
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Sell Crops Tab */}
        {activeTab === 'sell' && (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">🛒</div>
            <h3 className="font-semibold mb-2">
              {language === 'en' ? 'Sell Your Crops' : 'നിങ്ങളുടെ വിളകൾ വിൽക്കുക'}
            </h3>
            <p className="text-gray-600 mb-4">
              {language === 'en' 
                ? 'Create listings to sell your crops directly to buyers'
                : 'വാങ്ങുന്നവർക്ക് നേരിട്ട് നിങ്ങളുടെ വിളകൾ വിൽക്കാൻ ലിസ്റ്റിംഗുകൾ സൃഷ്ടിക്കുക'
              }
            </p>
            <button className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors">
              {language === 'en' ? 'Create Listing' : 'ലിസ്റ്റിംഗ് സൃഷ്ടിക്കുക'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default MarketBoard