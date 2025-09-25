import mongoose from 'mongoose'

const activitySchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  farmId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Farm',
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['sowedSeeds', 'appliedFertilizer', 'irrigated', 'pestDisease', 'weeding', 'harvested']
  },
  crop: {
    type: String,
    required: true
  },
  notes: {
    type: String,
    trim: true
  },
  location: {
    type: String,
    required: true
  },
  weather: {
    temperature: Number,
    humidity: Number,
    rainfall: Number
  },
  images: [{
    url: { type: String, required: true },
    public_id: String,
    width: Number,
    height: Number,
    size: Number,
    format: String,
    caption: String
  }],
  isDeleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
})

// Indexes for efficient queries
activitySchema.index({ userId: 1, createdAt: -1 })
activitySchema.index({ farmId: 1, createdAt: -1 })
activitySchema.index({ type: 1 })
activitySchema.index({ crop: 1 })

export default mongoose.model('Activity', activitySchema)