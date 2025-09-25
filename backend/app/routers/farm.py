from fastapi import APIRouter, HTTPException, Depends, Query
from typing import List, Optional
from app.models.farm import Farm, FarmCreate, FarmUpdate, Activity, ActivityCreate
from app.database import get_database
from app.middleware.auth import get_current_user_id
from slowapi import Limiter
from slowapi.util import get_remote_address
from fastapi import Request
import logging

logger = logging.getLogger(__name__)
router = APIRouter()
limiter = Limiter(key_func=get_remote_address)

@router.get("/profile")
@limiter.limit("30/minute")
async def get_farm_profile(
    request: Request,
    user_id: str = Depends(get_current_user_id),
    db = Depends(get_database)
):
    """Get farm profile"""
    try:
        farm = await db.farms.find_one({"user_id": user_id, "is_active": True})
        if not farm:
            raise HTTPException(status_code=404, detail="Farm profile not found")
        
        return {"success": True, "data": farm}
    except Exception as e:
        logger.error(f"Get farm profile error: {e}")
        raise HTTPException(status_code=500, detail="Server error")

@router.post("/profile")
@limiter.limit("10/minute")
async def create_farm_profile(
    request: Request,
    farm_data: FarmCreate,
    user_id: str = Depends(get_current_user_id),
    db = Depends(get_database)
):
    """Create or update farm profile"""
    try:
        # Check if farm already exists
        existing_farm = await db.farms.find_one({"user_id": user_id})
        
        farm_dict = farm_data.dict()
        farm_dict["user_id"] = user_id
        
        if existing_farm:
            # Update existing farm
            await db.farms.update_one(
                {"user_id": user_id},
                {"$set": {**farm_dict, "updated_at": datetime.utcnow()}}
            )
            farm = await db.farms.find_one({"user_id": user_id})
        else:
            # Create new farm
            result = await db.farms.insert_one(farm_dict)
            farm = await db.farms.find_one({"_id": result.inserted_id})
        
        return {"success": True, "message": "Farm profile saved successfully", "data": farm}
    except Exception as e:
        logger.error(f"Save farm profile error: {e}")
        raise HTTPException(status_code=500, detail="Server error")

@router.get("/activities")
@limiter.limit("30/minute")
async def get_activities(
    request: Request,
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    user_id: str = Depends(get_current_user_id),
    db = Depends(get_database)
):
    """Get farm activities"""
    try:
        skip = (page - 1) * limit
        
        activities = await db.activities.find(
            {"user_id": user_id, "is_deleted": False}
        ).sort("created_at", -1).skip(skip).limit(limit).to_list(length=limit)
        
        total = await db.activities.count_documents(
            {"user_id": user_id, "is_deleted": False}
        )
        
        return {
            "success": True,
            "data": activities,
            "pagination": {
                "page": page,
                "limit": limit,
                "total": total,
                "pages": (total + limit - 1) // limit
            }
        }
    except Exception as e:
        logger.error(f"Get activities error: {e}")
        raise HTTPException(status_code=500, detail="Server error")

@router.post("/activities")
@limiter.limit("20/minute")
async def add_activity(
    request: Request,
    activity_data: ActivityCreate,
    user_id: str = Depends(get_current_user_id),
    db = Depends(get_database)
):
    """Add farm activity"""
    try:
        # Get user's farm
        farm = await db.farms.find_one({"user_id": user_id, "is_active": True})
        if not farm:
            raise HTTPException(status_code=404, detail="Farm profile not found")
        
        activity_dict = activity_data.dict()
        activity_dict["user_id"] = user_id
        activity_dict["farm_id"] = farm["_id"]
        
        result = await db.activities.insert_one(activity_dict)
        activity = await db.activities.find_one({"_id": result.inserted_id})
        
        return {
            "success": True,
            "message": "Activity added successfully",
            "data": activity
        }
    except Exception as e:
        logger.error(f"Add activity error: {e}")
        raise HTTPException(status_code=500, detail="Server error")

@router.delete("/activities/{activity_id}")
@limiter.limit("10/minute")
async def delete_activity(
    request: Request,
    activity_id: str,
    user_id: str = Depends(get_current_user_id),
    db = Depends(get_database)
):
    """Delete farm activity"""
    try:
        from bson import ObjectId
        
        result = await db.activities.update_one(
            {"_id": ObjectId(activity_id), "user_id": user_id},
            {"$set": {"is_deleted": True}}
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Activity not found")
        
        return {"success": True, "message": "Activity deleted successfully"}
    except Exception as e:
        logger.error(f"Delete activity error: {e}")
        raise HTTPException(status_code=500, detail="Server error")