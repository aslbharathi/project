import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'

const WelcomeScreen = () => {
  const navigate = useNavigate()
  const { language, toggleLanguage } = useLanguage()

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex flex-col">
      {/* Language Toggle */}
      <button 
        className="absolute top-4 right-4 bg-white border-2 border-gray-300 rounded-lg px-3 py-1 text-sm font-semibold shadow-md z-10"
        onClick={toggleLanguage}
      >
        {language === 'en' ? 'മലയാളം' : 'English'}
      </button>

      {/* Header */}
      <div className="bg-green-600 text-white p-6 text-center">
        <div className="text-4xl mb-2">🌾</div>
        <h1 className="text-3xl font-bold mb-2">
          {language === 'en' ? 'Krishi Sakhi' : 'കൃഷി സഖി'}
        </h1>
        <p className="text-green-100 text-sm">
          {language === 'en' 
            ? 'Kerala Government - Department of Agriculture'
            : 'കേരള സർക്കാർ - കൃഷി വകുപ്പ്'
          }
        </p>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="max-w-md w-full text-center">
          {/* Welcome Message */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              {language === 'en' 
                ? 'Welcome to Your Digital Farming Assistant'
                : 'നിങ്ങളുടെ ഡിജിറ്റൽ കൃഷി സഹായിയിലേക്ക് സ്വാഗതം'
              }
            </h2>
            <p className="text-gray-600 text-lg">
              {language === 'en' 
                ? 'Get expert farming advice, weather alerts, and government scheme information'
                : 'വിദഗ്ധ കൃഷി ഉപദേശം, കാലാവസ്ഥാ മുന്നറിയിപ്പുകൾ, സർക്കാർ പദ്ധതി വിവരങ്ങൾ എന്നിവ ലഭിക്കുക'
              }
            </p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 gap-4 mb-8">
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="text-2xl mb-2">🤖</div>
              <h3 className="font-semibold text-gray-800 mb-1">
                {language === 'en' ? 'AI Assistant' : 'AI സഹായി'}
              </h3>
              <p className="text-sm text-gray-600">
                {language === 'en' 
                  ? 'Get instant farming advice in Malayalam'
                  : 'മലയാളത്തിൽ തൽക്ഷണ കൃഷി ഉപദേശം ലഭിക്കുക'
                }
              </p>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="text-2xl mb-2">🌤️</div>
              <h3 className="font-semibold text-gray-800 mb-1">
                {language === 'en' ? 'Weather Alerts' : 'കാലാവസ്ഥാ മുന്നറിയിപ്പുകൾ'}
              </h3>
              <p className="text-sm text-gray-600">
                {language === 'en' 
                  ? 'Timely weather updates for better farming'
                  : 'മെച്ചപ്പെട്ട കൃഷിക്കായി സമയബന്ധിത കാലാവസ്ഥാ അപ്‌ഡേറ്റുകൾ'
                }
              </p>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="text-2xl mb-2">🏛️</div>
              <h3 className="font-semibold text-gray-800 mb-1">
                {language === 'en' ? 'Government Schemes' : 'സർക്കാർ പദ്ധതികൾ'}
              </h3>
              <p className="text-sm text-gray-600">
                {language === 'en' 
                  ? 'Access to farming subsidies and support'
                  : 'കൃഷി സബ്‌സിഡികളും പിന്തുണയും ലഭ്യമാക്കുക'
                }
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <button 
              onClick={() => navigate('/signup')}
              className="w-full bg-green-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-green-700 transition-colors shadow-lg"
            >
              {language === 'en' 
                ? '🚀 Get Started - Sign Up'
                : '🚀 ആരംഭിക്കുക - സൈൻ അപ്പ്'
              }
            </button>
            
            <button 
              onClick={() => navigate('/login')}
              className="w-full border-2 border-green-600 text-green-600 py-4 px-6 rounded-lg font-semibold text-lg hover:bg-green-50 transition-colors"
            >
              {language === 'en' 
                ? '👤 Already have an account? Login'
                : '👤 ഇതിനകം അക്കൗണ്ട് ഉണ്ടോ? ലോഗിൻ'
              }
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-100 p-4 text-center">
        <p className="text-sm text-gray-600">
          {language === 'en' 
            ? '© 2024 Kerala Government - Department of Agriculture'
            : '© 2024 കേരള സർക്കാർ - കൃഷി വകുപ്പ്'
          }
        </p>
        <p className="text-xs text-gray-500 mt-1">
          {language === 'en' 
            ? 'Empowering Kerala farmers through technology'
            : 'സാങ്കേതികവിദ്യയിലൂടെ കേരള കർഷകരെ ശാക്തീകരിക്കുന്നു'
          }
        </p>
      </div>
    </div>
  )
}

export default WelcomeScreen