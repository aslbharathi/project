import React, { useState, useRef, useEffect } from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import { useFarmData } from '../contexts/FarmDataContext'
import { Mic, MicOff, Send, Camera, Image } from 'lucide-react'

const ChatInterface = () => {
  const { language, toggleLanguage, t } = useLanguage()
  const { farmData, chatHistory, addChatMessage } = useFarmData()
  const [message, setMessage] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const chatContainerRef = useRef(null)
  const fileInputRef = useRef(null)

  useEffect(() => {
    // Scroll to bottom when new messages are added
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [chatHistory])

  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert(language === 'ml' ? 'ശബ്ദ തിരിച്ചറിയൽ പിന്തുണയ്ക്കുന്നില്ല' : 'Speech recognition not supported')
      return
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SpeechRecognition()
    
    recognition.lang = language === 'ml' ? 'ml-IN' : 'en-IN'
    recognition.continuous = false
    recognition.interimResults = false

    setIsRecording(true)

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript
      setMessage(transcript)
      setIsRecording(false)
    }

    recognition.onerror = () => {
      setIsRecording(false)
      alert(language === 'ml' ? 'ശബ്ദ തിരിച്ചറിയൽ പരാജയപ്പെട്ടു' : 'Speech recognition failed')
    }

    recognition.onend = () => {
      setIsRecording(false)
    }

    recognition.start()
  }

  const generateAIResponse = (userMessage) => {
    const lowerMessage = userMessage.toLowerCase()
    
    // Pest/Disease related queries
    if (lowerMessage.includes('പുഴു') || lowerMessage.includes('കീടം') || lowerMessage.includes('pest') || lowerMessage.includes('bug')) {
      return t('pestResponse')
    }
    
    // Weather related queries
    if (lowerMessage.includes('മഴ') || lowerMessage.includes('കാലാവസ്ഥ') || lowerMessage.includes('weather') || lowerMessage.includes('rain')) {
      return t('weatherAlert')
    }
    
    // Price related queries
    if (lowerMessage.includes('വില') || lowerMessage.includes('price') || lowerMessage.includes('market')) {
      return t('priceAlert')
    }
    
    // Fertilizer related queries
    if (lowerMessage.includes('വളം') || lowerMessage.includes('fertilizer')) {
      return language === 'ml' ? 
        `നിങ്ങളുടെ ${t(farmData.currentCrop)} വിളയ്ക്ക് ഇപ്പോൾ ജൈവ വളം ഉപയോഗിക്കുന്നത് നല്ലതാണ്. മഴയ്ക്ക് മുമ്പ് വളം ഇടരുത്.` :
        `For your ${t(farmData.currentCrop)} crop, organic fertilizer is recommended now. Don't apply fertilizer before rain.`
    }
    
    // Watering related queries
    if (lowerMessage.includes('ജലം') || lowerMessage.includes('നനയ്ക്കുക') || lowerMessage.includes('water') || lowerMessage.includes('irrigation')) {
      return language === 'ml' ? 
        `${t(farmData.currentCrop)} വിളയ്ക്ക് ദിവസവും രാവിലെ ജലം നൽകുക. വൈകുന്നേരം 5 മണിക്ക് ശേഷം നനയ്ക്കരുത്.` :
        `Water your ${t(farmData.currentCrop)} crop every morning. Don't water after 5 PM.`
    }
    
    // Default response
    return language === 'ml' ? 
      `നിങ്ങളുടെ ${t(farmData.currentCrop)} വിളയെക്കുറിച്ച് കൂടുതൽ വിവരങ്ങൾ ആവശ്യമാണ്. ദയവായി കൂടുതൽ വിശദമായി പറയുക.` :
      `I need more information about your ${t(farmData.currentCrop)} crop. Please provide more details.`
  }

  const handleSendMessage = async () => {
    if (!message.trim()) return

    // Add user message
    addChatMessage({
      type: 'user',
      content: message,
      sender: 'user'
    })

    const userMessage = message
    setMessage('')
    setIsTyping(true)

    // Simulate AI thinking time
    await new Promise(resolve => setTimeout(resolve, 1500))

    // Generate and add AI response
    const aiResponse = generateAIResponse(userMessage)
    addChatMessage({
      type: 'ai',
      content: aiResponse,
      sender: 'ai'
    })

    setIsTyping(false)
  }

  const handleImageUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      // In a real app, you would upload the image and analyze it
      const imageMessage = language === 'ml' ? 
        'ചിത്രം അപ്‌ലോഡ് ചെയ്തു. വിശകലനം ചെയ്യുന്നു...' :
        'Image uploaded. Analyzing...'
      
      addChatMessage({
        type: 'user',
        content: imageMessage,
        sender: 'user',
        hasImage: true
      })

      // Simulate image analysis
      setTimeout(() => {
        const analysisResponse = language === 'ml' ? 
          'ചിത്രത്തിൽ നിന്ന് കാണുന്നത്: ഇലകളിൽ മഞ്ഞനിറം കാണുന്നു. ഇത് പോഷകക്കുറവ് ആകാം. മഗ്നീഷ്യം സൾഫേറ്റ് സ്പ്രേ ചെയ്യുക.' :
          'From the image: Yellow spots on leaves detected. This could be nutrient deficiency. Apply magnesium sulfate spray.'
        
        addChatMessage({
          type: 'ai',
          content: analysisResponse,
          sender: 'ai'
        })
      }, 2000)
    }
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
        {/* Header */}
        <div className="text-center mb-4 fade-in">
          <h1 className="font-bold text-primary mb-2" style={{ fontSize: '1.5rem' }}>
            {language === 'ml' ? 'കൃഷി സഖി ചാറ്റ്' : 'Krishi Sakhi Chat'}
          </h1>
          <p className="text-gray">
            {language === 'ml' ? 'നിങ്ങളുടെ കൃഷി സംബന്ധിയായ സംശയങ്ങൾ ചോദിക്കുക' : 'Ask your farming questions'}
          </p>
        </div>

        {/* Chat Container */}
        <div 
          ref={chatContainerRef}
          className="chat-container mb-4"
        >
          {chatHistory.length === 0 ? (
            <div className="text-center text-muted p-4">
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🤖</div>
              <p>
                {language === 'ml' ? 
                  'നമസ്കാരം! നിങ്ങളുടെ കൃഷി സഖി ഇവിടെ സഹായിക്കാൻ തയ്യാറാണ്.' :
                  'Hello! Your farming assistant is here to help.'
                }
              </p>
              <div className="mt-3">
                <p className="text-sm">
                  {language === 'ml' ? 'ഉദാഹരണ ചോദ്യങ്ങൾ:' : 'Example questions:'}
                </p>
                <div className="text-left text-sm mt-2">
                  <p>• {language === 'ml' ? 'എന്റെ വഴുതനയിൽ പുഴുക്കൾ കാണുന്നു' : 'I see pests on my brinjal'}</p>
                  <p>• {language === 'ml' ? 'ഇന്ന് മഴ പെയ്യുമോ?' : 'Will it rain today?'}</p>
                  <p>• {language === 'ml' ? 'വളം എപ്പോൾ ഇടണം?' : 'When to apply fertilizer?'}</p>
                </div>
              </div>
            </div>
          ) : (
            chatHistory.map((msg) => (
              <div key={msg.id} className={`chat-message ${msg.sender}`}>
                <div className={`message-bubble ${msg.sender}`}>
                  {msg.hasImage && (
                    <div className="flex items-center gap-2 mb-2 text-sm opacity-75">
                      <Image size={16} />
                      {language === 'ml' ? 'ചിത്രം' : 'Image'}
                    </div>
                  )}
                  <p className="mb-0">{msg.content}</p>
                  <div className="text-xs opacity-75 mt-1">
                    {new Date(msg.timestamp).toLocaleTimeString(language === 'ml' ? 'ml-IN' : 'en-IN', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              </div>
            ))
          )}
          
          {isTyping && (
            <div className="chat-message ai">
              <div className="message-bubble ai">
                <div className="flex items-center gap-2">
                  <div className="loading-spinner" style={{ width: '16px', height: '16px' }} />
                  <span>{language === 'ml' ? 'ടൈപ്പ് ചെയ്യുന്നു...' : 'Typing...'}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Container */}
        <div className="chat-input-container">
          <button
            className={`btn-voice ${isRecording ? 'recording' : ''}`}
            onClick={handleVoiceInput}
            disabled={isRecording || isTyping}
            style={{ width: '48px', height: '48px' }}
          >
            {isRecording ? <MicOff size={20} /> : <Mic size={20} />}
          </button>
          
          <div className="flex-1 relative">
            <textarea
              className="chat-input"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={isRecording ? t('listening') : t('typeMessage')}
              disabled={isRecording || isTyping}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleSendMessage()
                }
              }}
            />
            <button
              className="voice-btn"
              style={{ right: '8px', top: '8px' }}
              onClick={() => fileInputRef.current?.click()}
              disabled={isTyping}
            >
              <Camera size={16} />
            </button>
          </div>
          
          <button
            className="btn btn-primary"
            onClick={handleSendMessage}
            disabled={!message.trim() || isRecording || isTyping}
            style={{ width: '48px', height: '48px', padding: '0' }}
          >
            <Send size={20} />
          </button>
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          style={{ display: 'none' }}
        />

        {/* Recording indicator */}
        {isRecording && (
          <div className="text-center mt-2">
            <p className="text-error font-medium">
              {t('listening')}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ChatInterface