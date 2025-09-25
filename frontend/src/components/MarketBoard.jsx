import React, { useState, useEffect } from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import { useAuth } from '../contexts/AuthContext'
import { formatTimeAgo } from '../utils/helpers'

const MarketBoard = () => {
  const { language, toggleLanguage } = useLanguage()
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('prices') // 'prices' or 'sell'
  const [marketPrices, setMarketPrices] = useState([])
  const [myListings, setMyListings] = useState([])
  const [showSellForm, setShowSellForm] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  
  const [sellForm, setSellForm] = useState({
    crop: '',
    quantity: '',
    unit: 'kg',
    expectedPrice: '',
    location: '',
    harvestDate: '',
    quality: 'good',
    description: ''
  })

  useEffect(() => {
    loadMarketData()
  }, [])

  const loadMarketData = async () => {
    try {
      setIsLoading(true)
      
      // Mock market prices data
      const mockPrices = [
        {
          crop: 'coconut',
          price: 85,
          unit: 'piece',
          market: 'Thrissur',
          change: '+5%',
          trend: 'up',
          lastUpdated: new Date().toISOString()
        },
        {
          crop: 'paddy',
          price: 2800,
          unit: 'quintal',
          market: 'Palakkad',
          change: '+2%',
          trend: 'up',
          lastUpdated: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
        },
        {
          crop: 'pepper',
          price: 650,
          unit: 'kg',
          market: 'Kochi',
          change: '-3%',
          trend: 'down',
          lastUpdated: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
        },
        {
          crop: 'banana',
          price: 45,
          unit: 'dozen',
          market: 'Kozhikode',
          change: '0%',
          trend: 'stable',
          lastUpdated: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
        },
        {
          crop: 'rubber',
          price: 180,
          unit: 'kg',
          market: 'Kottayam',
          change: '+8%',
          trend: 'up',
          lastUpdated: new Date(Date.now() - 30 * 60 * 1000).toISOString()
        }
      ]
      
      setMarketPrices(mockPrices)
      
      // Mock user listings
      const mockListings = [
        {
          id: 1,
          crop: 'coconut',
          quantity: 500,
          unit: 'pieces',
          expectedPrice: 80,
          location: 'Thrissur',
          status: 'active',
          createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          inquiries: 3
        }
      ]
      
      setMyListings(mockListings)
    } catch (error) {
      console.error('Failed to load market data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSellFormChange = (e) => {
    const { name, value } = e.target
    setSellForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmitListing = async (e) => {
    e.preventDefault()
    
    if (!sellForm.crop || !sellForm.quantity || !sellForm.expectedPrice) {
      alert(language === 'en' ? 'Please fill all required fields' : 'ആവശ്യമായ എല്ലാ ഫീൽഡുകളും പൂരിപ്പിക്കുക')
      return
    }

    try {
      const newListing = {
        id: Date.now(),
        ...sellForm,
        quantity: parseFloat(sellForm.quantity),
        expectedPrice: parseFloat(sellForm.expectedPrice),
        status: 'active',
        createdAt: new Date().toISOString(),
        inquiries: 0,
        farmerName: user?.name,
        farmerMobile: user?.mobile
      }
      
      setMyListings(prev => [newListing, ...prev])
      setSellForm({
        crop: '',
        quantity: '',
        unit: 'kg',
        expectedPrice: '',
        location: '',
        harvestDate: '',
        quality: 'good',
        description: ''
      })
      setShowSellForm(false)
      
      alert(language === 'en' ? 'Listing created successfully!' : 'ലിസ്റ്റിംഗ് വിജയകരമായി സൃഷ്ടിച്ചു!')
    } catch (error) {
      console.error('Failed to create listing:', error)
      alert(language === 'en' ? 'Failed to create listing' : 'ലിസ്റ്റിംഗ് സൃഷ്ടിക്കാൻ കഴിഞ്ഞില്ല')
    }
  }

  const getCropName = (crop) => {
    const cropNames = {
      en: {
        coconut: 'Coconut',
        paddy: 'Paddy',
        pepper: 'Pepper',
        banana: 'Banana',
        rubber: 'Rubber',
        cardamom: 'Cardamom',
        ginger: 'Ginger',
        turmeric: 'Turmeric'
      },
      ml: {
        coconut: 'തെങ്ങ്',
        paddy: 'നെല്ല്',
        pepper: 'കുരുമുളക്',
        banana: 'വാഴ',
        rubber: 'റബ്ബർ',
        cardamom: 'ഏലം',
        ginger: 'ഇഞ്ചി',
        turmeric: 'മഞ്ഞൾ'
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
      case 'up': return 'var(--success)'
      case 'down': return 'var(--error)'
      default: return 'var(--gray-500)'
    }
  }

  if (isLoading) {
    return (
      <div className="container flex items-center justify-center" style={{ minHeight: '100vh' }}>
        <div className="text-center">
          <div className="loading-spinner mb-3" />
          <p>{language === 'en' ? 'Loading market data...' : 'മാർക്കറ്റ് ഡാറ്റ ലോഡ് ചെയ്യുന്നു...'}</p>
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
          💰 {language === 'en' ? 'Market Board' : 'മാർക്കറ്റ് ബോർഡ്'}
        </h1>
        <p className="text-gray">
          {language === 'en' 
            ? 'Live prices and sell your crops'
            : 'തത്സമയ വിലകളും നിങ്ങളുടെ വിളകൾ വിൽക്കാനും'
          }
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 mb-4" style={{ overflowX: 'auto' }}>
        {[
          { key: 'prices', label: language === 'en' ? 'Market Prices' : 'മാർക്കറ്റ് വിലകൾ', icon: '📊' },
          { key: 'sell', label: language === 'en' ? 'Sell Crops' : 'വിളകൾ വിൽക്കുക', icon: '🛒' }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`btn ${activeTab === tab.key ? 'btn-primary' : 'btn-secondary'}`}
            style={{ 
              padding: '0.75rem 1rem', 
              fontSize: '0.875rem',
              whiteSpace: 'nowrap',
              flexShrink: 0
            }}
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
            <span className="text-muted" style={{ fontSize: '0.8rem' }}>
              {language === 'en' ? 'Live Updates' : 'തത്സമയ അപ്‌ഡേറ്റുകൾ'}
            </span>
          </div>

          {marketPrices.map((item, index) => (
            <div key={index} className="card">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold">{getCropName(item.crop)}</h3>
                    <span style={{ color: getTrendColor(item.trend) }}>
                      {getTrendIcon(item.trend)}
                    </span>
                  </div>
                  <p className="text-muted" style={{ fontSize: '0.875rem' }}>
                    {item.market} • {formatTimeAgo(item.lastUpdated, language)}
                  </p>
                </div>
                
                <div className="text-right">
                  <div className="font-bold text-primary" style={{ fontSize: '1.2rem' }}>
                    ₹{item.price}
                  </div>
                  <div className="text-muted" style={{ fontSize: '0.8rem' }}>
                    per {item.unit}
                  </div>
                  <div 
                    className="font-medium" 
                    style={{ 
                      fontSize: '0.8rem',
                      color: getTrendColor(item.trend)
                    }}
                  >
                    {item.change}
                  </div>
                </div>
              </div>
            </div>
          ))}

          <div className="card" style={{ backgroundColor: 'var(--light-green)' }}>
            <div className="text-center">
              <h3 className="font-semibold mb-2">
                💡 {language === 'en' ? 'Price Alert' : 'വില മുന്നറിയിപ്പ്'}
              </h3>
              <p style={{ fontSize: '0.9rem' }}>
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
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">
              {language === 'en' ? 'Your Listings' : 'നിങ്ങളുടെ ലിസ്റ്റിംഗുകൾ'}
            </h2>
            <button
              onClick={() => setShowSellForm(!showSellForm)}
              className="btn btn-primary"
              style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
            >
              {showSellForm ? '✕' : '+'} {language === 'en' ? 'Add Listing' : 'ലിസ്റ്റിംഗ് ചേർക്കുക'}
            </button>
          </div>

          {/* Sell Form */}
          {showSellForm && (
            <div className="card">
              <h3 className="font-semibold mb-3">
                {language === 'en' ? 'Create New Listing' : 'പുതിയ ലിസ്റ്റിംഗ് സൃഷ്ടിക്കുക'}
              </h3>
              
              <form onSubmit={handleSubmitListing} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="form-group">
                    <label className="form-label">
                      {language === 'en' ? 'Crop' : 'വിള'} *
                    </label>
                    <select
                      name="crop"
                      value={sellForm.crop}
                      onChange={handleSellFormChange}
                      className="form-input form-select"
                      required
                    >
                      <option value="">{language === 'en' ? 'Select crop' : 'വിള തിരഞ്ഞെടുക്കുക'}</option>
                      <option value="coconut">{getCropName('coconut')}</option>
                      <option value="paddy">{getCropName('paddy')}</option>
                      <option value="pepper">{getCropName('pepper')}</option>
                      <option value="banana">{getCropName('banana')}</option>
                      <option value="rubber">{getCropName('rubber')}</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      {language === 'en' ? 'Quantity' : 'അളവ്'} *
                    </label>
                    <input
                      type="number"
                      name="quantity"
                      value={sellForm.quantity}
                      onChange={handleSellFormChange}
                      className="form-input"
                      placeholder="0"
                      min="1"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="form-group">
                    <label className="form-label">
                      {language === 'en' ? 'Unit' : 'യൂണിറ്റ്'}
                    </label>
                    <select
                      name="unit"
                      value={sellForm.unit}
                      onChange={handleSellFormChange}
                      className="form-input form-select"
                    >
                      <option value="kg">{language === 'en' ? 'Kg' : 'കിലോ'}</option>
                      <option value="quintal">{language === 'en' ? 'Quintal' : 'ക്വിന്റൽ'}</option>
                      <option value="pieces">{language === 'en' ? 'Pieces' : 'എണ്ണം'}</option>
                      <option value="dozen">{language === 'en' ? 'Dozen' : 'ഡസൻ'}</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      {language === 'en' ? 'Expected Price (₹)' : 'പ്രതീക്ഷിക്കുന്ന വില (₹)'} *
                    </label>
                    <input
                      type="number"
                      name="expectedPrice"
                      value={sellForm.expectedPrice}
                      onChange={handleSellFormChange}
                      className="form-input"
                      placeholder="0"
                      min="1"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    {language === 'en' ? 'Location' : 'സ്ഥലം'}
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={sellForm.location}
                    onChange={handleSellFormChange}
                    className="form-input"
                    placeholder={language === 'en' ? 'Farm location' : 'കൃഷിയിടത്തിന്റെ സ്ഥലം'}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    {language === 'en' ? 'Quality' : 'ഗുണനിലവാരം'}
                  </label>
                  <select
                    name="quality"
                    value={sellForm.quality}
                    onChange={handleSellFormChange}
                    className="form-input form-select"
                  >
                    <option value="excellent">{language === 'en' ? 'Excellent' : 'മികച്ചത്'}</option>
                    <option value="good">{language === 'en' ? 'Good' : 'നല്ലത്'}</option>
                    <option value="average">{language === 'en' ? 'Average' : 'ശരാശരി'}</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    {language === 'en' ? 'Description (Optional)' : 'വിവരണം (ഓപ്ഷണൽ)'}
                  </label>
                  <textarea
                    name="description"
                    value={sellForm.description}
                    onChange={handleSellFormChange}
                    className="form-input"
                    rows="3"
                    placeholder={language === 'en' ? 'Additional details about your crop...' : 'നിങ്ങളുടെ വിളയെക്കുറിച്ചുള്ള അധിക വിവരങ്ങൾ...'}
                  />
                </div>

                <button type="submit" className="btn btn-primary w-full">
                  {language === 'en' ? 'Create Listing' : 'ലിസ്റ്റിംഗ് സൃഷ്ടിക്കുക'}
                </button>
              </form>
            </div>
          )}

          {/* My Listings */}
          <div className="space-y-3">
            {myListings.length > 0 ? (
              myListings.map((listing) => (
                <div key={listing.id} className="card">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{getCropName(listing.crop)}</h3>
                        <span 
                          className="text-xs px-2 py-1 rounded"
                          style={{ 
                            backgroundColor: listing.status === 'active' ? 'var(--success)' : 'var(--gray-400)',
                            color: 'white'
                          }}
                        >
                          {listing.status === 'active' 
                            ? (language === 'en' ? 'Active' : 'സജീവം')
                            : (language === 'en' ? 'Inactive' : 'നിഷ്ക്രിയം')
                          }
                        </span>
                      </div>
                      
                      <p className="text-gray" style={{ fontSize: '0.9rem' }}>
                        {listing.quantity} {listing.unit} • ₹{listing.expectedPrice} per {listing.unit}
                      </p>
                      
                      <p className="text-muted" style={{ fontSize: '0.8rem' }}>
                        {listing.location} • {formatTimeAgo(listing.createdAt, language)}
                      </p>
                      
                      {listing.inquiries > 0 && (
                        <p className="text-primary" style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>
                          📞 {listing.inquiries} {language === 'en' ? 'inquiries' : 'അന്വേഷണങ്ങൾ'}
                        </p>
                      )}
                    </div>
                    
                    <div className="text-right">
                      <button 
                        className="btn btn-secondary"
                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}
                      >
                        {language === 'en' ? 'Edit' : 'എഡിറ്റ്'}
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🛒</div>
                <h3 className="font-semibold mb-2">
                  {language === 'en' ? 'No Listings Yet' : 'ഇതുവരെ ലിസ്റ്റിംഗുകളൊന്നുമില്ല'}
                </h3>
                <p className="text-gray mb-4">
                  {language === 'en' 
                    ? 'Create your first listing to start selling'
                    : 'വിൽപ്പന ആരംഭിക്കാൻ നിങ്ങളുടെ ആദ്യ ലിസ്റ്റിംഗ് സൃഷ്ടിക്കുക'
                  }
                </p>
                <button
                  onClick={() => setShowSellForm(true)}
                  className="btn btn-primary"
                >
                  {language === 'en' ? 'Create First Listing' : 'ആദ്യ ലിസ്റ്റിംഗ് സൃഷ്ടിക്കുക'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default MarketBoard