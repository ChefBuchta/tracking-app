import sqlite3
from datetime import datetime
import os

# Database file path
DATABASE_PATH = "tracking_app.db"

def get_db_connection():
    """Get a database connection"""
    conn = sqlite3.connect(DATABASE_PATH)
    conn.row_factory = sqlite3.Row  # This enables column access by name
    return conn

def init_database():
    """Initialize the database with tables"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Create user_stats table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS user_stats (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            age INTEGER,
            weight REAL,
            height REAL,
            sex TEXT,
            activity_level TEXT,
            calories_target INTEGER DEFAULT 2000,
            protein_target REAL DEFAULT 150,
            carbs_target REAL DEFAULT 250,
            fat_target REAL DEFAULT 67,
            fiber_target REAL DEFAULT 25,
            sugar_target REAL DEFAULT 50,
            sodium_target REAL DEFAULT 2300,
            vitamin_a_target REAL DEFAULT 900,
            vitamin_c_target REAL DEFAULT 90,
            vitamin_d_target REAL DEFAULT 20,
            vitamin_e_target REAL DEFAULT 15,
            vitamin_k_target REAL DEFAULT 120,
            vitamin_b1_target REAL DEFAULT 1.2,
            vitamin_b2_target REAL DEFAULT 1.3,
            vitamin_b3_target REAL DEFAULT 16,
            vitamin_b6_target REAL DEFAULT 1.7,
            vitamin_b12_target REAL DEFAULT 2.4,
            folate_target REAL DEFAULT 400,
            calcium_target REAL DEFAULT 1000,
            iron_target REAL DEFAULT 8,
            magnesium_target REAL DEFAULT 400,
            phosphorus_target REAL DEFAULT 700,
            potassium_target REAL DEFAULT 4700,
            zinc_target REAL DEFAULT 11,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Create diary_entries table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS diary_entries (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            food_id TEXT NOT NULL,
            food_name TEXT NOT NULL,
            meal_type TEXT NOT NULL,
            quantity REAL NOT NULL,
            date TEXT NOT NULL,
            calories REAL NOT NULL,
            protein REAL NOT NULL,
            fat REAL NOT NULL,
            carbs REAL NOT NULL,
            fiber REAL NOT NULL,
            sugar REAL NOT NULL,
            sodium REAL NOT NULL,
            vitamin_a REAL DEFAULT 0,
            vitamin_c REAL DEFAULT 0,
            vitamin_d REAL DEFAULT 0,
            vitamin_e REAL DEFAULT 0,
            vitamin_k REAL DEFAULT 0,
            vitamin_b1 REAL DEFAULT 0,
            vitamin_b2 REAL DEFAULT 0,
            vitamin_b3 REAL DEFAULT 0,
            vitamin_b6 REAL DEFAULT 0,
            vitamin_b12 REAL DEFAULT 0,
            folate REAL DEFAULT 0,
            calcium REAL DEFAULT 0,
            iron REAL DEFAULT 0,
            magnesium REAL DEFAULT 0,
            phosphorus REAL DEFAULT 0,
            potassium REAL DEFAULT 0,
            zinc REAL DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Insert default user stats if none exist
    cursor.execute('SELECT COUNT(*) FROM user_stats')
    if cursor.fetchone()[0] == 0:
        cursor.execute('''
            INSERT INTO user_stats (
                name, age, weight, height, sex, activity_level,
                calories_target, protein_target, carbs_target, fat_target
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', ('Default User', 25, 70, 175, 'male', 'moderate', 3000, 225, 375, 100))
    
    conn.commit()
    conn.close()

def calculate_bmr(weight, height, age, sex):
    """Calculate Basal Metabolic Rate using Mifflin-St Jeor Equation"""
    if sex.lower() == 'male':
        bmr = 10 * weight + 6.25 * height - 5 * age + 5
    else:
        bmr = 10 * weight + 6.25 * height - 5 * age - 161
    return bmr

def calculate_tdee(bmr, activity_level):
    """Calculate Total Daily Energy Expenditure"""
    activity_multipliers = {
        'sedentary': 1.2,
        'light': 1.375,
        'moderate': 1.55,
        'active': 1.725,
        'very_active': 1.9
    }
    return bmr * activity_multipliers.get(activity_level.lower(), 1.55)

def update_user_stats(stats_data):
    """Update user stats in database"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Calculate targets based on TDEE
    bmr = calculate_bmr(stats_data['weight'], stats_data['height'], stats_data['age'], stats_data['sex'])
    tdee = calculate_tdee(bmr, stats_data['activity_level'])
    
    # Calculate macro targets based on TDEE
    calories_target = int(tdee)
    protein_target = round(calories_target * 0.3 / 4, 1)  # 30% of calories from protein
    carbs_target = round(calories_target * 0.45 / 4, 1)   # 45% of calories from carbs
    fat_target = round(calories_target * 0.25 / 9, 1)     # 25% of calories from fat
    
    cursor.execute('''
        UPDATE user_stats SET
            name = ?, age = ?, weight = ?, height = ?, sex = ?, activity_level = ?,
            calories_target = ?, protein_target = ?, carbs_target = ?, fat_target = ?,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = 1
    ''', (
        stats_data['name'], stats_data['age'], stats_data['weight'], 
        stats_data['height'], stats_data['sex'], stats_data['activity_level'],
        calories_target, protein_target, carbs_target, fat_target
    ))
    
    conn.commit()
    conn.close()
    
    return {
        'calories_target': calories_target,
        'protein_target': protein_target,
        'carbs_target': carbs_target,
        'fat_target': fat_target
    }

def get_user_stats():
    """Get current user stats"""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM user_stats WHERE id = 1')
    stats = cursor.fetchone()
    conn.close()
    return dict(stats) if stats else None

def save_diary_entry(entry_data):
    """Save a diary entry to database"""
    conn = get_db_connection()
    cursor = conn.cursor()
    print(entry_data)
    cursor.execute('''
        INSERT INTO diary_entries (
            food_id, food_name, meal_type, quantity, date,
            calories, protein, fat, carbs, fiber, sugar, sodium,
            vitamin_a, vitamin_c, vitamin_d, vitamin_e, vitamin_k,
            vitamin_b1, vitamin_b2, vitamin_b3, vitamin_b6, vitamin_b12,
            folate, calcium, iron, magnesium, phosphorus, potassium, zinc
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        entry_data['food_id'], entry_data['food_name'], entry_data['meal_type'],
        entry_data['quantity'], entry_data['date'], entry_data['calories'],
        entry_data['protein'], entry_data['fat'], entry_data['carbs'],
        entry_data['fiber'], entry_data['sugar'], entry_data['sodium'],
        entry_data.get('vitamin_a', 0), entry_data.get('vitamin_c', 0),
        entry_data.get('vitamin_d', 0), entry_data.get('vitamin_e', 0),
        entry_data.get('vitamin_k', 0), entry_data.get('vitamin_b1', 0),
        entry_data.get('vitamin_b2', 0), entry_data.get('vitamin_b3', 0),
        entry_data.get('vitamin_b6', 0), entry_data.get('vitamin_b12', 0),
        entry_data.get('folate', 0), entry_data.get('calcium', 0),
        entry_data.get('iron', 0), entry_data.get('magnesium', 0),
        entry_data.get('phosphorus', 0), entry_data.get('potassium', 0),
        entry_data.get('zinc', 0)
    ))
    
    entry_id = cursor.lastrowid
    conn.commit()
    conn.close()
    return entry_id

def get_diary_entries(date=None):
    """Get diary entries for a specific date"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    if date:
        cursor.execute('SELECT * FROM diary_entries WHERE date = ? ORDER BY created_at DESC', (date,))
    else:
        today = datetime.now().strftime('%Y-%m-%d')
        cursor.execute('SELECT * FROM diary_entries WHERE date = ? ORDER BY created_at DESC', (today,))
    
    entries = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return entries

def delete_diary_entry(entry_id):
    """Delete a diary entry"""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('DELETE FROM diary_entries WHERE id = ?', (entry_id,))
    conn.commit()
    conn.close()

def get_daily_summary(date=None):
    """Get daily nutrition summary"""
    entries = get_diary_entries(date)
    
    if not entries:
        return {
            'date': date or datetime.now().strftime('%Y-%m-%d'),
            'total_entries': 0,
            'calories': 0,
            'protein': 0,
            'fat': 0,
            'carbs': 0,
            'fiber': 0,
            'sugar': 0,
            'sodium': 0,
            'vitamin_a': 0,
            'vitamin_c': 0,
            'vitamin_d': 0,
            'vitamin_e': 0,
            'vitamin_k': 0,
            'vitamin_b1': 0,
            'vitamin_b2': 0,
            'vitamin_b3': 0,
            'vitamin_b6': 0,
            'vitamin_b12': 0,
            'folate': 0,
            'calcium': 0,
            'iron': 0,
            'magnesium': 0,
            'phosphorus': 0,
            'potassium': 0,
            'zinc': 0
        }
    
    summary = {
        'date': date or datetime.now().strftime('%Y-%m-%d'),
        'total_entries': len(entries),
        'calories': sum(entry['calories'] for entry in entries),
        'protein': sum(entry['protein'] for entry in entries),
        'fat': sum(entry['fat'] for entry in entries),
        'carbs': sum(entry['carbs'] for entry in entries),
        'fiber': sum(entry['fiber'] for entry in entries),
        'sugar': sum(entry['sugar'] for entry in entries),
        'sodium': sum(entry['sodium'] for entry in entries),
        'vitamin_a': sum(entry['vitamin_a'] for entry in entries),
        'vitamin_c': sum(entry['vitamin_c'] for entry in entries),
        'vitamin_d': sum(entry['vitamin_d'] for entry in entries),
        'vitamin_e': sum(entry['vitamin_e'] for entry in entries),
        'vitamin_k': sum(entry['vitamin_k'] for entry in entries),
        'vitamin_b1': sum(entry['vitamin_b1'] for entry in entries),
        'vitamin_b2': sum(entry['vitamin_b2'] for entry in entries),
        'vitamin_b3': sum(entry['vitamin_b3'] for entry in entries),
        'vitamin_b6': sum(entry['vitamin_b6'] for entry in entries),
        'vitamin_b12': sum(entry['vitamin_b12'] for entry in entries),
        'folate': sum(entry['folate'] for entry in entries),
        'calcium': sum(entry['calcium'] for entry in entries),
        'iron': sum(entry['iron'] for entry in entries),
        'magnesium': sum(entry['magnesium'] for entry in entries),
        'phosphorus': sum(entry['phosphorus'] for entry in entries),
        'potassium': sum(entry['potassium'] for entry in entries),
        'zinc': sum(entry['zinc'] for entry in entries)
    }
    
    # Round all values
    for key in summary:
        if isinstance(summary[key], float):
            summary[key] = round(summary[key], 1)
    
    return summary
