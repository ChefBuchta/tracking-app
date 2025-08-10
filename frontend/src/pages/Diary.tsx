import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CircularProgress } from "@/components/CircularProgress";
import { MacroCard } from "@/components/MacroCard";
import { FoodCard } from "@/components/FoodCard";
import { apiService, DiaryEntry, DailySummary, UserStats } from "@/services/api";

export const Diary = () => {
  const [diaryEntries, setDiaryEntries] = useState<DiaryEntry[]>([]);
  const [dailySummary, setDailySummary] = useState<DailySummary | null>(null);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Default targets (fallback if user stats not loaded)
  const targetCalories = userStats?.calories_target || 2000;
  const targetProtein = userStats?.protein_target || 150;
  const targetFat = userStats?.fat_target || 67;
  const targetCarbs = userStats?.carbs_target || 250;

  const loadDiaryData = async () => {
    try {
      setLoading(true);
      const [entries, summary, stats] = await Promise.all([
        apiService.getTodaysDiary(),
        apiService.getTodaysSummary(),
        apiService.getUserStats()
      ]);
      setDiaryEntries(entries);
      setDailySummary(summary);
      setUserStats(stats);
    } catch (error) {
      console.error('Error loading diary data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDiaryData();
    
    // Refresh data when the page becomes visible (user returns from adding food)
    const handleFocus = () => {
      loadDiaryData();
    };
    
    window.addEventListener('focus', handleFocus);
    
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  const handleRemoveEntry = async (entryId: number) => {
    const success = await apiService.removeDiaryEntry(entryId);
    if (success) {
      setDiaryEntries(prev => prev.filter(entry => entry.id !== entryId));
      // Reload summary
      const summary = await apiService.getTodaysSummary();
      setDailySummary(summary);
    }
  };

  if (loading) {
    return (
      <div className="max-w-md mx-auto p-4 space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Food Diary</h1>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  const totalCalories = dailySummary?.calories || 0;
  const totalProtein = dailySummary?.protein || 0;
  const totalFat = dailySummary?.fat || 0;
  const totalCarbs = dailySummary?.carbs || 0;

  return (
    <div className="max-w-md mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold">Food Diary</h1>
        <p className="text-muted-foreground">Today, {new Date().toLocaleDateString()}</p>
        {userStats && (
          <p className="text-sm text-muted-foreground mt-1">
            Target: {userStats.calories_target} calories
          </p>
        )}
      </div>

      {/* Calorie Progress */}
      <Card className="p-6">
        <div className="flex justify-center mb-4">
          <CircularProgress value={totalCalories} max={targetCalories} size="lg">
            <div className="text-center">
              <div className="text-2xl font-bold">{totalCalories}</div>
              <div className="text-sm text-muted-foreground">{targetCalories} kcal</div>
            </div>
          </CircularProgress>
        </div>
        <div className="text-center">
          <div className="text-sm text-muted-foreground">
            {targetCalories - totalCalories} calories remaining
          </div>
        </div>
      </Card>

      {/* Macros */}
      <div className="space-y-3">
        <MacroCard name="Protein" current={totalProtein} target={targetProtein} unit="g" />
        <MacroCard name="Carbohydrates" current={totalCarbs} target={targetCarbs} unit="g" />
        <MacroCard name="Fat" current={totalFat} target={targetFat} unit="g" />
      </div>

      {/* Food List */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Today's Food</h2>
          <Link to="/add-food">
            <Button size="sm" className="gap-2">
              <Plus size={16} />
              Add Food
            </Button>
          </Link>
        </div>
        
        {diaryEntries.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground mb-4">No food logged yet</p>
            <Link to="/add-food">
              <Button>Add Your First Food</Button>
            </Link>
          </Card>
        ) : (
          <div className="space-y-3">
            {diaryEntries.map((entry) => (
              <FoodCard 
                key={entry.id} 
                id={entry.id}
                name={entry.food_name}
                calories={entry.calories}
                protein={entry.protein}
                fat={entry.fat}
                carbs={entry.carbs}
                quantity={entry.quantity}
                mealType={entry.meal_type}
                onRemove={() => handleRemoveEntry(entry.id)}
                isDiaryEntry={true}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};