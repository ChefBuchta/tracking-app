
from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Boolean, JSON
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()

class User(Base):
	__tablename__ = "users"
	id = Column(Integer, primary_key=True, index=True)
	email = Column(String, unique=True, index=True, nullable=False)
	password_hash = Column(String, nullable=False)
	name = Column(String)
	age = Column(Integer)
	weight = Column(Float)
	height = Column(Float)
	sex = Column(String)
	activity_level = Column(String)
	created_at = Column(DateTime, default=datetime.utcnow)

class Food(Base):
	__tablename__ = "foods"
	id = Column(Integer, primary_key=True, index=True)
	name = Column(String, nullable=False)
	calories = Column(Float)
	protein = Column(Float)
	fat = Column(Float)
	carbs = Column(Float)
	fiber = Column(Float)
	sugar = Column(Float)
	sodium = Column(Float)
	micronutrients = Column(JSON, default={})

class UserGoal(Base):
	__tablename__ = "user_goals"
	id = Column(Integer, primary_key=True, index=True)
	user_id = Column(Integer, ForeignKey("users.id"))
	calories = Column(Float)
	protein = Column(Float)
	carbs = Column(Float)
	fat = Column(Float)
	micronutrients = Column(JSON, default={})

class DiaryEntry(Base):
	__tablename__ = "diary_entries"
	id = Column(Integer, primary_key=True, index=True)
	user_id = Column(Integer, ForeignKey("users.id"))
	food_id = Column(Integer, ForeignKey("foods.id"))
	meal_type = Column(String)
	grams = Column(Integer)  # Amount in grams
	date = Column(String)
	created_at = Column(DateTime, default=datetime.utcnow)

class UserSettings(Base):
	__tablename__ = "user_settings"
	id = Column(Integer, primary_key=True, index=True)
	user_id = Column(Integer, ForeignKey("users.id"))
	notifications = Column(Boolean, default=True)
	dark_mode = Column(Boolean, default=False)
	units = Column(String, default="metric")