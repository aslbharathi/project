import httpx
from typing import Dict, Any, Optional
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)

class WeatherService:
    def __init__(self):
        self.api_key = settings.WEATHER_API_KEY
        self.base_url = "https://api.openweathermap.org/data/2.5"
    
    async def get_current_weather(self, location: str) -> Dict[str, Any]:
        """Get current weather for location"""
        try:
            url = f"{self.base_url}/weather"
            params = {
                "q": location,
                "appid": self.api_key,
                "units": "metric"
            }
            
            async with httpx.AsyncClient() as client:
                response = await client.get(url, params=params)
                
                if response.status_code == 200:
                    data = response.json()
                    return self._format_weather_data(data)
                else:
                    return self._get_mock_weather_data(location)
                    
        except Exception as e:
            logger.error(f"Weather API error: {e}")
            return self._get_mock_weather_data(location)
    
    async def get_weather_forecast(self, location: str, days: int = 5) -> Dict[str, Any]:
        """Get weather forecast for location"""
        try:
            url = f"{self.base_url}/forecast"
            params = {
                "q": location,
                "appid": self.api_key,
                "units": "metric",
                "cnt": days * 8  # 8 forecasts per day (3-hour intervals)
            }
            
            async with httpx.AsyncClient() as client:
                response = await client.get(url, params=params)
                
                if response.status_code == 200:
                    data = response.json()
                    return self._format_forecast_data(data)
                else:
                    return self._get_mock_forecast_data(location, days)
                    
        except Exception as e:
            logger.error(f"Weather forecast API error: {e}")
            return self._get_mock_forecast_data(location, days)
    
    def _format_weather_data(self, data: Dict) -> Dict[str, Any]:
        """Format weather API response"""
        return {
            "location": data["name"],
            "current": {
                "temperature": round(data["main"]["temp"]),
                "humidity": data["main"]["humidity"],
                "rainfall": data.get("rain", {}).get("1h", 0),
                "wind_speed": data["wind"]["speed"],
                "condition": data["weather"][0]["main"].lower(),
                "description": data["weather"][0]["description"]
            }
        }
    
    def _format_forecast_data(self, data: Dict) -> Dict[str, Any]:
        """Format forecast API response"""
        forecasts = []
        
        # Group by day and take daily averages
        daily_data = {}
        for item in data["list"]:
            date = item["dt_txt"].split(" ")[0]
            if date not in daily_data:
                daily_data[date] = []
            daily_data[date].append(item)
        
        for date, day_data in list(daily_data.items())[:5]:  # Limit to 5 days
            temps = [item["main"]["temp"] for item in day_data]
            humidity = sum(item["main"]["humidity"] for item in day_data) / len(day_data)
            rainfall = sum(item.get("rain", {}).get("3h", 0) for item in day_data)
            
            forecasts.append({
                "date": date,
                "max_temp": round(max(temps)),
                "min_temp": round(min(temps)),
                "humidity": round(humidity),
                "rainfall": round(rainfall, 1),
                "condition": day_data[0]["weather"][0]["main"].lower()
            })
        
        return {
            "location": data["city"]["name"],
            "forecast": forecasts
        }
    
    def _get_mock_weather_data(self, location: str) -> Dict[str, Any]:
        """Return mock weather data when API fails"""
        return {
            "location": location,
            "current": {
                "temperature": 28,
                "humidity": 75,
                "rainfall": 0,
                "wind_speed": 12,
                "condition": "partly_cloudy",
                "description": "Partly cloudy with chance of rain"
            }
        }
    
    def _get_mock_forecast_data(self, location: str, days: int) -> Dict[str, Any]:
        """Return mock forecast data when API fails"""
        import datetime
        
        forecasts = []
        for i in range(days):
            date = (datetime.datetime.now() + datetime.timedelta(days=i)).strftime("%Y-%m-%d")
            forecasts.append({
                "date": date,
                "max_temp": 30 + (i % 3),
                "min_temp": 22 + (i % 2),
                "humidity": 70 + (i * 5),
                "rainfall": i * 2,
                "condition": ["sunny", "partly_cloudy", "cloudy", "rainy"][i % 4]
            })
        
        return {
            "location": location,
            "forecast": forecasts
        }

# Global instance
weather_service = WeatherService()