import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface MacroCardProps {
  name: string;
  current: number;
  target: number;
  unit: string;
  color?: string;
}

export const MacroCard = ({ name, current, target, unit, color = "primary" }: MacroCardProps) => {
  const percentage = Math.min((current / target) * 100, 100);

  return (
    <Card className="p-4 space-y-3">
      <div className="flex justify-between items-center">
        <span className="font-medium text-sm">{name}</span>
        <span className="text-sm text-muted-foreground">
          {current} / {target} {unit}
        </span>
      </div>
      <Progress value={percentage} className="h-2" />
    </Card>
  );
};