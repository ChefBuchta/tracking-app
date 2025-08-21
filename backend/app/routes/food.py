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
    for item in data.get("common", [])[:5]:  # limit to top 5 results
        food_name = item.get("food_name", "")
        
        # Step 2: Lookup macros
        nutri_url = "https://trackapi.nutritionix.com/v2/natural/nutrients"
        nutri_res = requests.post(nutri_url, headers=BASE_HEADERS, json={"query": food_name})
        nutri_res.raise_for_status()
        nutri_data = nutri_res.json()

        if nutri_data.get("foods"):
            f = nutri_data["foods"][0]
            results.append({
                "name": f.get("food_name", "").title(),
                "serving_unit": f.get("serving_unit", "g"),
                "serving_size": f.get("serving_qty", 1),
                "serving_weight_grams": f.get("serving_weight_grams", 100),
                "calories": f.get("nf_calories", 0),
                "protein": f.get("nf_protein", 0),
                "fat": f.get("nf_total_fat", 0),
                "carbs": f.get("nf_total_carbohydrate", 0),
            })
    return {"results": results}

# 2) DETAILS
@router.get("/details")
def food_details(name: str = Query(..., description="Food name to fetch nutrition for")):
    nutrition = get_nutrition(name, 1)
    if not nutrition:
        raise HTTPException(status_code=404, detail="Nutrition info not found")
    return {"food_name": name.title(), **nutrition}
