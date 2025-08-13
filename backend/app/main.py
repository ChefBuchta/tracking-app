from fastapi import FastAPI, middleware, Query, HTTPException
from fastapi.middleware import cors
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from app.data import foods, get_food_by_id
from app.database import (
    init_database, get_user_stats, update_user_stats, 
    save_diary_entry, get_diary_entries, delete_diary_entry, get_daily_summary
)
from app.routes import food

# Initialize database on startup
init_database()

app = FastAPI()
app.include_router(food.router, prefix="/api")
allowed_origins = [
    "http://localhost:8080",
    "http://localhost:5173",  # Vite default port
    "http://localhost:8081",  # Your frontend port
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models for request/response
class DiaryEntryCreate(BaseModel):
    food_id: str
    meal_type: str = "snack"
    quantity: float = 1.0
    date: Optional[str] = None

class UserStatsUpdate(BaseModel):
    name: str
    age: int
    weight: float
    height: float
    sex: str
    activity_level: str

class DiaryEntryResponse(BaseModel):
    id: int
    food_id: str
    food_name: str
    meal_type: str
    quantity: float
    date: str
    created_at: str
    calories: float
    protein: float
    fat: float
    carbs: float
    fiber: float
    sugar: float
    sodium: float

@app.get("/")
def read_root():
    return {"message": "Welcome to the Tracking App!"}

@app.get("/foods")
def get_foods(q: str = Query(None, description="Search query")):
    if q:
        result = [food for food in foods if q.lower() in food["name"].lower()]
    else:
        result = foods
    return {"foods": result}
@app.get("/foods/recent")
def get_recent_foods():
    # For now, return the first 5 foods as "recent"
    # Later this will be based on user's actual recent usage
    return {"foods": foods[:5]}
@app.get("/foods/{food_id}")
def get_food_by_id_endpoint(food_id: str):
    food = get_food_by_id(food_id)
    if food is None:
        raise HTTPException(status_code=404, detail="Food not found")
    return {"food": food}

# User stats endpoints
@app.get("/user/stats")
def get_user_stats_endpoint():
    """Get current user stats and targets"""
    stats = get_user_stats()
    if not stats:
        raise HTTPException(status_code=404, detail="User stats not found")
    return stats

@app.put("/user/stats")
def update_user_stats_endpoint(stats: UserStatsUpdate):
    """Update user stats and recalculate targets"""
    updated_targets = update_user_stats(stats.dict())
    return {"message": "User stats updated successfully", "new_targets": updated_targets}

# Diary endpoints
@app.get("/diary")
def get_todays_diary():
    """Get today's diary entries"""
    entries = get_diary_entries()
    return {"entries": entries}

@app.post("/diary/add")
def add_food_to_diary(entry: DiaryEntryCreate):
    """Add a food item to the diary"""
    food = get_food_by_id(entry.food_id)
    if not food:
        raise HTTPException(status_code=404, detail="Food not found")
    
    from datetime import datetime
    
    if entry.date is None:
        entry.date = datetime.now().strftime("%Y-%m-%d")
    
    # Calculate nutrition based on quantity
    entry_data = {
        "food_id": entry.food_id,
        "food_name": food["name"],
        "meal_type": entry.meal_type,
        "quantity": entry.quantity,
        "date": entry.date,
        "calories": round(food["calories"] * entry.quantity, 1),
        "protein": round(food["protein"] * entry.quantity, 1),
        "fat": round(food["fat"] * entry.quantity, 1),
        "carbs": round(food["carbs"] * entry.quantity, 1),
        "fiber": round(food.get("fiber", 0) * entry.quantity, 1),
        "sugar": round(food.get("sugar", 0) * entry.quantity, 1),
        "sodium": round(food.get("sodium", 0) * entry.quantity, 1),
        "vitamin_a": round(food.get("vitamin_a", 0) * entry.quantity, 1),
        "vitamin_c": round(food.get("vitamin_c", 0) * entry.quantity, 1),
        "vitamin_d": round(food.get("vitamin_d", 0) * entry.quantity, 1),
        "vitamin_e": round(food.get("vitamin_e", 0) * entry.quantity, 1),
        "vitamin_k": round(food.get("vitamin_k", 0) * entry.quantity, 1),
        "vitamin_b1": round(food.get("vitamin_b1", 0) * entry.quantity, 1),
        "vitamin_b2": round(food.get("vitamin_b2", 0) * entry.quantity, 1),
        "vitamin_b3": round(food.get("vitamin_b3", 0) * entry.quantity, 1),
        "vitamin_b6": round(food.get("vitamin_b6", 0) * entry.quantity, 1),
        "vitamin_b12": round(food.get("vitamin_b12", 0) * entry.quantity, 1),
        "folate": round(food.get("folate", 0) * entry.quantity, 1),
        "calcium": round(food.get("calcium", 0) * entry.quantity, 1),
        "iron": round(food.get("iron", 0) * entry.quantity, 1),
        "magnesium": round(food.get("magnesium", 0) * entry.quantity, 1),
        "phosphorus": round(food.get("phosphorus", 0) * entry.quantity, 1),
        "potassium": round(food.get("potassium", 0) * entry.quantity, 1),
        "zinc": round(food.get("zinc", 0) * entry.quantity, 1),
    }
    
    entry_id = save_diary_entry(entry_data)
    entry_data["id"] = entry_id
    entry_data["created_at"] = datetime.now().isoformat()
    
    return {"entry": entry_data, "message": "Food added to diary successfully"}

@app.delete("/diary/{entry_id}")
def remove_diary_entry_endpoint(entry_id: int):
    """Remove a diary entry"""
    delete_diary_entry(entry_id)
    return {"message": "Diary entry removed successfully"}

@app.get("/diary/summary/{date}")
def get_daily_summary_endpoint(date: str):
    """Get daily nutrition summary for a specific date"""
    summary = get_daily_summary(date)
    return summary

@app.get("/diary/summary")
def get_todays_summary_endpoint():
    """Get today's nutrition summary"""
    summary = get_daily_summary()
    return summary

@app.get("/diary/{date}")
def get_diary_by_date(date: str):
    """Get diary entries for a specific date (YYYY-MM-DD format)"""
    entries = get_diary_entries(date)
    return {"entries": entries, "date": date}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
