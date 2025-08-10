import { useLocation, Link } from "react-router-dom";
import { BookOpen, History, Target, BarChart3, User } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { path: "/", icon: BookOpen, label: "Diary" },
  { path: "/history", icon: History, label: "History" },
  { path: "/goals", icon: Target, label: "Goals" },
  { path: "/statistics", icon: BarChart3, label: "Stats" },
  { path: "/profile", icon: User, label: "Profile" },
];

export const BottomNavigation = () => {
  const location = useLocation();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border">
      <div className="flex justify-around items-center py-2 px-4 max-w-md mx-auto">
        {navItems.map(({ path, icon: Icon, label }) => {
          const isActive = location.pathname === path;
          return (
            <Link
              key={path}
              to={path}
              className={cn(
                "flex flex-col items-center py-2 px-3 rounded-lg transition-colors",
                isActive
                  ? "text-primary bg-accent"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon size={20} />
              <span className="text-xs mt-1">{label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};