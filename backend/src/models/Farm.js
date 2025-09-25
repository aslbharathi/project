import mongoose from 'mongoose'

const farmSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  landSize: {
    type: Number,
    required: true,
    min: 0
  },
  landUnit: {
    type: String,
    required: true,
    enum: ['cents', 'hectares'],
    default: 'cents'
  },
  currentCrop: {
    type: String,
    required: true,
    enum: ['paddy', 'coconut', 'rubber', 'banana', 'brinjal', 'pepper', 'cardamom', 'ginger', 'turmeric']
  },
  soilType: {
    type: String,
    required: true,
    enum: ['laterite', 'alluvial', 'coastal', 'forest']
  },
  irrigation: {
    type: Boolean,
    default: false
  },
  coordinates: {
    latitude: Number,
    longitude: Number
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
})

// Index for efficient queries
farmSchema.index({ userId: 1 })
farmSchema.index({ location: 1 })
farmSchema.index({ currentCrop: 1 })

export default mongoose.model('Farm', farmSchema)