from fastapi import APIRouter, Query
import requests

router = APIRouter()

@router.get("/search")
def search_food(query: str = Query(..., min_length=1)):
    url = "https://world.openfoodfacts.org/cgi/search.pl"
    params = {
        "search_terms": query,
        "search_simple": 1,
        "action": "process",
        "json": 1
    }
    r = requests.get(url, params=params)
    if r.status_code == 200:
        data = r.json()
        products = data.get("products", [])
        
        results = []
        for p in products:
            results.append({
                "id": p.get("code", ""),
                "name": p.get("product_name", "Unknown"),
                "calories": p.get("nutriments", {}).get("energy-kcal_100g"),
                "protein": p.get("nutriments", {}).get("proteins_100g"),
                "fat": p.get("nutriments", {}).get("fat_100g"),
                "carbs": p.get("nutriments", {}).get("carbohydrates_100g"),
                "fiber": p.get("nutriments", {}).get("fiber_100g"),
                "sugar": p.get("nutriments", {}).get("sugars_100g"),
                "sodium": p.get("nutriments", {}).get("sodium_100g"),
            })
        return results
    return {"error": "Failed to fetch data"}

@router.get("/barcode/{code}")
def get_food_by_barcode(code: str):
    url = f"https://world.openfoodfacts.org/api/v0/product/{code}.json"
    r = requests.get(url)
    if r.status_code == 200:
        data = r.json()
        if data.get("status") == 1:
            return data["product"]
        return {"error": "Product not found"}
    return {"error": "Failed to fetch data"}
