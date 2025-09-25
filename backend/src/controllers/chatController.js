import Chat from '../models/Chat.js'
import { validationResult } from 'express-validator'
import { generateUserId, generateSessionId } from '../utils/helpers.js'
import { generateAIResponse } from '../services/aiService.js'

// Get chat history
export const getChatHistory = async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] || generateUserId(req)
    const { sessionId } = req.query

    let query = { userId, isActive: true }
    if (sessionId) {
      query.sessionId = sessionId
    }

    const chats = await Chat.find(query)
      .sort({ createdAt: -1 })
      .limit(10)

    // Flatten messages from all chat sessions
    const messages = chats.reduce((acc, chat) => {
      return [...acc, ...chat.messages]
    }, []).sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))

    res.json({
      success: true,
      data: messages
    })
  } catch (error) {
    console.error('Get chat history error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error'
    })
  }
}

// Send message
export const sendMessage = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array()
      })
    }

    const userId = req.headers['x-user-id'] || generateUserId(req)
    const { message, sessionId: providedSessionId, hasImage, imageUrl } = req.body

    const sessionId = providedSessionId || generateSessionId()

    // Find or create chat session
    let chat = await Chat.findOne({ userId, sessionId })
    if (!chat) {
      chat = new Chat({
        userId,
        sessionId,
        messages: []
      })
    }

    // Add user message
    const userMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: message,
      sender: 'user',
      hasImage: hasImage || false,
      imageUrl: imageUrl || null,
      timestamp: new Date()
    }

    chat.messages.push(userMessage)

    // Generate AI response
    const aiResponse = await generateAIResponse(message, userId)
    
    const aiMessage = {
      id: (Date.now() + 1).toString(),
      type: 'ai',
      content: aiResponse.content,
      sender: 'ai',
      timestamp: new Date()
    }

    chat.messages.push(aiMessage)

    // Keep only last 50 messages per session
    if (chat.messages.length > 50) {
      chat.messages = chat.messages.slice(-50)
    }

    await chat.save()

    res.json({
      success: true,
      data: {
        userMessage,
        aiMessage,
        sessionId
      }
    })
  } catch (error) {
    console.error('Send message error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error'
    })
  }
}

// Clear chat history
export const clearChatHistory = async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] || generateUserId(req)
    const { sessionId } = req.body

    if (sessionId) {
      await Chat.findOneAndUpdate(
        { userId, sessionId },
        { isActive: false }
      )
    } else {
      await Chat.updateMany(
        { userId },
        { isActive: false }
      )
    }

    res.json({
      success: true,
      message: 'Chat history cleared successfully'
    })
  } catch (error) {
    console.error('Clear chat history error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error'
    })
  }
}