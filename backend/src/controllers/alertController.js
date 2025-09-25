import Alert from '../models/Alert.js'
import Farm from '../models/Farm.js'
import { validationResult } from 'express-validator'
import { generateUserId } from '../utils/helpers.js'
import { generateLocationBasedAlerts } from '../services/alertService.js'

// Get alerts
export const getAlerts = async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] || generateUserId(req)
    const { page = 1, limit = 20, type, priority, unreadOnly } = req.query

    let query = { userId, isActive: true }
    
    if (type) query.type = type
    if (priority) query.priority = priority
    if (unreadOnly === 'true') query.isRead = false

    const alerts = await Alert.find(query)
      .sort({ priority: 1, createdAt: -1 }) // High priority first
      .limit(limit * 1)
      .skip((page - 1) * limit)

    const total = await Alert.countDocuments(query)
    const unreadCount = await Alert.countDocuments({ 
      userId, 
      isActive: true, 
      isRead: false 
    })

    res.json({
      success: true,
      data: alerts,
      unreadCount,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Get alerts error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error'
    })
  }
}

// Mark alert as read
export const markAlertAsRead = async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] || generateUserId(req)
    const { id } = req.params

    const alert = await Alert.findOne({ _id: id, userId, isActive: true })
    
    if (!alert) {
      return res.status(404).json({
        success: false,
        message: 'Alert not found'
      })
    }

    alert.isRead = true
    await alert.save()

    res.json({
      success: true,
      message: 'Alert marked as read'
    })
  } catch (error) {
    console.error('Mark alert as read error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error'
    })
  }
}

// Mark all alerts as read
export const markAllAlertsAsRead = async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] || generateUserId(req)

    await Alert.updateMany(
      { userId, isActive: true, isRead: false },
      { isRead: true }
    )

    res.json({
      success: true,
      message: 'All alerts marked as read'
    })
  } catch (error) {
    console.error('Mark all alerts as read error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error'
    })
  }
}

// Generate alerts for user
export const generateAlerts = async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] || generateUserId(req)

    // Get user's farm data
    const farm = await Farm.findOne({ userId, isActive: true })
    if (!farm) {
      return res.status(404).json({
        success: false,
        message: 'Farm profile not found'
      })
    }

    // Generate location and crop-based alerts
    const alerts = await generateLocationBasedAlerts(farm)

    // Save alerts to database
    const savedAlerts = await Alert.insertMany(
      alerts.map(alert => ({
        userId,
        ...alert
      }))
    )

    res.json({
      success: true,
      message: `Generated ${savedAlerts.length} alerts`,
      data: savedAlerts
    })
  } catch (error) {
    console.error('Generate alerts error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error'
    })
  }
}

// Delete alert
export const deleteAlert = async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] || generateUserId(req)
    const { id } = req.params

    const alert = await Alert.findOne({ _id: id, userId, isActive: true })
    
    if (!alert) {
      return res.status(404).json({
        success: false,
        message: 'Alert not found'
      })
    }

    alert.isActive = false
    await alert.save()

    res.json({
      success: true,
      message: 'Alert deleted successfully'
    })
  } catch (error) {
    console.error('Delete alert error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error'
    })
  }
}