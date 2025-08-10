from pydantic import BaseModel, Field
from typing import Optional, Dict
from datetime import datetime

class UserBase(BaseModel):
    email: str
    name: Optional[str] = None
    age: Optional[int] = None
    weight: Optional[float] = None
    height: Optional[float] = None
    sex: Optional[str] = None
    activity_level: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserRead(UserBase):
    id: int
    created_at: datetime
    class Config:
        orm_mode = True

class FoodBase(BaseModel):
    name: str
    calories: Optional[float] = None
    protein: Optional[float] = None
    fat: Optional[float] = None
    carbs: Optional[float] = None
    fiber: Optional[float] = None
    sugar: Optional[float] = None
    sodium: Optional[float] = None
    micronutrients: Optional[Dict] = None

class FoodCreate(FoodBase):
    pass

class FoodRead(FoodBase):
    id: int
    class Config:
        orm_mode = True

class UserGoalBase(BaseModel):
    calories: Optional[float] = None
    protein: Optional[float] = None
    carbs: Optional[float] = None
    fat: Optional[float] = None
    micronutrients: Optional[Dict] = None

class UserGoalCreate(UserGoalBase):
    user_id: int

class UserGoalRead(UserGoalBase):
    id: int
    user_id: int
    class Config:
        orm_mode = True

class DiaryEntryBase(BaseModel):
    user_id: int
    food_id: int
    meal_type: str
    grams: int = Field(..., gt=0, description="Amount in grams")
    date: str

class DiaryEntryCreate(DiaryEntryBase):
    pass

class DiaryEntryRead(DiaryEntryBase):
    id: int
    created_at: datetime
    class Config:
        orm_mode = True

class UserSettingsBase(BaseModel):
    user_id: int
    notifications: Optional[bool] = True
    dark_mode: Optional[bool] = False
    units: Optional[str] = "metric"

class UserSettingsCreate(UserSettingsBase):
    pass

class UserSettingsRead(UserSettingsBase):
    id: int
    class Config:
        orm_mode = True
