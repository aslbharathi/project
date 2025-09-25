import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import { useFarmData } from '../contexts/FarmDataContext'

const CROPS = [
  'paddy', 'coconut', 'rubber', 'banana', 'brinjal', 
  'pepper', 'cardamom', 'ginger', 'turmeric'
]

const SOIL_TYPES = ['laterite', 'alluvial', 'coastal', 'forest']

const FarmSetup = () => {
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

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.name?.trim()) {
      newErrors.name = language === 'en' ? 'Farm name is required' : 'കൃഷിയിടത്തിന്റെ പേര് ആവശ്യമാണ്'
    }
    
    if (!formData.location?.trim()) {
      newErrors.location = language === 'en' ? 'Location is required' : 'സ്ഥലം ആവശ്യമാണ്'
    }
    
    if (!formData.landSize || formData.landSize <= 0) {
      newErrors.landSize = language === 'en' ? 'Valid land size is required' : 'സാധുവായ ഭൂമിയുടെ വലിപ്പം ആവശ്യമാണ്'
    }
    
    if (!formData.currentCrop) {
      newErrors.currentCrop = language === 'en' ? 'Current crop is required' : 'നിലവിലെ വിള ആവശ്യമാണ്'
    }
    
    if (!formData.soilType) {
      newErrors.soilType = language === 'en' ? 'Soil type is required' : 'മണ്ണിന്റെ തരം ആവശ്യമാണ്'
    }
    
    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const validationErrors = validateForm()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setIsLoading(true)
    
    try {
      await updateFarmData(formData)
      navigate('/dashboard')
    } catch (error) {
      console.error('Farm setup error:', error)
      // Still proceed if offline
      await updateFarmData(formData)
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <button 
        className="absolute top-4 right-4 bg-white border-2 border-gray-300 rounded-lg px-3 py-1 text-sm font-semibold shadow-md"
        onClick={toggleLanguage}
      >
        {language === 'en' ? 'മലയാളം' : 'English'}
      </button>

      <div className="max-w-md mx-auto pt-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-green-600 mb-2">
            {language === 'en' ? 'Set Up Your Farm' : 'നിങ്ങളുടെ കൃഷിയിടം സജ്ജീകരിക്കുക'}
          </h1>
          <p className="text-gray-600">
            {language === 'en' 
              ? 'Tell us about your farm to get personalized advice'
              : 'വ്യക്തിഗത ഉപദേശം ലഭിക്കാൻ നിങ്ങളുടെ കൃഷിയിടത്തെക്കുറിച്ച് പറയുക'
            }
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                {language === 'en' ? 'Farm Name' : 'കൃഷിയിടത്തിന്റെ പേര്'}
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
                placeholder={language === 'en' ? 'Enter farm name' : 'കൃഷിയിടത്തിന്റെ പേര് നൽകുക'}
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                {language === 'en' ? 'Location' : 'സ്ഥലം'}
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
                placeholder={language === 'en' ? 'Village, District' : 'ഗ്രാമം, ജില്ല'}
              />
              {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  {language === 'en' ? 'Land Size' : 'ഭൂമിയുടെ വലിപ്പം'}
                </label>
                <input
                  type="number"
                  name="landSize"
                  value={formData.landSize}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
                  placeholder="0"
                  min="0"
                  step="0.1"
                />
                {errors.landSize && <p className="text-red-500 text-sm mt-1">{errors.landSize}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  {language === 'en' ? 'Unit' : 'യൂണിറ്റ്'}
                </label>
                <select
                  name="landUnit"
                  value={formData.landUnit}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
                >
                  <option value="cents">{language === 'en' ? 'Cents' : 'സെന്റ്'}</option>
                  <option value="hectares">{language === 'en' ? 'Hectares' : 'ഹെക്ടർ'}</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                {language === 'en' ? 'Current Crop' : 'നിലവിലെ വിള'}
              </label>
              <select
                name="currentCrop"
                value={formData.currentCrop}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
              >
                <option value="">{language === 'en' ? 'Select crop' : 'വിള തിരഞ്ഞെടുക്കുക'}</option>
                {CROPS.map(crop => (
                  <option key={crop} value={crop}>
                    {cropOptions[language][crop]}
                  </option>
                ))}
              </select>
              {errors.currentCrop && <p className="text-red-500 text-sm mt-1">{errors.currentCrop}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                {language === 'en' ? 'Soil Type' : 'മണ്ണിന്റെ തരം'}
              </label>
              <select
                name="soilType"
                value={formData.soilType}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
              >
                <option value="">{language === 'en' ? 'Select soil type' : 'മണ്ണിന്റെ തരം തിരഞ്ഞെടുക്കുക'}</option>
                {SOIL_TYPES.map(soil => (
                  <option key={soil} value={soil}>
                    {soilOptions[language][soil]}
                  </option>
                ))}
              </select>
              {errors.soilType && <p className="text-red-500 text-sm mt-1">{errors.soilType}</p>}
            </div>

            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="irrigation"
                  checked={formData.irrigation}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                <span className="text-sm font-semibold text-gray-700">
                  {language === 'en' ? 'Irrigation facilities available' : 'ജലസേചന സൗകര്യങ്ങൾ ലഭ്യമാണ്'}
                </span>
              </label>
            </div>

            <button 
              type="submit" 
              className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-semibold text-lg hover:bg-green-700 transition-colors disabled:opacity-50 mt-6"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  {language === 'en' ? 'Setting up...' : 'സജ്ജീകരിക്കുന്നു...'}
                </div>
              ) : (
                language === 'en' ? 'Complete Setup' : 'സജ്ജീകരണം പൂർത്തിയാക്കുക'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default FarmSetup