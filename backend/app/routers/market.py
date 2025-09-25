from fastapi import APIRouter, HTTPException, Depends, Query
from typing import List, Optional
from pydantic import BaseModel
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

class MarketListing(BaseModel):
    crop: str
    quantity: float
    unit: str
    expected_price: float
    location: str
    harvest_date: Optional[str] = None
    quality: str = "good"
    description: Optional[str] = None

@router.get("/prices")
@limiter.limit("60/minute")
async def get_market_prices(
    request: Request,
    district: Optional[str] = Query(None),
    crop: Optional[str] = Query(None),
    db = Depends(get_database)
):
    """Get current market prices"""
    try:
        # Mock market prices data
        mock_prices = [
            {
                "crop": "coconut",
                "price": 85,
                "unit": "piece",
                "market": "Thrissur",
                "change": "+5%",
                "trend": "up",
                "last_updated": time.time()
            },
            {
                "crop": "paddy",
                "price": 2800,
                "unit": "quintal",
                "market": "Palakkad",
                "change": "+2%",
                "trend": "up",
                "last_updated": time.time() - 7200
            },
            {
                "crop": "pepper",
                "price": 650,
                "unit": "kg",
                "market": "Kochi",
                "change": "-3%",
                "trend": "down",
                "last_updated": time.time() - 14400
            },
            {
                "crop": "banana",
                "price": 45,
                "unit": "dozen",
                "market": "Kozhikode",
                "change": "0%",
                "trend": "stable",
                "last_updated": time.time() - 3600
            },
            {
                "crop": "rubber",
                "price": 180,
                "unit": "kg",
                "market": "Kottayam",
                "change": "+8%",
                "trend": "up",
                "last_updated": time.time() - 1800
            }
        ]
        
        # Filter by district or crop if specified
        filtered_prices = mock_prices
        if district:
            filtered_prices = [p for p in filtered_prices if district.lower() in p["market"].lower()]
        if crop:
            filtered_prices = [p for p in filtered_prices if p["crop"] == crop]
        
        return {
            "success": True,
            "data": filtered_prices
        }
    except Exception as e:
        logger.error(f"Get market prices error: {e}")
        raise HTTPException(status_code=500, detail="Server error")

@router.get("/listings")
@limiter.limit("30/minute")
async def get_market_listings(
    request: Request,
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    crop: Optional[str] = Query(None),
    district: Optional[str] = Query(None),
    user_id: str = Depends(get_current_user_id),
    db = Depends(get_database)
):
    """Get market listings from farmers"""
    try:
        skip = (page - 1) * limit
        
        query = {"is_active": True}
        if crop:
            query["crop"] = crop
        if district:
            query["location"] = {"$regex": district, "$options": "i"}
        
        listings = await db.market_listings.find(query).sort("created_at", -1).skip(skip).limit(limit).to_list(length=limit)
        
        total = await db.market_listings.count_documents(query)
        
        return {
            "success": True,
            "data": listings,
            "pagination": {
                "page": page,
                "limit": limit,
                "total": total,
                "pages": (total + limit - 1) // limit
            }
        }
    except Exception as e:
        logger.error(f"Get market listings error: {e}")
        raise HTTPException(status_code=500, detail="Server error")

@router.post("/listings")
@limiter.limit("10/minute")
async def create_listing(
    request: Request,
    listing_data: MarketListing,
    user_id: str = Depends(get_current_user_id),
    db = Depends(get_database)
):
    """Create a new market listing"""
    try:
        # Get user info
        user = await db.users.find_one({"mobile": user_id})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        listing_dict = listing_data.dict()
        listing_dict.update({
            "user_id": user_id,
            "farmer_name": user.get("name", "Unknown"),
            "farmer_mobile": user_id,
            "farmer_district": user.get("district"),
            "status": "active",
            "inquiries": 0,
            "created_at": time.time(),
            "updated_at": time.time(),
            "is_active": True
        })
        
        result = await db.market_listings.insert_one(listing_dict)
        listing_dict["_id"] = str(result.inserted_id)
        
        return {
            "success": True,
            "message": "Listing created successfully",
            "data": listing_dict
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Create listing error: {e}")
        raise HTTPException(status_code=500, detail="Server error")

@router.get("/listings/my")
@limiter.limit("30/minute")
async def get_my_listings(
    request: Request,
    user_id: str = Depends(get_current_user_id),
    db = Depends(get_database)
):
    """Get current user's listings"""
    try:
        listings = await db.market_listings.find({
            "user_id": user_id,
            "is_active": True
        }).sort("created_at", -1).to_list(length=50)
        
        return {
            "success": True,
            "data": listings
        }
    except Exception as e:
        logger.error(f"Get my listings error: {e}")
        raise HTTPException(status_code=500, detail="Server error")

@router.put("/listings/{listing_id}")
@limiter.limit("10/minute")
async def update_listing(
    request: Request,
    listing_id: str,
    listing_data: MarketListing,
    user_id: str = Depends(get_current_user_id),
    db = Depends(get_database)
):
    """Update a market listing"""
    try:
        from bson import ObjectId
        
        # Check if listing belongs to user
        listing = await db.market_listings.find_one({
            "_id": ObjectId(listing_id),
            "user_id": user_id,
            "is_active": True
        })
        
        if not listing:
            raise HTTPException(status_code=404, detail="Listing not found")
        
        update_data = listing_data.dict()
        update_data["updated_at"] = time.time()
        
        await db.market_listings.update_one(
            {"_id": ObjectId(listing_id)},
            {"$set": update_data}
        )
        
        return {
            "success": True,
            "message": "Listing updated successfully"
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Update listing error: {e}")
        raise HTTPException(status_code=500, detail="Server error")

@router.delete("/listings/{listing_id}")
@limiter.limit("10/minute")
async def delete_listing(
    request: Request,
    listing_id: str,
    user_id: str = Depends(get_current_user_id),
    db = Depends(get_database)
):
    """Delete a market listing"""
    try:
        from bson import ObjectId
        
        result = await db.market_listings.update_one(
            {"_id": ObjectId(listing_id), "user_id": user_id},
            {"$set": {"is_active": False, "updated_at": time.time()}}
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Listing not found")
        
        return {
            "success": True,
            "message": "Listing deleted successfully"
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Delete listing error: {e}")
        raise HTTPException(status_code=500, detail="Server error")

@router.post("/listings/{listing_id}/inquire")
@limiter.limit("20/minute")
async def inquire_about_listing(
    request: Request,
    listing_id: str,
    user_id: str = Depends(get_current_user_id),
    db = Depends(get_database)
):
    """Express interest in a listing"""
    try:
        from bson import ObjectId
        
        # Check if listing exists
        listing = await db.market_listings.find_one({
            "_id": ObjectId(listing_id),
            "is_active": True
        })
        
        if not listing:
            raise HTTPException(status_code=404, detail="Listing not found")
        
        # Don't allow farmers to inquire about their own listings
        if listing["user_id"] == user_id:
            raise HTTPException(status_code=400, detail="Cannot inquire about your own listing")
        
        # Check if already inquired
        existing_inquiry = await db.listing_inquiries.find_one({
            "listing_id": listing_id,
            "inquirer_id": user_id
        })
        
        if existing_inquiry:
            raise HTTPException(status_code=400, detail="Already inquired about this listing")
        
        # Create inquiry
        inquiry_data = {
            "listing_id": listing_id,
            "inquirer_id": user_id,
            "listing_owner_id": listing["user_id"],
            "created_at": time.time(),
            "status": "pending"
        }
        
        await db.listing_inquiries.insert_one(inquiry_data)
        
        # Increment inquiry count
        await db.market_listings.update_one(
            {"_id": ObjectId(listing_id)},
            {"$inc": {"inquiries": 1}}
        )
        
        return {
            "success": True,
            "message": "Inquiry sent successfully",
            "contact_info": {
                "farmer_name": listing["farmer_name"],
                "mobile": listing["farmer_mobile"]
            }
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Inquire about listing error: {e}")
        raise HTTPException(status_code=500, detail="Server error")