# food.py
from fastapi import APIRouter, Query, HTTPException
import requests
import os
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()

NUTRITIONIX_APP_ID = os.getenv("NUTRITIONIX_APP_ID")
NUTRITIONIX_API_KEY = os.getenv("NUTRITIONIX_API_KEY")

BASE_HEADERS = {
    "x-app-id": NUTRITIONIX_APP_ID,
    "x-app-key": NUTRITIONIX_API_KEY,
    "x-remote-user-id": "0",
    "Content-Type": "application/json"
}

NUTRITIONIX_URL = "https://trackapi.nutritionix.com/v2/natural/nutrients"

@router.get("/search")
def search_food(query: str = Query(..., min_length=1)):
    body = {"query": query}
    r = requests.post(NUTRITIONIX_URL, headers=BASE_HEADERS, json=body)
    
    if r.status_code != 200:
        raise HTTPException(status_code=500, detail="Nutritionix API error")
    
    data = r.json()
    if not data.get("foods"):
        return []

    # Map each food to your response format
    results = []
    for food_data in data["foods"]:
        results.append({
            "id": food_data.get("food_name", "").lower().replace(" ", "_"),
            "name": food_data.get("food_name"),
            "photo": food_data.get("photo", {}).get("thumb", ""),
            "calories": food_data.get("nf_calories", 0),
            "protein": food_data.get("nf_protein", 0),
            "fat": food_data.get("nf_total_fat", 0),
            "carbs": food_data.get("nf_total_carbohydrate", 0),
            "fiber": food_data.get("nf_dietary_fiber", 0),
            "sugar": food_data.get("nf_sugars", 0),
            "sodium": food_data.get("nf_sodium", 0)
        })
    
    return results
