import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import { useFarmData } from '../contexts/FarmDataContext'
import { Mic, MicOff, MapPin, User, Ruler, Sprout, Mountain, Droplets } from 'lucide-react'

const FarmSetup = ({ onComplete }) => {
  const navigate = useNavigate()
  const { language, toggleLanguage, t } = useLanguage()
  const { saveFarmData } = useFarmData()
  
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    landSize: '',
    landUnit: 'cents',
    currentCrop: '',
    soilType: '',
    irrigation: false
  })
  
  const [isRecording, setIsRecording] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  const crops = [
    'paddy', 'coconut', 'rubber', 'banana', 'brinjal', 
    'pepper', 'cardamom', 'ginger', 'turmeric'
  ]

  const soilTypes = ['laterite', 'alluvial', 'coastal', 'forest']

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleVoiceInput = (field) => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert(language === 'ml' ? 'ശബ്ദ തിരിച്ചറിയൽ പിന്തുണയ്ക്കുന്നില്ല' : 'Speech recognition not supported')
      return
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SpeechRecognition()
    
    recognition.lang = language === 'ml' ? 'ml-IN' : 'en-IN'
    recognition.continuous = false
    recognition.interimResults = false

    setIsRecording(prev => ({ ...prev, [field]: true }))

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript
      handleInputChange(field, transcript)
      setIsRecording(prev => ({ ...prev, [field]: false }))
    }

    recognition.onerror = () => {
      setIsRecording(prev => ({ ...prev, [field]: false }))
      alert(language === 'ml' ? 'ശബ്ദ തിരിച്ചറിയൽ പരാജയപ്പെട്ടു' : 'Speech recognition failed')
    }

    recognition.onend = () => {
      setIsRecording(prev => ({ ...prev, [field]: false }))
    }

    recognition.start()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.name || !formData.location || !formData.landSize || !formData.currentCrop || !formData.soilType) {
      alert(language === 'ml' ? 'എല്ലാ ഫീൽഡുകളും പൂരിപ്പിക്കുക' : 'Please fill all fields')
      return
    }

    setIsLoading(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    saveFarmData(formData)
    onComplete()
    navigate('/dashboard')
  }

  return (
    <div className="container">
      <button 
        className="language-toggle"
        onClick={toggleLanguage}
      >
        {language === 'ml' ? 'English' : 'മലയാളം'}
      </button>

      <div style={{ paddingTop: '2rem', paddingBottom: '6rem' }}>
        <div className="text-center mb-4 fade-in">
          <h1 className="font-bold text-primary mb-2" style={{ fontSize: '1.75rem' }}>
            {t('setupTitle')}
          </h1>
          <p className="text-gray">
            {language === 'ml' ? 'നിങ്ങളുടെ വിവരങ്ങൾ നൽകുക' : 'Provide your information'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="fade-in">
          {/* Name Field */}
          <div className="form-group">
            <label className="form-label flex items-center gap-2">
              <User size={18} />
              {t('name')} *
            </label>
            <div className="input-with-voice">
              <input
                type="text"
                className="form-input"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder={language === 'ml' ? 'നിങ്ങളുടെ പേര്' : 'Your name'}
                required
              />
              <button
                type="button"
                className={`voice-btn ${isRecording.name ? 'recording' : ''}`}
                onClick={() => handleVoiceInput('name')}
                disabled={isRecording.name}
              >
                {isRecording.name ? <MicOff size={16} /> : <Mic size={16} />}
              </button>
            </div>
          </div>

          {/* Location Field */}
          <div className="form-group">
            <label className="form-label flex items-center gap-2">
              <MapPin size={18} />
              {t('location')} *
            </label>
            <div className="input-with-voice">
              <input
                type="text"
                className="form-input"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder={language === 'ml' ? 'നിങ്ങളുടെ സ്ഥലം' : 'Your location'}
                required
              />
              <button
                type="button"
                className={`voice-btn ${isRecording.location ? 'recording' : ''}`}
                onClick={() => handleVoiceInput('location')}
                disabled={isRecording.location}
              >
                {isRecording.location ? <MicOff size={16} /> : <Mic size={16} />}
              </button>
            </div>
          </div>

          {/* Land Size Field */}
          <div className="form-group">
            <label className="form-label flex items-center gap-2">
              <Ruler size={18} />
              {t('landSize')} *
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                className="form-input"
                style={{ flex: 2 }}
                value={formData.landSize}
                onChange={(e) => handleInputChange('landSize', e.target.value)}
                placeholder="0"
                required
                min="0"
                step="0.1"
              />
              <select
                className="form-input form-select"
                style={{ flex: 1 }}
                value={formData.landUnit}
                onChange={(e) => handleInputChange('landUnit', e.target.value)}
              >
                <option value="cents">{t('cents')}</option>
                <option value="hectares">{t('hectares')}</option>
              </select>
            </div>
          </div>

          {/* Current Crop Field */}
          <div className="form-group">
            <label className="form-label flex items-center gap-2">
              <Sprout size={18} />
              {t('currentCrop')} *
            </label>
            <select
              className="form-input form-select"
              value={formData.currentCrop}
              onChange={(e) => handleInputChange('currentCrop', e.target.value)}
              required
            >
              <option value="">
                {language === 'ml' ? 'വിള തിരഞ്ഞെടുക്കുക' : 'Select crop'}
              </option>
              {crops.map(crop => (
                <option key={crop} value={crop}>
                  {t(crop)}
                </option>
              ))}
            </select>
          </div>

          {/* Soil Type Field */}
          <div className="form-group">
            <label className="form-label flex items-center gap-2">
              <Mountain size={18} />
              {t('soilType')} *
            </label>
            <select
              className="form-input form-select"
              value={formData.soilType}
              onChange={(e) => handleInputChange('soilType', e.target.value)}
              required
            >
              <option value="">
                {language === 'ml' ? 'മണ്ണിന്റെ തരം തിരഞ്ഞെടുക്കുക' : 'Select soil type'}
              </option>
              {soilTypes.map(soil => (
                <option key={soil} value={soil}>
                  {t(soil)}
                </option>
              ))}
            </select>
          </div>

          {/* Irrigation Field */}
          <div className="form-group">
            <label className="form-label flex items-center gap-2">
              <Droplets size={18} />
              {t('irrigation')}
            </label>
            <div className="flex gap-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="irrigation"
                  checked={formData.irrigation === true}
                  onChange={() => handleInputChange('irrigation', true)}
                />
                <span>{t('yes')}</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="irrigation"
                  checked={formData.irrigation === false}
                  onChange={() => handleInputChange('irrigation', false)}
                />
                <span>{t('no')}</span>
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="btn btn-primary w-full mt-4"
            disabled={isLoading}
            style={{ fontSize: '1.125rem' }}
          >
            {isLoading ? (
              <>
                <div className="loading-spinner" />
                {t('loading')}
              </>
            ) : (
              <>
                <Sprout size={20} />
                {t('saveProfile')}
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}

export default FarmSetup