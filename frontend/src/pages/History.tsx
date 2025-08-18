import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { FoodCard }  from "@/components/FoodCard";

const mockHistoryData = [
  {
    date: "2024-01-15",
    foods: [
      { id: 1, name: "Oatmeal", calories: 150, protein: 5, fat: 3, carbs: 27 },
      { id: 2, name: "Banana", calories: 105, protein: 1, fat: 0, carbs: 27 },
    ],
    totalCalories: 255,
  },
  {
    date: "2024-01-14", 
    foods: [
      { id: 3, name: "Chicken Salad", calories: 320, protein: 25, fat: 12, carbs: 15 },
      { id: 4, name: "Apple", calories: 95, protein: 0.5, fat: 0.3, carbs: 25 },
    ],
    totalCalories: 415,
  },
];

export const History = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<"day" | "week" | "month">("day");

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const navigateDate = (direction: "prev" | "next") => {
    const newDate = new Date(selectedDate);
    if (viewMode === "day") {
      newDate.setDate(newDate.getDate() + (direction === "next" ? 1 : -1));
    } else if (viewMode === "week") {
      newDate.setDate(newDate.getDate() + (direction === "next" ? 7 : -7));
    } else {
      newDate.setMonth(newDate.getMonth() + (direction === "next" ? 1 : -1));
    }
    setSelectedDate(newDate);
  };

  return (
    <div className="max-w-md mx-auto p-4 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Food History</h1>
        <p className="text-muted-foreground">Track your nutrition over time</p>
      </div>

      {/* Date Navigation */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <Button variant="ghost" size="sm" onClick={() => navigateDate("prev")}>
            <ChevronLeft size={16} />
          </Button>
          <div className="flex items-center gap-2">
            <Calendar size={16} />
            <span className="font-medium">{formatDate(selectedDate)}</span>
          </div>
          <Button variant="ghost" size="sm" onClick={() => navigateDate("next")}>
            <ChevronRight size={16} />
          </Button>
        </div>
        
        <div className="flex gap-2">
          {["day", "week", "month"].map((mode) => (
            <Button
              key={mode}
              variant={viewMode === mode ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode(mode as any)}
              className="capitalize"
            >
              {mode}
            </Button>
          ))}
        </div>
      </Card>

      {/* History Data */}
      <div className="space-y-4">
        {mockHistoryData.map((day) => (
          <Card key={day.date} className="p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold">
                {new Date(day.date).toLocaleDateString()}
              </h3>
              <div className="text-sm text-muted-foreground">
                {day.totalCalories} kcal
              </div>
            </div>
            
            <div className="space-y-2">
              {day.foods.map((food) => (
                <FoodCard 
                  key={food.id} 
                  {...food}
                  showActions={false}
                />
              ))}
            </div>
          </Card>
        ))}
      </div>

      {/* Weekly Summary */}
      <Card className="p-4">
        <h2 className="font-semibold mb-3">This Week Summary</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">1,850</div>
            <div className="text-muted-foreground">Avg Calories</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">7</div>
            <div className="text-muted-foreground">Days Logged</div>
          </div>
        </div>
      </Card>
    </div>
  );
};