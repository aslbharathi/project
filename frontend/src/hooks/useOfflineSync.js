import { useState, useEffect } from 'react'
import { farmService } from '../services/farmService'

export const useOfflineSync = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [pendingSync, setPendingSync] = useState(false)

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      syncPendingData()
    }

    const handleOffline = () => {
      setIsOnline(false)
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const syncPendingData = async () => {
    if (!isOnline) return

    setPendingSync(true)
    
    try {
      // Sync farm data
      const localFarmData = localStorage.getItem('krishiSakhiFarmData')
      if (localFarmData) {
        await farmService.saveFarmData(JSON.parse(localFarmData))
      }

      // Sync activities
      const localActivities = localStorage.getItem('krishiSakhiActivities')
      if (localActivities) {
        const activities = JSON.parse(localActivities)
        // Sync only new activities (implement proper sync logic)
        for (const activity of activities.slice(0, 10)) {
          try {
            await farmService.addActivity(activity)
          } catch (error) {
            console.error('Failed to sync activity:', error)
          }
        }
      }
    } catch (error) {
      console.error('Sync failed:', error)
    } finally {
      setPendingSync(false)
    }
  }

  return { isOnline, pendingSync, syncPendingData }
}