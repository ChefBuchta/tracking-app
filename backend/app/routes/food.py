from fastapi import APIRouter, Query, HTTPException
import requests
import os
from dotenv import load_dotenv

from app.routes.nutrionix import get_nutrition

load_dotenv()
router = APIRouter()

NUTRITIONIX_APP_ID = os.getenv("NUTRITIONIX_APP_ID")
NUTRITIONIX_API_KEY = os.getenv("NUTRITIONIX_API_KEY")

BASE_HEADERS = {
    "x-app-id": NUTRITIONIX_APP_ID,
    "x-app-key": NUTRITIONIX_API_KEY,
}

# 1) SEARCH
@router.get("/search")
def search_food(query: str = Query(..., description="Food name to search")):
    url = "https://trackapi.nutritionix.com/v2/search/instant"
    params = {"query": query, "detailed": False}
    r = requests.get(url, headers=BASE_HEADERS, params=params)
    r.raise_for_status()
    data = r.json()

    # Return simplified results
    results = []
    for item in data.get("common", []):
        results.append({
            "name": item.get("food_name", "").title(),
            "image": item.get("photo", {}).get("thumb", ""),
            "serving_unit": item.get("serving_unit", "g"),
            "serving_size": item.get("serving_qty", 100),
        })
    return {"results": results}

# 2) DETAILS
@router.get("/details")
def food_details(name: str = Query(..., description="Food name to fetch nutrition for")):
    nutrition = get_nutrition(name, 1)
    if not nutrition:
        raise HTTPException(status_code=404, detail="Nutrition info not found")
    return {"food_name": name.title(), **nutrition}
