import { cn } from "@/lib/utils";

interface CircularProgressProps {
  value: number;
  max: number;
  size?: "sm" | "md" | "lg";
  children?: React.ReactNode;
  className?: string;
}

export const CircularProgress = ({ 
  value, 
  max, 
  size = "md", 
  children, 
  className 
}: CircularProgressProps) => {
  const percentage = Math.min((value / max) * 100, 100);
  const strokeDasharray = `${percentage} 100`;
  
  const sizeClasses = {
    sm: "w-16 h-16",
    md: "w-24 h-24", 
    lg: "w-32 h-32"
  };

  return (
    <div className={cn("relative", sizeClasses[size], className)}>
      <svg
        className="w-full h-full transform -rotate-90"
        viewBox="0 0 36 36"
      >
        <path
          d="M18 2.0845
            a 15.9155 15.9155 0 0 1 0 31.831
            a 15.9155 15.9155 0 0 1 0 -31.831"
          fill="none"
          stroke="hsl(var(--progress-bg))"
          strokeWidth="2"
        />
        <path
          d="M18 2.0845
            a 15.9155 15.9155 0 0 1 0 31.831
            a 15.9155 15.9155 0 0 1 0 -31.831"
          fill="none"
          stroke="hsl(var(--progress-fill))"
          strokeWidth="2"
          strokeDasharray={strokeDasharray}
          strokeLinecap="round"
          className="transition-all duration-300 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        {children}
      </div>
    </div>
  );
};