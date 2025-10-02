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
}

export function BMIForm({ onComplete, userRole }: BMIFormProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    height: '',
    weight: '',
    age: '',
    gender: '',
    sport: '',
    dietPreference: '',
    activityLevel: '',
    goals: '',
    allergies: '',
    medicalConditions: '',
    currentSupplements: '',
    trainingSchedule: '',
    sleepHours: '',
    hydrationLevel: '',
    injuryHistory: '',
    competitionLevel: '',
    bodyFatPercentage: '',
    preferredMealTimes: '',
    budgetRange: '',
    experienceLevel: '',
    recoveryConcerns: ''
  });

  const [bmiResult, setBmiResult] = useState<number | null>(null);
  const [bmiCategory, setBmiCategory] = useState('');
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

      console.log('Submitting BMI data:', completeData);
      
      const response = await apiRequest('/user/bmi', {
        method: 'POST',
        body: JSON.stringify(completeData),
      });

      console.log('BMI data saved successfully:', response);
      toast.success('Profile completed successfully!');
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
    'Soccer', 'Basketball', 'Tennis', 'Swimming', 'Running', 'Cycling',
    'Weightlifting', 'Boxing', 'Yoga', 'Martial Arts', 'Golf', 'Baseball',
    'Volleyball', 'Cricket', 'Rugby', 'Hockey', 'Other'
  ];

  const progress = (step / 6) * 100;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-green-50 to-blue-50">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4">
            <Calculator className="w-8 h-8 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl">Health & Performance Assessment</CardTitle>
          <p className="text-muted-foreground">
            Help us personalize your nutrition and training recommendations
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
              <h3 className="text-lg">Your BMI Results</h3>
              
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
                Health Information
              </h3>

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

              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-800">
                  ✓ Your information will be used to create personalized nutrition and training recommendations
                </p>
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
                  'Complete Assessment'
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}