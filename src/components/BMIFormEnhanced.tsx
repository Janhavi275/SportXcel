import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Textarea } from './ui/textarea';
import { Progress } from './ui/progress';
import { Calculator, Activity, Utensils, Loader2 } from 'lucide-react';
import { apiRequest } from '../utils/supabase/client';
import { toast } from 'sonner@2.0.3';

interface BMIFormProps {
  onComplete: (data: any) => void;
  userRole: string;
  initialData?: any;
  isEditing?: boolean;
}

export function BMIFormEnhanced({ onComplete, userRole, initialData, isEditing = false }: BMIFormProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    height: initialData?.height || '',
    weight: initialData?.weight || '',
    age: initialData?.age || '',
    gender: initialData?.gender || '',
    sport: initialData?.sport || '',
    dietPreference: initialData?.dietPreference || '',
    activityLevel: initialData?.activityLevel || '',
    goals: initialData?.goals || '',
    allergies: initialData?.allergies || '',
    medicalConditions: initialData?.medicalConditions || '',
    currentSupplements: initialData?.currentSupplements || '',
    trainingSchedule: initialData?.trainingSchedule || '',
    sleepHours: initialData?.sleepHours || '',
    hydrationLevel: initialData?.hydrationLevel || '',
    injuryHistory: initialData?.injuryHistory || '',
    competitionLevel: initialData?.competitionLevel || '',
    bodyFatPercentage: initialData?.bodyFatPercentage || '',
    preferredMealTimes: initialData?.preferredMealTimes || '',
    budgetRange: initialData?.budgetRange || '',
    experienceLevel: initialData?.experienceLevel || '',
    recoveryConcerns: initialData?.recoveryConcerns || ''
  });

  const [bmiResult, setBmiResult] = useState<number | null>(initialData?.bmi || null);
  const [bmiCategory, setBmiCategory] = useState(initialData?.bmiCategory || '');
  const [isLoading, setIsLoading] = useState(false);

  const calculateBMI = () => {
    const heightInM = parseFloat(formData.height) / 100;
    const weightInKg = parseFloat(formData.weight);
    const bmi = weightInKg / (heightInM * heightInM);
    setBmiResult(Math.round(bmi * 10) / 10);
    
    if (bmi < 18.5) setBmiCategory('Underweight');
    else if (bmi < 25) setBmiCategory('Normal weight');
    else if (bmi < 30) setBmiCategory('Overweight');
    else setBmiCategory('Obese');
  };

  const handleNext = () => {
    if (step === 1) {
      calculateBMI();
    }
    setStep(step + 1);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const completeData = {
        ...formData,
        bmi: bmiResult,
        bmiCategory,
        completed_at: new Date().toISOString()
      };

      console.log('Submitting comprehensive BMI data:', completeData);
      
      const response = await apiRequest('/user/bmi', {
        method: 'POST',
        body: JSON.stringify(completeData),
      });

      console.log('Comprehensive BMI data saved successfully:', response);
      toast.success('Complete profile assessment saved successfully!');
      onComplete(completeData);
    } catch (error) {
      console.error('BMI submission error:', error);
      toast.error('Failed to save profile data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const sportsOptions = [
    'Running', 'Swimming', 'Cycling', 'Weightlifting', 'Yoga', 'Other'
  ];

  const progress = (step / 6) * 100;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-green-50 to-blue-50">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4">
            <Calculator className="w-8 h-8 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl">Comprehensive Health & Performance Assessment</CardTitle>
          <p className="text-muted-foreground">
            Complete assessment for personalized nutrition, training, and supplement recommendations
          </p>
          <Progress value={progress} className="mt-4" />
          <p className="text-sm text-muted-foreground mt-2">Step {step} of 6</p>
        </CardHeader>

        <CardContent className="space-y-6">
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg">Basic Information</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="height">Height (cm)</Label>
                  <Input
                    id="height"
                    type="number"
                    placeholder="170"
                    value={formData.height}
                    onChange={(e) => updateFormData('height', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    placeholder="70"
                    value={formData.weight}
                    onChange={(e) => updateFormData('weight', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="25"
                    value={formData.age}
                    onChange={(e) => updateFormData('age', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Gender</Label>
                  <Select value={formData.gender} onValueChange={(value) => updateFormData('gender', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {step === 2 && bmiResult && (
            <div className="space-y-4">
              <h3 className="text-lg">Your BMI Results & Sport Details</h3>
              
              <div className="bg-muted p-6 rounded-lg text-center">
                <div className="text-3xl mb-2">{bmiResult}</div>
                <div className="text-lg text-muted-foreground">{bmiCategory}</div>
              </div>

              <div className="space-y-2">
                <Label>Primary Sport</Label>
                <Select value={formData.sport} onValueChange={(value) => updateFormData('sport', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your primary sport" />
                  </SelectTrigger>
                  <SelectContent>
                    {sportsOptions.map((sport) => (
                      <SelectItem key={sport} value={sport.toLowerCase()}>
                        {sport}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Competition Level</Label>
                <RadioGroup 
                  value={formData.competitionLevel} 
                  onValueChange={(value) => updateFormData('competitionLevel', value)}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="recreational" id="recreational" />
                    <Label htmlFor="recreational">Recreational</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="amateur" id="amateur" />
                    <Label htmlFor="amateur">Amateur/Club Level</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="competitive" id="competitive" />
                    <Label htmlFor="competitive">Competitive</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="professional" id="professional" />
                    <Label htmlFor="professional">Professional/Elite</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label>Activity Level</Label>
                <RadioGroup 
                  value={formData.activityLevel} 
                  onValueChange={(value) => updateFormData('activityLevel', value)}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="low" id="low" />
                    <Label htmlFor="low">Low (1-2 times/week)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="moderate" id="moderate" />
                    <Label htmlFor="moderate">Moderate (3-4 times/week)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="high" id="high" />
                    <Label htmlFor="high">High (5-6 times/week)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="very-high" id="very-high" />
                    <Label htmlFor="very-high">Very High (Daily)</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h3 className="text-lg flex items-center gap-2">
                <Utensils className="w-5 h-5" />
                Dietary Preferences
              </h3>

              <div className="space-y-2">
                <Label>Diet Type</Label>
                <RadioGroup 
                  value={formData.dietPreference} 
                  onValueChange={(value) => updateFormData('dietPreference', value)}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="vegetarian" id="vegetarian" />
                    <Label htmlFor="vegetarian">Vegetarian</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="non-vegetarian" id="non-vegetarian" />
                    <Label htmlFor="non-vegetarian">Non-Vegetarian</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="vegan" id="vegan" />
                    <Label htmlFor="vegan">Vegan</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="pescatarian" id="pescatarian" />
                    <Label htmlFor="pescatarian">Pescatarian</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="allergies">Food Allergies/Intolerances</Label>
                <Textarea
                  id="allergies"
                  placeholder="List any food allergies or intolerances"
                  value={formData.allergies}
                  onChange={(e) => updateFormData('allergies', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="goals">Performance Goals</Label>
                <Textarea
                  id="goals"
                  placeholder="Describe your fitness and performance goals"
                  value={formData.goals}
                  onChange={(e) => updateFormData('goals', e.target.value)}
                />
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <h3 className="text-lg flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Training & Lifestyle
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sleepHours">Average Sleep Hours</Label>
                  <Select value={formData.sleepHours} onValueChange={(value) => updateFormData('sleepHours', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select hours" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="less-than-6">Less than 6 hours</SelectItem>
                      <SelectItem value="6-7">6-7 hours</SelectItem>
                      <SelectItem value="7-8">7-8 hours</SelectItem>
                      <SelectItem value="8-9">8-9 hours</SelectItem>
                      <SelectItem value="more-than-9">More than 9 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hydrationLevel">Daily Water Intake</Label>
                  <Select value={formData.hydrationLevel} onValueChange={(value) => updateFormData('hydrationLevel', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select intake" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Less than 1L</SelectItem>
                      <SelectItem value="moderate">1-2L</SelectItem>
                      <SelectItem value="good">2-3L</SelectItem>
                      <SelectItem value="high">More than 3L</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="trainingSchedule">Training Schedule</Label>
                <Textarea
                  id="trainingSchedule"
                  placeholder="Describe your typical weekly training schedule"
                  value={formData.trainingSchedule}
                  onChange={(e) => updateFormData('trainingSchedule', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Experience Level in Your Sport</Label>
                <RadioGroup 
                  value={formData.experienceLevel} 
                  onValueChange={(value) => updateFormData('experienceLevel', value)}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="beginner" id="beginner" />
                    <Label htmlFor="beginner">Beginner (0-1 years)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="intermediate" id="intermediate" />
                    <Label htmlFor="intermediate">Intermediate (2-5 years)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="advanced" id="advanced" />
                    <Label htmlFor="advanced">Advanced (5+ years)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="expert" id="expert" />
                    <Label htmlFor="expert">Expert/Professional</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-4">
              <h3 className="text-lg flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Health & Body Composition
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bodyFat">Body Fat Percentage (if known)</Label>
                  <Input
                    id="bodyFat"
                    type="number"
                    placeholder="15"
                    value={formData.bodyFatPercentage}
                    onChange={(e) => updateFormData('bodyFatPercentage', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="budget">Monthly Supplement Budget</Label>
                  <Select value={formData.budgetRange} onValueChange={(value) => updateFormData('budgetRange', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Under $50</SelectItem>
                      <SelectItem value="moderate">$50-$100</SelectItem>
                      <SelectItem value="high">$100-$200</SelectItem>
                      <SelectItem value="premium">Over $200</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="injury">Injury History</Label>
                <Textarea
                  id="injury"
                  placeholder="List any past or current injuries that affect your training"
                  value={formData.injuryHistory}
                  onChange={(e) => updateFormData('injuryHistory', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="recovery">Recovery & Pain Concerns</Label>
                <Textarea
                  id="recovery"
                  placeholder="Describe any areas where you need help with recovery or pain management"
                  value={formData.recoveryConcerns}
                  onChange={(e) => updateFormData('recoveryConcerns', e.target.value)}
                />
              </div>
            </div>
          )}

          {step === 6 && (
            <div className="space-y-4">
              <h3 className="text-lg flex items-center gap-2">
                <Utensils className="w-5 h-5" />
                Nutrition & Supplements
              </h3>

              <div className="space-y-2">
                <Label htmlFor="mealTimes">Preferred Meal Schedule</Label>
                <Textarea
                  id="mealTimes"
                  placeholder="Describe your typical meal schedule and preferences (e.g., intermittent fasting, post-workout nutrition timing)"
                  value={formData.preferredMealTimes}
                  onChange={(e) => updateFormData('preferredMealTimes', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="medical">Medical Conditions</Label>
                <Textarea
                  id="medical"
                  placeholder="List any medical conditions or injuries"
                  value={formData.medicalConditions}
                  onChange={(e) => updateFormData('medicalConditions', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="supplements">Current Supplements</Label>
                <Textarea
                  id="supplements"
                  placeholder="List any supplements you're currently taking"
                  value={formData.currentSupplements}
                  onChange={(e) => updateFormData('currentSupplements', e.target.value)}
                />
              </div>

              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h4 className="text-sm mb-2 text-green-800">🎯 Assessment Complete!</h4>
                <p className="text-sm text-green-700">
                  Your comprehensive profile will be used to generate personalized:
                </p>
                <ul className="text-xs mt-2 space-y-1 text-green-700 pl-4">
                  <li>• Sport-specific nutrition plans</li>
                  <li>• Targeted supplement recommendations</li>
                  <li>• Recovery and performance optimization strategies</li>
                  <li>• Training load and dietary adjustments</li>
                </ul>
              </div>
            </div>
          )}

          <div className="flex justify-between pt-4">
            {step > 1 && (
              <Button variant="outline" onClick={() => setStep(step - 1)}>
                Previous
              </Button>
            )}
            {step < 6 ? (
              <Button 
                onClick={handleNext} 
                className="ml-auto"
                disabled={step === 1 && (!formData.height || !formData.weight || !formData.age || !formData.gender)}
              >
                Next
              </Button>
            ) : (
              <Button onClick={handleSubmit} className="ml-auto" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  isEditing ? 'Update Profile' : 'Complete Assessment'
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}