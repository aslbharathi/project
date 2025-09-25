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

class FarmBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    location: str = Field(..., min_length=1, max_length=100)
    land_size: float = Field(..., gt=0)
    land_unit: str = Field(..., regex="^(cents|hectares)$")
    current_crop: str = Field(..., regex="^(paddy|coconut|rubber|banana|brinjal|pepper|cardamom|ginger|turmeric)$")
    soil_type: str = Field(..., regex="^(laterite|alluvial|coastal|forest)$")
    irrigation: bool = False
    coordinates: Optional[dict] = None

class FarmCreate(FarmBase):
    pass

class FarmUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    location: Optional[str] = Field(None, min_length=1, max_length=100)
    land_size: Optional[float] = Field(None, gt=0)
    land_unit: Optional[str] = Field(None, regex="^(cents|hectares)$")
    current_crop: Optional[str] = Field(None, regex="^(paddy|coconut|rubber|banana|brinjal|pepper|cardamom|ginger|turmeric)$")
    soil_type: Optional[str] = Field(None, regex="^(laterite|alluvial|coastal|forest)$")
    irrigation: Optional[bool] = None
    coordinates: Optional[dict] = None

class Farm(FarmBase):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    user_id: str
    is_active: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

class ActivityBase(BaseModel):
    type: str = Field(..., regex="^(sowedSeeds|appliedFertilizer|irrigated|pestDisease|weeding|harvested)$")
    crop: str = Field(..., min_length=1, max_length=50)
    notes: Optional[str] = Field(None, max_length=500)
    location: str = Field(..., min_length=1, max_length=100)
    weather: Optional[dict] = None
    images: Optional[List[dict]] = None

class ActivityCreate(ActivityBase):
    pass

class Activity(ActivityBase):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    user_id: str
    farm_id: PyObjectId
    is_deleted: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}