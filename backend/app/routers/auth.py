from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional
import hashlib
import time
from app.database import get_database
from slowapi import Limiter
from slowapi.util import get_remote_address
from fastapi import Request
import logging

logger = logging.getLogger(__name__)
router = APIRouter()
limiter = Limiter(key_func=get_remote_address)

class SignupRequest(BaseModel):
    name: str
    mobile: str
    district: str
    panchayat: Optional[str] = None
    location: Optional[str] = None
    otp: str

class LoginRequest(BaseModel):
    mobile: str
    otp: str

class OTPRequest(BaseModel):
    mobile: str

@router.post("/send-otp")
@limiter.limit("5/minute")
async def send_otp(
    request: Request,
    otp_request: OTPRequest,
    db = Depends(get_database)
):
    """Send OTP to mobile number"""
    try:
        # In production, integrate with SMS service
        # For now, return success (OTP would be 123456 for testing)
        
        # Store OTP in database with expiry
        otp_data = {
            "mobile": otp_request.mobile,
            "otp": "123456",  # In production, generate random OTP
            "created_at": time.time(),
            "expires_at": time.time() + 300,  # 5 minutes
            "verified": False
        }
        
        await db.otps.insert_one(otp_data)
        
        return {
            "success": True,
            "message": "OTP sent successfully",
            "otp": "123456"  # Remove this in production
        }
    except Exception as e:
        logger.error(f"Send OTP error: {e}")
        raise HTTPException(status_code=500, detail="Failed to send OTP")

@router.post("/signup")
@limiter.limit("10/minute")
async def signup(
    request: Request,
    signup_data: SignupRequest,
    db = Depends(get_database)
):
    """Register new farmer"""
    try:
        # Verify OTP
        otp_record = await db.otps.find_one({
            "mobile": signup_data.mobile,
            "otp": signup_data.otp,
            "verified": False
        })
        
        if not otp_record or otp_record["expires_at"] < time.time():
            raise HTTPException(status_code=400, detail="Invalid or expired OTP")
        
        # Check if user already exists
        existing_user = await db.users.find_one({"mobile": signup_data.mobile})
        if existing_user:
            raise HTTPException(status_code=400, detail="User already exists")
        
        # Create new user
        user_data = {
            "name": signup_data.name,
            "mobile": signup_data.mobile,
            "district": signup_data.district,
            "panchayat": signup_data.panchayat,
            "location": signup_data.location,
            "role": "farmer",
            "is_verified": True,
            "created_at": time.time(),
            "is_active": True
        }
        
        result = await db.users.insert_one(user_data)
        user_data["_id"] = str(result.inserted_id)
        
        # Mark OTP as verified
        await db.otps.update_one(
            {"_id": otp_record["_id"]},
            {"$set": {"verified": True}}
        )
        
        # Generate token (in production, use proper JWT)
        token = hashlib.sha256(f"{signup_data.mobile}{time.time()}".encode()).hexdigest()
        
        return {
            "success": True,
            "message": "Account created successfully",
            "user": user_data,
            "token": token
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Signup error: {e}")
        raise HTTPException(status_code=500, detail="Signup failed")

@router.post("/login")
@limiter.limit("10/minute")
async def login(
    request: Request,
    login_data: LoginRequest,
    db = Depends(get_database)
):
    """Login existing user"""
    try:
        # Verify OTP
        otp_record = await db.otps.find_one({
            "mobile": login_data.mobile,
            "otp": login_data.otp,
            "verified": False
        })
        
        if not otp_record or otp_record["expires_at"] < time.time():
            raise HTTPException(status_code=400, detail="Invalid or expired OTP")
        
        # Find user
        user = await db.users.find_one({"mobile": login_data.mobile})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Mark OTP as verified
        await db.otps.update_one(
            {"_id": otp_record["_id"]},
            {"$set": {"verified": True}}
        )
        
        # Update last login
        await db.users.update_one(
            {"_id": user["_id"]},
            {"$set": {"last_login": time.time()}}
        )
        
        # Generate token
        token = hashlib.sha256(f"{login_data.mobile}{time.time()}".encode()).hexdigest()
        
        user["_id"] = str(user["_id"])
        
        return {
            "success": True,
            "message": "Login successful",
            "user": user,
            "token": token
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Login error: {e}")
        raise HTTPException(status_code=500, detail="Login failed")

@router.post("/verify-token")
async def verify_token(
    request: Request,
    db = Depends(get_database)
):
    """Verify authentication token"""
    try:
        # In production, implement proper JWT verification
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            raise HTTPException(status_code=401, detail="Invalid token")
        
        return {"success": True, "message": "Token valid"}
    except Exception as e:
        logger.error(f"Token verification error: {e}")
        raise HTTPException(status_code=401, detail="Invalid token")