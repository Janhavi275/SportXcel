import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Download, 
  Share2, 
  ArrowLeft, 
  TrendingUp, 
  TrendingDown, 
  Target,
  Activity,
  Clock,
  Users,
  Star,
  AlertTriangle,
  CheckCircle,
  BarChart3
} from 'lucide-react';

interface AnalysisReportProps {
  analysisData: any;
  onBack: () => void;
  userRole: string;
}

export function AnalysisReport({ analysisData, onBack, userRole }: AnalysisReportProps) {
  const [activeTab, setActiveTab] = useState('summary');

  const mockPerformanceComparison = {
    speed: { user: 15.2, average: 12.8, percentile: 78 },
    endurance: { user: 42, average: 35, percentile: 85 },
    technique: { user: 82, average: 70, percentile: 91 },
    efficiency: { user: 88, average: 75, percentile: 76 }
  };

  const mockTaskAnalysis = {
    tasksCompleted: 45,
    averageHuman: 32,
    timeEfficiency: 92,
    accuracyScore: 89,
    consistencyRating: 84
  };

  const mockOfficialReview = {
    reviewer: 'Coach Martinez',
    reviewDate: '2024-10-01',
    overallRating: 4.5,
    technicalScore: 87,
    comments: 'Excellent form consistency. Focus on follow-through timing.',
    approved: true,
    recommendations: [
      'Increase practice frequency for serve technique',
      'Work on footwork stability',
      'Maintain current training intensity'
    ]
  };

  const getPerformanceIcon = (value: number, average: number) => {
    if (value > average) return <TrendingUp className="w-4 h-4 text-green-600" />;
    if (value < average) return <TrendingDown className="w-4 h-4 text-red-600" />;
    return <Target className="w-4 h-4 text-yellow-600" />;
  };

  const getPerformanceColor = (percentile: number) => {
    if (percentile >= 90) return 'text-green-600';
    if (percentile >= 70) return 'text-blue-600';
    if (percentile >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl">Analysis Report</h1>
              <p className="text-muted-foreground">
                Detailed performance analysis and recommendations
              </p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Button>
              <Download className="w-4 h-4 mr-2" />
              Export PDF
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="comparison">Human Comparison</TabsTrigger>
            <TabsTrigger value="official">Official Review</TabsTrigger>
          </TabsList>

          <TabsContent value="summary" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm">Overall Score</CardTitle>
                  <Activity className="w-4 h-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl">{analysisData?.overallScore || 85}%</div>
                  <Progress value={analysisData?.overallScore || 85} className="mt-2" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm">Tasks Completed</CardTitle>
                  <Target className="w-4 h-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl">{mockTaskAnalysis.tasksCompleted}</div>
                  <p className="text-xs text-muted-foreground">
                    +{mockTaskAnalysis.tasksCompleted - mockTaskAnalysis.averageHuman} above average
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm">Efficiency</CardTitle>
                  <Clock className="w-4 h-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl">{mockTaskAnalysis.timeEfficiency}%</div>
                  <Progress value={mockTaskAnalysis.timeEfficiency} className="mt-2" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm">Accuracy</CardTitle>
                  <CheckCircle className="w-4 h-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl">{mockTaskAnalysis.accuracyScore}%</div>
                  <Progress value={mockTaskAnalysis.accuracyScore} className="mt-2" />
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Key Findings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                      <div>
                        <p className="text-sm">Excellent technique consistency</p>
                        <p className="text-xs text-muted-foreground">92% consistency across all movements</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <TrendingUp className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <p className="text-sm">Above average performance</p>
                        <p className="text-xs text-muted-foreground">78th percentile in your sport category</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                      <div>
                        <p className="text-sm">Room for improvement in endurance</p>
                        <p className="text-xs text-muted-foreground">Focus on cardiovascular training</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recommendations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {analysisData?.recommendations?.map((rec: string, index: number) => (
                      <div key={index} className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm text-blue-800">{rec}</p>
                      </div>
                    )) || [
                      'Increase training frequency by 15%',
                      'Focus on technique refinement',
                      'Add flexibility exercises to routine'
                    ].map((rec, index) => (
                      <div key={index} className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm text-blue-800">{rec}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Object.entries(mockPerformanceComparison).map(([metric, data]) => (
                    <div key={metric} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm capitalize">{metric}</h4>
                        {getPerformanceIcon(data.user, data.average)}
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Your Score</span>
                          <span>{data.user}{metric === 'speed' ? ' mph' : metric === 'endurance' ? ' min' : '%'}</span>
                        </div>
                        <Progress value={(data.user / data.average) * 50} className="h-2" />
                        
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Average: {data.average}{metric === 'speed' ? ' mph' : metric === 'endurance' ? ' min' : '%'}</span>
                          <span className={getPerformanceColor(data.percentile)}>
                            {data.percentile}th percentile
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Progress Tracking</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="text-sm">Last Analysis</p>
                      <p className="text-xs text-muted-foreground">September 28, 2024</p>
                    </div>
                    <Badge variant="outline">Score: 78%</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border rounded-lg bg-green-50">
                    <div>
                      <p className="text-sm">Current Analysis</p>
                      <p className="text-xs text-muted-foreground">October 1, 2024</p>
                    </div>
                    <Badge variant="default">Score: 85%</Badge>
                  </div>
                  
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <TrendingUp className="w-6 h-6 text-green-600 mx-auto mb-2" />
                    <p className="text-sm">+7% improvement from last analysis</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="comparison" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Human Performance Comparison
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl text-blue-600 mb-2">{mockTaskAnalysis.tasksCompleted}</div>
                      <p className="text-sm">Your Tasks</p>
                    </div>
                    
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl text-muted-foreground mb-2">{mockTaskAnalysis.averageHuman}</div>
                      <p className="text-sm">Average Human</p>
                    </div>
                    
                    <div className="text-center p-4 border rounded-lg bg-green-50">
                      <div className="text-2xl text-green-600 mb-2">+{mockTaskAnalysis.tasksCompleted - mockTaskAnalysis.averageHuman}</div>
                      <p className="text-sm">Above Average</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-lg">Performance Breakdown</h4>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Task Completion Rate</span>
                        <div className="flex items-center gap-2">
                          <Progress value={75} className="w-24" />
                          <span className="text-sm">140% of average</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Speed & Efficiency</span>
                        <div className="flex items-center gap-2">
                          <Progress value={85} className="w-24" />
                          <span className="text-sm">123% of average</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Accuracy</span>
                        <div className="flex items-center gap-2">
                          <Progress value={89} className="w-24" />
                          <span className="text-sm">119% of average</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="text-sm mb-2">AI Insights</h4>
                    <p className="text-sm text-blue-800">
                      Your performance is in the top 15% of athletes in your category. 
                      You demonstrate exceptional task completion efficiency and above-average 
                      technical execution compared to the general population.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {userRole !== 'official' && (
            <TabsContent value="official" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="w-5 h-5" />
                    Official Review
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="text-sm">Reviewed by: {mockOfficialReview.reviewer}</p>
                        <p className="text-xs text-muted-foreground">Date: {mockOfficialReview.reviewDate}</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 mb-1">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`w-4 h-4 ${i < Math.floor(mockOfficialReview.overallRating) ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} 
                            />
                          ))}
                        </div>
                        <p className="text-xs text-muted-foreground">{mockOfficialReview.overallRating}/5.0</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 border rounded-lg">
                        <h4 className="text-sm mb-2">Technical Score</h4>
                        <div className="text-2xl mb-2">{mockOfficialReview.technicalScore}%</div>
                        <Progress value={mockOfficialReview.technicalScore} />
                      </div>
                      
                      <div className="p-4 border rounded-lg">
                        <h4 className="text-sm mb-2">Status</h4>
                        <Badge variant={mockOfficialReview.approved ? 'default' : 'destructive'} className="mb-2">
                          {mockOfficialReview.approved ? 'Approved' : 'Needs Improvement'}
                        </Badge>
                      </div>
                    </div>

                    <div className="p-4 bg-muted rounded-lg">
                      <h4 className="text-sm mb-2">Official Comments</h4>
                      <p className="text-sm">{mockOfficialReview.comments}</p>
                    </div>

                    <div>
                      <h4 className="text-sm mb-3">Official Recommendations</h4>
                      <div className="space-y-2">
                        {mockOfficialReview.recommendations.map((rec, index) => (
                          <div key={index} className="flex items-start gap-2 p-3 border rounded-lg">
                            <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                            <p className="text-sm">{rec}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
}