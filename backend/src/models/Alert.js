import mongoose from 'mongoose'

const alertSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['weather', 'price', 'scheme', 'irrigation', 'pest', 'fertilizer', 'harvest']
  },
  priority: {
    type: String,
    required: true,
    enum: ['high', 'medium', 'low'],
    default: 'medium'
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  location: String,
  crop: String,
  isRead: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
  }
}, {
  timestamps: true
})

// TTL index to automatically delete expired alerts
alertSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })

// Indexes for efficient queries
alertSchema.index({ userId: 1, createdAt: -1 })
alertSchema.index({ type: 1 })
alertSchema.index({ priority: 1 })
alertSchema.index({ isRead: 1 })

export default mongoose.model('Alert', alertSchema)