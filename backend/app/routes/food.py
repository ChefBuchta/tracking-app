# food.py
from fastapi import APIRouter, Query
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
    "Content-Type": "application/json",
}

NATURAL_URL = "https://trackapi.nutritionix.com/v2/natural/nutrients"
INSTANT_URL = "https://trackapi.nutritionix.com/v2/search/instant"

def get_nutrition(food_name: str):
    """Fetch real nutrition info for a single food item"""
    body = {"query": food_name}
    r = requests.post(NATURAL_URL, headers=BASE_HEADERS, json=body)
    if r.status_code == 200:
        data = r.json()
        if data.get("foods"):
            return data["foods"][0]
    return None

@router.get("/search")
def search_food(query: str = Query(..., min_length=1)):
    # Step 1: Get search suggestions
    r = requests.get(INSTANT_URL, headers=BASE_HEADERS, params={"query": query})
    if r.status_code != 200:
        return {"error": "Failed to fetch data"}

    data = r.json()
    common_foods = data.get("common", [])

    # Step 2: Sort so exact match comes first
    common_foods.sort(key=lambda x: 0 if x.get("food_name", "").lower() == query.lower() else 1)

    results = []
    for item in common_foods:
        name = item.get("food_name")
        photo = item.get("photo", {}).get("thumb")
        
        # Step 3: Get real nutrition
        nutrition = get_nutrition(name)
        if nutrition:
            results.append({
                "id": name,
                "name": name.title(),
                "photo": photo,
                "calories": nutrition.get("nf_calories", 0),
                "protein": nutrition.get("nf_protein", 0),
                "fat": nutrition.get("nf_total_fat", 0),
                "carbs": nutrition.get("nf_total_carbohydrate", 0),
                "fiber": nutrition.get("nf_dietary_fiber", 0),
                "sugar": nutrition.get("nf_sugars", 0),
                "sodium": nutrition.get("nf_sodium", 0),
            })
    return results
