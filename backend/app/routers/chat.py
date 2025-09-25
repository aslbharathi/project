from fastapi import APIRouter, HTTPException, Depends
from app.models.chat import ChatRequest, ChatResponse, Message
from app.database import get_database
from app.middleware.auth import get_current_user_id
from app.services.llm_service import granite_service
from app.services.translation_service import translation_service
from slowapi import Limiter
from slowapi.util import get_remote_address
from fastapi import Request
import uuid
import logging
from datetime import datetime

logger = logging.getLogger(__name__)
router = APIRouter()
limiter = Limiter(key_func=get_remote_address)

@router.get("/history")
@limiter.limit("30/minute")
async def get_chat_history(
    request: Request,
    session_id: str = None,
    user_id: str = Depends(get_current_user_id),
    db = Depends(get_database)
):
    """Get chat history"""
    try:
        query = {"user_id": user_id, "is_active": True}
        if session_id:
            query["session_id"] = session_id
        
        chats = await db.chats.find(query).sort("created_at", -1).limit(10).to_list(length=10)
        
        # Flatten messages from all chat sessions
        messages = []
        for chat in chats:
            messages.extend(chat.get("messages", []))
        
        # Sort messages by timestamp
        messages.sort(key=lambda x: x.get("timestamp", datetime.min))
        
        return {"success": True, "data": messages}
    except Exception as e:
        logger.error(f"Get chat history error: {e}")
        raise HTTPException(status_code=500, detail="Server error")

@router.post("/message")
@limiter.limit("20/minute")
async def send_message(
    request: Request,
    chat_request: ChatRequest,
    user_id: str = Depends(get_current_user_id),
    db = Depends(get_database)
):
    """Send message and get AI response"""
    try:
        session_id = chat_request.session_id or str(uuid.uuid4())
        
        # Find or create chat session
        chat = await db.chats.find_one({"user_id": user_id, "session_id": session_id})
        if not chat:
            chat = {
                "user_id": user_id,
                "session_id": session_id,
                "messages": [],
                "is_active": True,
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            }
            await db.chats.insert_one(chat)
        
        # Get farm context for better AI responses
        farm = await db.farms.find_one({"user_id": user_id, "is_active": True})
        context = {}
        if farm:
            context = {
                "current_crop": farm.get("current_crop"),
                "soil_type": farm.get("soil_type"),
                "location": farm.get("location")
            }
        
        # Detect language if not provided
        if not chat_request.language or chat_request.language == "auto":
            detected_lang = await translation_service.detect_language(chat_request.message)
            chat_request.language = detected_lang
        
        # Create user message
        user_message = Message(
            content=chat_request.message,
            sender="user",
            has_image=chat_request.has_image,
            image_url=chat_request.image_url,
            language=chat_request.language
        )
        
        # Translate message to English for AI processing if needed
        message_for_ai = chat_request.message
        if chat_request.language == "ml":
            message_for_ai = await translation_service.translate_text(
                chat_request.message, "ml", "en"
            )
        
        # Generate AI response
        ai_response_text = await granite_service.generate_response(message_for_ai, context)
        
        # Translate AI response back to user's language if needed
        if chat_request.language == "ml":
            ai_response_text = await translation_service.translate_text(
                ai_response_text, "en", "ml"
            )
        
        # Create AI message
        ai_message = Message(
            content=ai_response_text,
            sender="ai",
            language=chat_request.language
        )
        
        # Update chat session
        await db.chats.update_one(
            {"user_id": user_id, "session_id": session_id},
            {
                "$push": {
                    "messages": {
                        "$each": [user_message.dict(), ai_message.dict()],
                        "$slice": -50  # Keep only last 50 messages
                    }
                },
                "$set": {"updated_at": datetime.utcnow()}
            }
        )
        
        return {
            "success": True,
            "data": {
                "user_message": user_message,
                "ai_message": ai_message,
                "session_id": session_id
            }
        }
    except Exception as e:
        logger.error(f"Send message error: {e}")
        raise HTTPException(status_code=500, detail="Server error")

@router.delete("/history")
@limiter.limit("5/minute")
async def clear_chat_history(
    request: Request,
    session_id: str = None,
    user_id: str = Depends(get_current_user_id),
    db = Depends(get_database)
):
    """Clear chat history"""
    try:
        if session_id:
            await db.chats.update_one(
                {"user_id": user_id, "session_id": session_id},
                {"$set": {"is_active": False}}
            )
        else:
            await db.chats.update_many(
                {"user_id": user_id},
                {"$set": {"is_active": False}}
            )
        
        return {"success": True, "message": "Chat history cleared successfully"}
    except Exception as e:
        logger.error(f"Clear chat history error: {e}")
        raise HTTPException(status_code=500, detail="Server error")