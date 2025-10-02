import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { 
  Download, 
  Save, 
  Calendar, 
  Target, 
  Clock, 
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  Play,
  Pause,
  RotateCcw,
  TrendingUp,
  Activity,
  Dumbbell,
  Heart,
  Zap
} from 'lucide-react';
import { apiRequest } from '../utils/supabase/client';
import { toast } from 'sonner@2.0.3';

interface TrainingPlanProps {
  userProfile: any;
  userRole: string;
}

interface TrainingPlanData {
  id?: string;
  name: string;
  sport: string;
  duration: string;
  goal: string;
  level: string;
  description: string;
  exercises: Exercise[];
  schedule: ScheduleItem[];
  nutritionGuidelines: string[];
  recoveryProtocol: string[];
  progressMetrics: string[];
  created_at?: string;
  updated_at?: string;
}

interface Exercise {
  name: string;
  sets: number;
  reps: string;
  weight?: string;
  duration?: string;
  rest: string;
  notes: string;
  category: string;
}

interface ScheduleItem {
  day: string;
  time: string;
  session: string;
  duration: string;
  intensity: string;
}

export function TrainingPlan({ userProfile, userRole }: TrainingPlanProps) {
  const [trainingPlans, setTrainingPlans] = useState<TrainingPlanData[]>([]);
  const [currentPlan, setCurrentPlan] = useState<TrainingPlanData | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [newPlan, setNewPlan] = useState<TrainingPlanData>({
    name: '',
    sport: userProfile?.sport || 'running',
    duration: '4',
    goal: '',
    level: userProfile?.experienceLevel || 'intermediate',
    description: '',
    exercises: [],
    schedule: [],
    nutritionGuidelines: [],
    recoveryProtocol: [],
    progressMetrics: []
  });

  useEffect(() => {
    fetchTrainingPlans();
    if (userProfile) {
      generateRecommendedPlan();
    }
  }, [userProfile]);

  const fetchTrainingPlans = async () => {
    try {
      setLoading(true);
      const response = await apiRequest('/training-plans');
      setTrainingPlans(response.plans || []);
    } catch (error) {
      console.error('Failed to fetch training plans:', error);
      toast.error('Failed to load training plans');
    } finally {
      setLoading(false);
    }
  };

  const generateRecommendedPlan = () => {
    if (!userProfile) return;

    const recommendedExercises = getRecommendedExercises(userProfile.sport, userProfile.experienceLevel);
    const recommendedSchedule = getRecommendedSchedule(userProfile.sport, userProfile.activityLevel);
    const nutritionGuidelines = getNutritionGuidelines(userProfile.sport, userProfile.dietPreference);
    const recoveryProtocol = getRecoveryProtocol(userProfile.sport, userProfile.recoveryConcerns);

    setNewPlan({
      ...newPlan,
      name: `Personalized ${userProfile.sport} Training Plan`,
      description: `AI-generated training plan based on your profile and goals`,
      exercises: recommendedExercises,
      schedule: recommendedSchedule,
      nutritionGuidelines,
      recoveryProtocol,
      progressMetrics: [
        'Weekly performance score improvement',
        'Technique consistency rating',
        'Endurance capacity increase',
        'Strength progression tracking',
        'Injury prevention metrics'
      ]
    });
  };

  const getRecommendedExercises = (sport: string, level: string): Exercise[] => {
    const exerciseDatabase = {
      running: [
        { name: 'Interval Running', sets: 5, reps: '400m', rest: '90s', notes: 'Maintain 85% effort', category: 'Cardio' },
        { name: 'Hill Repeats', sets: 6, reps: '1 min', rest: '2 min', notes: 'Focus on form', category: 'Strength' },
        { name: 'Easy Pace Run', sets: 1, reps: '30-45 min', rest: '0', notes: 'Conversational pace', category: 'Endurance' },
        { name: 'Squats', sets: 3, reps: '12-15', rest: '60s', notes: 'Bodyweight or weighted', category: 'Strength' },
        { name: 'Lunges', sets: 3, reps: '10 each leg', rest: '45s', notes: 'Focus on balance', category: 'Strength' }
      ],
      swimming: [
        { name: 'Freestyle Intervals', sets: 8, reps: '50m', rest: '15s', notes: '80% effort', category: 'Technique' },
        { name: 'Backstroke Drills', sets: 4, reps: '25m', rest: '30s', notes: 'Focus on rotation', category: 'Technique' },
        { name: 'Pull Set', sets: 6, reps: '100m', rest: '20s', notes: 'Use pull buoy', category: 'Strength' },
        { name: 'Kick Set', sets: 8, reps: '25m', rest: '15s', notes: 'Use kickboard', category: 'Endurance' },
        { name: 'Core Stability', sets: 3, reps: '1 min', rest: '30s', notes: 'Plank variations', category: 'Strength' }
      ],
      cycling: [
        { name: 'Interval Training', sets: 5, reps: '3 min', rest: '2 min', notes: 'Zone 4 effort', category: 'Cardio' },
        { name: 'Hill Climbs', sets: 4, reps: '5 min', rest: '3 min', notes: 'Steady effort', category: 'Strength' },
        { name: 'Endurance Ride', sets: 1, reps: '60-90 min', rest: '0', notes: 'Zone 2 effort', category: 'Endurance' },
        { name: 'Leg Press', sets: 3, reps: '12-15', rest: '60s', notes: 'Focus on power', category: 'Strength' },
        { name: 'Hamstring Curls', sets: 3, reps: '12-15', rest: '45s', notes: 'Controlled movement', category: 'Strength' }
      ],
      weightlifting: [
        { name: 'Deadlifts', sets: 4, reps: '5-8', rest: '2-3 min', notes: 'Focus on form', category: 'Strength' },
        { name: 'Squats', sets: 4, reps: '6-10', rest: '2-3 min', notes: 'Progressive overload', category: 'Strength' },
        { name: 'Bench Press', sets: 4, reps: '6-10', rest: '2-3 min', notes: 'Controlled tempo', category: 'Strength' },
        { name: 'Pull-ups', sets: 3, reps: '8-12', rest: '90s', notes: 'Full range of motion', category: 'Strength' },
        { name: 'Plank', sets: 3, reps: '60s', rest: '30s', notes: 'Core engagement', category: 'Stability' }
      ],
      yoga: [
        { name: 'Sun Salutation A', sets: 5, reps: '1 flow', rest: '30s', notes: 'Focus on breath', category: 'Flow' },
        { name: 'Warrior Sequences', sets: 3, reps: '5 breaths each', rest: '0', notes: 'Hold poses', category: 'Strength' },
        { name: 'Balance Poses', sets: 2, reps: '1 min each side', rest: '15s', notes: 'Tree, eagle, dancer', category: 'Balance' },
        { name: 'Hip Openers', sets: 3, reps: '2 min', rest: '30s', notes: 'Pigeon, lizard poses', category: 'Flexibility' },
        { name: 'Meditation', sets: 1, reps: '10-15 min', rest: '0', notes: 'Mindfulness practice', category: 'Mental' }
      ]
    };

    return exerciseDatabase[sport as keyof typeof exerciseDatabase] || exerciseDatabase.running;
  };

  const getRecommendedSchedule = (sport: string, activityLevel: string): ScheduleItem[] => {
    const baseSchedule = [
      { day: 'Monday', time: '7:00 AM', session: 'Strength Training', duration: '60 min', intensity: 'High' },
      { day: 'Tuesday', time: '6:30 AM', session: 'Technique Practice', duration: '45 min', intensity: 'Medium' },
      { day: 'Wednesday', time: '7:00 AM', session: 'Endurance Training', duration: '75 min', intensity: 'Medium' },
      { day: 'Thursday', time: '6:30 AM', session: 'Active Recovery', duration: '30 min', intensity: 'Low' },
      { day: 'Friday', time: '7:00 AM', session: 'High Intensity', duration: '45 min', intensity: 'High' },
      { day: 'Saturday', time: '8:00 AM', session: 'Long Session', duration: '90 min', intensity: 'Medium' },
      { day: 'Sunday', time: 'Rest', session: 'Complete Rest', duration: '0 min', intensity: 'Rest' }
    ];

    if (activityLevel === 'low') {
      return baseSchedule.filter((_, index) => index % 2 === 0);
    }
    if (activityLevel === 'very-high') {
      return [...baseSchedule, { day: 'Sunday', time: '10:00 AM', session: 'Light Activity', duration: '30 min', intensity: 'Low' }];
    }
    return baseSchedule;
  };

  const getNutritionGuidelines = (sport: string, dietPreference: string): string[] => {
    const baseGuidelines = [
      'Maintain proper hydration throughout the day (2-3L water)',
      'Eat a balanced meal 2-3 hours before training',
      'Consume protein within 30 minutes post-workout',
      'Include complex carbohydrates for sustained energy',
      'Focus on anti-inflammatory foods for recovery'
    ];

    const sportSpecific = {
      running: ['Emphasize carbohydrate loading before long runs', 'Include iron-rich foods for oxygen transport'],
      swimming: ['Increase caloric intake due to high energy expenditure', 'Focus on lean proteins for muscle recovery'],
      cycling: ['Maintain electrolyte balance during long rides', 'Include healthy fats for sustained energy'],
      weightlifting: ['Increase protein intake to 1.6-2.2g per kg body weight', 'Time creatine supplementation around workouts'],
      yoga: ['Focus on light, easily digestible meals', 'Include magnesium-rich foods for muscle relaxation']
    };

    const dietSpecific = {
      vegetarian: ['Ensure adequate B12 and iron intake', 'Combine plant proteins for complete amino profiles'],
      vegan: ['Supplement with B12, D3, and omega-3s', 'Focus on quinoa, legumes, and nuts for protein'],
      pescatarian: ['Include fatty fish 2-3 times per week', 'Leverage seafood for omega-3 fatty acids']
    };

    return [
      ...baseGuidelines,
      ...(sportSpecific[sport as keyof typeof sportSpecific] || []),
      ...(dietSpecific[dietPreference as keyof typeof dietSpecific] || [])
    ];
  };

  const getRecoveryProtocol = (sport: string, recoveryConcerns: string): string[] => {
    const baseRecovery = [
      'Prioritize 7-9 hours of quality sleep',
      'Include dynamic warm-up before training',
      'Perform static stretching post-workout',
      'Schedule regular massage or self-massage',
      'Take at least one complete rest day per week'
    ];

    if (recoveryConcerns && recoveryConcerns.length > 0) {
      baseRecovery.push('Address specific pain points with targeted exercises');
      baseRecovery.push('Consider consulting with a physical therapist');
    }

    return baseRecovery;
  };

  const savePlan = async () => {
    try {
      const planData = isEditing ? { ...currentPlan, ...newPlan } : newPlan;
      const response = await apiRequest('/training-plans', {
        method: isEditing ? 'PUT' : 'POST',
        body: JSON.stringify(planData),
      });

      if (isEditing) {
        setTrainingPlans(plans => 
          plans.map(plan => plan.id === currentPlan?.id ? response.plan : plan)
        );
        setCurrentPlan(response.plan);
        setIsEditing(false);
      } else {
        setTrainingPlans(plans => [...plans, response.plan]);
        setIsCreating(false);
      }

      toast.success(`Training plan ${isEditing ? 'updated' : 'created'} successfully!`);
    } catch (error) {
      console.error('Failed to save training plan:', error);
      toast.error('Failed to save training plan');
    }
  };

  const downloadPlan = async (plan: TrainingPlanData) => {
    try {
      const response = await apiRequest(`/training-plans/${plan.id}/download`);
      
      // Create download blob
      const blob = new Blob([response.pdfData], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${plan.name.replace(/\s+/g, '_')}_Training_Plan.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success('Training plan downloaded successfully!');
    } catch (error) {
      console.error('Failed to download plan:', error);
      toast.error('Failed to download training plan');
    }
  };

  const deletePlan = async (planId: string) => {
    try {
      await apiRequest(`/training-plans/${planId}`, { method: 'DELETE' });
      setTrainingPlans(plans => plans.filter(plan => plan.id !== planId));
      if (currentPlan?.id === planId) {
        setCurrentPlan(null);
      }
      toast.success('Training plan deleted successfully!');
    } catch (error) {
      console.error('Failed to delete plan:', error);
      toast.error('Failed to delete training plan');
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="h-32 bg-muted rounded"></div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl">Training Plans</h2>
          <p className="text-muted-foreground">
            Create, manage, and track your personalized training programs
          </p>
        </div>
        <Button onClick={() => setIsCreating(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create Plan
        </Button>
      </div>

      {isCreating || isEditing ? (
        <Card>
          <CardHeader>
            <CardTitle>{isEditing ? 'Edit Training Plan' : 'Create New Training Plan'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Plan Name</Label>
                <Input
                  id="name"
                  value={newPlan.name}
                  onChange={(e) => setNewPlan({...newPlan, name: e.target.value})}
                  placeholder="Enter plan name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Duration (weeks)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={newPlan.duration}
                  onChange={(e) => setNewPlan({...newPlan, duration: e.target.value})}
                  placeholder="4"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="goal">Training Goal</Label>
              <Textarea
                id="goal"
                value={newPlan.goal}
                onChange={(e) => setNewPlan({...newPlan, goal: e.target.value})}
                placeholder="Describe your training objectives"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newPlan.description}
                onChange={(e) => setNewPlan({...newPlan, description: e.target.value})}
                placeholder="Plan overview and key features"
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={savePlan}>
                <Save className="w-4 h-4 mr-2" />
                {isEditing ? 'Update Plan' : 'Save Plan'}
              </Button>
              <Button variant="outline" onClick={() => {
                setIsCreating(false);
                setIsEditing(false);
                setNewPlan({
                  name: '',
                  sport: userProfile?.sport || 'running',
                  duration: '4',
                  goal: '',
                  level: userProfile?.experienceLevel || 'intermediate',
                  description: '',
                  exercises: [],
                  schedule: [],
                  nutritionGuidelines: [],
                  recoveryProtocol: [],
                  progressMetrics: []
                });
              }}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {trainingPlans.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Activity className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg mb-2">No Training Plans Yet</h3>
                <p className="text-muted-foreground mb-4">
                  Create your first personalized training plan to get started
                </p>
                <Button onClick={() => setIsCreating(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Plan
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trainingPlans.map((plan, index) => (
                <Card key={plan.id || index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{plan.name}</CardTitle>
                        <p className="text-sm text-muted-foreground capitalize">
                          {plan.sport} • {plan.duration} weeks
                        </p>
                      </div>
                      <Badge variant="outline" className="capitalize">
                        {plan.level}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {plan.description}
                    </p>
                    
                    <div className="space-y-2">
                      <div className="flex items-center text-sm">
                        <Dumbbell className="w-4 h-4 mr-2 text-muted-foreground" />
                        {plan.exercises.length} exercises
                      </div>
                      <div className="flex items-center text-sm">
                        <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
                        {plan.schedule.length} sessions/week
                      </div>
                      <div className="flex items-center text-sm">
                        <Target className="w-4 h-4 mr-2 text-muted-foreground" />
                        {plan.progressMetrics.length} metrics tracked
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        onClick={() => setCurrentPlan(plan)}
                        className="flex-1"
                      >
                        <Play className="w-4 h-4 mr-2" />
                        View
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => downloadPlan(plan)}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => {
                          setCurrentPlan(plan);
                          setNewPlan(plan);
                          setIsEditing(true);
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {currentPlan && !isEditing && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{currentPlan.name}</CardTitle>
                    <p className="text-muted-foreground">
                      {currentPlan.description}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => downloadPlan(currentPlan)}>
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                    <Button variant="outline" onClick={() => setCurrentPlan(null)}>
                      Close
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="exercises">Exercises</TabsTrigger>
                    <TabsTrigger value="schedule">Schedule</TabsTrigger>
                    <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
                    <TabsTrigger value="progress">Progress</TabsTrigger>
                  </TabsList>

                  <TabsContent value="exercises" className="space-y-4 mt-6">
                    <div className="grid gap-4">
                      {currentPlan.exercises.map((exercise, index) => (
                        <div key={index} className="p-4 border rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium">{exercise.name}</h4>
                            <Badge variant="outline">{exercise.category}</Badge>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-muted-foreground">
                            <span>Sets: {exercise.sets}</span>
                            <span>Reps: {exercise.reps}</span>
                            <span>Rest: {exercise.rest}</span>
                            {exercise.weight && <span>Weight: {exercise.weight}</span>}
                          </div>
                          {exercise.notes && (
                            <p className="text-sm text-muted-foreground mt-2">{exercise.notes}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="schedule" className="space-y-4 mt-6">
                    <div className="grid gap-3">
                      {currentPlan.schedule.map((session, index) => (
                        <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <p className="font-medium">{session.day}</p>
                            <p className="text-sm text-muted-foreground">{session.session}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm">{session.time}</p>
                            <p className="text-sm text-muted-foreground">
                              {session.duration} • {session.intensity}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="nutrition" className="space-y-4 mt-6">
                    <div className="space-y-3">
                      {currentPlan.nutritionGuidelines.map((guideline, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                          <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                          <p className="text-sm">{guideline}</p>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-6">
                      <h4 className="font-medium mb-3">Recovery Protocol</h4>
                      <div className="space-y-3">
                        {currentPlan.recoveryProtocol.map((protocol, index) => (
                          <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <Heart className="w-4 h-4 text-blue-600 mt-0.5" />
                            <p className="text-sm text-blue-800">{protocol}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="progress" className="space-y-4 mt-6">
                    <div className="grid gap-3">
                      {currentPlan.progressMetrics.map((metric, index) => (
                        <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <TrendingUp className="w-4 h-4 text-green-600" />
                            <span className="text-sm">{metric}</span>
                          </div>
                          <Progress value={Math.random() * 100} className="w-24" />
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}