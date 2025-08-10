# Core entities:
- User (id, email, password_hash, name, age, weight, height, sex, activity_level, created_at)
- Food (id, name, calories, protein, fat, carbs, fiber, sugar, sodium, micronutrients)
- UserGoal (user_id, calories, protein, carbs, fat, micronutrients)
- DiaryEntry (id, user_id, food_id, meal_type, quantity, date, created_at)
- UserSettings (user_id, notifications, dark_mode, units)