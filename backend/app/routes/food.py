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
        return data.get("products", [])
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
