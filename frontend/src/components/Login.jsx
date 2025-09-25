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
      // In real app, show success message about OTP sent
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
        name: 'Farmer User' // Mock name
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
    <div className="container" style={{ minHeight: '100vh', paddingTop: '2rem' }}>
      <button 
        className="language-toggle"
        onClick={toggleLanguage}
        aria-label="Toggle Language"
      >
        {language === 'en' ? 'മലയാളം' : 'English'}
      </button>

      <div style={{ paddingTop: '4rem' }}>
        <div className="text-center mb-5">
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🌾</div>
          <h1 className="font-bold text-primary" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
            {language === 'en' ? 'Krishi Sakhi' : 'കൃഷി സഖി'}
          </h1>
          <p className="text-gray" style={{ fontSize: '1rem' }}>
            {language === 'en' ? 'Kerala Government Agriculture Department' : 'കേരള സർക്കാർ കൃഷി വകുപ്പ്'}
          </p>
        </div>

        <div className="card">
          <h2 className="font-bold text-center mb-4" style={{ fontSize: '1.5rem' }}>
            {language === 'en' ? 'Login' : 'ലോഗിൻ'}
          </h2>

          {step === 'mobile' ? (
            <form onSubmit={handleSendOTP} className="space-y-4">
              <div className="form-group">
                <label className="form-label">
                  {language === 'en' ? 'Mobile Number' : 'മൊബൈൽ നമ്പർ'}
                </label>
                <input
                  type="tel"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder={language === 'en' ? 'Enter 10-digit mobile number' : '10 അക്ക മൊബൈൽ നമ്പർ നൽകുക'}
                  maxLength="10"
                  style={{ fontSize: '1.2rem', textAlign: 'center' }}
                />
              </div>

              {error && (
                <div className="alert alert-error">
                  <p>{error}</p>
                </div>
              )}

              <button 
                type="submit" 
                className="btn btn-primary w-full"
                disabled={isLoading}
                style={{ fontSize: '1.1rem', padding: '1rem' }}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="loading-spinner" />
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
                <p className="text-gray">
                  {language === 'en' 
                    ? `OTP sent to ${formData.mobile}` 
                    : `${formData.mobile} ലേക്ക് OTP അയച്ചു`
                  }
                </p>
              </div>

              <div className="form-group">
                <label className="form-label">
                  {language === 'en' ? 'Enter OTP' : 'OTP നൽകുക'}
                </label>
                <input
                  type="text"
                  name="otp"
                  value={formData.otp}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder={language === 'en' ? '6-digit OTP' : '6 അക്ക OTP'}
                  maxLength="6"
                  style={{ fontSize: '1.5rem', textAlign: 'center', letterSpacing: '0.5rem' }}
                />
              </div>

              {error && (
                <div className="alert alert-error">
                  <p>{error}</p>
                </div>
              )}

              <button 
                type="submit" 
                className="btn btn-primary w-full"
                disabled={isLoading}
                style={{ fontSize: '1.1rem', padding: '1rem' }}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="loading-spinner" />
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
                className="btn btn-secondary w-full"
                style={{ fontSize: '1rem' }}
              >
                ← {language === 'en' ? 'Change Mobile Number' : 'മൊബൈൽ നമ്പർ മാറ്റുക'}
              </button>
            </form>
          )}

          <div className="text-center mt-4">
            <p className="text-muted">
              {language === 'en' ? "Don't have an account?" : 'അക്കൗണ്ട് ഇല്ലേ?'}
            </p>
            <Link to="/signup" className="text-primary font-semibold">
              {language === 'en' ? 'Sign Up Here' : 'ഇവിടെ സൈൻ അപ്പ് ചെയ്യുക'}
            </Link>
          </div>
        </div>

        <div className="text-center mt-4">
          <p className="text-muted" style={{ fontSize: '0.875rem' }}>
            {language === 'en' 
              ? 'Secure login powered by Kerala Government'
              : 'കേരള സർക്കാരിന്റെ സുരക്ഷിത ലോഗിൻ'
            }
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login