import mongoose from 'mongoose'

const chatSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  sessionId: {
    type: String,
    required: true
  },
  messages: [{
    id: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['user', 'ai'],
      required: true
    },
    content: {
      type: String,
      required: true
    },
    sender: {
      type: String,
      enum: ['user', 'ai'],
      required: true
    },
    hasImage: {
      type: Boolean,
      default: false
    },
    imageUrl: String,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
})

// Indexes for efficient queries
chatSchema.index({ userId: 1, createdAt: -1 })
chatSchema.index({ sessionId: 1 })

export default mongoose.model('Chat', chatSchema)