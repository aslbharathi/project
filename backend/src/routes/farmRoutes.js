import express from 'express'
import { body } from 'express-validator'
import {
  getFarmProfile,
  saveFarmProfile,
  getActivities,
  addActivity,
  deleteActivity
} from '../controllers/farmController.js'

const router = express.Router()

// Farm profile routes
router.get('/profile', getFarmProfile)

router.post('/profile', [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('location').trim().notEmpty().withMessage('Location is required'),
  body('landSize').isNumeric().withMessage('Land size must be a number'),
  body('landUnit').isIn(['cents', 'hectares']).withMessage('Invalid land unit'),
  body('currentCrop').isIn(['paddy', 'coconut', 'rubber', 'banana', 'brinjal', 'pepper', 'cardamom', 'ginger', 'turmeric']).withMessage('Invalid crop'),
  body('soilType').isIn(['laterite', 'alluvial', 'coastal', 'forest']).withMessage('Invalid soil type'),
  body('irrigation').isBoolean().withMessage('Irrigation must be boolean')
], saveFarmProfile)

router.put('/profile', [
  body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
  body('location').optional().trim().notEmpty().withMessage('Location cannot be empty'),
  body('landSize').optional().isNumeric().withMessage('Land size must be a number'),
  body('landUnit').optional().isIn(['cents', 'hectares']).withMessage('Invalid land unit'),
  body('currentCrop').optional().isIn(['paddy', 'coconut', 'rubber', 'banana', 'brinjal', 'pepper', 'cardamom', 'ginger', 'turmeric']).withMessage('Invalid crop'),
  body('soilType').optional().isIn(['laterite', 'alluvial', 'coastal', 'forest']).withMessage('Invalid soil type'),
  body('irrigation').optional().isBoolean().withMessage('Irrigation must be boolean')
], saveFarmProfile)

// Activity routes
router.get('/activities', getActivities)

router.post('/activities', [
  body('type').isIn(['sowedSeeds', 'appliedFertilizer', 'irrigated', 'pestDisease', 'weeding', 'harvested']).withMessage('Invalid activity type'),
  body('crop').trim().notEmpty().withMessage('Crop is required'),
  body('location').trim().notEmpty().withMessage('Location is required'),
  body('notes').optional().trim()
], addActivity)

router.delete('/activities/:id', deleteActivity)

export default router