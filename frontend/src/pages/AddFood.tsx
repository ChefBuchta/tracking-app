import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Search, Loader2 } from "lucide-react";
import { FoodCard } from "@/components/FoodCard";
import { useToast } from "@/hooks/use-toast";
import { apiService, type FoodItem } from "@/services/api";

export const AddFood = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<FoodItem[]>([]);
  const [recentFoods, setRecentFoods] = useState<FoodItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedMealType, setSelectedMealType] = useState("snack");
  const [grams, setGrams] = useState(100); // Default grams to 100
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Load recent foods on component mount
    const loadRecentFoods = async () => {
      try {
        const foods = await apiService.getRecentFoods();
        setRecentFoods(foods);
      } catch (error) {
        console.error('Failed to load recent foods:', error);
      }
    };
    
    loadRecentFoods();
  }, []);

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    
    setIsSearching(true);
    try {
      const foods = await apiService.searchFood(searchTerm);
      setSearchResults(foods);
    } catch (error) {
      
      toast({
        title: "Search Error",
        description: "Failed to search for foods. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddFood = async (food: FoodItem, grams: number) => {
    try {
      const quantity = grams / 100; // Convert grams to quantity multiplier assuming per 100g nutrition
      const entry = await apiService.addFoodToDiary(food, selectedMealType, quantity);
      if (entry) {
        toast({
          title: "Food Added",
          description: `${food.name} has been added to your diary as ${selectedMealType}.`,
        });
        navigate("/"); // Navigate back to diary page
      } else {
        throw new Error("Failed to add food");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add food to diary.",
        variant: "destructive",
      });
    }
  };

  const mealTypes = [
    { id: "breakfast", label: "Breakfast" },
    { id: "lunch", label: "Lunch" },
    { id: "dinner", label: "Dinner" },
    { id: "snack", label: "Snack" },
  ];

  return (
    <div className="max-w-md mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
        </Button>
        <h1 className="text-xl font-bold">Add Food</h1>
      </div>

      {/* Search */}
      <Card className="p-4">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Input
              placeholder="Search foods..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="pl-10"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
          </div>
          <Button onClick={handleSearch} disabled={isSearching}>
            {isSearching ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Searching...
              </>
            ) : (
              "Search"
            )}
          </Button>
        </div>
      </Card>

      {/* Meal Type Selection */}
      <Card className="p-4">
        <h2 className="font-semibold mb-3">Meal Type</h2>
        <div className="grid grid-cols-2 gap-2">
          {mealTypes.map((mealType) => (
            <Button
              key={mealType.id}
              variant={selectedMealType === mealType.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedMealType(mealType.id)}
            >
              {mealType.label}
            </Button>
          ))}
        </div>
        {/* Grams Input */}
        <div className="flex gap-2 mt-4">
        <Input
          type="number"
          min={1}
          value={grams}
          onChange={e => setGrams(Number(e.target.value))}
          placeholder="Grams"
        />
        </div>
      </Card>

      {/* Grams Input */}
      <Card className="p-4">
        <h2 className="font-semibold mb-3">Grams</h2>
        <Input
          type="number"
          min={1}
          value={grams}
          onChange={e => setGrams(Number(e.target.value))}
          placeholder="Grams"
        />
      </Card>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="space-y-4">
          <h2 className="font-semibold">Search Results</h2>
          <div className="space-y-3">
            {searchResults.map((food) => (
              <FoodCard 
                key={food.id} 
                {...food}
                onAdd={() => handleAddFood(food, grams)}
                showActions={true}
              />
            ))}
          </div>
        </div>
      )}

      {/* Recent Foods */}
      <div className="space-y-4">
        <h2 className="font-semibold">Recent Foods</h2>
        <div className="space-y-3">
          {recentFoods.slice(0, 3).map((food) => (
            <FoodCard 
              key={food.id} 
              {...food}
              onAdd={() => handleAddFood(food, grams)}
              showActions={true}
            />
          ))}
          {recentFoods.length === 0 && (
            <Card className="p-4">
              <p className="text-sm text-muted-foreground text-center">
                No recent foods found. Try searching for foods above.
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};