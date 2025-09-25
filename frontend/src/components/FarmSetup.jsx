import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import { useFarmData } from '../contexts/FarmDataContext'
import { farmService } from '../services/farmService'
import { CROPS, SOIL_TYPES } from '../utils/constants'
import { validateFarmData } from '../utils/helpers'

const FarmSetup = ({ onComplete }) => {
  const navigate = useNavigate()
  const { language, toggleLanguage } = useLanguage()
  const { updateFarmData } = useFarmData()
  
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    landSize: '',
    landUnit: 'cents',
    currentCrop: '',
    soilType: '',
    irrigation: false
  })
  
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const validation = validateFarmData(formData)
    if (!validation.isValid) {
      setErrors(validation.errors)
      return
    }

    setIsLoading(true)
    
    try {
      await farmService.saveFarmData(formData)
      updateFarmData(formData)
      onComplete()
      navigate('/dashboard')
    } catch (error) {
      console.error('Farm setup error:', error)
      // Still proceed if offline
      updateFarmData(formData)
      onComplete()
      navigate('/dashboard')
    } finally {
      setIsLoading(false)
    }
  }

  const cropOptions = {
    en: {
      paddy: 'Paddy',
      coconut: 'Coconut',
      rubber: 'Rubber',
      banana: 'Banana',
      brinjal: 'Brinjal',
      pepper: 'Pepper',
      cardamom: 'Cardamom',
      ginger: 'Ginger',
      turmeric: 'Turmeric'
    },
    ml: {
      paddy: 'നെല്ല്',
      coconut: 'തെങ്ങ്',
      rubber: 'റബ്ബർ',
      banana: 'വാഴ',
      brinjal: 'വഴുതന',
      pepper: 'കുരുമുളക്',
      cardamom: 'ഏലം',
      ginger: 'ഇഞ്ചി',
      turmeric: 'മഞ്ഞൾ'
    }
  }

  const soilOptions = {
    en: {
      laterite: 'Laterite',
      alluvial: 'Alluvial',
      coastal: 'Coastal',
      forest: 'Forest'
    },
    ml: {
      laterite: 'ലാറ്ററൈറ്റ്',
      alluvial: 'എക്കൽ',
      coastal: 'തീരദേശ',
      forest: 'വന'
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

      <div style={{ paddingTop: '2rem' }}>
        <div className="text-center mb-4">
          <h1 className="font-bold text-primary" style={{ fontSize: '1.5rem' }}>
            {language === 'en' ? 'Set Up Your Farm' : 'നിങ്ങളുടെ കൃഷിയിടം സജ്ജീകരിക്കുക'}
          </h1>
          <p className="text-gray">
            {language === 'en' 
              ? 'Tell us about your farm to get personalized advice'
              : 'വ്യക്തിഗത ഉപദേശം ലഭിക്കാൻ നിങ്ങളുടെ കൃഷിയിടത്തെക്കുറിച്ച് പറയുക'
            }
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="form-group">
            <label className="form-label">
              {language === 'en' ? 'Farm Name' : 'കൃഷിയിടത്തിന്റെ പേര്'}
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="form-input"
              placeholder={language === 'en' ? 'Enter farm name' : 'കൃഷിയിടത്തിന്റെ പേര് നൽകുക'}
            />
            {errors.name && <p className="text-error" style={{ fontSize: '0.875rem', marginTop: '0.25rem' }}>{errors.name}</p>}
          </div>

          <div className="form-group">
            <label className="form-label">
              {language === 'en' ? 'Location' : 'സ്ഥലം'}
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              className="form-input"
              placeholder={language === 'en' ? 'Village, District' : 'ഗ്രാമം, ജില്ല'}
            />
            {errors.location && <p className="text-error" style={{ fontSize: '0.875rem', marginTop: '0.25rem' }}>{errors.location}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="form-group">
              <label className="form-label">
                {language === 'en' ? 'Land Size' : 'ഭൂമിയുടെ വലിപ്പം'}
              </label>
              <input
                type="number"
                name="landSize"
                value={formData.landSize}
                onChange={handleInputChange}
                className="form-input"
                placeholder="0"
                min="0"
                step="0.1"
              />
              {errors.landSize && <p className="text-error" style={{ fontSize: '0.875rem', marginTop: '0.25rem' }}>{errors.landSize}</p>}
            </div>

            <div className="form-group">
              <label className="form-label">
                {language === 'en' ? 'Unit' : 'യൂണിറ്റ്'}
              </label>
              <select
                name="landUnit"
                value={formData.landUnit}
                onChange={handleInputChange}
                className="form-input form-select"
              >
                <option value="cents">{language === 'en' ? 'Cents' : 'സെന്റ്'}</option>
                <option value="hectares">{language === 'en' ? 'Hectares' : 'ഹെക്ടർ'}</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">
              {language === 'en' ? 'Current Crop' : 'നിലവിലെ വിള'}
            </label>
            <select
              name="currentCrop"
              value={formData.currentCrop}
              onChange={handleInputChange}
              className="form-input form-select"
            >
              <option value="">{language === 'en' ? 'Select crop' : 'വിള തിരഞ്ഞെടുക്കുക'}</option>
              {CROPS.map(crop => (
                <option key={crop} value={crop}>
                  {cropOptions[language][crop]}
                </option>
              ))}
            </select>
            {errors.currentCrop && <p className="text-error" style={{ fontSize: '0.875rem', marginTop: '0.25rem' }}>{errors.currentCrop}</p>}
          </div>

          <div className="form-group">
            <label className="form-label">
              {language === 'en' ? 'Soil Type' : 'മണ്ണിന്റെ തരം'}
            </label>
            <select
              name="soilType"
              value={formData.soilType}
              onChange={handleInputChange}
              className="form-input form-select"
            >
              <option value="">{language === 'en' ? 'Select soil type' : 'മണ്ണിന്റെ തരം തിരഞ്ഞെടുക്കുക'}</option>
              {SOIL_TYPES.map(soil => (
                <option key={soil} value={soil}>
                  {soilOptions[language][soil]}
                </option>
              ))}
            </select>
            {errors.soilType && <p className="text-error" style={{ fontSize: '0.875rem', marginTop: '0.25rem' }}>{errors.soilType}</p>}
          </div>

          <div className="form-group">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="irrigation"
                checked={formData.irrigation}
                onChange={handleInputChange}
              />
              <span className="form-label mb-0">
                {language === 'en' ? 'Irrigation facilities available' : 'ജലസേചന സൗകര്യങ്ങൾ ലഭ്യമാണ്'}
              </span>
            </label>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary w-full"
            disabled={isLoading}
            style={{ marginTop: '2rem' }}
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="loading-spinner" />
                {language === 'en' ? 'Setting up...' : 'സജ്ജീകരിക്കുന്നു...'}
              </div>
            ) : (
              language === 'en' ? 'Complete Setup' : 'സജ്ജീകരണം പൂർത്തിയാക്കുക'
            )}
          </button>
        </form>
      </div>
    </div>
  )
}

export default FarmSetup