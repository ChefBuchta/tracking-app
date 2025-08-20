# app/routes/diary.py
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from dotenv import load_dotenv
from app.routes.nutrionix import get_nutrition

load_dotenv()
router = APIRouter()


# ----------------- Models -----------------
class DiaryEntryCreate(BaseModel):
    food_id: str
    food_name: Optional[str] = None
    meal_type: str
    quantity: float                     # user input (grams or units)
    unit_type: Optional[str] = "grams"  # "grams" or "units"
    serving_size: Optional[float] = None
    date: Optional[str] = None

    # Nutrition fields (can be None if fetched later)
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


# ----------------- Add Food Route -----------------
@router.post("/add")
def add_food_to_diary(entry: DiaryEntryCreate):
    # If nutrition info missing, fetch from Nutritionix
    if any(getattr(entry, f) is None for f in ["calories", "protein", "fat", "carbs"]):
        if not entry.food_name:
            raise HTTPException(status_code=400, detail="Food name required when nutrition data missing")

        nutrients = get_nutrition(entry.food_name, "100g")  # always fetch per 100g
        if not nutrients:
            raise HTTPException(status_code=404, detail="Food not found or nutrition data unavailable")

        # Fill entry fields with baseline (per 100g) values
        for key, value in nutrients.items():
            setattr(entry, key, round(value, 2))

        # Force serving size standardization to grams
        entry.serving_size = 100
        entry.unit_type = "grams"

    # ----------------- Scaling -----------------
    if entry.unit_type == "grams":
        multiplier = entry.quantity / 100  # because baseline is per 100g
    elif entry.unit_type == "units" and entry.serving_size:
        multiplier = (entry.quantity * entry.serving_size) / 100
    else:
        multiplier = entry.quantity / 100

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

    # ----------------- Defaults -----------------
    if entry.date is None:
        entry.date = datetime.now().strftime("%Y-%m-%d")

    entry_data = entry.dict()
    entry_data["food_name"] = entry.food_name.title() if entry.food_name else "Unknown Food"
    entry_data["created_at"] = datetime.now().isoformat()

    # Save to DB
    from app.database import save_diary_entry
    entry_id = save_diary_entry(entry_data)
    entry_data["id"] = entry_id

    return {"entry": entry_data, "message": "Food added to diary successfully"}
