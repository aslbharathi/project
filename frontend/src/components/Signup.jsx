import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import { useAuth } from '../contexts/AuthContext'

const KERALA_DISTRICTS = [
  { id: 'thiruvananthapuram', name_en: 'Thiruvananthapuram', name_ml: 'തിരുവനന്തപുരം' },
  { id: 'kollam', name_en: 'Kollam', name_ml: 'കൊല്ലം' },
  { id: 'pathanamthitta', name_en: 'Pathanamthitta', name_ml: 'പത്തനംതിട്ട' },
  { id: 'alappuzha', name_en: 'Alappuzha', name_ml: 'ആലപ്പുഴ' },
  { id: 'kottayam', name_en: 'Kottayam', name_ml: 'കോട്ടയം' },
  { id: 'idukki', name_en: 'Idukki', name_ml: 'ഇടുക്കി' },
  { id: 'ernakulam', name_en: 'Ernakulam', name_ml: 'എറണാകുളം' },
  { id: 'thrissur', name_en: 'Thrissur', name_ml: 'തൃശ്ശൂർ' },
  { id: 'palakkad', name_en: 'Palakkad', name_ml: 'പാലക്കാട്' },
  { id: 'malappuram', name_en: 'Malappuram', name_ml: 'മലപ്പുറം' },
  { id: 'kozhikode', name_en: 'Kozhikode', name_ml: 'കോഴിക്കോട്' },
  { id: 'wayanad', name_en: 'Wayanad', name_ml: 'വയനാട്' },
  { id: 'kannur', name_en: 'Kannur', name_ml: 'കണ്ണൂർ' },
  { id: 'kasaragod', name_en: 'Kasaragod', name_ml: 'കാസർഗോഡ്' }
]

const Signup = () => {
  const navigate = useNavigate()
  const { language, toggleLanguage } = useLanguage()
  const { signup } = useAuth()
  
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    district: '',
    panchayat: '',
    location: '',
    otp: ''
  })
  const [step, setStep] = useState('details') // 'details' or 'otp'
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setError('')
  }

  const handleSubmitDetails = async (e) => {
    e.preventDefault()
    
    if (!formData.name.trim()) {
      setError(language === 'en' ? 'Please enter your name' : 'നിങ്ങളുടെ പേര് നൽകുക')
      return
    }
    
    if (!formData.mobile || formData.mobile.length !== 10) {
      setError(language === 'en' ? 'Please enter a valid 10-digit mobile number' : 'സാധുവായ 10 അക്ക മൊബൈൽ നമ്പർ നൽകുക')
      return
    }
    
    if (!formData.district) {
      setError(language === 'en' ? 'Please select your district' : 'നിങ്ങളുടെ ജില്ല തിരഞ്ഞെടുക്കുക')
      return
    }

    setIsLoading(true)
    
    // Mock OTP sending
    setTimeout(() => {
      setStep('otp')
      setIsLoading(false)
    }, 1000)
  }

  const handleVerifyOTP = async (e) => {
    e.preventDefault()
    
    if (!formData.otp || formData.otp.length !== 6) {
      setError(language === 'en' ? 'Please enter a valid 6-digit OTP' : 'സാധുവായ 6 അക്ക OTP നൽകുക')
      return
    }

    setIsLoading(true)
    
    try {
      const result = await signup(formData)
      
      if (result.success) {
        navigate('/setup')
      } else {
        setError(result.error || (language === 'en' ? 'Signup failed' : 'സൈൻ അപ്പ് പരാജയപ്പെട്ടു'))
      }
    } catch (error) {
      setError(language === 'en' ? 'Signup failed. Please try again.' : 'സൈൻ അപ്പ് പരാജയപ്പെട്ടു. വീണ്ടും ശ്രമിക്കുക.')
    } finally {
      setIsLoading(false)
    }
  }

  const districtOptions = {
    en: KERALA_DISTRICTS.reduce((acc, district) => {
      acc[district.id] = district.name_en
      return acc
    }, {}),
    ml: KERALA_DISTRICTS.reduce((acc, district) => {
      acc[district.id] = district.name_ml
      return acc
    }, {})
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <button 
        className="absolute top-4 right-4 bg-white border-2 border-gray-300 rounded-lg px-3 py-1 text-sm font-semibold shadow-md"
        onClick={toggleLanguage}
      >
        {language === 'en' ? 'മലയാളം' : 'English'}
      </button>

      <div className="max-w-md mx-auto pt-8">
        <div className="text-center mb-6">
          <div className="text-3xl mb-3">🌾</div>
          <h1 className="text-xl font-bold text-green-600 mb-2">
            {language === 'en' ? 'Join Krishi Sakhi' : 'കൃഷി സഖിയിൽ ചേരുക'}
          </h1>
          <p className="text-gray-600 text-sm">
            {language === 'en' ? 'Kerala Government Agriculture Department' : 'കേരള സർക്കാർ കൃഷി വകുപ്പ്'}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          {step === 'details' ? (
            <>
              <h2 className="text-lg font-bold text-center mb-4">
                {language === 'en' ? 'Create Account' : 'അക്കൗണ്ട് സൃഷ്ടിക്കുക'}
              </h2>

              <form onSubmit={handleSubmitDetails} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    {language === 'en' ? 'Full Name' : 'പൂർണ്ണ നാമം'}
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
                    placeholder={language === 'en' ? 'Enter your full name' : 'നിങ്ങളുടെ പൂർണ്ണ നാമം നൽകുക'}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    {language === 'en' ? 'Mobile Number' : 'മൊബൈൽ നമ്പർ'}
                  </label>
                  <input
                    type="tel"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
                    placeholder={language === 'en' ? '10-digit mobile number' : '10 അക്ക മൊബൈൽ നമ്പർ'}
                    maxLength="10"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    {language === 'en' ? 'District' : 'ജില്ല'}
                  </label>
                  <select
                    name="district"
                    value={formData.district}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
                  >
                    <option value="">{language === 'en' ? 'Select District' : 'ജില്ല തിരഞ്ഞെടുക്കുക'}</option>
                    {KERALA_DISTRICTS.map(district => (
                      <option key={district.id} value={district.id}>
                        {districtOptions[language][district.id]}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    {language === 'en' ? 'Panchayat/Municipality (Optional)' : 'പഞ്ചായത്ത്/മുനിസിപ്പാലിറ്റി (ഓപ്ഷണൽ)'}
                  </label>
                  <input
                    type="text"
                    name="panchayat"
                    value={formData.panchayat}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
                    placeholder={language === 'en' ? 'Enter panchayat name' : 'പഞ്ചായത്തിന്റെ പേര് നൽകുക'}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    {language === 'en' ? 'Village/Area (Optional)' : 'ഗ്രാമം/പ്രദേശം (ഓപ്ഷണൽ)'}
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
                    placeholder={language === 'en' ? 'Enter village/area name' : 'ഗ്രാമം/പ്രദേശത്തിന്റെ പേര് നൽകുക'}
                  />
                </div>

                {error && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {error}
                  </div>
                )}

                <button 
                  type="submit" 
                  className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      {language === 'en' ? 'Sending OTP...' : 'OTP അയയ്ക്കുന്നു...'}
                    </div>
                  ) : (
                    <>
                      📱 {language === 'en' ? 'Send OTP' : 'OTP അയയ്ക്കുക'}
                    </>
                  )}
                </button>
              </form>
            </>
          ) : (
            <>
              <h2 className="text-lg font-bold text-center mb-4">
                {language === 'en' ? 'Verify Mobile Number' : 'മൊബൈൽ നമ്പർ പരിശോധിക്കുക'}
              </h2>

              <div className="text-center mb-4">
                <p className="text-gray-600">
                  {language === 'en' 
                    ? `OTP sent to ${formData.mobile}` 
                    : `${formData.mobile} ലേക്ക് OTP അയച്ചു`
                  }
                </p>
              </div>

              <form onSubmit={handleVerifyOTP} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {language === 'en' ? 'Enter OTP' : 'OTP നൽകുക'}
                  </label>
                  <input
                    type="text"
                    name="otp"
                    value={formData.otp}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-center text-xl tracking-widest focus:border-green-500 focus:outline-none"
                    placeholder={language === 'en' ? '6-digit OTP' : '6 അക്ക OTP'}
                    maxLength="6"
                  />
                </div>

                {error && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {error}
                  </div>
                )}

                <button 
                  type="submit" 
                  className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      {language === 'en' ? 'Creating Account...' : 'അക്കൗണ്ട് സൃഷ്ടിക്കുന്നു...'}
                    </div>
                  ) : (
                    <>
                      ✅ {language === 'en' ? 'Create Account' : 'അക്കൗണ്ട് സൃഷ്ടിക്കുക'}
                    </>
                  )}
                </button>

                <button 
                  type="button"
                  onClick={() => setStep('details')}
                  className="w-full border-2 border-gray-300 text-gray-600 py-3 px-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  ← {language === 'en' ? 'Back to Details' : 'വിവരങ്ങളിലേക്ക് മടങ്ങുക'}
                </button>
              </form>
            </>
          )}

          <div className="text-center mt-6">
            <p className="text-gray-600">
              {language === 'en' ? 'Already have an account?' : 'ഇതിനകം അക്കൗണ്ട് ഉണ്ടോ?'}
            </p>
            <Link to="/login" className="text-green-600 font-semibold hover:text-green-700">
              {language === 'en' ? 'Login Here' : 'ഇവിടെ ലോഗിൻ ചെയ്യുക'}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Signup