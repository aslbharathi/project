import express from 'express'
import {
  getAlerts,
  markAlertAsRead,
  markAllAlertsAsRead,
  generateAlerts,
  deleteAlert
} from '../controllers/alertController.js'

const router = express.Router()

// Get alerts
router.get('/', getAlerts)

// Mark alert as read
router.patch('/:id/read', markAlertAsRead)

// Mark all alerts as read
router.patch('/read-all', markAllAlertsAsRead)

// Generate alerts
router.post('/generate', generateAlerts)

// Delete alert
router.delete('/:id', deleteAlert)

export default router