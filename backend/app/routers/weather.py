from fastapi import APIRouter, HTTPException, Query
from app.services.weather_service import weather_service
from slowapi import Limiter
from slowapi.util import get_remote_address
from fastapi import Request
import logging

logger = logging.getLogger(__name__)
router = APIRouter()
limiter = Limiter(key_func=get_remote_address)

@router.get("/current")
@limiter.limit("60/minute")
async def get_current_weather(
    request: Request,
    location: str = Query(None),
    lat: float = Query(None),
    lon: float = Query(None)
):
    """Get current weather"""
    try:
        if not location and (not lat or not lon):
            raise HTTPException(
                status_code=400,
                detail="Location or coordinates are required"
            )
        
        if not location:
            location = f"{lat},{lon}"
        
        weather_data = await weather_service.get_current_weather(location)
        
        return {"success": True, "data": weather_data}
    except Exception as e:
        logger.error(f"Get weather data error: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch weather data")

@router.get("/forecast")
@limiter.limit("30/minute")
async def get_weather_forecast(
    request: Request,
    location: str = Query(None),
    lat: float = Query(None),
    lon: float = Query(None),
    days: int = Query(5, ge=1, le=7)
):
    """Get weather forecast"""
    try:
        if not location and (not lat or not lon):
            raise HTTPException(
                status_code=400,
                detail="Location or coordinates are required"
            )
        
        if not location:
            location = f"{lat},{lon}"
        
        forecast_data = await weather_service.get_weather_forecast(location, days)
        
        return {"success": True, "data": forecast_data}
    except Exception as e:
        logger.error(f"Get weather forecast error: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch weather forecast")