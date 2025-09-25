from fastapi import APIRouter, HTTPException, Depends, Query
from typing import Optional
from app.models.alert import Alert, AlertCreate
from app.database import get_database
from app.middleware.auth import get_current_user_id
from slowapi import Limiter
from slowapi.util import get_remote_address
from fastapi import Request
import logging
from datetime import datetime

logger = logging.getLogger(__name__)
router = APIRouter()
limiter = Limiter(key_func=get_remote_address)

@router.get("/")
@limiter.limit("30/minute")
async def get_alerts(
    request: Request,
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    type: Optional[str] = Query(None),
    priority: Optional[str] = Query(None),
    unread_only: bool = Query(False),
    user_id: str = Depends(get_current_user_id),
    db = Depends(get_database)
):
    """Get alerts"""
    try:
        skip = (page - 1) * limit
        
        query = {"user_id": user_id, "is_active": True}
        if type:
            query["type"] = type
        if priority:
            query["priority"] = priority
        if unread_only:
            query["is_read"] = False
        
        alerts = await db.alerts.find(query).sort([
            ("priority", 1),  # High priority first (assuming high=1, medium=2, low=3)
            ("created_at", -1)
        ]).skip(skip).limit(limit).to_list(length=limit)
        
        total = await db.alerts.count_documents(query)
        unread_count = await db.alerts.count_documents({
            "user_id": user_id,
            "is_active": True,
            "is_read": False
        })
        
        return {
            "success": True,
            "data": alerts,
            "unread_count": unread_count,
            "pagination": {
                "page": page,
                "limit": limit,
                "total": total,
                "pages": (total + limit - 1) // limit
            }
        }
    except Exception as e:
        logger.error(f"Get alerts error: {e}")
        raise HTTPException(status_code=500, detail="Server error")

@router.patch("/{alert_id}/read")
@limiter.limit("30/minute")
async def mark_alert_as_read(
    request: Request,
    alert_id: str,
    user_id: str = Depends(get_current_user_id),
    db = Depends(get_database)
):
    """Mark alert as read"""
    try:
        from bson import ObjectId
        
        result = await db.alerts.update_one(
            {"_id": ObjectId(alert_id), "user_id": user_id, "is_active": True},
            {"$set": {"is_read": True}}
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Alert not found")
        
        return {"success": True, "message": "Alert marked as read"}
    except Exception as e:
        logger.error(f"Mark alert as read error: {e}")
        raise HTTPException(status_code=500, detail="Server error")

@router.patch("/read-all")
@limiter.limit("10/minute")
async def mark_all_alerts_as_read(
    request: Request,
    user_id: str = Depends(get_current_user_id),
    db = Depends(get_database)
):
    """Mark all alerts as read"""
    try:
        await db.alerts.update_many(
            {"user_id": user_id, "is_active": True, "is_read": False},
            {"$set": {"is_read": True}}
        )
        
        return {"success": True, "message": "All alerts marked as read"}
    except Exception as e:
        logger.error(f"Mark all alerts as read error: {e}")
        raise HTTPException(status_code=500, detail="Server error")

@router.post("/generate")
@limiter.limit("5/minute")
async def generate_alerts(
    request: Request,
    user_id: str = Depends(get_current_user_id),
    db = Depends(get_database)
):
    """Generate alerts for user"""
    try:
        # Get user's farm data
        farm = await db.farms.find_one({"user_id": user_id, "is_active": True})
        if not farm:
            raise HTTPException(status_code=404, detail="Farm profile not found")
        
        # Generate sample alerts based on farm data
        alerts_to_create = []
        
        # Weather alert
        alerts_to_create.append({
            "user_id": user_id,
            "type": "weather",
            "priority": "high",
            "title": "Weather Alert",
            "message": f"Rain expected in {farm.get('location', 'your area')}. Avoid applying fertilizers today.",
            "location": farm.get("location"),
            "crop": farm.get("current_crop")
        })
        
        # Crop-specific alerts
        crop = farm.get("current_crop")
        if crop == "paddy":
            alerts_to_create.append({
                "user_id": user_id,
                "type": "irrigation",
                "priority": "medium",
                "title": "Irrigation Reminder",
                "message": "Maintain water level in paddy fields. Check for proper drainage.",
                "location": farm.get("location"),
                "crop": crop
            })
        elif crop == "coconut":
            alerts_to_create.append({
                "user_id": user_id,
                "type": "pest",
                "priority": "medium",
                "title": "Pest Alert",
                "message": "Check coconut trees for red palm weevil. Look for holes in trunk.",
                "location": farm.get("location"),
                "crop": crop
            })
        
        # Insert alerts
        if alerts_to_create:
            result = await db.alerts.insert_many(alerts_to_create)
            created_alerts = await db.alerts.find({
                "_id": {"$in": result.inserted_ids}
            }).to_list(length=len(result.inserted_ids))
            
            return {
                "success": True,
                "message": f"Generated {len(created_alerts)} alerts",
                "data": created_alerts
            }
        
        return {"success": True, "message": "No new alerts to generate"}
    except Exception as e:
        logger.error(f"Generate alerts error: {e}")
        raise HTTPException(status_code=500, detail="Server error")

@router.delete("/{alert_id}")
@limiter.limit("10/minute")
async def delete_alert(
    request: Request,
    alert_id: str,
    user_id: str = Depends(get_current_user_id),
    db = Depends(get_database)
):
    """Delete alert"""
    try:
        from bson import ObjectId
        
        result = await db.alerts.update_one(
            {"_id": ObjectId(alert_id), "user_id": user_id, "is_active": True},
            {"$set": {"is_active": False}}
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Alert not found")
        
        return {"success": True, "message": "Alert deleted successfully"}
    except Exception as e:
        logger.error(f"Delete alert error: {e}")
        raise HTTPException(status_code=500, detail="Server error")