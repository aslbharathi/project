import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import { useAuth } from '../contexts/AuthContext'
import { KERALA_DISTRICTS } from '../utils/constants'

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
    <div className="container" style={{ minHeight: '100vh', paddingTop: '2rem' }}>
      <button 
        className="language-toggle"
        onClick={toggleLanguage}
        aria-label="Toggle Language"
      >
        {language === 'en' ? 'മലയാളം' : 'English'}
      </button>

      <div style={{ paddingTop: '2rem' }}>
        <div className="text-center mb-4">
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🌾</div>
          <h1 className="font-bold text-primary" style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>
            {language === 'en' ? 'Join Krishi Sakhi' : 'കൃഷി സഖിയിൽ ചേരുക'}
          </h1>
          <p className="text-gray" style={{ fontSize: '0.9rem' }}>
            {language === 'en' ? 'Kerala Government Agriculture Department' : 'കേരള സർക്കാർ കൃഷി വകുപ്പ്'}
          </p>
        </div>

        <div className="card">
          {step === 'details' ? (
            <>
              <h2 className="font-bold text-center mb-4" style={{ fontSize: '1.3rem' }}>
                {language === 'en' ? 'Create Account' : 'അക്കൗണ്ട് സൃഷ്ടിക്കുക'}
              </h2>

              <form onSubmit={handleSubmitDetails} className="space-y-3">
                <div className="form-group">
                  <label className="form-label">
                    {language === 'en' ? 'Full Name' : 'പൂർണ്ണ നാമം'}
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder={language === 'en' ? 'Enter your full name' : 'നിങ്ങളുടെ പൂർണ്ണ നാമം നൽകുക'}
                    style={{ fontSize: '1.1rem' }}
                  />
                </div>

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
                    placeholder={language === 'en' ? '10-digit mobile number' : '10 അക്ക മൊബൈൽ നമ്പർ'}
                    maxLength="10"
                    style={{ fontSize: '1.1rem' }}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    {language === 'en' ? 'District' : 'ജില്ല'}
                  </label>
                  <select
                    name="district"
                    value={formData.district}
                    onChange={handleInputChange}
                    className="form-input form-select"
                    style={{ fontSize: '1.1rem' }}
                  >
                    <option value="">{language === 'en' ? 'Select District' : 'ജില്ല തിരഞ്ഞെടുക്കുക'}</option>
                    {KERALA_DISTRICTS.map(district => (
                      <option key={district.id} value={district.id}>
                        {districtOptions[language][district.id]}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    {language === 'en' ? 'Panchayat/Municipality (Optional)' : 'പഞ്ചായത്ത്/മുനിസിപ്പാലിറ്റി (ഓപ്ഷണൽ)'}
                  </label>
                  <input
                    type="text"
                    name="panchayat"
                    value={formData.panchayat}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder={language === 'en' ? 'Enter panchayat name' : 'പഞ്ചായത്തിന്റെ പേര് നൽകുക'}
                    style={{ fontSize: '1.1rem' }}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    {language === 'en' ? 'Village/Area (Optional)' : 'ഗ്രാമം/പ്രദേശം (ഓപ്ഷണൽ)'}
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder={language === 'en' ? 'Enter village/area name' : 'ഗ്രാമം/പ്രദേശത്തിന്റെ പേര് നൽകുക'}
                    style={{ fontSize: '1.1rem' }}
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
                  style={{ fontSize: '1.1rem', padding: '1rem', marginTop: '1.5rem' }}
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
            </>
          ) : (
            <>
              <h2 className="font-bold text-center mb-4" style={{ fontSize: '1.3rem' }}>
                {language === 'en' ? 'Verify Mobile Number' : 'മൊബൈൽ നമ്പർ പരിശോധിക്കുക'}
              </h2>

              <div className="text-center mb-4">
                <p className="text-gray">
                  {language === 'en' 
                    ? `OTP sent to ${formData.mobile}` 
                    : `${formData.mobile} ലേക്ക് OTP അയച്ചു`
                  }
                </p>
              </div>

              <form onSubmit={handleVerifyOTP} className="space-y-4">
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
                  className="btn btn-secondary w-full"
                  style={{ fontSize: '1rem' }}
                >
                  ← {language === 'en' ? 'Back to Details' : 'വിവരങ്ങളിലേക്ക് മടങ്ങുക'}
                </button>
              </form>
            </>
          )}

          <div className="text-center mt-4">
            <p className="text-muted">
              {language === 'en' ? 'Already have an account?' : 'ഇതിനകം അക്കൗണ്ട് ഉണ്ടോ?'}
            </p>
            <Link to="/login" className="text-primary font-semibold">
              {language === 'en' ? 'Login Here' : 'ഇവിടെ ലോഗിൻ ചെയ്യുക'}
            </Link>
          </div>
        </div>

        <div className="text-center mt-4">
          <p className="text-muted" style={{ fontSize: '0.875rem' }}>
            {language === 'en' 
              ? 'By signing up, you agree to Kerala Government terms'
              : 'സൈൻ അപ്പ് ചെയ്യുന്നതിലൂടെ, നിങ്ങൾ കേരള സർക്കാരിന്റെ നിബന്ധനകൾ അംഗീകരിക്കുന്നു'
            }
          </p>
        </div>
      </div>
    </div>
  )
}

export default Signup