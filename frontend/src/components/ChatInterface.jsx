import React, { useState, useEffect, useRef } from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import { farmService } from '../services/farmService'
import { formatTimeAgo } from '../utils/helpers'

const ChatInterface = () => {
  const { language, toggleLanguage } = useLanguage()
  const [messages, setMessages] = useState([])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const messagesEndRef = useRef(null)
  const recognitionRef = useRef(null)

  useEffect(() => {
    loadChatHistory()
    initializeSpeechRecognition()
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const loadChatHistory = async () => {
    try {
      const history = await farmService.getChatHistory()
      setMessages(Array.isArray(history) ? history : [])
    } catch (error) {
      console.error('Failed to load chat history:', error)
      // Add welcome message if no history
      setMessages([{
        id: '1',
        type: 'ai',
        content: language === 'en' 
          ? 'Hello! I\'m your farming assistant. How can I help you today?'
          : 'നമസ്കാരം! ഞാൻ നിങ്ങളുടെ കൃഷി സഹായിയാണ്. ഇന്ന് എങ്ങനെ സഹായിക്കാം?',
        sender: 'ai',
        timestamp: new Date().toISOString()
      }])
    }
  }

  const initializeSpeechRecognition = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      
      recognitionRef.current.continuous = false
      recognitionRef.current.interimResults = false
      recognitionRef.current.lang = language === 'ml' ? 'ml-IN' : 'en-IN'
      
      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript
        setInputMessage(transcript)
        setIsListening(false)
      }
      
      recognitionRef.current.onerror = () => {
        setIsListening(false)
      }
      
      recognitionRef.current.onend = () => {
        setIsListening(false)
      }
    }
  }

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

    try {
      const response = await farmService.sendMessage(inputMessage.trim())
      
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: response.response || response.content,
        sender: 'ai',
        timestamp: new Date().toISOString()
      }

      setMessages(prev => [...prev, aiMessage])
    } catch (error) {
      console.error('Failed to send message:', error)
      
      // Fallback AI response
      const fallbackMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: language === 'en' 
          ? 'I apologize, but I\'m having trouble connecting right now. Please try again later.'
          : 'ക്ഷമിക്കണം, ഇപ്പോൾ കണക്ഷൻ പ്രശ്നമുണ്ട്. പിന്നീട് വീണ്ടും ശ്രമിക്കുക.',
        sender: 'ai',
        timestamp: new Date().toISOString()
      }
      
      setMessages(prev => [...prev, fallbackMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleVoiceInput = () => {
    if (!recognitionRef.current) {
      alert(language === 'en' 
        ? 'Voice recognition is not supported in your browser'
        : 'നിങ്ങളുടെ ബ്രൗസറിൽ വോയ്‌സ് റെക്കഗ്നിഷൻ പിന്തുണയ്ക്കുന്നില്ല'
      )
      return
    }

    if (isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
    } else {
      recognitionRef.current.lang = language === 'ml' ? 'ml-IN' : 'en-IN'
      recognitionRef.current.start()
      setIsListening(true)
    }
  }

  return (
    <div className="container" style={{ height: '100vh', display: 'flex', flexDirection: 'column', paddingBottom: '100px' }}>
      <button 
        className="language-toggle"
        onClick={toggleLanguage}
        aria-label="Toggle Language"
      >
        {language === 'en' ? 'മലയാളം' : 'English'}
      </button>

      {/* Header */}
      <div className="flex items-center gap-3 p-3" style={{ borderBottom: '1px solid var(--gray-200)' }}>
        <div style={{ fontSize: '1.5rem' }}>🤖</div>
        <div>
          <h1 className="font-semibold">
            {language === 'en' ? 'Farming Assistant' : 'കൃഷി സഹായി'}
          </h1>
          <p className="text-muted" style={{ fontSize: '0.8rem' }}>
            {language === 'en' ? 'Ask me anything about farming' : 'കൃഷിയെക്കുറിച്ച് എന്തും ചോദിക്കുക'}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1" style={{ overflowY: 'auto', padding: '1rem 0' }}>
        {messages.map((message) => (
          <div
            key={message.id}
            className={`mb-4 flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.sender === 'user'
                  ? 'bg-primary text-white'
                  : 'bg-white shadow border'
              }`}
              style={{ maxWidth: '80%' }}
            >
              <p style={{ fontSize: '0.9rem', lineHeight: '1.4' }}>
                {message.content}
              </p>
              <p
                className={`text-xs mt-1 ${
                  message.sender === 'user' ? 'text-white opacity-75' : 'text-muted'
                }`}
              >
                {formatTimeAgo(message.timestamp, language)}
              </p>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start mb-4">
            <div className="bg-white shadow border px-4 py-2 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="loading-spinner" style={{ width: '16px', height: '16px' }} />
                <span style={{ fontSize: '0.9rem' }}>
                  {language === 'en' ? 'Thinking...' : 'ചിന്തിക്കുന്നു...'}
                </span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <div className="p-3" style={{ borderTop: '1px solid var(--gray-200)', backgroundColor: 'white' }}>
        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder={language === 'en' ? 'Type your message...' : 'നിങ്ങളുടെ സന്ദേശം ടൈപ്പ് ചെയ്യുക...'}
            className="flex-1 form-input"
            style={{ marginBottom: 0 }}
            disabled={isLoading}
          />
          
          <button
            type="button"
            onClick={handleVoiceInput}
            className={`btn-voice ${isListening ? 'recording' : ''}`}
            style={{ width: '48px', height: '48px', flexShrink: 0 }}
            disabled={isLoading}
          >
            {isListening ? '🔴' : '🎤'}
          </button>
          
          <button
            type="submit"
            className="btn btn-primary"
            style={{ padding: '0.75rem 1rem', flexShrink: 0 }}
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