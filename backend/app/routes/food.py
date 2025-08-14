from fastapi import APIRouter, Query
import requests
import os
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()

NUTRITIONIX_APP_ID = os.getenv("NUTRITIONIX_APP_ID")
NUTRITIONIX_API_KEY = os.getenv("NUTRITIONIX_API_KEY")

@router.get("/search")
def search_food(query: str = Query(..., min_length=1)):
    url = "https://trackapi.nutritionix.com/v2/search/instant"
    headers = {
        "x-app-id": NUTRITIONIX_APP_ID,
        "x-app-key": NUTRITIONIX_API_KEY
    }
    params = {"query": query}
    
    r = requests.get(url, headers=headers, params=params)
    if r.status_code == 200:
        data = r.json()
        results = []
        
        for item in data.get("common", []):
            results.append({
                "id": item.get("food_name"),
                "name": item.get("food_name").title(),
                "photo": item.get("photo", {}).get("thumb")
            })
        return results
    
    return {"error": "Failed to fetch data"}

