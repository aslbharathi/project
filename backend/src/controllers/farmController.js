import { DateTime } from 'luxon'
import Farm from '../models/Farm.js'
import Activity from '../models/Activity.js'
import { validationResult } from 'express-validator'
import { generateUserId } from '../utils/helpers.js'

// Get farm profile
export const getFarmProfile = async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] || generateUserId(req)
    
    const farm = await Farm.findOne({ userId, isActive: true })
    
    if (!farm) {
      return res.status(404).json({
        success: false,
        message: 'Farm profile not found'
      })
    }

    res.json({
      success: true,
      data: farm
    })
  } catch (error) {
    console.error('Get farm profile error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error'
    })
  }
}

// Create or update farm profile
export const saveFarmProfile = async (req, res) => {
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
    const farmData = req.body

    let farm = await Farm.findOne({ userId })
    
    if (farm) {
      // Update existing farm
      Object.assign(farm, farmData)
      farm.updatedAt = new Date()
      await farm.save()
    } else {
      // Create new farm
      farm = new Farm({
        userId,
        ...farmData,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      await farm.save()
    }

    res.json({
      success: true,
      message: 'Farm profile saved successfully',
      data: farm
    })
  } catch (error) {
    console.error('Save farm profile error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error'
    })
  }
}

// Get activities
export const getActivities = async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] || generateUserId(req)
    const { page = 1, limit = 20 } = req.query

    const activities = await Activity.find({ 
      userId, 
      isDeleted: false 
    })
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .populate('farmId', 'name location')

    const total = await Activity.countDocuments({ 
      userId, 
      isDeleted: false 
    })

    res.json({
      success: true,
      data: activities,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Get activities error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error'
    })
  }
}

// Add activity
export const addActivity = async (req, res) => {
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
    const activityData = req.body

    // Get user's farm
    const farm = await Farm.findOne({ userId, isActive: true })
    if (!farm) {
      return res.status(404).json({
        success: false,
        message: 'Farm profile not found'
      })
    }

    const activity = new Activity({
      userId,
      farmId: farm._id,
      ...activityData
    })

    await activity.save()

    res.status(201).json({
      success: true,
      message: 'Activity added successfully',
      data: activity
    })
  } catch (error) {
    console.error('Add activity error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error'
    })
  }
}

// Delete activity
export const deleteActivity = async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] || generateUserId(req)
    const { id } = req.params

    const activity = await Activity.findOne({ 
      _id: id, 
      userId, 
      isDeleted: false 
    })

    if (!activity) {
      return res.status(404).json({
        success: false,
        message: 'Activity not found'
      })
    }

    activity.isDeleted = true
    await activity.save()

    res.json({
      success: true,
      message: 'Activity deleted successfully'
    })
  } catch (error) {
    console.error('Delete activity error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error'
    })
  }
}