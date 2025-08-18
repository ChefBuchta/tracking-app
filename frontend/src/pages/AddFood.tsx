import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowLeft, Search, Loader2, Plus, Minus, ScanLine } from "lucide-react";
import { FoodCard } from "@/components/FoodCard";
import { useToast } from "@/hooks/use-toast";
import { apiService, type FoodItem } from "@/services/api";
import BarcodeScanner from "@/components/BarcodeScanner"; // You'll create this

export const AddFood = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<FoodItem[]>([]);
  const [recentFoods, setRecentFoods] = useState<FoodItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [selectedMealType, setSelectedMealType] = useState("snack");
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [quantityType, setQuantityType] = useState<'grams' | 'units'>('grams');
  const [grams, setGrams] = useState("");
  const [unitCount, setUnitCount] = useState(1);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
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

  const handleBarcodeDetected = async (code: string) => {
    try {
      const food = await apiService.getFoodByBarcode(code);
      if (food) {
        setSelectedFood(food);
        setIsScanning(false);
      } else {
        toast({
          title: "Not Found",
          description: "No product found for this barcode.",
          variant: "destructive",
        });
      }
    } catch (err) {
      toast({
        title: "Scan Error",
        description: "Failed to fetch product for barcode.",
        variant: "destructive",
      });
    }
  };

  const handleAddFood = async () => {
    if (!selectedFood) return;
    try {
      let quantity: number;
      if (quantityType === 'units' && selectedFood.serving_unit === 'item') {
        quantity = unitCount;
      } else {
        const gramValue = parseInt(grams) || 0;
        quantity = Math.max(1, gramValue) / (selectedFood.serving_size || 100);
      }
      const entry = await apiService.addFoodToDiary(selectedFood, selectedMealType, quantity);
      if (entry) {
        toast({
          title: "Food Added",
          description: `${selectedFood.name} has been added to your diary as ${selectedMealType}.`,
        });
        navigate("/");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add food to diary.",
        variant: "destructive",
      });
    }
  };

  const handleFoodSelect = (food: FoodItem) => {
    setSelectedFood(food);
    if (food.serving_unit === 'item' && food.name.toLowerCase().includes('banana')) {
      setQuantityType('units');
      setGrams("118");
      setUnitCount(1);
    } else if (food.serving_unit === 'item') {
      setQuantityType('units');
      setGrams(String(food.serving_size || 100));
      setUnitCount(1);
    } else {
      setQuantityType('grams');
      setGrams("100");
    }
  };

  const handleGramsChange = (value: string) => {
    if (value === "" || /^\d+$/.test(value)) {
      setGrams(value);
    }
  };

  const mealTypes = [
    { id: "breakfast", label: "Breakfast" },
    { id: "lunch", label: "Lunch" },
    { id: "dinner", label: "Dinner" },
    { id: "snack", label: "Snack" },
  ];

  return (
    <div className="max-w-md mx-auto p-4 space-y-6 bg-gradient-to-b from-background to-muted/20 min-h-screen">
      {/* Header */}
      <div className="flex items-center gap-4 sticky top-0 bg-background/95 backdrop-blur z-10 py-2">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
        </Button>
        <h1 className="text-2xl font-bold text-black text-center w-full">Add Food</h1>
      </div>

      {/* Search + Scan Section */}
      <Card className="p-4 border-2 border-border/50 shadow-lg space-y-4">
        {/* Search Box */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Input
              placeholder="Search foods..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="pl-10"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
          </div>
          <Button onClick={handleSearch} disabled={isSearching}>
            {isSearching ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Searching...
              </>
            ) : (
              "Search"
            )}
          </Button>
        </div>

        <div className="flex items-center justify-center">
          <span className="text-muted-foreground text-sm">OR</span>
        </div>

        {/* Barcode Scanner */}
        {!isScanning ? (
          <Button variant="outline" onClick={() => setIsScanning(true)}>
            <ScanLine className="mr-2 h-4 w-4" /> Scan Barcode
          </Button>
        ) : (
          <div>
            <BarcodeScanner onDetected={handleBarcodeDetected} />
            <Button variant="ghost" size="sm" onClick={() => setIsScanning(false)} className="mt-2">
              Stop Scanning
            </Button>
          </div>
        )}
      </Card>

       {/* Selected Food Details */}
      {selectedFood && (
        <Card className="p-6 border-2 border-primary/20 shadow-xl bg-gradient-to-br from-card to-card/80">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-primary">Selected: {selectedFood.name}</h2>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setSelectedFood(null)}
              className="text-muted-foreground hover:text-primary"
            >
              Change
            </Button>
          </div>
          
          {/* Meal Type Selection */}
          <div className="mb-6">
            <h3 className="font-medium mb-3 text-lg">Meal Type</h3>
            <div className="grid grid-cols-2 gap-3">
              {mealTypes.map((mealType) => (
                <Button
                  key={mealType.id}
                  variant={selectedMealType === mealType.id ? "default" : "outline"}
                  size="lg"
                  onClick={() => setSelectedMealType(mealType.id)}
                  className="rounded-xl transition-all duration-200 hover:scale-105"
                >
                  {mealType.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Quantity Selection */}
          <div className="mb-6">
            <h3 className="font-medium mb-3 text-lg">Quantity</h3>
            <RadioGroup 
              value={quantityType} 
              onValueChange={(value) => setQuantityType(value as 'grams' | 'units')}
              className="grid grid-cols-2 gap-3"
            >
              <div className="relative">
                <RadioGroupItem value="grams" id="grams" className="peer sr-only" />
                <Label 
                  htmlFor="grams" 
                  className="flex flex-col items-center justify-center rounded-xl border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer transition-all duration-200"
                >
                  <span className="text-lg font-semibold">Grams</span>
                  <span className="text-sm text-muted-foreground">Exact weight</span>
                </Label>
              </div>
              <div className="relative">
                <RadioGroupItem value="units" id="units" className="peer sr-only" />
                <Label 
                  htmlFor="units" 
                  className="flex flex-col items-center justify-center rounded-xl border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer transition-all duration-200"
                >
                  <span className="text-lg font-semibold">Units</span>
                  <span className="text-sm text-muted-foreground">
                    {selectedFood.serving_unit === 'item' ? 'Items' : 'Servings'}
                  </span>
                </Label>
              </div>
            </RadioGroup>

            {quantityType === 'grams' ? (
              <div className="mt-4">
                <Label className="text-sm font-medium mb-2">Enter exact weight</Label>
                <div className="flex items-center gap-3 mt-2">
                  <Input
                    type="number"
                    min="1"
                    value={grams}
                    onChange={(e) => handleGramsChange(e.target.value)}
                    placeholder="Enter grams"
                    className="text-lg text-center font-semibold h-12"
                  />
                  <span className="text-lg font-semibold text-muted-foreground">g</span>
                </div>
              </div>
            ) : (
              <div className="mt-4">
                <Label className="text-sm font-medium mb-2">Enter quantity</Label>
                <div className="flex items-center gap-4 mt-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => setUnitCount(Math.max(1, unitCount - 1))}
                    className="h-12 w-12 rounded-full"
                  >
                    <Minus size={20} />
                  </Button>
                  <Input
                    type="number"
                    min="1"
                    value={unitCount}
                    onChange={(e) => setUnitCount(Math.max(1, parseInt(e.target.value) || 1))}
                    className="text-center text-lg font-semibold h-12 w-20"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => setUnitCount(unitCount + 1)}
                    className="h-12 w-12 rounded-full"
                  >
                    <Plus size={20} />
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground mt-2 text-center">
                  {unitCount} {selectedFood.serving_unit} = {Math.round(unitCount * (selectedFood.serving_size || 100))}g
                </p>
              </div>
            )}
          </div>

          <Button 
            onClick={handleAddFood} 
            className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 h-12 text-lg font-semibold"
          >
            Add to Diary
          </Button>
        </Card>
      )}

      {/* Search Results */}
      {searchResults.length > 0 && !selectedFood && (
        <div className="space-y-4">
          <h2 className="font-semibold text-lg">Search Results</h2>
          <div className="space-y-3">
          {searchResults.map((food) => (
            <div 
              key={food.id} 
              className="p-4 rounded-xl border-2 border-border/50 hover:border-primary/50 transition-all duration-200 cursor-pointer text-left"
              onClick={() => handleFoodSelect(food)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleFoodSelect(food); }}
            >
              <div className="text-left">
                <FoodCard {...food} showActions={false} />
              </div>
            </div>
          ))}
          </div>
        </div>
      )}

      {/* Recent Foods */}
      {!selectedFood && (
        <div className="space-y-4">
          <h2 className="font-semibold text-lg">Recent Foods</h2>
          <div className="space-y-3">
          {recentFoods.slice(0, 3).map((food) => (
            <div 
              key={food.id} 
              className="p-4 rounded-xl border-2 border-border/50 hover:border-primary/50 transition-all duration-200 cursor-pointer text-left"
              onClick={() => handleFoodSelect(food)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleFoodSelect(food); }}
            >
              <div className="text-left">
                <FoodCard {...food} showActions={false} />
              </div>
            </div>
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
      )}
    </div>
  );
};