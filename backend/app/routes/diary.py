#This is diary.py
#This file contains the API routes for the food diary
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from datetime import datetime
import requests
import os
from typing import Optional
from dotenv import load_dotenv
from app.routes.nutrionix import get_nutrition
load_dotenv()

router = APIRouter()

NUTRITIONIX_APP_ID = os.getenv("NUTRITIONIX_APP_ID")
NUTRITIONIX_API_KEY = os.getenv("NUTRITIONIX_API_KEY")

BASE_HEADERS = {
    "x-app-id": NUTRITIONIX_APP_ID,
    "x-app-key": NUTRITIONIX_API_KEY,
    "Content-Type": "application/json"
}

# ----------------- Models -----------------
class DiaryEntryCreate(BaseModel):
    food_id: str
    food_name: Optional[str] = None
    meal_type: str
    quantity: float
    unit_type: Optional[str] = "grams"
    serving_size: Optional[float] = None
    date: Optional[str] = None
    calories: Optional[float] = None
    protein: Optional[float] = None
    fat: Optional[float] = None
    carbs: Optional[float] = None
    fiber: Optional[float] = None
    sugar: Optional[float] = None
    sodium: Optional[float] = None
    vitamin_a: Optional[float] = None
    vitamin_c: Optional[float] = None
    vitamin_d: Optional[float] = None
    vitamin_e: Optional[float] = None
    vitamin_k: Optional[float] = None
    vitamin_b1: Optional[float] = None
    vitamin_b2: Optional[float] = None
    vitamin_b3: Optional[float] = None
    vitamin_b6: Optional[float] = None
    vitamin_b12: Optional[float] = None
    folate: Optional[float] = None
    calcium: Optional[float] = None
    iron: Optional[float] = None
    magnesium: Optional[float] = None
    phosphorus: Optional[float] = None
    potassium: Optional[float] = None
    zinc: Optional[float] = None

# ----------------- Nutritionix Fetch -----------------

# ----------------- Add Food Route -----------------
@router.post("/add")
def add_food_to_diary(entry: DiaryEntryCreate):
    # Use provided nutrition info if available
    nutrients_fields = ["calories", "protein", "fat", "carbs", "fiber", "sugar", "sodium"]
    for field in nutrients_fields:
        if getattr(entry, field) is None:
            # If any field is missing, fetch nutrition from API
            if entry.food_name:
                nutrients = get_nutrition(entry.food_name, "100g")
                if not nutrients:
                    raise HTTPException(status_code=404, detail="Food not found or nutrition data unavailable")
                for key, value in nutrients.items():
                    if key == "serving_size":
                        # store serving size in grams if available
                        if value and value.get("weight_in_grams"):
                            entry.serving_size = value.get("weight_in_grams")
                        
                    else:
                        setattr(entry, key, round(value, 1))
            else:
                raise HTTPException(status_code=400, detail="Cannot add food without nutrition info")

    # Determine multiplier
    if entry.unit_type == "grams" and entry.serving_size:
        multiplier = entry.quantity / entry.serving_size
    elif entry.unit_type == "units":
        multiplier = entry.quantity
    else:
        multiplier = entry.quantity / 100  # default

# Scale all numeric nutrient fields
    nutrient_fields = [
        "calories", "protein", "fat", "carbs", "fiber", "sugar", "sodium",
        "vitamin_a", "vitamin_c", "vitamin_d", "vitamin_e", "vitamin_k",
        "vitamin_b1", "vitamin_b2", "vitamin_b3", "vitamin_b6", "vitamin_b12",
        "folate", "calcium", "iron", "magnesium", "phosphorus", "potassium", "zinc"
    ]
    for field in nutrient_fields:
        value = getattr(entry, field)
        if value is not None:
            setattr(entry, field, round(value * multiplier, 2))

    # Default date to today if missing
    if entry.date is None:
        entry.date = datetime.now().strftime("%Y-%m-%d")

    # Prepare data for DB
    entry_data = entry.dict()
    entry_data["food_name"] = entry.food_name.title() if entry.food_name else "Unknown Food"
    entry_data["created_at"] = datetime.now().isoformat()

    # Save to DB
    from app.database import save_diary_entry
    entry_id = save_diary_entry(entry_data)
    entry_data["id"] = entry_id

    return {"entry": entry_data, "message": "Food added to diary successfully"}

