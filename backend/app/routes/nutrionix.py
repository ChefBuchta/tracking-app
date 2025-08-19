#This is nutrionix.py
from fastapi import APIRouter
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
    "Content-Type": "application/json"
}

def get_nutrition(food_name: str, base_amount: str = "100g"):
    """
    Always fetch nutrition for a fixed base amount from Nutritionix.
    Example: "100g egg" or "1 egg"
    Returns nutrients PER base_amount, not scaled again.
    """
    url = "https://trackapi.nutritionix.com/v2/natural/nutrients"
    body = {"query": f"{base_amount} {food_name}"}

    try:
        r = requests.post(url, headers=BASE_HEADERS, json=body)
        r.raise_for_status()
        data = r.json()

        if not data.get("foods"):
            print(f"No foods found for query: {food_name}")
            return None

        food_data = data["foods"][0]

        nutrients = {
            "calories": food_data.get("nf_calories", 0),
            "protein": food_data.get("nf_protein", 0),
            "fat": food_data.get("nf_total_fat", 0),
            "carbs": food_data.get("nf_total_carbohydrate", 0),
            "fiber": food_data.get("nf_dietary_fiber", 0),
            "sugar": food_data.get("nf_sugars", 0),
            "sodium": food_data.get("nf_sodium", 0),

            # ⚠️ use absolute values, not %DV
            "vitamin_a": food_data.get("nf_vitamin_a_iu", 0),
            "vitamin_c": food_data.get("nf_vitamin_c_mg", 0),
            "vitamin_d": food_data.get("nf_vitamin_d_mcg", 0),
            "vitamin_e": food_data.get("nf_vitamin_e_mg", 0),
            "vitamin_k": food_data.get("nf_vitamin_k_mcg", 0),
            "vitamin_b1": food_data.get("nf_thiamin_mg", 0),
            "vitamin_b2": food_data.get("nf_riboflavin_mg", 0),
            "vitamin_b3": food_data.get("nf_niacin_mg", 0),
            "vitamin_b6": food_data.get("nf_vitamin_b6_mg", 0),
            "vitamin_b12": food_data.get("nf_vitamin_b12_mcg", 0),
            "folate": food_data.get("nf_folate_mcg", 0),
            "calcium": food_data.get("nf_calcium_mg", 0),
            "iron": food_data.get("nf_iron_mg", 0),
            "magnesium": food_data.get("nf_magnesium_mg", 0),
            "phosphorus": food_data.get("nf_phosphorus_mg", 0),
            "potassium": food_data.get("nf_potassium_mg", 0),
            "zinc": food_data.get("nf_zinc_mg", 0),
        }

        return nutrients

    except Exception as e:
        print(f"Error fetching nutrition: {e}")
        return None

