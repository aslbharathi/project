from fastapi import APIRouter, HTTPException, Depends
from typing import List, Optional
from app.database import get_database
from app.middleware.auth import get_current_user_id
from slowapi import Limiter
from slowapi.util import get_remote_address
from fastapi import Request
import logging

logger = logging.getLogger(__name__)
router = APIRouter()
limiter = Limiter(key_func=get_remote_address)

# Mock government schemes data
GOVERNMENT_SCHEMES = [
    {
        "id": "pm-kisan",
        "name_en": "PM-KISAN",
        "name_ml": "പിഎം-കിസാൻ",
        "description_en": "Direct income support to farmers",
        "description_ml": "കർഷകർക്ക് നേരിട്ടുള്ള വരുമാന പിന്തുണ",
        "amount": 6000,
        "eligibility": ["landowner", "small_farmer"],
        "documents": ["land_records", "bank_account", "aadhaar"],
        "application_deadline": "2024-12-31",
        "status": "active"
    },
    {
        "id": "kerala-farmer-assistance",
        "name_en": "Kerala Farmer Assistance Scheme",
        "name_ml": "കേരള കർഷക സഹായ പദ്ധതി",
        "description_en": "State government support for farmers",
        "description_ml": "കർഷകർക്കുള്ള സംസ്ഥാന സർക്കാർ പിന്തുണ",
        "amount": 10000,
        "eligibility": ["kerala_resident", "active_farmer"],
        "documents": ["residence_proof", "farming_certificate"],
        "application_deadline": "2024-11-30",
        "status": "active"
    },
    {
        "id": "crop-insurance",
        "name_en": "Pradhan Mantri Fasal Bima Yojana",
        "name_ml": "പ്രധാനമന്ത്രി ഫസൽ ബീമ യോജന",
        "description_en": "Crop insurance scheme for risk mitigation",
        "description_ml": "അപകടസാധ്യത കുറയ്ക്കുന്നതിനുള്ള വിള ഇൻഷുറൻസ് പദ്ധതി",
        "amount": 0,  # Premium based
        "eligibility": ["all_farmers"],
        "documents": ["land_records", "sowing_certificate"],
        "application_deadline": "2024-10-15",
        "status": "active"
    },
    {
        "id": "organic-farming-support",
        "name_en": "Organic Farming Support Scheme",
        "name_ml": "ജൈവകൃഷി പിന്തുണ പദ്ധതി",
        "description_en": "Support for organic farming practices",
        "description_ml": "ജൈവകൃഷി രീതികൾക്കുള്ള പിന്തുണ",
        "amount": 15000,
        "eligibility": ["organic_farmer", "certified_land"],
        "documents": ["organic_certificate", "land_records"],
        "application_deadline": "2024-09-30",
        "status": "active"
    }
]

@router.get("/")
@limiter.limit("30/minute")
async def get_all_schemes(
    request: Request,
    language: str = "en",
    db = Depends(get_database)
):
    """Get all available government schemes"""
    try:
        return {
            "success": True,
            "data": GOVERNMENT_SCHEMES
        }
    except Exception as e:
        logger.error(f"Get schemes error: {e}")
        raise HTTPException(status_code=500, detail="Server error")

@router.get("/eligible")
@limiter.limit("30/minute")
async def get_eligible_schemes(
    request: Request,
    user_id: str = Depends(get_current_user_id),
    db = Depends(get_database)
):
    """Get schemes eligible for current user"""
    try:
        # Get user's farm data
        farm = await db.farms.find_one({"user_id": user_id, "is_active": True})
        if not farm:
            return {
                "success": True,
                "data": [],
                "message": "Complete farm setup to see eligible schemes"
            }
        
        # Get user's activities
        activities_count = await db.activities.count_documents({
            "user_id": user_id,
            "is_deleted": False
        })
        
        # Check eligibility for each scheme
        eligible_schemes = []
        for scheme in GOVERNMENT_SCHEMES:
            is_eligible = check_scheme_eligibility(scheme, farm, activities_count)
            if is_eligible:
                eligible_schemes.append({
                    **scheme,
                    "eligibility_status": "eligible",
                    "application_status": "not_applied"  # Check actual status from DB
                })
        
        return {
            "success": True,
            "data": eligible_schemes
        }
    except Exception as e:
        logger.error(f"Get eligible schemes error: {e}")
        raise HTTPException(status_code=500, detail="Server error")

@router.get("/{scheme_id}")
@limiter.limit("30/minute")
async def get_scheme_details(
    request: Request,
    scheme_id: str,
    user_id: str = Depends(get_current_user_id),
    db = Depends(get_database)
):
    """Get detailed information about a specific scheme"""
    try:
        scheme = next((s for s in GOVERNMENT_SCHEMES if s["id"] == scheme_id), None)
        if not scheme:
            raise HTTPException(status_code=404, detail="Scheme not found")
        
        # Check if user has applied
        application = await db.scheme_applications.find_one({
            "user_id": user_id,
            "scheme_id": scheme_id
        })
        
        scheme_details = {
            **scheme,
            "application_status": application["status"] if application else "not_applied",
            "applied_date": application.get("created_at") if application else None
        }
        
        return {
            "success": True,
            "data": scheme_details
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Get scheme details error: {e}")
        raise HTTPException(status_code=500, detail="Server error")

@router.post("/{scheme_id}/apply")
@limiter.limit("10/minute")
async def apply_for_scheme(
    request: Request,
    scheme_id: str,
    user_id: str = Depends(get_current_user_id),
    db = Depends(get_database)
):
    """Apply for a government scheme"""
    try:
        scheme = next((s for s in GOVERNMENT_SCHEMES if s["id"] == scheme_id), None)
        if not scheme:
            raise HTTPException(status_code=404, detail="Scheme not found")
        
        # Check if already applied
        existing_application = await db.scheme_applications.find_one({
            "user_id": user_id,
            "scheme_id": scheme_id
        })
        
        if existing_application:
            raise HTTPException(status_code=400, detail="Already applied for this scheme")
        
        # Get user and farm data
        user = await db.users.find_one({"mobile": user_id})  # Simplified user lookup
        farm = await db.farms.find_one({"user_id": user_id, "is_active": True})
        
        if not farm:
            raise HTTPException(status_code=400, detail="Complete farm setup to apply")
        
        # Create application
        application_data = {
            "user_id": user_id,
            "scheme_id": scheme_id,
            "scheme_name": scheme["name_en"],
            "status": "pending",
            "applied_date": time.time(),
            "user_data": {
                "name": user.get("name") if user else "Unknown",
                "mobile": user_id,
                "district": user.get("district") if user else farm.get("location")
            },
            "farm_data": {
                "land_size": farm.get("land_size"),
                "crop": farm.get("current_crop"),
                "location": farm.get("location")
            }
        }
        
        result = await db.scheme_applications.insert_one(application_data)
        
        return {
            "success": True,
            "message": "Application submitted successfully",
            "application_id": str(result.inserted_id),
            "status": "pending"
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Apply for scheme error: {e}")
        raise HTTPException(status_code=500, detail="Server error")

@router.get("/applications/my")
@limiter.limit("30/minute")
async def get_my_applications(
    request: Request,
    user_id: str = Depends(get_current_user_id),
    db = Depends(get_database)
):
    """Get user's scheme applications"""
    try:
        applications = await db.scheme_applications.find({
            "user_id": user_id
        }).sort("applied_date", -1).to_list(length=50)
        
        return {
            "success": True,
            "data": applications
        }
    except Exception as e:
        logger.error(f"Get my applications error: {e}")
        raise HTTPException(status_code=500, detail="Server error")

def check_scheme_eligibility(scheme, farm_data, activities_count):
    """Check if user is eligible for a scheme"""
    for criteria in scheme["eligibility"]:
        if criteria == "landowner" and farm_data.get("land_size", 0) > 0:
            continue
        elif criteria == "small_farmer" and farm_data.get("land_size", 0) <= 2:
            continue
        elif criteria == "kerala_resident":
            continue  # All users are Kerala residents
        elif criteria == "active_farmer" and activities_count > 0:
            continue
        elif criteria == "all_farmers":
            continue
        elif criteria == "organic_farmer":
            # Check if user practices organic farming (simplified)
            continue
        elif criteria == "certified_land":
            # Check if land is certified (simplified)
            continue
        else:
            return False
    
    return True

import time