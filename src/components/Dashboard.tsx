import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Notifications } from './Notifications';
import { AnalysisReport } from './AnalysisReport';
import { BadgesAndRankings } from './BadgesAndRankings';
import { NutritionSupplements } from './NutritionSupplements';
import { SecurityCenter } from './SecurityCenter';
import { RoleBasedWelcome } from './RoleBasedWelcome';
import { TrainingPlan } from './TrainingPlan';
import { 
  User, 
  Settings, 
  LogOut, 
  Trophy, 
  Activity, 
  Video, 
  BarChart3, 
  Apple, 
  Target,
  Play,
  Upload,
  Camera,
  Calendar,
  TrendingUp,
  Bell,
  Medal,
  Pill,
  FileText,
  Shield,
  CheckCircle,
  Dumbbell
} from 'lucide-react';
import { apiRequest } from '../utils/supabase/client';
import { toast } from 'sonner@2.0.3';

interface DashboardProps {
  user: {
    username: string;
    role: string;
    profile?: any;
  };
  onLogout: () => void;
  onStartVideoAnalysis: () => void;
  onViewReport?: (reportData: any) => void;
  onEditProfile?: () => void;
}

export function Dashboard({ user, onLogout, onStartVideoAnalysis, onViewReport, onEditProfile }: DashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [showNotifications, setShowNotifications] = useState(false);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await apiRequest('/dashboard');
      setDashboardData(response.dashboardData);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getTabsGridCols = () => {
    if (user.role === 'athlete') return 'grid-cols-8'; // All tabs including training plan
    if (user.role === 'official') return 'grid-cols-3'; // Overview, Security, Reviews
    if (user.role === 'administrator') return 'grid-cols-7'; // All except nutrition and achievements, plus training plan
    return 'grid-cols-3';
  };

  const mockRecommendations = {
    nutrition: [
      'Increase protein intake to 1.6g per kg body weight',
      'Add omega-3 supplements for recovery',
      'Include complex carbs 2 hours before training'
    ],
    supplements: [
      { name: 'Whey Protein', dosage: '25g post-workout', reason: 'Muscle recovery' },
      { name: 'Creatine', dosage: '5g daily', reason: 'Power output' },
      { name: 'Vitamin D3', dosage: '2000 IU daily', reason: 'Bone health' }
    ],
    training: [
      'Focus on explosive power exercises',
      'Add 2 recovery sessions per week',
      'Increase training volume gradually by 10%'
    ]
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <Trophy className="w-4 h-4 text-primary-foreground" />
              </div>
              <h1 className="text-xl">SportXcel</h1>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span className="text-sm">{user.username}</span>
                <Badge variant="secondary" className="capitalize">
                  {user.role}
                </Badge>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative"
              >
                <Bell className="w-4 h-4" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                  3
                </div>
              </Button>
              <Button variant="ghost" size="sm" onClick={onEditProfile}>
                <Settings className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={onLogout}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showNotifications ? (
          <div className="mb-8">
            <Notifications userRole={user.role} />
          </div>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className={`grid w-full ${getTabsGridCols()}`}>
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                <span className="hidden sm:inline">Overview</span>
              </TabsTrigger>
              
              {/* Video Analysis - Athletes and Administrators only */}
              {(user.role === 'athlete' || user.role === 'administrator') && (
                <TabsTrigger value="video" className="flex items-center gap-2">
                  <Video className="w-4 h-4" />
                  <span className="hidden sm:inline">Video Analysis</span>
                </TabsTrigger>
              )}
              
              {/* Nutrition - Athletes only */}
              {user.role === 'athlete' && (
                <TabsTrigger value="nutrition" className="flex items-center gap-2">
                  <Apple className="w-4 h-4" />
                  <span className="hidden sm:inline">Nutrition</span>
                </TabsTrigger>
              )}
              
              {/* Performance - Athletes and Administrators */}
              {(user.role === 'athlete' || user.role === 'administrator') && (
                <TabsTrigger value="performance" className="flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  <span className="hidden sm:inline">Performance</span>
                </TabsTrigger>
              )}
              
              {/* Achievements - Athletes only */}
              {user.role === 'athlete' && (
                <TabsTrigger value="achievements" className="flex items-center gap-2">
                  <Medal className="w-4 h-4" />
                  <span className="hidden sm:inline">Achievements</span>
                </TabsTrigger>
              )}
              
              {/* Training Plans - Athletes and Administrators */}
              {(user.role === 'athlete' || user.role === 'administrator') && (
                <TabsTrigger value="training" className="flex items-center gap-2">
                  <Dumbbell className="w-4 h-4" />
                  <span className="hidden sm:inline">Training</span>
                </TabsTrigger>
              )}
              
              {/* Security - All roles */}
              <TabsTrigger value="security" className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <span className="hidden sm:inline">Security</span>
              </TabsTrigger>
              
              {/* Reports - All roles but different content */}
              <TabsTrigger value="reports" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                <span className="hidden sm:inline">
                  {user.role === 'official' ? 'Reviews' : user.role === 'administrator' ? 'Admin' : 'Reports'}
                </span>
              </TabsTrigger>
              
              {/* User Management - Administrators only */}
              {user.role === 'administrator' && (
                <TabsTrigger value="users" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">Users</span>
                </TabsTrigger>
              )}
            </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <RoleBasedWelcome user={user} />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm">Total Analyses</CardTitle>
                  <Activity className="w-4 h-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl">{dashboardData?.stats?.total_analyses || 0}</div>
                  <p className="text-xs text-muted-foreground">Completed</p>
                  <Progress value={Math.min(100, (dashboardData?.stats?.total_analyses || 0) * 10)} className="mt-2" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm">Performance Score</CardTitle>
                  <TrendingUp className="w-4 h-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl">{dashboardData?.stats?.avg_performance_score || 0}%</div>
                  <p className="text-xs text-muted-foreground">
                    {dashboardData?.stats?.improvement_trend === 'improving' ? '↗ Improving' : '📊 Baseline'}
                  </p>
                  <Progress value={dashboardData?.stats?.avg_performance_score || 0} className="mt-2" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm">Recent Analyses</CardTitle>
                  <Target className="w-4 h-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl">{dashboardData?.stats?.recent_analyses || 0}</div>
                  <p className="text-xs text-muted-foreground">Last 5 sessions</p>
                  <Progress value={Math.min(100, (dashboardData?.stats?.recent_analyses || 0) * 20)} className="mt-2" />
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activities</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {loading ? (
                      <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="animate-pulse flex items-center justify-between">
                            <div className="space-y-1">
                              <div className="h-4 bg-muted rounded w-32"></div>
                              <div className="h-3 bg-muted rounded w-20"></div>
                            </div>
                            <div className="h-6 bg-muted rounded w-16"></div>
                          </div>
                        ))}
                      </div>
                    ) : (dashboardData?.recent_activities || []).length > 0 ? (
                      (dashboardData.recent_activities || [])
                        .filter((activity: any) => activity != null && activity.title && activity.type)
                        .map((activity: any, index: number) => (
                        <div key={activity?.id || index} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              activity?.type === 'video_upload' ? 'bg-blue-100 text-blue-600' :
                              activity?.type === 'video_recording' ? 'bg-purple-100 text-purple-600' :
                              activity?.type === 'analysis_complete' ? 'bg-green-100 text-green-600' :
                              'bg-gray-100 text-gray-600'
                            }`}>
                              {activity?.type === 'video_upload' ? <Upload className="w-4 h-4" /> :
                               activity?.type === 'video_recording' ? <Camera className="w-4 h-4" /> :
                               activity?.type === 'analysis_complete' ? <Activity className="w-4 h-4" /> :
                               <CheckCircle className="w-4 h-4" />}
                            </div>
                            <div>
                              <p className="text-sm">{activity?.title || 'Unknown Activity'}</p>
                              <p className="text-xs text-muted-foreground">
                                {activity?.timestamp ? 
                                  `${new Date(activity.timestamp).toLocaleDateString()} at ${new Date(activity.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` :
                                  'Unknown time'
                                }
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={
                              activity?.type === 'video_upload' ? 'secondary' :
                              activity?.type === 'video_recording' ? 'outline' :
                              activity?.type === 'analysis_complete' ? 'default' :
                              'secondary'
                            }>
                              {activity?.type === 'video_upload' ? 'Upload' :
                               activity?.type === 'video_recording' ? 'Record' :
                               activity?.type === 'analysis_complete' ? `Score: ${activity?.metadata?.overallScore || 0}%` :
                               'Activity'}
                            </Badge>
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <p className="text-sm">No recent activities found</p>
                        <p className="text-xs">Upload a video to get started!</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>AI Recommendations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {mockRecommendations.training.slice(0, 3).map((rec, index) => (
                      <div key={index} className="p-3 bg-muted rounded-lg">
                        <p className="text-sm">{rec}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {(user.role === 'athlete' || user.role === 'administrator') && (
            <TabsContent value="video" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Video Analysis</CardTitle>
                <p className="text-muted-foreground">
                  Upload or record videos for AI-powered posture and technique analysis
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button 
                    onClick={onStartVideoAnalysis} 
                    className="h-32 flex-col gap-3"
                    disabled={user.role === 'official'}
                  >
                    <Upload className="w-8 h-8" />
                    Upload Video
                    <p className="text-xs opacity-75">
                      {user.role === 'official' ? 'Officials cannot upload videos' : 'Select video from device'}
                    </p>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-32 flex-col gap-3"
                    disabled={user.role === 'official'}
                  >
                    <Camera className="w-8 h-8" />
                    Record Video
                    <p className="text-xs opacity-75">
                      {user.role === 'official' ? 'Officials cannot record videos' : 'Record using camera'}
                    </p>
                  </Button>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2 mb-3">
                    <Bell className="w-5 h-5 text-blue-600" />
                    <h4 className="text-sm text-blue-800">Advanced Security Features</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-blue-700">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-3 h-3" />
                      <span>Real-time cheat detection</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-3 h-3" />
                      <span>Video authenticity verification</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-3 h-3" />
                      <span>Motion pattern analysis</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-3 h-3" />
                      <span>Blockchain-secured results</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg">Recent Analyses</h3>
                  {[
                    { name: 'Running Form Analysis', date: '2024-10-01', score: 85, verified: true },
                    { name: 'Swimming Technique', date: '2024-09-28', score: 78, verified: true },
                    { name: 'Cycling Posture', date: '2024-09-25', score: 92, verified: true }
                  ].map((analysis, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Play className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm">{analysis.name}</p>
                          <p className="text-xs text-muted-foreground">{analysis.date}</p>
                        </div>
                      </div>
                      <div className="text-right flex items-center gap-2">
                        <div>
                          <p className="text-sm">Score: {analysis.score}%</p>
                          <div className="flex items-center gap-1">
                            <CheckCircle className="w-3 h-3 text-green-600" />
                            <span className="text-xs text-green-600">Verified</span>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">View Details</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            </TabsContent>
          )}

          {user.role === 'athlete' && (
            <TabsContent value="nutrition" className="space-y-6">
              <NutritionSupplements userProfile={user.profile} userRole={user.role} />
            </TabsContent>
          )}

          {(user.role === 'athlete' || user.role === 'administrator') && (
            <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { metric: 'Speed', value: '15.2 mph', change: '+2.1%' },
                      { metric: 'Endurance', value: '42 min', change: '+5.3%' },
                      { metric: 'Strength', value: '185 lbs', change: '+3.2%' },
                      { metric: 'Flexibility', value: '85%', change: '+1.8%' }
                    ].map((item, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="text-sm">{item.metric}</span>
                        <div className="text-right">
                          <div className="text-sm">{item.value}</div>
                          <div className="text-xs text-green-600">{item.change}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Training Schedule</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { day: 'Today', session: 'Strength Training', time: '6:00 PM' },
                      { day: 'Tomorrow', session: 'Cardio Session', time: '7:00 AM' },
                      { day: 'Thursday', session: 'Technique Practice', time: '5:30 PM' }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div>
                          <p className="text-sm">{item.session}</p>
                          <p className="text-xs text-muted-foreground">{item.day}</p>
                        </div>
                        <div className="text-sm text-muted-foreground">{item.time}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            </TabsContent>
          )}

          {user.role === 'athlete' && (
            <TabsContent value="achievements" className="space-y-6">
              <BadgesAndRankings userRole={user.role} />
            </TabsContent>
          )}

          {(user.role === 'athlete' || user.role === 'administrator') && (
            <TabsContent value="training" className="space-y-6">
              <TrainingPlan userProfile={user.profile} userRole={user.role} />
            </TabsContent>
          )}

          <TabsContent value="security" className="space-y-6">
            <SecurityCenter userRole={user.role} />
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Analysis Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { 
                      id: 1, 
                      title: 'Running Form Analysis', 
                      date: '2024-10-01', 
                      score: 85, 
                      status: 'Reviewed by Official',
                      type: 'Performance Analysis'
                    },
                    { 
                      id: 2, 
                      title: 'Swimming Technique', 
                      date: '2024-09-28', 
                      score: 78, 
                      status: 'Pending Review',
                      type: 'Technique Analysis'
                    },
                    { 
                      id: 3, 
                      title: 'Cycling Posture', 
                      date: '2024-09-25', 
                      score: 92, 
                      status: 'Approved',
                      type: 'Performance Analysis'
                    }
                  ].map((report) => (
                    <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                          <FileText className="w-6 h-6 text-primary-foreground" />
                        </div>
                        <div>
                          <h4 className="text-sm">{report.title}</h4>
                          <p className="text-xs text-muted-foreground">{report.type} • {report.date}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline">Score: {report.score}%</Badge>
                            <Badge 
                              variant={
                                report.status === 'Approved' ? 'default' : 
                                report.status === 'Reviewed by Official' ? 'secondary' : 
                                'outline'
                              }
                              className="text-xs"
                            >
                              {report.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => onViewReport && onViewReport(report)}
                      >
                        View Report
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {user.role === 'administrator' && (
              <Card>
                <CardHeader>
                  <CardTitle>Admin Reports</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 border rounded-lg text-center">
                      <div className="text-2xl text-blue-600 mb-2">1,250</div>
                      <p className="text-sm text-muted-foreground">Total Athletes</p>
                    </div>
                    <div className="p-4 border rounded-lg text-center">
                      <div className="text-2xl text-green-600 mb-2">450</div>
                      <p className="text-sm text-muted-foreground">Videos Analyzed</p>
                    </div>
                    <div className="p-4 border rounded-lg text-center">
                      <div className="text-2xl text-orange-600 mb-2">89%</div>
                      <p className="text-sm text-muted-foreground">Avg Performance</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {user.role === 'official' && (
              <Card>
                <CardHeader>
                  <CardTitle>Pending Reviews</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { athlete: 'John Smith', sport: 'Swimming', submitted: '2 hours ago', priority: 'High' },
                      { athlete: 'Sarah Wilson', sport: 'Running', submitted: '4 hours ago', priority: 'Medium' },
                      { athlete: 'Mike Chen', sport: 'Cycling', submitted: '1 day ago', priority: 'Low' }
                    ].map((review, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="text-sm">{review.athlete} - {review.sport}</p>
                          <p className="text-xs text-muted-foreground">{review.submitted}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge 
                            variant={
                              review.priority === 'High' ? 'destructive' :
                              review.priority === 'Medium' ? 'secondary' :
                              'outline'
                            }
                          >
                            {review.priority}
                          </Badge>
                          <Button variant="outline" size="sm">
                            Review
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {user.role === 'administrator' && (
            <TabsContent value="users" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>User Management</CardTitle>
                  <p className="text-muted-foreground">
                    Manage athletes, officials, and system administrators
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <Card>
                      <CardContent className="p-6 text-center">
                        <Trophy className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                        <div className="text-2xl mb-1">1,250</div>
                        <p className="text-sm text-muted-foreground">Total Athletes</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-6 text-center">
                        <Shield className="w-8 h-8 mx-auto mb-2 text-green-600" />
                        <div className="text-2xl mb-1">45</div>
                        <p className="text-sm text-muted-foreground">Officials</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-6 text-center">
                        <Settings className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                        <div className="text-2xl mb-1">8</div>
                        <p className="text-sm text-muted-foreground">Administrators</p>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg">Recent User Activity</h3>
                    {[
                      { name: 'John Smith', role: 'Athlete', action: 'Uploaded video analysis', time: '2 hours ago' },
                      { name: 'Dr. Sarah Johnson', role: 'Official', action: 'Reviewed performance report', time: '4 hours ago' },
                      { name: 'Mike Chen', role: 'Athlete', action: 'Completed training session', time: '6 hours ago' },
                      { name: 'Coach Martinez', role: 'Official', action: 'Approved technique assessment', time: '1 day ago' }
                    ].map((activity, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                            <User className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-sm">{activity.name}</p>
                            <p className="text-xs text-muted-foreground">{activity.action}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant="outline" className="mb-1">
                            {activity.role}
                          </Badge>
                          <p className="text-xs text-muted-foreground">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
        )}
      </div>
    </div>
  );
}