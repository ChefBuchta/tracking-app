// utils/normalizeFood.ts
import type { FoodItem } from './api';
export function normalizeFood(item: any): FoodItem {
  const nutr = item.nutriments || {};

  const caloriesFromNutriments =
    nutr["energy-kcal_100g"] ??
    (nutr["energy_100g"] ? nutr["energy_100g"] / 4.184 : undefined);

  return {
    id: item.id || item._id || item.code || crypto.randomUUID(),
    name: (item.name || item.product_name || "").trim() || "Unnamed Product",
    calories: item.calories ?? caloriesFromNutriments ?? 0,
    protein: item.protein ?? nutr["proteins_100g"] ?? 0,
    fat: item.fat ?? nutr["fat_100g"] ?? 0,
    carbs: item.carbs ?? nutr["carbohydrates_100g"] ?? 0,
    fiber: item.fiber ?? nutr["fiber_100g"] ?? 0,
    sugar: item.sugar ?? nutr["sugars_100g"] ?? 0,
    sodium: item.sodium ?? nutr["sodium_100g"] ?? 0,
    serving_size: item.serving_size ?? 100,
    serving_unit: item.serving_unit || "g",
    vitamin_a: item.vitamin_a ?? nutr["vitamin-a_100g"],
    vitamin_c: item.vitamin_c ?? nutr["vitamin-c_100g"],
    vitamin_d: item.vitamin_d ?? nutr["vitamin-d_100g"],
    vitamin_e: item.vitamin_e ?? nutr["vitamin-e_100g"],
    vitamin_k: item.vitamin_k ?? nutr["vitamin-k_100g"],
    vitamin_b1: item.vitamin_b1 ?? nutr["vitamin-b1_100g"],
    vitamin_b2: item.vitamin_b2 ?? nutr["vitamin-b2_100g"],
    vitamin_b3: item.vitamin_b3 ?? nutr["vitamin-b3_100g"],
    vitamin_b6: item.vitamin_b6 ?? nutr["vitamin-b6_100g"],
    vitamin_b12: item.vitamin_b12 ?? nutr["vitamin-b12_100g"],
    folate: item.folate ?? nutr["folate_100g"],
    calcium: item.calcium ?? nutr["calcium_100g"],
    iron: item.iron ?? nutr["iron_100g"],
    magnesium: item.magnesium ?? nutr["magnesium_100g"],
    phosphorus: item.phosphorus ?? nutr["phosphorus_100g"],
    potassium: item.potassium ?? nutr["potassium_100g"],
    zinc: item.zinc ?? nutr["zinc_100g"],
  };
}
