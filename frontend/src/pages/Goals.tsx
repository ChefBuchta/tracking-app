import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { apiService, UserStats, DailySummary } from "@/services/api";
import { 
  Target, 
  TrendingUp, 
  TrendingDown, 
  CheckCircle, 
  AlertCircle,
  Edit3
} from "lucide-react";

interface MicronutrientGoal {
  name: string;
  key: string;
  current: number;
  target: number;
  unit: string;
  category: 'vitamin' | 'mineral';
  description: string;
}

export const Goals = () => {
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [dailySummary, setDailySummary] = useState<DailySummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const [stats, summary] = await Promise.all([
        apiService.getUserStats(),
        apiService.getTodaysSummary()
      ]);
      setUserStats(stats);
      setDailySummary(summary);
    } catch (error) {
      console.error('Error loading goals data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const getMicronutrientGoals = (): MicronutrientGoal[] => {
    if (!userStats || !dailySummary) return [];

    return [
      // Vitamins
      {
        name: "Vitamin A",
        key: "vitamin_a",
        current: dailySummary.vitamin_a,
        target: userStats.vitamin_a_target,
        unit: "μg",
        category: "vitamin",
        description: "Important for vision, immune system, and cell growth"
      },
      {
        name: "Vitamin C",
        key: "vitamin_c",
        current: dailySummary.vitamin_c,
        target: userStats.vitamin_c_target,
        unit: "mg",
        category: "vitamin",
        description: "Antioxidant that supports immune system and collagen production"
      },
      {
        name: "Vitamin D",
        key: "vitamin_d",
        current: dailySummary.vitamin_d,
        target: userStats.vitamin_d_target,
        unit: "μg",
        category: "vitamin",
        description: "Essential for bone health and immune function"
      },
      {
        name: "Vitamin E",
        key: "vitamin_e",
        current: dailySummary.vitamin_e,
        target: userStats.vitamin_e_target,
        unit: "mg",
        category: "vitamin",
        description: "Antioxidant that protects cells from damage"
      },
      {
        name: "Vitamin K",
        key: "vitamin_k",
        current: dailySummary.vitamin_k,
        target: userStats.vitamin_k_target,
        unit: "μg",
        category: "vitamin",
        description: "Important for blood clotting and bone health"
      },
      {
        name: "Vitamin B1 (Thiamine)",
        key: "vitamin_b1",
        current: dailySummary.vitamin_b1,
        target: userStats.vitamin_b1_target,
        unit: "mg",
        category: "vitamin",
        description: "Helps convert food into energy"
      },
      {
        name: "Vitamin B2 (Riboflavin)",
        key: "vitamin_b2",
        current: dailySummary.vitamin_b2,
        target: userStats.vitamin_b2_target,
        unit: "mg",
        category: "vitamin",
        description: "Important for energy production and cell function"
      },
      {
        name: "Vitamin B3 (Niacin)",
        key: "vitamin_b3",
        current: dailySummary.vitamin_b3,
        target: userStats.vitamin_b3_target,
        unit: "mg",
        category: "vitamin",
        description: "Helps with energy metabolism and skin health"
      },
      {
        name: "Vitamin B6",
        key: "vitamin_b6",
        current: dailySummary.vitamin_b6,
        target: userStats.vitamin_b6_target,
        unit: "mg",
        category: "vitamin",
        description: "Important for brain development and immune function"
      },
      {
        name: "Vitamin B12",
        key: "vitamin_b12",
        current: dailySummary.vitamin_b12,
        target: userStats.vitamin_b12_target,
        unit: "μg",
        category: "vitamin",
        description: "Essential for nerve function and red blood cell formation"
      },
      {
        name: "Folate",
        key: "folate",
        current: dailySummary.folate,
        target: userStats.folate_target,
        unit: "μg",
        category: "vitamin",
        description: "Important for cell division and preventing birth defects"
      },
      // Minerals
      {
        name: "Calcium",
        key: "calcium",
        current: dailySummary.calcium,
        target: userStats.calcium_target,
        unit: "mg",
        category: "mineral",
        description: "Essential for strong bones and teeth"
      },
      {
        name: "Iron",
        key: "iron",
        current: dailySummary.iron,
        target: userStats.iron_target,
        unit: "mg",
        category: "mineral",
        description: "Important for oxygen transport in blood"
      },
      {
        name: "Magnesium",
        key: "magnesium",
        current: dailySummary.magnesium,
        target: userStats.magnesium_target,
        unit: "mg",
        category: "mineral",
        description: "Involved in hundreds of biochemical reactions"
      },
      {
        name: "Phosphorus",
        key: "phosphorus",
        current: dailySummary.phosphorus,
        target: userStats.phosphorus_target,
        unit: "mg",
        category: "mineral",
        description: "Important for bone health and energy production"
      },
      {
        name: "Potassium",
        key: "potassium",
        current: dailySummary.potassium,
        target: userStats.potassium_target,
        unit: "mg",
        category: "mineral",
        description: "Essential for heart function and muscle contractions"
      },
      {
        name: "Zinc",
        key: "zinc",
        current: dailySummary.zinc,
        target: userStats.zinc_target,
        unit: "mg",
        category: "mineral",
        description: "Important for immune function and wound healing"
      }
    ];
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 100) return "bg-green-500";
    if (percentage >= 80) return "bg-blue-500";
    if (percentage >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getProgressIcon = (percentage: number) => {
    if (percentage >= 100) return <CheckCircle className="w-4 h-4 text-green-600" />;
    if (percentage >= 80) return <TrendingUp className="w-4 h-4 text-blue-600" />;
    if (percentage < 50) return <AlertCircle className="w-4 h-4 text-red-600" />;
    return <TrendingDown className="w-4 h-4 text-yellow-600" />;
  };

  const getStatusText = (percentage: number) => {
    if (percentage >= 100) return "Excellent";
    if (percentage >= 80) return "Good";
    if (percentage >= 60) return "Fair";
    if (percentage >= 40) return "Poor";
    return "Very Low";
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Nutrition Goals</h1>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  const micronutrients = getMicronutrientGoals();
  const vitamins = micronutrients.filter(n => n.category === 'vitamin');
  const minerals = micronutrients.filter(n => n.category === 'mineral');

  const overallProgress = micronutrients.length > 0 
    ? Math.round(micronutrients.reduce((sum, n) => sum + Math.min(n.current / n.target * 100, 100), 0) / micronutrients.length)
    : 0;

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold">Nutrition Goals</h1>
        <p className="text-muted-foreground">Track your micronutrient progress</p>
      </div>

      {/* Overall Progress */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold">Overall Micronutrient Progress</h2>
            <p className="text-sm text-muted-foreground">
              {overallProgress}% of daily targets met
            </p>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setEditing(!editing)}
          >
            <Edit3 className="w-4 h-4 mr-2" />
            {editing ? 'Cancel' : 'Edit Targets'}
          </Button>
        </div>
        <Progress value={overallProgress} className="h-3" />
      </Card>

      {/* Vitamins Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Target className="w-5 h-5" />
          Vitamins
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          {vitamins.map((vitamin) => {
            const percentage = Math.round((vitamin.current / vitamin.target) * 100);
            return (
              <Card key={vitamin.key} className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-medium">{vitamin.name}</h3>
                    <p className="text-sm text-muted-foreground">{vitamin.description}</p>
                  </div>
                  {getProgressIcon(percentage)}
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>
                      {vitamin.current} / {vitamin.target} {vitamin.unit}
                    </span>
                    <Badge variant={percentage >= 100 ? "default" : "secondary"}>
                      {getStatusText(percentage)}
                    </Badge>
                  </div>
                  <Progress 
                    value={Math.min(percentage, 100)} 
                    className="h-2"
                    style={{
                      '--progress-color': percentage >= 100 ? '#22c55e' : 
                                        percentage >= 80 ? '#3b82f6' : 
                                        percentage >= 60 ? '#eab308' : '#ef4444'
                    } as React.CSSProperties}
                  />
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Minerals Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Target className="w-5 h-5" />
          Minerals
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          {minerals.map((mineral) => {
            const percentage = Math.round((mineral.current / mineral.target) * 100);
            return (
              <Card key={mineral.key} className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-medium">{mineral.name}</h3>
                    <p className="text-sm text-muted-foreground">{mineral.description}</p>
                  </div>
                  {getProgressIcon(percentage)}
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>
                      {mineral.current} / {mineral.target} {mineral.unit}
                    </span>
                    <Badge variant={percentage >= 100 ? "default" : "secondary"}>
                      {getStatusText(percentage)}
                    </Badge>
                  </div>
                  <Progress 
                    value={Math.min(percentage, 100)} 
                    className="h-2"
                    style={{
                      '--progress-color': percentage >= 100 ? '#22c55e' : 
                                        percentage >= 80 ? '#3b82f6' : 
                                        percentage >= 60 ? '#eab308' : '#ef4444'
                    } as React.CSSProperties}
                  />
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Summary Stats */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">Today's Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-green-600">
              {micronutrients.filter(n => (n.current / n.target) >= 1).length}
            </div>
            <div className="text-sm text-muted-foreground">Targets Met</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-600">
              {micronutrients.filter(n => (n.current / n.target) >= 0.8 && (n.current / n.target) < 1).length}
            </div>
            <div className="text-sm text-muted-foreground">Close to Target</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-yellow-600">
              {micronutrients.filter(n => (n.current / n.target) >= 0.6 && (n.current / n.target) < 0.8).length}
            </div>
            <div className="text-sm text-muted-foreground">Needs Attention</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-red-600">
              {micronutrients.filter(n => (n.current / n.target) < 0.6).length}
            </div>
            <div className="text-sm text-muted-foreground">Low Intake</div>
          </div>
        </div>
      </Card>
    </div>
  );
};