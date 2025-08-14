# diary.py
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.data import get_food_by_id
from app.database import save_diary_entry  # your existing helpers
from datetime import datetime

router = APIRouter()

class DiaryEntryCreate(BaseModel):
    food_id: str
    meal_type: str
    quantity: float
    date: str = None

@router.post("/add")
def add_food_to_diary(entry: DiaryEntryCreate):
    food = get_food_by_id(entry.food_id)
    if not food:
        raise HTTPException(status_code=404, detail="Food not found")
    
    if entry.date is None:
        entry.date = datetime.now().strftime("%Y-%m-%d")
    
    entry_data = {
        "food_id": entry.food_id,
        "food_name": food["name"],
        "meal_type": entry.meal_type,
        "quantity": entry.quantity,
        "date": entry.date,
        "calories": round(food["calories"] * entry.quantity, 1),
        # ... rest of nutrition fields ...
    }
    
    entry_id = save_diary_entry(entry_data)
    entry_data["id"] = entry_id
    entry_data["created_at"] = datetime.now().isoformat()
    
    return {"entry": entry_data, "message": "Food added to diary successfully"}
