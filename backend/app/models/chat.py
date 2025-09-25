from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from bson import ObjectId

class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid objectid")
        return ObjectId(v)

    @classmethod
    def __modify_schema__(cls, field_schema):
        field_schema.update(type="string")

class MessageBase(BaseModel):
    content: str = Field(..., min_length=1, max_length=2000)
    sender: str = Field(..., regex="^(user|ai)$")
    has_image: bool = False
    image_url: Optional[str] = None
    language: str = Field(default="en", regex="^(en|ml)$")

class MessageCreate(MessageBase):
    pass

class Message(MessageBase):
    id: str = Field(default_factory=lambda: str(ObjectId()))
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class ChatSessionBase(BaseModel):
    session_id: str
    messages: List[Message] = []

class ChatSessionCreate(ChatSessionBase):
    pass

class ChatSession(ChatSessionBase):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    user_id: str
    is_active: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=2000)
    session_id: Optional[str] = None
    language: str = Field(default="en", regex="^(en|ml)$")
    has_image: bool = False
    image_url: Optional[str] = None

class ChatResponse(BaseModel):
    user_message: Message
    ai_message: Message
    session_id: str