import { Card } from "@/components/ui/card";
import { CircularProgress } from "@/components/CircularProgress";

interface MicronutrientCardProps {
  name: string;
  current: number;
  target: number;
  unit: string;
  color?: string;
}

export const MicronutrientCard = ({ 
  name, 
  current, 
  target, 
  unit,
  color = "hsl(var(--primary))"
}: MicronutrientCardProps) => {
  const percentage = Math.min((current / target) * 100, 100);
  
  return (
    <Card className="p-3">
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium truncate">{name}</h4>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-muted-foreground">
              {current.toFixed(1)} / {target} {unit}
            </span>
          </div>
        </div>
        <div className="ml-3">
          <CircularProgress 
            value={current} 
            max={target}
            size="sm"
          />
        </div>
      </div>
    </Card>
  );
};