import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Apple, 
  Pill, 
  Calendar, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  TrendingUp,
  Utensils,
  Droplets,
  Target,
  Plus,
  Star
} from 'lucide-react';
import { apiRequest } from '../utils/supabase/client';
import { toast } from 'sonner@2.0.3';

interface NutritionSupplementsProps {
  userProfile: any;
  userRole: string;
}

export function NutritionSupplements({ userProfile, userRole }: NutritionSupplementsProps) {
  const [activeTab, setActiveTab] = useState('nutrition');
  const [nutritionData, setNutritionData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [selectedSport, setSelectedSport] = useState('running');

  useEffect(() => {
    if (selectedSport) {
      fetchNutritionSuggestions(selectedSport);
    }
  }, [selectedSport]);

  const fetchNutritionSuggestions = async (sport: string) => {
    try {
      setLoading(true);
      const response = await apiRequest(`/nutrition/${sport}`);
      setNutritionData(response.suggestions);
    } catch (error) {
      console.error('Failed to fetch nutrition suggestions:', error);
      toast.error('Failed to load nutrition suggestions');
    } finally {
      setLoading(false);
    }
  };

  // Filter meals based on dietary preferences
  const getFilteredMeals = () => {
    // Safely get dietary preference with fallback
    const dietPreference = userProfile?.dietPreference || 'non-vegetarian';
    const baseMeals = [
      {
        id: 1,
        name: 'Breakfast',
        time: '7:00 AM',
        calories: 650,
        completed: true,
        foods: ['Oatmeal with berries', 'Greek yogurt', 'Almonds', 'Protein shake']
      },
      {
        id: 2,
        name: 'Mid-Morning Snack',
        time: '10:00 AM',
        calories: 200,
        completed: true,
        foods: ['Banana', 'Peanut butter']
      },
      {
        id: 3,
        name: 'Lunch',
        time: '1:00 PM',
        calories: 750,
        completed: true,
        foods: dietPreference === 'vegetarian' 
          ? ['Plant-based protein bowl', 'Quinoa', 'Mixed vegetables', 'Avocado']
          : ['Grilled chicken breast', 'Quinoa', 'Mixed vegetables', 'Avocado']
      },
      {
        id: 4,
        name: 'Pre-Workout',
        time: '4:00 PM',
        calories: 150,
        completed: false,
        foods: ['Energy bar', 'Coffee']
      },
      {
        id: 5,
        name: 'Post-Workout',
        time: '6:30 PM',
        calories: 300,
        completed: false,
        foods: dietPreference === 'vegetarian'
          ? ['Plant protein shake', 'Almond milk']
          : ['Protein shake', 'Chocolate milk']
      },
      {
        id: 6,
        name: 'Dinner',
        time: '8:00 PM',
        calories: 800,
        completed: false,
        foods: dietPreference === 'vegetarian'
          ? ['Tofu stir-fry', 'Sweet potato', 'Broccoli', 'Brown rice']
          : ['Salmon fillet', 'Sweet potato', 'Broccoli', 'Brown rice']
      }
    ];

    // Additional filtering for vegan diet
    if (dietPreference === 'vegan') {
      return baseMeals.map(meal => {
        let veganFoods = meal.foods.map(food => {
          // Replace dairy and non-vegan items
          if (food.includes('Greek yogurt')) return 'Coconut yogurt';
          if (food.includes('Protein shake')) return 'Plant protein shake';
          if (food.includes('Chocolate milk')) return 'Oat milk';
          if (food.includes('Almond milk')) return 'Oat milk';
          return food;
        });
        return { ...meal, foods: veganFoods };
      });
    }

    return baseMeals;
  };

  const nutritionPlan = {
    dailyCalories: 2800,
    currentCalories: 2100,
    macros: {
      protein: { target: 140, current: 105, unit: 'g' },
      carbs: { target: 350, current: 280, unit: 'g' },
      fats: { target: 93, current: 75, unit: 'g' }
    },
    meals: getFilteredMeals()
  };

  // Filter supplements based on dietary preferences
  const getFilteredSupplements = () => {
    // Safely get dietary preference with fallback
    const dietPreference = userProfile?.dietPreference || 'non-vegetarian';
    const baseSupplements = [
      {
        id: 1,
        name: dietPreference === 'vegetarian' || dietPreference === 'vegan' 
          ? 'Plant Protein Isolate' 
          : 'Whey Protein Isolate',
        dosage: '25g',
        timing: 'Post-workout',
        taken: true,
        category: 'Performance',
        benefits: ['Muscle recovery', 'Protein synthesis'],
        aiRecommended: true,
        confidence: 95
      },
      {
        id: 2,
        name: 'Creatine Monohydrate',
        dosage: '5g',
        timing: 'Daily',
        taken: true,
        category: 'Performance',
        benefits: ['Power output', 'Muscle strength'],
        aiRecommended: true,
        confidence: 92
      },
      {
        id: 3,
        name: dietPreference === 'vegetarian' || dietPreference === 'vegan'
          ? 'Algae-based Omega-3'
          : 'Omega-3 Fish Oil',
        dosage: '1000mg',
        timing: 'With meals',
        taken: false,
        category: 'Health',
        benefits: ['Anti-inflammatory', 'Joint health'],
        aiRecommended: true,
        confidence: 88
      },
      {
        id: 4,
        name: 'Vitamin D3',
        dosage: '2000 IU',
        timing: 'Morning',
        taken: false,
        category: 'Health',
        benefits: ['Bone health', 'Immune support'],
        aiRecommended: true,
        confidence: 85
      },
      {
        id: 5,
        name: 'Magnesium',
        dosage: '400mg',
        timing: 'Evening',
        taken: false,
        category: 'Recovery',
        benefits: ['Muscle relaxation', 'Sleep quality'],
        aiRecommended: false,
        confidence: 72
      }
    ];

    // Add B12 supplement for vegetarian/vegan diets
    if (dietPreference === 'vegetarian' || dietPreference === 'vegan') {
      baseSupplements.push({
        id: 6,
        name: 'Vitamin B12',
        dosage: '250mcg',
        timing: 'Morning',
        taken: false,
        category: 'Health',
        benefits: ['Energy metabolism', 'Nervous system support'],
        aiRecommended: true,
        confidence: 90
      });
    }

    return baseSupplements;
  };

  const supplements = getFilteredSupplements();

  const hydrationTarget = 3500; // ml
  const currentHydration = 2100; // ml

  const weeklyNutritionGoals = [
    { goal: 'Meet daily protein targets', progress: 85, target: 7, completed: 6 },
    { goal: 'Stay within calorie range', progress: 71, target: 7, completed: 5 },
    { goal: 'Take all supplements', progress: 60, target: 7, completed: 4 },
    { goal: 'Proper hydration', progress: 80, target: 7, completed: 5 }
  ];

  const aiNutritionInsights = [
    {
      type: 'recommendation',
      icon: TrendingUp,
      title: 'Optimize Pre-Workout Nutrition',
      description: 'Based on your training schedule, consider adding complex carbs 2 hours before workouts for sustained energy.',
      confidence: 94
    },
    {
      type: 'warning',
      icon: AlertCircle,
      title: 'Protein Timing',
      description: 'You\'re missing optimal protein windows. Try to consume protein within 30 minutes post-workout.',
      confidence: 89
    },
    {
      type: 'success',
      icon: CheckCircle,
      title: 'Excellent Hydration Pattern',
      description: 'Your hydration timing aligns well with your training intensity. Keep it up!',
      confidence: 92
    }
  ];

  const getProgressColor = (percentage: number) => {
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl">Nutrition & Supplements</h2>
        <Badge variant="secondary">
          {userProfile?.dietPreference || 'Omnivore'} Diet
        </Badge>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="nutrition" className="flex items-center gap-2">
            <Apple className="w-4 h-4" />
            Nutrition
          </TabsTrigger>
          <TabsTrigger value="supplements" className="flex items-center gap-2">
            <Pill className="w-4 h-4" />
            Supplements
          </TabsTrigger>
          <TabsTrigger value="hydration" className="flex items-center gap-2">
            <Droplets className="w-4 h-4" />
            Hydration
          </TabsTrigger>
          <TabsTrigger value="insights" className="flex items-center gap-2">
            <Target className="w-4 h-4" />
            AI Insights
          </TabsTrigger>
        </TabsList>

        <TabsContent value="nutrition" className="space-y-6">
          {/* Daily Nutrition Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm">Calories</CardTitle>
                <Utensils className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl">{nutritionPlan.currentCalories}</div>
                <p className="text-xs text-muted-foreground">
                  / {nutritionPlan.dailyCalories} kcal
                </p>
                <Progress 
                  value={(nutritionPlan.currentCalories / nutritionPlan.dailyCalories) * 100} 
                  className="mt-2" 
                />
              </CardContent>
            </Card>

            {Object.entries(nutritionPlan.macros).map(([macro, data]) => (
              <Card key={macro}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm capitalize">{macro}</CardTitle>
                  <Target className="w-4 h-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl">{data.current}{data.unit}</div>
                  <p className="text-xs text-muted-foreground">
                    / {data.target}{data.unit}
                  </p>
                  <Progress 
                    value={(data.current / data.target) * 100} 
                    className="mt-2" 
                  />
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Daily Meal Plan */}
          <Card>
            <CardHeader>
              <CardTitle>Today's Meal Plan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {nutritionPlan.meals.map((meal) => (
                  <div
                    key={meal.id}
                    className={`p-4 border rounded-lg transition-colors ${
                      meal.completed ? 'bg-green-50 border-green-200' : 'bg-background'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-full ${meal.completed ? 'bg-green-600' : 'bg-gray-300'}`}></div>
                        <div>
                          <h4 className="text-sm">{meal.name}</h4>
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {meal.time}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm">{meal.calories} kcal</div>
                        {!meal.completed && (
                          <Button variant="outline" size="sm" className="mt-1">
                            Log Meal
                          </Button>
                        )}
                      </div>
                    </div>
                    
                    <div className="ml-7">
                      <div className="flex flex-wrap gap-1">
                        {meal.foods.map((food, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {food}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Weekly Goals */}
          <Card>
            <CardHeader>
              <CardTitle>Weekly Nutrition Goals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {weeklyNutritionGoals.map((goal, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{goal.goal}</span>
                      <span className={getProgressColor(goal.progress)}>
                        {goal.completed}/{goal.target} days
                      </span>
                    </div>
                    <Progress value={goal.progress} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="supplements" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {supplements.map((supplement) => (
              <Card key={supplement.id} className={supplement.taken ? 'bg-green-50' : ''}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{supplement.name}</CardTitle>
                    <div className="flex items-center gap-2">
                      {supplement.aiRecommended && (
                        <Badge variant="secondary" className="text-xs">
                          <Star className="w-3 h-3 mr-1" />
                          AI Recommended
                        </Badge>
                      )}
                      <Badge 
                        variant={supplement.taken ? 'default' : 'outline'}
                        className="text-xs"
                      >
                        {supplement.taken ? 'Taken' : 'Pending'}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Dosage</p>
                        <p>{supplement.dosage}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Timing</p>
                        <p>{supplement.timing}</p>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Benefits</p>
                      <div className="flex flex-wrap gap-1">
                        {supplement.benefits.map((benefit, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {benefit}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    {supplement.aiRecommended && (
                      <div className="flex items-center gap-2 text-xs text-blue-600">
                        <Target className="w-3 h-3" />
                        <span>AI Confidence: {supplement.confidence}%</span>
                      </div>
                    )}
                    
                    {!supplement.taken && (
                      <Button size="sm" className="w-full">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Mark as Taken
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Supplement Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { 
                    time: '7:00 AM', 
                    supplements: (userProfile?.dietPreference === 'vegetarian' || userProfile?.dietPreference === 'vegan')
                      ? ['Vitamin D3', 'Algae Omega-3', 'Vitamin B12']
                      : ['Vitamin D3', 'Omega-3'], 
                    taken: true 
                  },
                  { time: '12:00 PM', supplements: ['Creatine'], taken: true },
                  { 
                    time: '6:00 PM', 
                    supplements: (userProfile?.dietPreference === 'vegetarian' || userProfile?.dietPreference === 'vegan')
                      ? ['Plant Protein']
                      : ['Whey Protein'], 
                    taken: false 
                  },
                  { time: '10:00 PM', supplements: ['Magnesium'], taken: false }
                ].map((schedule, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${schedule.taken ? 'bg-green-600' : 'bg-gray-300'}`}></div>
                      <div>
                        <p className="text-sm">{schedule.time}</p>
                        <p className="text-xs text-muted-foreground">
                          {schedule.supplements.join(', ')}
                        </p>
                      </div>
                    </div>
                    {!schedule.taken && (
                      <Button variant="outline" size="sm">
                        Take Now
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hydration" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Daily Hydration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="text-center">
                  <div className="text-4xl mb-2">{currentHydration}ml</div>
                  <p className="text-muted-foreground">of {hydrationTarget}ml target</p>
                  <Progress value={(currentHydration / hydrationTarget) * 100} className="mt-4" />
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-3 border rounded-lg">
                    <div className="text-2xl text-blue-600">8</div>
                    <p className="text-xs text-muted-foreground">Glasses</p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <div className="text-2xl text-green-600">60%</div>
                    <p className="text-xs text-muted-foreground">Complete</p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <div className="text-2xl text-orange-600">1400ml</div>
                    <p className="text-xs text-muted-foreground">Remaining</p>
                  </div>
                </div>
                
                <div className="flex justify-center gap-2">
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add 250ml
                  </Button>
                  <Button variant="outline">
                    <Plus className="w-4 h-4 mr-2" />
                    Add 500ml
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Hydration Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { time: '6:00 AM', amount: '500ml', type: 'Wake up', completed: true },
                  { time: '8:00 AM', amount: '250ml', type: 'Breakfast', completed: true },
                  { time: '10:00 AM', amount: '250ml', type: 'Mid-morning', completed: true },
                  { time: '12:00 PM', amount: '300ml', type: 'Lunch', completed: true },
                  { time: '3:00 PM', amount: '250ml', type: 'Afternoon', completed: true },
                  { time: '5:00 PM', amount: '500ml', type: 'Pre-workout', completed: true },
                  { time: '7:00 PM', amount: '400ml', type: 'Post-workout', completed: false },
                  { time: '9:00 PM', amount: '250ml', type: 'Evening', completed: false }
                ].map((item, index) => (
                  <div key={index} className={`flex items-center justify-between p-3 border rounded-lg ${item.completed ? 'bg-blue-50' : ''}`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${item.completed ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
                      <div>
                        <p className="text-sm">{item.time} - {item.type}</p>
                        <p className="text-xs text-muted-foreground">{item.amount}</p>
                      </div>
                    </div>
                    {!item.completed && (
                      <Button variant="outline" size="sm">
                        <CheckCircle className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <div className="space-y-4">
            {aiNutritionInsights.map((insight, index) => {
              const IconComponent = insight.icon;
              return (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className={`p-2 rounded-full ${
                        insight.type === 'success' ? 'bg-green-100 text-green-600' :
                        insight.type === 'warning' ? 'bg-yellow-100 text-yellow-600' :
                        'bg-blue-100 text-blue-600'
                      }`}>
                        <IconComponent className="w-5 h-5" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-lg">{insight.title}</h3>
                          <Badge variant="outline" className="text-xs">
                            {insight.confidence}% confidence
                          </Badge>
                        </div>
                        <p className="text-muted-foreground">{insight.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Personalized Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="text-sm mb-2">Based on your {userProfile?.sport || 'sport'} performance:</h4>
                  <ul className="text-sm space-y-1 text-green-800">
                    <li>• Increase complex carbs 2 hours before training</li>
                    <li>• Add branch-chain amino acids for recovery</li>
                    <li>• Consider beetroot juice for endurance boost</li>
                  </ul>
                </div>
                
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="text-sm mb-2">BMI-based adjustments (BMI: {userProfile?.bmi || 'N/A'}):</h4>
                  <ul className="text-sm space-y-1 text-blue-800">
                    <li>• Optimize protein intake for muscle maintenance</li>
                    <li>• Balance caloric intake with training intensity</li>
                    <li>• Consider meal timing around workouts</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}