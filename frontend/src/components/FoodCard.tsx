import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Minus, Info, Trash2 } from "lucide-react";

interface FoodCardProps {
  id?: string | number;
  name: string;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  quantity?: number;
  mealType?: string;
  serving_size?: number;          // number of units (e.g. 1)
  serving_unit?: string;          // e.g. "cup", "item"
  serving_weight_grams?: number;  // actual grams equivalent
  onAdd?: () => void;
  onRemove?: () => void;
  showActions?: boolean;
  isDiaryEntry?: boolean;
}

export const FoodCard = ({ 
  id,
  name, 
  calories, 
  protein, 
  fat, 
  carbs, 
  quantity = 1,
  mealType,
  serving_size,
  serving_unit,
  serving_weight_grams,
  onAdd, 
  onRemove,
  showActions = true,
  isDiaryEntry = false
}: FoodCardProps) => {
  const getMealTypeColor = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'breakfast': return 'bg-orange-100 text-orange-800';
      case 'lunch': return 'bg-blue-100 text-blue-800';
      case 'dinner': return 'bg-purple-100 text-purple-800';
      case 'snack': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="p-4">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <div className="flex flex-col items-center gap-1 mb-1">
            <h3 className="font-medium text-sm text-center">{name}</h3>
            {mealType && (
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getMealTypeColor(mealType)}`}>
                {mealType}
              </span>
            )}
          </div>
          <div className="flex flex-col items-center gap-1 text-xs text-muted-foreground">
            <span>{calories} kcal</span>
            {quantity !== 1 && (
              <span>• {quantity}x</span>
            )}
            {/* ✅ Serving info */}
            {serving_size && serving_unit && serving_weight_grams && (
              <span>
                {serving_size} {serving_unit} ≈ {Math.round(serving_weight_grams)} g
              </span>
            )}
          </div>
        </div>
        {showActions && (
          <div className="flex gap-1">
            {isDiaryEntry && onRemove && (
              <Button variant="ghost" size="sm" onClick={onRemove} className="text-red-600 hover:text-red-700">
                <Trash2 size={16} />
              </Button>
            )}
            {!isDiaryEntry && onRemove && (
              <Button variant="ghost" size="sm" onClick={onRemove}>
                <Minus size={16} />
              </Button>
            )}
            {onAdd && (
              <Button variant="ghost" size="sm" onClick={onAdd}>
                <Plus size={16} />
              </Button>
            )}
            <Button variant="ghost" size="sm">
              <Info size={16} />
            </Button>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-3 gap-4 text-xs text-center">
        <div>
          <div className="text-muted-foreground">Protein</div>
          <div className="font-medium">{protein.toFixed(1)}g</div>
        </div>
        <div>
          <div className="text-muted-foreground">Fat</div>
          <div className="font-medium">{fat.toFixed(1)}g</div>
        </div>
        <div>
          <div className="text-muted-foreground">Carbs</div>
          <div className="font-medium">{carbs.toFixed(1)}g</div>
        </div>
      </div>
    </Card>
  );
};
