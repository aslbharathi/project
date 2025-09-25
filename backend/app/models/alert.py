from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime, timedelta
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

class AlertBase(BaseModel):
    type: str = Field(..., regex="^(weather|price|scheme|irrigation|pest|fertilizer|harvest)$")
    priority: str = Field(..., regex="^(high|medium|low)$")
    title: str = Field(..., min_length=1, max_length=200)
    message: str = Field(..., min_length=1, max_length=1000)
    location: Optional[str] = None
    crop: Optional[str] = None

class AlertCreate(AlertBase):
    pass

class Alert(AlertBase):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    user_id: str
    is_read: bool = False
    is_active: bool = True
    expires_at: datetime = Field(default_factory=lambda: datetime.utcnow() + timedelta(days=7))
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}