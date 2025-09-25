import React, { useState } from 'react'
import { useLanguage } from '../contexts/LanguageContext'

const ChatInterface = () => {
  const { language, toggleLanguage } = useLanguage()
  const [messages, setMessages] = useState([
    {
      id: '1',
      type: 'ai',
      content: language === 'en' 
        ? 'Hello! I\'m your farming assistant. How can I help you today?'
        : 'നമസ്കാരം! ഞാൻ നിങ്ങളുടെ കൃഷി സഹായിയാണ്. ഇന്ന് എങ്ങനെ സഹായിക്കാം?',
      sender: 'ai',
      timestamp: new Date().toISOString()
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSendMessage = async (e) => {
    e.preventDefault()
    
    if (!inputMessage.trim() || isLoading) return

    const userMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage.trim(),
      sender: 'user',
      timestamp: new Date().toISOString()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)

    // Mock AI response
    setTimeout(() => {
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: language === 'en' 
          ? 'Thank you for your question. I\'m here to help with your farming needs.'
          : 'നിങ്ങളുടെ ചോദ്യത്തിന് നന്ദി. നിങ്ങളുടെ കൃഷി ആവശ്യങ്ങളിൽ സഹായിക്കാൻ ഞാൻ ഇവിടെയുണ്ട്.',
        sender: 'ai',
        timestamp: new Date().toISOString()
      }
      setMessages(prev => [...prev, aiMessage])
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <button 
        className="absolute top-4 right-4 bg-white border-2 border-gray-300 rounded-lg px-3 py-1 text-sm font-semibold shadow-md z-10"
        onClick={toggleLanguage}
      >
        {language === 'en' ? 'മലയാളം' : 'English'}
      </button>

      {/* Header */}
      <div className="bg-green-600 text-white p-4 flex items-center">
        <div className="text-2xl mr-3">🤖</div>
        <div>
          <h1 className="font-semibold">
            {language === 'en' ? 'Farming Assistant' : 'കൃഷി സഹായി'}
          </h1>
          <p className="text-green-100 text-sm">
            {language === 'en' ? 'Ask me anything about farming' : 'കൃഷിയെക്കുറിച്ച് എന്തും ചോദിക്കുക'}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 pb-20">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`mb-4 flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.sender === 'user'
                  ? 'bg-green-600 text-white'
                  : 'bg-white shadow border'
              }`}
            >
              <p className="text-sm">{message.content}</p>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start mb-4">
            <div className="bg-white shadow border px-4 py-2 rounded-lg">
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600 mr-2"></div>
                <span className="text-sm">
                  {language === 'en' ? 'Thinking...' : 'ചിന്തിക്കുന്നു...'}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Form */}
      <div className="fixed bottom-16 left-0 right-0 bg-white border-t p-4">
        <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder={language === 'en' ? 'Type your message...' : 'നിങ്ങളുടെ സന്ദേശം ടൈപ്പ് ചെയ്യുക...'}
            className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
            disabled={isLoading}
          />
          
          <button
            type="button"
            className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors"
            disabled={isLoading}
          >
            🎤
          </button>
          
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50"
            disabled={isLoading || !inputMessage.trim()}
          >
            {language === 'en' ? 'Send' : 'അയയ്ക്കുക'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default ChatInterface