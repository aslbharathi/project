export const CROPS = [
  'paddy', 'coconut', 'rubber', 'banana', 'brinjal', 
  'pepper', 'cardamom', 'ginger', 'turmeric'
]

export const SOIL_TYPES = ['laterite', 'alluvial', 'coastal', 'forest']

export const ACTIVITY_TYPES = [
  { id: 'sowedSeeds', icon: '🌱' },
  { id: 'appliedFertilizer', icon: '🌿' },
  { id: 'irrigated', icon: '💧' },
  { id: 'pestDisease', icon: '🐛' },
  { id: 'weeding', icon: '🌿' },
  { id: 'harvested', icon: '🌾' }
]

export const ALERT_PRIORITIES = {
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low'
}

export const STORAGE_KEYS = {
  FARM_DATA: 'krishiSakhiFarmData',
  ACTIVITIES: 'krishiSakhiActivities',
  CHAT_HISTORY: 'krishiSakhiChatHistory',
  LANGUAGE: 'krishiSakhiLanguage',
  TOKEN: 'krishiSakhiToken',
  USER: 'krishiSakhiUser'
}

export const KERALA_DISTRICTS = [
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

export const GOVERNMENT_SCHEMES = [
  {
    id: 'pm-kisan',
    name_en: 'PM-KISAN',
    name_ml: 'പിഎം-കിസാൻ',
    description_en: 'Direct income support to farmers',
    description_ml: 'കർഷകർക്ക് നേരിട്ടുള്ള വരുമാന പിന്തുണ',
    amount: 6000,
    eligibility: ['landowner', 'small_farmer'],
    documents: ['land_records', 'bank_account', 'aadhaar']
  },
  {
    id: 'kerala-farmer-assistance',
    name_en: 'Kerala Farmer Assistance Scheme',
    name_ml: 'കേരള കർഷക സഹായ പദ്ധതി',
    description_en: 'State government support for farmers',
    description_ml: 'കർഷകർക്കുള്ള സംസ്ഥാന സർക്കാർ പിന്തുണ',
    amount: 10000,
    eligibility: ['kerala_resident', 'active_farmer'],
    documents: ['residence_proof', 'farming_certificate']
  },
  {
    id: 'crop-insurance',
    name_en: 'Pradhan Mantri Fasal Bima Yojana',
    name_ml: 'പ്രധാനമന്ത്രി ഫസൽ ബീമ യോജന',
    description_en: 'Crop insurance scheme',
    description_ml: 'വിള ഇൻഷുറൻസ് പദ്ധതി',
    amount: 0, // Premium based
    eligibility: ['all_farmers'],
    documents: ['land_records', 'sowing_certificate']
  }
]