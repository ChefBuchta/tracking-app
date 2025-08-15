#This is diary.py
#This file contains the routes for managing the food diary
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from datetime import datetime
import requests
import os
from typing import Optional

router = APIRouter()

NUTRITIONIX_APP_ID = os.getenv("NUTRITIONIX_APP_ID")
NUTRITIONIX_API_KEY = os.getenv("NUTRITIONIX_API_KEY")

BASE_HEADERS = {
    "x-app-id": NUTRITIONIX_APP_ID,
    "x-app-key": NUTRITIONIX_API_KEY,
    "Content-Type": "application/json"
}

# Model for incoming diary entry

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



def get_nutrition(food_name: str):
    url = "https://trackapi.nutritionix.com/v2/natural/nutrients"
    body = {"query": food_name}
    r = requests.post(url, headers=BASE_HEADERS, json=body)

    print(f"Nutrition API Response: {r.json()}")  # Debugging statement
    if r.status_code != 200 or not data.get("foods"):
        return None
    data = r.json()
    if not data.get("foods"):
        return None
    return data["foods"][0]


@router.post("/add")
def add_food_to_diary(entry: DiaryEntryCreate):
    # If calories are missing, fetch nutrition from Nutritionix
    if entry.calories is None and entry.food_name:
        food = get_nutrition(entry.food_name)
        if not food:
            raise HTTPException(status_code=404, detail="Food not found")

        # Populate missing nutrients from Nutritionix
        entry.calories = round(food.get("nf_calories", 0) * entry.quantity, 1)
        entry.protein = round(food.get("nf_protein", 0) * entry.quantity, 1)
        entry.fat = round(food.get("nf_total_fat", 0) * entry.quantity, 1)
        entry.carbs = round(food.get("nf_total_carbohydrate", 0) * entry.quantity, 1)
        entry.fiber = round(food.get("nf_dietary_fiber", 0) * entry.quantity, 1)
        entry.sugar = round(food.get("nf_sugars", 0) * entry.quantity, 1)
        entry.sodium = round(food.get("nf_sodium", 0) * entry.quantity, 1)
        entry.vitamin_a = round(food.get("nf_vitamin_a_dv", 0) * entry.quantity, 1)
        entry.vitamin_c = round(food.get("nf_vitamin_c_dv", 0) * entry.quantity, 1)
        entry.vitamin_d = round(food.get("nf_vitamin_d_dv", 0) * entry.quantity, 1)
        entry.vitamin_e = round(food.get("nf_vitamin_e_dv", 0) * entry.quantity, 1)
        entry.vitamin_k = round(food.get("nf_vitamin_k_dv", 0) * entry.quantity, 1)
        entry.vitamin_b1 = round(food.get("nf_thiamin_b1_dv", 0) * entry.quantity, 1)
        entry.vitamin_b2 = round(food.get("nf_riboflavin_b2_dv", 0) * entry.quantity, 1)
        entry.vitamin_b3 = round(food.get("nf_niacin_b3_dv", 0) * entry.quantity, 1)
        entry.vitamin_b6 = round(food.get("nf_vitamin_b6_dv", 0) * entry.quantity, 1)
        entry.vitamin_b12 = round(food.get("nf_vitamin_b12_dv", 0) * entry.quantity, 1)
        entry.folate = round(food.get("nf_folate_dv", 0) * entry.quantity, 1)
        entry.calcium = round(food.get("nf_calcium_dv", 0) * entry.quantity, 1)
        entry.iron = round(food.get("nf_iron_dv", 0) * entry.quantity, 1)
        entry.magnesium = round(food.get("nf_magnesium_dv", 0) * entry.quantity, 1)
        entry.phosphorus = round(food.get("nf_phosphorus_dv", 0) * entry.quantity, 1)
        entry.potassium = round(food.get("nf_potassium_dv", 0) * entry.quantity, 1)
        entry.zinc = round(food.get("nf_zinc_dv", 0) * entry.quantity, 1)

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
