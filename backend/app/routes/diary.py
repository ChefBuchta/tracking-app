from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from datetime import datetime
import requests
import os

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
    food_name: str
    meal_type: str
    quantity: float
    date: str = None


def get_nutrition(food_name: str):
    url = "https://trackapi.nutritionix.com/v2/natural/nutrients"
    body = {"query": food_name}
    r = requests.post(url, headers=BASE_HEADERS, json=body)

    if r.status_code != 200:
        return None
    data = r.json()
    if not data.get("foods"):
        return None
    return data["foods"][0]


@router.post("/add")
def add_food_to_diary(entry: DiaryEntryCreate):
    food = get_nutrition(entry.food_name)
    if not food:
        raise HTTPException(status_code=404, detail="Food not found")

    if entry.date is None:
        entry.date = datetime.now().strftime("%Y-%m-%d")

    entry_data = {
        "food_name": food.get("food_name").title(),
        "meal_type": entry.meal_type,
        "quantity": entry.quantity,
        "date": entry.date,
        "calories": round(food.get("nf_calories", 0) * entry.quantity, 1),
        "protein": round(food.get("nf_protein", 0) * entry.quantity, 1),
        "fat": round(food.get("nf_total_fat", 0) * entry.quantity, 1),
        "carbs": round(food.get("nf_total_carbohydrate", 0) * entry.quantity, 1),
        "fiber": round(food.get("nf_dietary_fiber", 0) * entry.quantity, 1),
        "sugar": round(food.get("nf_sugars", 0) * entry.quantity, 1),
        "sodium": round(food.get("nf_sodium", 0) * entry.quantity, 1),
        "created_at": datetime.now().isoformat()
    }

    # Save to DB (your save_diary_entry function)
    from app.database import save_diary_entry
    entry_id = save_diary_entry(entry_data)
    entry_data["id"] = entry_id

    return {"entry": entry_data, "message": "Food added to diary successfully"}
