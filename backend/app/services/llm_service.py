import httpx
import json
from typing import Dict, Any, Optional
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)

class IBMGraniteService:
    def __init__(self):
        self.api_key = settings.IBM_API_KEY
        self.project_id = settings.IBM_PROJECT_ID
        self.api_url = settings.IBM_API_URL
        self.model_id = "ibm/granite-13b-chat-v2"
        
    async def get_access_token(self) -> str:
        """Get IBM Cloud access token"""
        url = "https://iam.cloud.ibm.com/identity/token"
        headers = {"Content-Type": "application/x-www-form-urlencoded"}
        data = {
            "grant_type": "urn:iam:params:oauth:grant-type:apikey",
            "apikey": self.api_key
        }
        
        async with httpx.AsyncClient() as client:
            response = await client.post(url, headers=headers, data=data)
            if response.status_code == 200:
                return response.json()["access_token"]
            else:
                raise Exception(f"Failed to get access token: {response.text}")
    
    async def generate_response(self, prompt: str, context: Optional[Dict] = None) -> str:
        """Generate AI response using IBM Granite"""
        try:
            access_token = await self.get_access_token()
            
            # Enhance prompt with farming context
            enhanced_prompt = self._enhance_prompt(prompt, context)
            
            url = f"{self.api_url}/ml/v1/text/generation?version=2023-05-29"
            headers = {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": f"Bearer {access_token}"
            }
            
            payload = {
                "input": enhanced_prompt,
                "parameters": {
                    "decoding_method": "greedy",
                    "max_new_tokens": 500,
                    "temperature": 0.7,
                    "top_p": 0.9,
                    "repetition_penalty": 1.1
                },
                "model_id": self.model_id,
                "project_id": self.project_id
            }
            
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.post(url, headers=headers, json=payload)
                
                if response.status_code == 200:
                    result = response.json()
                    return result["results"][0]["generated_text"].strip()
                else:
                    logger.error(f"IBM Granite API error: {response.text}")
                    return self._get_fallback_response(prompt)
                    
        except Exception as e:
            logger.error(f"Error calling IBM Granite API: {e}")
            return self._get_fallback_response(prompt)
    
    def _enhance_prompt(self, prompt: str, context: Optional[Dict] = None) -> str:
        """Enhance prompt with farming context and instructions"""
        system_prompt = """You are Krishi Sakhi, an expert farming assistant for Kerala farmers. 
        Provide practical, actionable advice for farming in Kerala's climate and conditions.
        Focus on organic farming methods, local crops, and sustainable practices.
        Keep responses concise and farmer-friendly."""
        
        if context:
            farm_info = ""
            if context.get("current_crop"):
                farm_info += f"Current crop: {context['current_crop']}. "
            if context.get("soil_type"):
                farm_info += f"Soil type: {context['soil_type']}. "
            if context.get("location"):
                farm_info += f"Location: {context['location']}. "
            
            if farm_info:
                system_prompt += f"\n\nFarm context: {farm_info}"
        
        return f"{system_prompt}\n\nFarmer question: {prompt}\n\nResponse:"
    
    def _get_fallback_response(self, prompt: str) -> str:
        """Provide fallback response when API fails"""
        prompt_lower = prompt.lower()
        
        if any(word in prompt_lower for word in ['pest', 'bug', 'insect', 'കീടം']):
            return "For pest control, I recommend using neem oil spray in the evening. Check plants regularly and remove affected parts. Avoid chemical pesticides if possible."
        
        elif any(word in prompt_lower for word in ['weather', 'rain', 'കാലാവസ്ഥ', 'മഴ']):
            return "Monitor weather forecasts regularly. Avoid applying fertilizers or pesticides before expected rain. Ensure proper drainage during monsoon season."
        
        elif any(word in prompt_lower for word in ['fertilizer', 'വളം']):
            return "Use organic fertilizers like compost and cow dung. Apply during early morning or evening. Avoid over-fertilization which can harm plants."
        
        elif any(word in prompt_lower for word in ['water', 'irrigation', 'ജലം']):
            return "Water plants early morning or late evening. Maintain consistent soil moisture. Use mulching to reduce water evaporation."
        
        else:
            return "I'm here to help with your farming questions. Please provide more specific details about your concern - crops, pests, fertilizers, or other farming practices."

# Global instance
granite_service = IBMGraniteService()