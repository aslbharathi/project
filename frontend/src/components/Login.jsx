import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import { useAuth } from '../contexts/AuthContext'

const Login = () => {
  const navigate = useNavigate()
  const { language, toggleLanguage } = useLanguage()
  const { login } = useAuth()
  
  const [formData, setFormData] = useState({
    mobile: '',
    otp: ''
  })
  const [step, setStep] = useState('mobile') // 'mobile' or 'otp'
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setError('')
  }

  const handleSendOTP = async (e) => {
    e.preventDefault()
    
    if (!formData.mobile || formData.mobile.length !== 10) {
      setError(language === 'en' ? 'Please enter a valid 10-digit mobile number' : 'സാധുവായ 10 അക്ക മൊബൈൽ നമ്പർ നൽകുക')
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
      const result = await login({
        mobile: formData.mobile,
        otp: formData.otp,
        name: 'Farmer User'
      })
      
      if (result.success) {
        navigate('/dashboard')
      } else {
        setError(result.error || (language === 'en' ? 'Login failed' : 'ലോഗിൻ പരാജയപ്പെട്ടു'))
      }
    } catch (error) {
      setError(language === 'en' ? 'Login failed. Please try again.' : 'ലോഗിൻ പരാജയപ്പെട്ടു. വീണ്ടും ശ്രമിക്കുക.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <button 
        className="absolute top-4 right-4 bg-white border-2 border-gray-300 rounded-lg px-3 py-1 text-sm font-semibold shadow-md"
        onClick={toggleLanguage}
      >
        {language === 'en' ? 'മലയാളം' : 'English'}
      </button>

      <div className="max-w-md mx-auto pt-16">
        <div className="text-center mb-8">
          <div className="text-4xl mb-4">🌾</div>
          <h1 className="text-2xl font-bold text-green-600 mb-2">
            {language === 'en' ? 'Krishi Sakhi' : 'കൃഷി സഖി'}
          </h1>
          <p className="text-gray-600">
            {language === 'en' ? 'Kerala Government Agriculture Department' : 'കേരള സർക്കാർ കൃഷി വകുപ്പ്'}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-center mb-6">
            {language === 'en' ? 'Login' : 'ലോഗിൻ'}
          </h2>

          {step === 'mobile' ? (
            <form onSubmit={handleSendOTP} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {language === 'en' ? 'Mobile Number' : 'മൊബൈൽ നമ്പർ'}
                </label>
                <input
                  type="tel"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-center text-lg focus:border-green-500 focus:outline-none"
                  placeholder={language === 'en' ? 'Enter 10-digit mobile number' : '10 അക്ക മൊബൈൽ നമ്പർ നൽകുക'}
                  maxLength="10"
                />
              </div>

              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              )}

              <button 
                type="submit" 
                className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-semibold text-lg hover:bg-green-700 transition-colors disabled:opacity-50"
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
          ) : (
            <form onSubmit={handleVerifyOTP} className="space-y-4">
              <div className="text-center mb-4">
                <p className="text-gray-600">
                  {language === 'en' 
                    ? `OTP sent to ${formData.mobile}` 
                    : `${formData.mobile} ലേക്ക് OTP അയച്ചു`
                  }
                </p>
              </div>

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
                className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-semibold text-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    {language === 'en' ? 'Verifying...' : 'പരിശോധിക്കുന്നു...'}
                  </div>
                ) : (
                  <>
                    ✅ {language === 'en' ? 'Verify & Login' : 'പരിശോധിച്ച് ലോഗിൻ ചെയ്യുക'}
                  </>
                )}
              </button>

              <button 
                type="button"
                onClick={() => setStep('mobile')}
                className="w-full border-2 border-gray-300 text-gray-600 py-3 px-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                ← {language === 'en' ? 'Change Mobile Number' : 'മൊബൈൽ നമ്പർ മാറ്റുക'}
              </button>
            </form>
          )}

          <div className="text-center mt-6">
            <p className="text-gray-600">
              {language === 'en' ? "Don't have an account?" : 'അക്കൗണ്ട് ഇല്ലേ?'}
            </p>
            <Link to="/signup" className="text-green-600 font-semibold hover:text-green-700">
              {language === 'en' ? 'Sign Up Here' : 'ഇവിടെ സൈൻ അപ്പ് ചെയ്യുക'}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login