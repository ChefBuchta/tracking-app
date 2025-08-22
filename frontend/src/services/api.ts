// This is api.ts
// The purpose of this file is to define the API service for the frontend
import { normalizeFood } from './normalizefood';
// API service for backend 

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export interface FoodItem {
  id: string;
  name: string;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
  serving_size?: number; // e.g., 100 for 100g or 1 for 1 item
  serving_unit?: string; // e.g., "g" or "item"
  serving_weight_grams?: number; // e.g., 100 for 100g
  // Micronutrients
  vitamin_a?: number;
  vitamin_c?: number;
  vitamin_d?: number;
  vitamin_e?: number;
  vitamin_k?: number;
  vitamin_b1?: number;
  vitamin_b2?: number;
  vitamin_b3?: number;
  vitamin_b6?: number;
  vitamin_b12?: number;
  folate?: number;
  calcium?: number;
  iron?: number;
  magnesium?: number;
  phosphorus?: number;
  potassium?: number;
  zinc?: number;
  image?: string; // URL of the food image
}

export interface DiaryEntry {
  id: number;
  food_id: string;
  food_name: string;
  meal_type: string;
  quantity: number;
  date: string;
  created_at: string;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  fiber: number;
  sugar: number;
  sodium: number;
  vitamin_a: number;
  vitamin_c: number;
  vitamin_d: number;
  vitamin_e: number;
  vitamin_k: number;
  vitamin_b1: number;
  vitamin_b2: number;
  vitamin_b3: number;
  vitamin_b6: number;
  vitamin_b12: number;
  folate: number;
  calcium: number;
  iron: number;
  magnesium: number;
  phosphorus: number;
  potassium: number;
  zinc: number;
}

export interface DailySummary {
  date: string;
  total_entries: number;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  fiber: number;
  sugar: number;
  sodium: number;
  vitamin_a: number;
  vitamin_c: number;
  vitamin_d: number;
  vitamin_e: number;
  vitamin_k: number;
  vitamin_b1: number;
  vitamin_b2: number;
  vitamin_b3: number;
  vitamin_b6: number;
  vitamin_b12: number;
  folate: number;
  calcium: number;
  iron: number;
  magnesium: number;
  phosphorus: number;
  potassium: number;
  zinc: number;
}

export interface UserStats {
  id: number;
  name: string;
  age: number;
  weight: number;
  height: number;
  sex: string;
  activity_level: string;
  calories_target: number;
  protein_target: number;
  carbs_target: number;
  fat_target: number;
  fiber_target: number;
  sugar_target: number;
  sodium_target: number;
  vitamin_a_target: number;
  vitamin_c_target: number;
  vitamin_d_target: number;
  vitamin_e_target: number;
  vitamin_k_target: number;
  vitamin_b1_target: number;
  vitamin_b2_target: number;
  vitamin_b3_target: number;
  vitamin_b6_target: number;
  vitamin_b12_target: number;
  folate_target: number;
  calcium_target: number;
  iron_target: number;
  magnesium_target: number;
  phosphorus_target: number;
  potassium_target: number;
  zinc_target: number;
  created_at: string;
  updated_at: string;
}

export interface SearchFoodResponse {
  foods: FoodItem[];
  message?: string;
}

class ApiService {
  private async fetchWithErrorHandling(url: string, options?: RequestInit) {
    try {
      console.log('Making API request to:', url);
      console.log('Request options:', options);
      
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Response error text:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
      }

      const data = await response.json();
      console.log('Response data:', data);
      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

async searchFood(query: string): Promise<FoodItem[]> {
  try {
    const response = await this.fetchWithErrorHandling(
      `${API_BASE_URL}/api/search?query=${encodeURIComponent(query)}`
    );

    const foods = Array.isArray(response.results) ? response.results : [];

    // Fetch nutrition details for each food
    const detailedFoods = await Promise.all(
      foods.map(async (f: any) => {
        try {
          const details = await this.fetchWithErrorHandling(
            `${API_BASE_URL}/api/details?query=${encodeURIComponent(f.name)}`
          );
          return normalizeFood({ ...f, ...details });
        } catch (err) {
          console.error("Failed to fetch details for", f.name, err);
          return normalizeFood(f); // fallback (just name + serving)
        }
      })
    );

    return detailedFoods.filter(Boolean) as FoodItem[];
  } catch (error) {
    console.error("Error searching food:", error);
    return this.getMockFoodData(query).map(normalizeFood);
  }
}



  async getFoodById(foodId: string): Promise<FoodItem | null> {
    try {
      const response = await this.fetchWithErrorHandling(
        `${API_BASE_URL}/foods/${foodId}`
      );
      return response.food || null;
    } catch (error) {
      console.error('Error fetching food by ID:', error);
      return null;
    }
  }

  private getMockFoodData(query: string): FoodItem[] {
    const mockFoods = [
      { 
        id: '1', 
        name: 'Apple', 
        calories: 95, 
        protein: 0.5, 
        fat: 0.3, 
        carbs: 25,
        fiber: 4.4,
        sugar: 19,
        vitamin_c: 8.4,
        potassium: 195
      },
      { 
        id: '2', 
        name: 'Banana', 
        calories: 105, 
        protein: 1.3, 
        fat: 0.4, 
        carbs: 27,
        fiber: 3.1,
        sugar: 14,
        vitamin_c: 10.3,
        potassium: 422,
        vitamin_b6: 0.4
      },
      { 
        id: '3', 
        name: 'Chicken Breast', 
        calories: 231, 
        protein: 43.5, 
        fat: 5, 
        carbs: 0,
        vitamin_b3: 15.4,
        vitamin_b6: 1.0,
        phosphorus: 256
      },
      { 
        id: '4', 
        name: 'Brown Rice', 
        calories: 216, 
        protein: 5, 
        fat: 1.8, 
        carbs: 45,
        fiber: 3.5,
        magnesium: 143,
        phosphorus: 208
      },
    ];

    return mockFoods.filter(food => 
      food.name.toLowerCase().includes(query.toLowerCase()) ||
      query.toLowerCase().includes(food.name.toLowerCase().substring(0, 4))
    );
  }

  async getFoodByBarcode(code: string): Promise<FoodItem | null> {
  try {
    const response = await this.fetchWithErrorHandling(
      `${API_BASE_URL}/api/barcode/${encodeURIComponent(code)}`
    );
    return response || null;
  } catch (error) {
    console.error('Error fetching food by barcode:', error);
    return null;
  }
}

  async getRecentFoods(): Promise<FoodItem[]> {
    try {
      const response = await this.fetchWithErrorHandling(`${API_BASE_URL}/api/foods/recent`);
      return response.foods || [];
    } catch (error) {
      console.error('Error fetching recent foods:', error);
      return this.getMockFoodData('').slice(0, 3);
    }
  }

  async addFoodToDiary(food: FoodItem, mealType: string = 'snack', quantity: number = 1, unit_type: 'grams' | 'units' = 'grams'): Promise<DiaryEntry | null> {
    try {
      console.log('Adding food to diary:', { food_id: food.id, meal_type: mealType, quantity, unit_type });
      console.log('API URL:', `${API_BASE_URL}/diary/add`);
      
      const response = await this.fetchWithErrorHandling(`${API_BASE_URL}/diary/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },

        body: JSON.stringify({
          food_id: food.id,
          food_name: food.name,
          meal_type: mealType,
          quantity: quantity,
          unit_type: unit_type,
        }),
      });
      
      console.log('API Response:', response);
      return response.entry || null;
    } catch (error) {
      console.error('Error adding food to diary:', error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack
      });
      return null;
    }
  }

  async getTodaysDiary(): Promise<DiaryEntry[]> {
    try {
      const response = await this.fetchWithErrorHandling(`${API_BASE_URL}/diary`);
      return response.entries || [];
    } catch (error) {
      console.error('Error fetching today\'s diary:', error);
      return [];
    }
  }

  async getDiaryByDate(date: string): Promise<DiaryEntry[]> {
    try {
      const response = await this.fetchWithErrorHandling(`${API_BASE_URL}/diary/${date}`);
      return response.entries || [];
    } catch (error) {
      console.error('Error fetching diary by date:', error);
      return [];
    }
  }

  async removeDiaryEntry(entryId: number): Promise<boolean> {
    try {
      await this.fetchWithErrorHandling(`${API_BASE_URL}/diary/${entryId}`, {
        method: 'DELETE',
      });
      return true;
    } catch (error) {
      console.error('Error removing diary entry:', error);
      return false;
    }
  }

  async getTodaysSummary(): Promise<DailySummary | null> {
    try {
      const response = await this.fetchWithErrorHandling(`${API_BASE_URL}/diary/summary`);
      return response || null;
    } catch (error) {
      console.error('Error fetching today\'s summary:', error);
      return null;
    }
  }

  async getDailySummary(date: string): Promise<DailySummary | null> {
    try {
      const response = await this.fetchWithErrorHandling(`${API_BASE_URL}/diary/summary/${date}`);
      return response || null;
    } catch (error) {
      console.error('Error fetching daily summary:', error);
      return null;
    }
  }

  // User stats endpoints
  async getUserStats(): Promise<UserStats | null> {
    try {
      const response = await this.fetchWithErrorHandling(`${API_BASE_URL}/user/stats`);
      return response || null;
    } catch (error) {
      console.error('Error fetching user stats:', error);
      return null;
    }
  }

  async updateUserStats(stats: {
    name: string;
    age: number;
    weight: number;
    height: number;
    sex: string;
    activity_level: string;
  }): Promise<{ message: string; new_targets: any } | null> {
    try {
      const response = await this.fetchWithErrorHandling(`${API_BASE_URL}/user/stats`, {
        method: 'PUT',
        body: JSON.stringify(stats),
      });
      return response || null;
    } catch (error) {
      console.error('Error updating user stats:', error);
      return null;
    }
  }
  
}

export const apiService = new ApiService();

export async function searchFoods(query: string) {
  const res = await fetch(`/api/search?query=${encodeURIComponent(query)}`);
  if (!res.ok) throw new Error('Failed to fetch');
  return res.json();
}

export async function getFoodByBarcode(code: string) {
  const res = await fetch(`/api/barcode/${encodeURIComponent(code)}`);
  if (!res.ok) throw new Error('Failed to fetch');
  return res.json();
}
