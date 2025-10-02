import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { BMIFormEnhanced } from './BMIFormEnhanced';
import { 
  User, 
  Edit, 
  Save, 
  Calculator, 
  Apple, 
  Activity,
  Settings,
  Shield,
  Bell,
  Palette,
  Moon,
  Sun,
  Globe,
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { apiRequest } from '../utils/supabase/client';
import { toast } from 'sonner@2.0.3';

interface ProfileSettingsProps {
  user: {
    username: string;
    role: string;
    profile?: any;
  };
  onProfileUpdate: (updatedProfile: any) => void;
}

export function ProfileSettings({ user, onProfileUpdate }: ProfileSettingsProps) {
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [showBMIForm, setShowBMIForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    username: user.username,
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    dateOfBirth: '',
    emergencyContact: '',
    emergencyPhone: '',
    profilePicture: '',
    bio: '',
    location: '',
    timezone: 'UTC',
    language: 'en',
    ...user.profile
  });

  const [preferences, setPreferences] = useState({
    theme: 'light',
    notifications: {
      email: true,
      push: true,
      sms: false,
      analysisComplete: true,
      trainingReminders: true,
      nutritionTips: true,
      weeklyReports: true
    },
    privacy: {
      profileVisibility: 'public',
      shareAnalytics: true,
      shareProgress: false,
      allowOfficialReview: true
    },
    units: {
      weight: 'kg',
      height: 'cm',
      distance: 'km',
      temperature: 'celsius'
    }
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });

  useEffect(() => {
    fetchUserSettings();
  }, []);

  const fetchUserSettings = async () => {
    try {
      const response = await apiRequest('/user/settings');
      if (response.settings) {
        setPreferences(prev => ({ ...prev, ...response.settings }));
      }
    } catch (error) {
      console.error('Failed to fetch user settings:', error);
    }
  };

  const updateProfile = async () => {
    try {
      setLoading(true);
      const response = await apiRequest('/user/profile', {
        method: 'PUT',
        body: JSON.stringify(profileData),
      });

      onProfileUpdate(response.profile);
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const updatePreferences = async () => {
    try {
      setLoading(true);
      await apiRequest('/user/settings', {
        method: 'PUT',
        body: JSON.stringify(preferences),
      });

      toast.success('Preferences updated successfully!');
    } catch (error) {
      console.error('Failed to update preferences:', error);
      toast.error('Failed to update preferences');
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return;
    }

    try {
      setLoading(true);
      await apiRequest('/user/change-password', {
        method: 'POST',
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        }),
      });

      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      toast.success('Password changed successfully!');
    } catch (error) {
      console.error('Failed to change password:', error);
      toast.error('Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const handleBMIComplete = (bmiData: any) => {
    setProfileData(prev => ({ ...prev, ...bmiData }));
    setShowBMIForm(false);
    onProfileUpdate({ ...user.profile, ...bmiData });
    toast.success('Health profile updated successfully!');
  };

  const calculateBMI = () => {
    if (user.profile?.height && user.profile?.weight) {
      const heightInM = parseFloat(user.profile.height) / 100;
      const weightInKg = parseFloat(user.profile.weight);
      const bmi = weightInKg / (heightInM * heightInM);
      return Math.round(bmi * 10) / 10;
    }
    return null;
  };

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { category: 'Underweight', color: 'text-blue-600' };
    if (bmi < 25) return { category: 'Normal weight', color: 'text-green-600' };
    if (bmi < 30) return { category: 'Overweight', color: 'text-yellow-600' };
    return { category: 'Obese', color: 'text-red-600' };
  };

  const bmi = calculateBMI();
  const bmiInfo = bmi ? getBMICategory(bmi) : null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl">Profile Settings</h2>
          <p className="text-muted-foreground">
            Manage your account settings and preferences
          </p>
        </div>
        <Badge variant="outline" className="capitalize">
          {user.role}
        </Badge>
      </div>

      {showBMIForm ? (
        <BMIFormEnhanced
          onComplete={handleBMIComplete}
          userRole={user.role}
        />
      ) : (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="health">Health</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Personal Information
                  </CardTitle>
                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    {isEditing ? 'Cancel' : 'Edit'}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={profileData.firstName}
                      onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={profileData.lastName}
                      onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={profileData.dateOfBirth}
                      onChange={(e) => setProfileData({...profileData, dateOfBirth: e.target.value})}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={profileData.location}
                      onChange={(e) => setProfileData({...profileData, location: e.target.value})}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={profileData.bio}
                    onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                    disabled={!isEditing}
                    placeholder="Tell us about yourself and your athletic journey"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="emergencyContact">Emergency Contact</Label>
                    <Input
                      id="emergencyContact"
                      value={profileData.emergencyContact}
                      onChange={(e) => setProfileData({...profileData, emergencyContact: e.target.value})}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="emergencyPhone">Emergency Phone</Label>
                    <Input
                      id="emergencyPhone"
                      value={profileData.emergencyPhone}
                      onChange={(e) => setProfileData({...profileData, emergencyPhone: e.target.value})}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                {isEditing && (
                  <div className="flex gap-2 pt-4">
                    <Button onClick={updateProfile} disabled={loading}>
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </Button>
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="health" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="w-5 h-5" />
                    Health & Fitness Profile
                  </CardTitle>
                  <Button
                    variant="outline"
                    onClick={() => setShowBMIForm(true)}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Update Health Profile
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {user.profile ? (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="text-center p-4 border rounded-lg">
                        <div className="text-2xl mb-2">{user.profile.height || 'N/A'}</div>
                        <p className="text-sm text-muted-foreground">Height (cm)</p>
                      </div>
                      <div className="text-center p-4 border rounded-lg">
                        <div className="text-2xl mb-2">{user.profile.weight || 'N/A'}</div>
                        <p className="text-sm text-muted-foreground">Weight (kg)</p>
                      </div>
                      <div className="text-center p-4 border rounded-lg">
                        <div className="text-2xl mb-2">{bmi || 'N/A'}</div>
                        <p className="text-sm text-muted-foreground">BMI</p>
                        {bmiInfo && (
                          <p className={`text-xs mt-1 ${bmiInfo.color}`}>
                            {bmiInfo.category}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <h4 className="font-medium">Basic Information</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Age:</span>
                            <span>{user.profile.age || 'Not specified'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Gender:</span>
                            <span className="capitalize">{user.profile.gender || 'Not specified'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Primary Sport:</span>
                            <span className="capitalize">{user.profile.sport || 'Not specified'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Activity Level:</span>
                            <span className="capitalize">{user.profile.activityLevel || 'Not specified'}</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h4 className="font-medium">Dietary Preferences</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Diet Type:</span>
                            <span className="capitalize">{user.profile.dietPreference || 'Not specified'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Sleep Hours:</span>
                            <span>{user.profile.sleepHours || 'Not specified'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Hydration Level:</span>
                            <span className="capitalize">{user.profile.hydrationLevel || 'Not specified'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Competition Level:</span>
                            <span className="capitalize">{user.profile.competitionLevel || 'Not specified'}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {user.profile.goals && (
                      <div>
                        <h4 className="font-medium mb-2">Performance Goals</h4>
                        <p className="text-sm text-muted-foreground">{user.profile.goals}</p>
                      </div>
                    )}

                    {user.profile.allergies && (
                      <div>
                        <h4 className="font-medium mb-2">Allergies & Intolerances</h4>
                        <p className="text-sm text-muted-foreground">{user.profile.allergies}</p>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-8">
                    <Calculator className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg mb-2">Complete Your Health Profile</h3>
                    <p className="text-muted-foreground mb-4">
                      Get personalized nutrition and training recommendations
                    </p>
                    <Button onClick={() => setShowBMIForm(true)}>
                      <Calculator className="w-4 h-4 mr-2" />
                      Complete Health Assessment
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preferences" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Application Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-base">Theme</Label>
                    <p className="text-sm text-muted-foreground mb-3">Choose your preferred theme</p>
                    <RadioGroup 
                      value={preferences.theme} 
                      onValueChange={(value) => setPreferences({...preferences, theme: value})}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="light" id="light" />
                        <Label htmlFor="light" className="flex items-center gap-2">
                          <Sun className="w-4 h-4" />
                          Light
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="dark" id="dark" />
                        <Label htmlFor="dark" className="flex items-center gap-2">
                          <Moon className="w-4 h-4" />
                          Dark
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="system" id="system" />
                        <Label htmlFor="system" className="flex items-center gap-2">
                          <Palette className="w-4 h-4" />
                          System
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="language">Language</Label>
                      <Select value={preferences.language} onValueChange={(value) => setPreferences({...preferences, language: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="es">Spanish</SelectItem>
                          <SelectItem value="fr">French</SelectItem>
                          <SelectItem value="de">German</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="timezone">Timezone</Label>
                      <Select value={preferences.timezone} onValueChange={(value) => setPreferences({...preferences, timezone: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="UTC">UTC</SelectItem>
                          <SelectItem value="EST">Eastern Time</SelectItem>
                          <SelectItem value="PST">Pacific Time</SelectItem>
                          <SelectItem value="GMT">Greenwich Mean Time</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label className="text-base">Units</Label>
                    <p className="text-sm text-muted-foreground mb-3">Choose your preferred units</p>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label>Weight</Label>
                      <Select value={preferences.units.weight} onValueChange={(value) => setPreferences({
                        ...preferences, 
                        units: {...preferences.units, weight: value}
                      })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="kg">Kilograms</SelectItem>
                          <SelectItem value="lbs">Pounds</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Height</Label>
                      <Select value={preferences.units.height} onValueChange={(value) => setPreferences({
                        ...preferences, 
                        units: {...preferences.units, height: value}
                      })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cm">Centimeters</SelectItem>
                          <SelectItem value="ft">Feet/Inches</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Distance</Label>
                      <Select value={preferences.units.distance} onValueChange={(value) => setPreferences({
                        ...preferences, 
                        units: {...preferences.units, distance: value}
                      })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="km">Kilometers</SelectItem>
                          <SelectItem value="mi">Miles</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Temperature</Label>
                      <Select value={preferences.units.temperature} onValueChange={(value) => setPreferences({
                        ...preferences, 
                        units: {...preferences.units, temperature: value}
                      })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="celsius">Celsius</SelectItem>
                          <SelectItem value="fahrenheit">Fahrenheit</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={updatePreferences} disabled={loading}>
                    <Save className="w-4 h-4 mr-2" />
                    Save Preferences
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="w-5 h-5" />
                  Change Password
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <div className="relative">
                    <Input
                      id="currentPassword"
                      type={showPassword.current ? "text" : "password"}
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 -translate-y-1/2"
                      onClick={() => setShowPassword({...showPassword, current: !showPassword.current})}
                    >
                      {showPassword.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={showPassword.new ? "text" : "password"}
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 -translate-y-1/2"
                      onClick={() => setShowPassword({...showPassword, new: !showPassword.new})}
                    >
                      {showPassword.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showPassword.confirm ? "text" : "password"}
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 -translate-y-1/2"
                      onClick={() => setShowPassword({...showPassword, confirm: !showPassword.confirm})}
                    >
                      {showPassword.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button onClick={changePassword} disabled={loading}>
                    <Save className="w-4 h-4 mr-2" />
                    Change Password
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Privacy Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <Label className="text-base">Profile Visibility</Label>
                    <p className="text-sm text-muted-foreground mb-3">Who can see your profile information</p>
                    <RadioGroup 
                      value={preferences.privacy.profileVisibility} 
                      onValueChange={(value) => setPreferences({
                        ...preferences, 
                        privacy: {...preferences.privacy, profileVisibility: value}
                      })}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="public" id="public" />
                        <Label htmlFor="public">Public - Anyone can see</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="athletes" id="athletes" />
                        <Label htmlFor="athletes">Athletes only</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="private" id="private" />
                        <Label htmlFor="private">Private - Only me</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={updatePreferences} disabled={loading}>
                    <Save className="w-4 h-4 mr-2" />
                    Save Privacy Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Notification Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-base">Notification Methods</Label>
                    <p className="text-sm text-muted-foreground mb-3">Choose how you'd like to receive notifications</p>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4" />
                          <span>Email Notifications</span>
                        </div>
                        <Button
                          variant={preferences.notifications.email ? "default" : "outline"}
                          size="sm"
                          onClick={() => setPreferences({
                            ...preferences,
                            notifications: {...preferences.notifications, email: !preferences.notifications.email}
                          })}
                        >
                          {preferences.notifications.email ? 'Enabled' : 'Disabled'}
                        </Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4" />
                          <span>Push Notifications</span>
                        </div>
                        <Button
                          variant={preferences.notifications.push ? "default" : "outline"}
                          size="sm"
                          onClick={() => setPreferences({
                            ...preferences,
                            notifications: {...preferences.notifications, push: !preferences.notifications.push}
                          })}
                        >
                          {preferences.notifications.push ? 'Enabled' : 'Disabled'}
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label className="text-base">Notification Types</Label>
                    <p className="text-sm text-muted-foreground mb-3">Choose what notifications you'd like to receive</p>
                    <div className="space-y-3">
                      {[
                        { key: 'analysisComplete', label: 'Analysis Complete', description: 'When your video analysis is finished' },
                        { key: 'trainingReminders', label: 'Training Reminders', description: 'Reminders for scheduled training sessions' },
                        { key: 'nutritionTips', label: 'Nutrition Tips', description: 'Personalized nutrition recommendations' },
                        { key: 'weeklyReports', label: 'Weekly Reports', description: 'Weekly progress and performance summaries' }
                      ].map((item) => (
                        <div key={item.key} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="text-sm font-medium">{item.label}</p>
                            <p className="text-xs text-muted-foreground">{item.description}</p>
                          </div>
                          <Button
                            variant={preferences.notifications[item.key as keyof typeof preferences.notifications] ? "default" : "outline"}
                            size="sm"
                            onClick={() => setPreferences({
                              ...preferences,
                              notifications: {
                                ...preferences.notifications, 
                                [item.key]: !preferences.notifications[item.key as keyof typeof preferences.notifications]
                              }
                            })}
                          >
                            {preferences.notifications[item.key as keyof typeof preferences.notifications] ? 'On' : 'Off'}
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={updatePreferences} disabled={loading}>
                    <Save className="w-4 h-4 mr-2" />
                    Save Notification Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}