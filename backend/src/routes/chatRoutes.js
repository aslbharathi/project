import express from 'express'
import { body } from 'express-validator'
import {
  getChatHistory,
  sendMessage,
  clearChatHistory
} from '../controllers/chatController.js'

const router = express.Router()

// Get chat history
router.get('/history', getChatHistory)

// Send message
router.post('/message', [
  body('message').trim().notEmpty().withMessage('Message is required'),
  body('sessionId').optional().trim(),
  body('hasImage').optional().isBoolean(),
  body('imageUrl').optional().isURL().withMessage('Invalid image URL')
], sendMessage)

// Clear chat history
router.delete('/history', clearChatHistory)

export default router