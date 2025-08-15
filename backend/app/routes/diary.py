from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from datetime import datetime
import requests
import os
from typing import Optional
from dotenv import load_dotenv

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
def get_nutrition(food_name: str, quantity: float = 1):
    """
    Fetch nutrition info from Nutritionix for a given food name and quantity.
    Returns a dict with calories, protein, fat, carbs, etc., or None if not found.
    """
    url = "https://trackapi.nutritionix.com/v2/natural/nutrients"
    body = {"query": f"{quantity} {food_name}"}

    try:
        r = requests.post(url, headers=BASE_HEADERS, json=body)
        r.raise_for_status()
        data = r.json()
        if not data.get("foods"):
            print(f"No foods found for query: {food_name}")
            return None
        food_data = data["foods"][0]

        return {
            "calories": food_data.get("nf_calories", 0),
            "protein": food_data.get("nf_protein", 0),
            "fat": food_data.get("nf_total_fat", 0),
            "carbs": food_data.get("nf_total_carbohydrate", 0),
            "fiber": food_data.get("nf_dietary_fiber", 0),
            "sugar": food_data.get("nf_sugars", 0),
            "sodium": food_data.get("nf_sodium", 0),
            "vitamin_a": food_data.get("nf_vitamin_a_dv", 0),
            "vitamin_c": food_data.get("nf_vitamin_c_dv", 0),
            "vitamin_d": food_data.get("nf_vitamin_d_dv", 0),
            "vitamin_e": food_data.get("nf_vitamin_e_dv", 0),
            "vitamin_k": food_data.get("nf_vitamin_k_dv", 0),
            "vitamin_b1": food_data.get("nf_thiamin_b1_dv", 0),
            "vitamin_b2": food_data.get("nf_riboflavin_b2_dv", 0),
            "vitamin_b3": food_data.get("nf_niacin_b3_dv", 0),
            "vitamin_b6": food_data.get("nf_vitamin_b6_dv", 0),
            "vitamin_b12": food_data.get("nf_vitamin_b12_dv", 0),
            "folate": food_data.get("nf_folate_dv", 0),
            "calcium": food_data.get("nf_calcium_dv", 0),
            "iron": food_data.get("nf_iron_dv", 0),
            "magnesium": food_data.get("nf_magnesium_dv", 0),
            "phosphorus": food_data.get("nf_phosphorus_dv", 0),
            "potassium": food_data.get("nf_potassium_dv", 0),
            "zinc": food_data.get("nf_zinc_dv", 0),
        }
    except Exception as e:
        print(f"Error fetching nutrition: {e}")
        return None

# ----------------- Add Food Route -----------------
@router.post("/add")
def add_food_to_diary(entry: DiaryEntryCreate):
    # If calories are missing, fetch nutrition info
    if entry.calories is None and entry.food_name:
        nutrients = get_nutrition(entry.food_name, entry.quantity)
        if not nutrients:
            raise HTTPException(status_code=404, detail="Food not found or nutrition data unavailable")

        # Populate entry with fetched nutrients
        for key, value in nutrients.items():
            setattr(entry, key, round(value, 1))

    # Default date to today if missing
    if entry.date is None:
        entry.date = datetime.now().strftime("%Y-%m-%d")

    # Prepare data for DB
    entry_data = entry.dict()
    entry_data["food_name"] = entry.food_name.title() if entry.food_name else "Unknown Food"
    entry_data["created_at"] = datetime.now().isoformat()

    # Save to DB
    from app.database import save_diary_entry
    if entry_data.get("calories") is None:
        raise HTTPException(status_code=400, detail="Cannot add food without calories")

    entry_id = save_diary_entry(entry_data)
    entry_data["id"] = entry_id

    return {"entry": entry_data, "message": "Food added to diary successfully"}
