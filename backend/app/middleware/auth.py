from fastapi import Header, HTTPException
import hashlib

async def get_current_user_id(x_user_id: str = Header(None)) -> str:
    """Get or generate user ID from headers"""
    if x_user_id:
        return x_user_id
    
    # Generate a default user ID if not provided
    return "default_user"

def generate_user_id(ip_address: str, user_agent: str) -> str:
    """Generate user ID from IP and user agent"""
    identifier = f"{ip_address}-{user_agent}"
    return hashlib.sha256(identifier.encode()).hexdigest()[:16]