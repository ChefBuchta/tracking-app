import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, Award, Target } from "lucide-react";

const mockStats = {
  weeklyAverage: {
    calories: 1850,
    protein: 120,
    carbs: 180,
    fat: 65,
  },
  micronutrients: [
    { name: "Vitamin D", percentage: 85, status: "good" },
    { name: "Iron", percentage: 65, status: "low" },
    { name: "Calcium", percentage: 95, status: "excellent" },
    { name: "Vitamin B12", percentage: 45, status: "deficient" },
    { name: "Magnesium", percentage: 78, status: "good" },
    { name: "Zinc", percentage: 88, status: "good" },
  ],
  achievements: [
    { title: "7 Day Streak", icon: Award, achieved: true },
    { title: "Protein Goal Met", icon: Target, achieved: true },
    { title: "Balanced Week", icon: TrendingUp, achieved: false },
  ],
};

export const Statistics = () => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "excellent": return "text-green-600";
      case "good": return "text-primary";
      case "low": return "text-yellow-600";
      case "deficient": return "text-red-600";
      default: return "text-muted-foreground";
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Statistics</h1>
        <p className="text-muted-foreground">Your nutrition insights</p>
      </div>

      {/* Weekly Averages */}
      <Card className="p-6">
        <h2 className="font-semibold mb-4 flex items-center gap-2">
          <TrendingUp size={20} />
          Weekly Averages
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold">{mockStats.weeklyAverage.calories}</div>
            <div className="text-sm text-muted-foreground">Calories</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{mockStats.weeklyAverage.protein}g</div>
            <div className="text-sm text-muted-foreground">Protein</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{mockStats.weeklyAverage.carbs}g</div>
            <div className="text-sm text-muted-foreground">Carbs</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{mockStats.weeklyAverage.fat}g</div>
            <div className="text-sm text-muted-foreground">Fat</div>
          </div>
        </div>
      </Card>

      {/* Micronutrients */}
      <Card className="p-6">
        <h2 className="font-semibold mb-4">Micronutrient Status</h2>
        <div className="space-y-4">
          {mockStats.micronutrients.map((nutrient) => (
            <div key={nutrient.name} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">{nutrient.name}</span>
                <span className={`text-sm capitalize ${getStatusColor(nutrient.status)}`}>
                  {nutrient.percentage}%
                </span>
              </div>
              <Progress value={nutrient.percentage} className="h-2" />
            </div>
          ))}
        </div>
      </Card>

      {/* Achievements */}
      <Card className="p-6">
        <h2 className="font-semibold mb-4">Achievements</h2>
        <div className="space-y-3">
          {mockStats.achievements.map((achievement, index) => {
            const Icon = achievement.icon;
            return (
              <div 
                key={index}
                className={`flex items-center gap-3 p-3 rounded-lg border ${
                  achievement.achieved 
                    ? "bg-primary/5 border-primary/20" 
                    : "bg-muted/50 border-border"
                }`}
              >
                <Icon 
                  size={20} 
                  className={achievement.achieved ? "text-primary" : "text-muted-foreground"}
                />
                <span className={achievement.achieved ? "font-medium" : "text-muted-foreground"}>
                  {achievement.title}
                </span>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Recommendations */}
      <Card className="p-6">
        <h2 className="font-semibold mb-4">Recommendations</h2>
        <div className="space-y-3 text-sm">
          <div className="flex items-start gap-2">
            <TrendingDown className="text-yellow-600 mt-0.5" size={16} />
            <div>
              <div className="font-medium">Increase Iron Intake</div>
              <div className="text-muted-foreground">Try spinach, lentils, or lean red meat</div>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <TrendingDown className="text-red-600 mt-0.5" size={16} />
            <div>
              <div className="font-medium">B12 Deficiency</div>
              <div className="text-muted-foreground">Consider supplements or fortified foods</div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};