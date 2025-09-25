from fastapi import APIRouter, HTTPException, Depends, Query
from typing import List, Optional
from app.database import get_database
from app.middleware.auth import get_current_user_id
from slowapi import Limiter
from slowapi.util import get_remote_address
from fastapi import Request
import logging
import time

logger = logging.getLogger(__name__)
router = APIRouter()
limiter = Limiter(key_func=get_remote_address)

async def verify_admin_access(user_id: str = Depends(get_current_user_id), db = Depends(get_database)):
    """Verify that the current user has admin access"""
    user = await db.users.find_one({"mobile": user_id})
    if not user or user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return user

@router.get("/farmers")
@limiter.limit("30/minute")
async def get_farmers_overview(
    request: Request,
    page: int = Query(1, ge=1),
    limit: int = Query(50, ge=1, le=100),
    district: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    admin_user = Depends(verify_admin_access),
    db = Depends(get_database)
):
    """Get overview of all farmers for admin"""
    try:
        skip = (page - 1) * limit
        
        # Build query
        query = {}
        if district:
            query["district"] = district
        if status:
            query["status"] = status
        
        # Get farmers with their farm data
        farmers = await db.users.find(query).skip(skip).limit(limit).to_list(length=limit)
        
        # Enrich with farm and activity data
        enriched_farmers = []
        for farmer in farmers:
            farmer_id = farmer.get("mobile", str(farmer["_id"]))
            
            # Get farm data
            farm = await db.farms.find_one({"user_id": farmer_id, "is_active": True})
            
            # Get activity count
            activities_count = await db.activities.count_documents({
                "user_id": farmer_id,
                "is_deleted": False
            })
            
            # Get scheme applications count
            schemes_count = await db.scheme_applications.count_documents({
                "user_id": farmer_id
            })
            
            # Determine status based on last activity
            last_activity = await db.activities.find_one(
                {"user_id": farmer_id, "is_deleted": False},
                sort=[("created_at", -1)]
            )
            
            days_since_activity = 999
            if last_activity:
                days_since_activity = (time.time() - last_activity.get("created_at", 0)) / 86400
            
            status = "active" if days_since_activity <= 7 else "inactive"
            
            enriched_farmer = {
                "id": str(farmer["_id"]),
                "name": farmer.get("name"),
                "mobile": farmer.get("mobile"),
                "district": farmer.get("district"),
                "panchayat": farmer.get("panchayat"),
                "location": farmer.get("location"),
                "created_at": farmer.get("created_at"),
                "last_login": farmer.get("last_login"),
                "status": status,
                "farm_data": {
                    "crop": farm.get("current_crop") if farm else None,
                    "land_size": farm.get("land_size") if farm else 0,
                    "soil_type": farm.get("soil_type") if farm else None,
                    "location": farm.get("location") if farm else None
                },
                "activities_count": activities_count,
                "schemes_applied": schemes_count,
                "last_activity": last_activity.get("created_at") if last_activity else None
            }
            enriched_farmers.append(enriched_farmer)
        
        total = await db.users.count_documents(query)
        
        return {
            "success": True,
            "data": enriched_farmers,
            "pagination": {
                "page": page,
                "limit": limit,
                "total": total,
                "pages": (total + limit - 1) // limit
            }
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Get farmers overview error: {e}")
        raise HTTPException(status_code=500, detail="Server error")

@router.get("/analytics")
@limiter.limit("30/minute")
async def get_admin_analytics(
    request: Request,
    admin_user = Depends(verify_admin_access),
    db = Depends(get_database)
):
    """Get analytics data for admin dashboard"""
    try:
        # Total farmers
        total_farmers = await db.users.count_documents({"role": "farmer"})
        
        # Active farmers (logged in within last 30 days)
        thirty_days_ago = time.time() - (30 * 24 * 60 * 60)
        active_farmers = await db.users.count_documents({
            "role": "farmer",
            "last_login": {"$gte": thirty_days_ago}
        })
        
        # Total land area
        pipeline = [
            {"$match": {"is_active": True}},
            {"$group": {"_id": None, "total_land": {"$sum": "$land_size"}}}
        ]
        land_result = await db.farms.aggregate(pipeline).to_list(length=1)
        total_land_area = land_result[0]["total_land"] if land_result else 0
        
        # Average activities per farmer
        total_activities = await db.activities.count_documents({"is_deleted": False})
        avg_activities = total_activities / total_farmers if total_farmers > 0 else 0
        
        # Scheme utilization
        total_applications = await db.scheme_applications.count_documents({})
        approved_applications = await db.scheme_applications.count_documents({"status": "approved"})
        scheme_utilization = (approved_applications / total_applications * 100) if total_applications > 0 else 0
        
        # Alert response rate (mock calculation)
        alert_response_rate = 72  # Mock value
        
        # District-wise distribution
        district_pipeline = [
            {"$match": {"role": "farmer"}},
            {"$group": {"_id": "$district", "count": {"$sum": 1}}},
            {"$sort": {"count": -1}}
        ]
        district_data = await db.users.aggregate(district_pipeline).to_list(length=20)
        
        # Crop distribution
        crop_pipeline = [
            {"$match": {"is_active": True}},
            {"$group": {"_id": "$current_crop", "count": {"$sum": 1}}},
            {"$sort": {"count": -1}}
        ]
        crop_data = await db.farms.aggregate(crop_pipeline).to_list(length=20)
        
        return {
            "success": True,
            "data": {
                "overview": {
                    "total_farmers": total_farmers,
                    "active_farmers": active_farmers,
                    "total_land_area": round(total_land_area, 2),
                    "average_activities_per_farmer": round(avg_activities, 1),
                    "scheme_utilization": round(scheme_utilization, 1),
                    "alert_response_rate": alert_response_rate
                },
                "distributions": {
                    "by_district": district_data,
                    "by_crop": crop_data
                }
            }
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Get admin analytics error: {e}")
        raise HTTPException(status_code=500, detail="Server error")

@router.get("/schemes/analytics")
@limiter.limit("30/minute")
async def get_schemes_analytics(
    request: Request,
    admin_user = Depends(verify_admin_access),
    db = Depends(get_database)
):
    """Get government schemes analytics"""
    try:
        # Scheme-wise applications
        scheme_pipeline = [
            {"$group": {
                "_id": "$scheme_id",
                "total_applications": {"$sum": 1},
                "approved": {"$sum": {"$cond": [{"$eq": ["$status", "approved"]}, 1, 0]}},
                "pending": {"$sum": {"$cond": [{"$eq": ["$status", "pending"]}, 1, 0]}},
                "rejected": {"$sum": {"$cond": [{"$eq": ["$status", "rejected"]}, 1, 0]}}
            }},
            {"$sort": {"total_applications": -1}}
        ]
        
        scheme_stats = await db.scheme_applications.aggregate(scheme_pipeline).to_list(length=20)
        
        # Monthly application trends
        monthly_pipeline = [
            {"$group": {
                "_id": {
                    "year": {"$year": {"$dateFromString": {"dateString": {"$toString": "$applied_date"}}}},
                    "month": {"$month": {"$dateFromString": {"dateString": {"$toString": "$applied_date"}}}}
                },
                "applications": {"$sum": 1}
            }},
            {"$sort": {"_id.year": -1, "_id.month": -1}},
            {"$limit": 12}
        ]
        
        monthly_trends = await db.scheme_applications.aggregate(monthly_pipeline).to_list(length=12)
        
        return {
            "success": True,
            "data": {
                "scheme_statistics": scheme_stats,
                "monthly_trends": monthly_trends
            }
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Get schemes analytics error: {e}")
        raise HTTPException(status_code=500, detail="Server error")

@router.get("/alerts/monitoring")
@limiter.limit("30/minute")
async def get_alerts_monitoring(
    request: Request,
    admin_user = Depends(verify_admin_access),
    db = Depends(get_database)
):
    """Get alerts monitoring data"""
    try:
        # Recent alerts with reach and response data
        recent_alerts = await db.alerts.find({
            "is_active": True
        }).sort("created_at", -1).limit(20).to_list(length=20)
        
        # Add mock reach and response data
        for alert in recent_alerts:
            alert["reach"] = 2500  # Mock reach
            alert["responses"] = 1800  # Mock responses
            alert["response_rate"] = round((alert["responses"] / alert["reach"]) * 100, 1)
        
        # Alert type distribution
        type_pipeline = [
            {"$match": {"is_active": True}},
            {"$group": {"_id": "$type", "count": {"$sum": 1}}},
            {"$sort": {"count": -1}}
        ]
        
        alert_types = await db.alerts.aggregate(type_pipeline).to_list(length=10)
        
        return {
            "success": True,
            "data": {
                "recent_alerts": recent_alerts,
                "alert_types": alert_types
            }
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Get alerts monitoring error: {e}")
        raise HTTPException(status_code=500, detail="Server error")

@router.get("/farmers/{farmer_id}/details")
@limiter.limit("30/minute")
async def get_farmer_details(
    request: Request,
    farmer_id: str,
    admin_user = Depends(verify_admin_access),
    db = Depends(get_database)
):
    """Get detailed information about a specific farmer"""
    try:
        from bson import ObjectId
        
        # Get farmer
        farmer = await db.users.find_one({"_id": ObjectId(farmer_id)})
        if not farmer:
            raise HTTPException(status_code=404, detail="Farmer not found")
        
        farmer_mobile = farmer.get("mobile", str(farmer["_id"]))
        
        # Get farm data
        farm = await db.farms.find_one({"user_id": farmer_mobile, "is_active": True})
        
        # Get activities
        activities = await db.activities.find({
            "user_id": farmer_mobile,
            "is_deleted": False
        }).sort("created_at", -1).limit(20).to_list(length=20)
        
        # Get scheme applications
        schemes = await db.scheme_applications.find({
            "user_id": farmer_mobile
        }).sort("applied_date", -1).to_list(length=10)
        
        # Get market listings
        listings = await db.market_listings.find({
            "user_id": farmer_mobile,
            "is_active": True
        }).sort("created_at", -1).limit(10).to_list(length=10)
        
        farmer_details = {
            "id": str(farmer["_id"]),
            "name": farmer.get("name"),
            "mobile": farmer.get("mobile"),
            "district": farmer.get("district"),
            "panchayat": farmer.get("panchayat"),
            "location": farmer.get("location"),
            "created_at": farmer.get("created_at"),
            "last_login": farmer.get("last_login"),
            "farm_data": farm,
            "recent_activities": activities,
            "scheme_applications": schemes,
            "market_listings": listings,
            "statistics": {
                "total_activities": len(activities),
                "schemes_applied": len(schemes),
                "active_listings": len(listings)
            }
        }
        
        return {
            "success": True,
            "data": farmer_details
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Get farmer details error: {e}")
        raise HTTPException(status_code=500, detail="Server error")