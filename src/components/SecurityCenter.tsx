import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Alert, AlertDescription } from './ui/alert';
import { 
  Shield, 
  ShieldCheck, 
  ShieldAlert, 
  ShieldX,
  Lock,
  Unlock,
  Eye,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Activity,
  TrendingUp,
  Users,
  FileText,
  Settings,
  Zap,
  Clock,
  BarChart3
} from 'lucide-react';

interface SecurityCenterProps {
  userRole: string;
}

export function SecurityCenter({ userRole }: SecurityCenterProps) {
  const [activeTab, setActiveTab] = useState('overview');

  const securityMetrics = {
    overallScore: 96,
    trustLevel: 'Excellent',
    detectionRate: 99.8,
    falsePositives: 0.2,
    totalScans: 15847,
    threatsBlocked: 23,
    verifiedVideos: 15824
  };

  const recentDetections = [
    {
      id: 1,
      type: 'Video Manipulation',
      severity: 'High',
      user: 'User#4721',
      timestamp: '2024-10-01 14:23:15',
      action: 'Blocked',
      confidence: 97
    },
    {
      id: 2,
      type: 'Speed Manipulation',
      severity: 'Medium',
      user: 'User#3892',
      timestamp: '2024-10-01 11:45:32',
      action: 'Flagged',
      confidence: 85
    },
    {
      id: 3,
      type: 'Deepfake Detection',
      severity: 'High',
      user: 'User#5634',
      timestamp: '2024-09-30 16:12:08',
      action: 'Blocked',
      confidence: 94
    }
  ];

  const systemHealth = {
    apiUptime: 99.97,
    detectionEngine: 'Operational',
    blockchainSync: 'Synchronized',
    aiModels: 'Updated',
    lastUpdate: '2024-10-01 08:00:00'
  };

  const detectionPatterns = [
    { type: 'Frame Interpolation', count: 12, trend: '+2%' },
    { type: 'Speed Alteration', count: 8, trend: '-15%' },
    { type: 'Digital Enhancement', count: 3, trend: '+33%' },
    { type: 'Deepfake', count: 0, trend: '0%' }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'High': return 'text-red-600 bg-red-50 border-red-200';
      case 'Medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'Low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getTrustLevelIcon = (level: string) => {
    switch (level) {
      case 'Excellent': return <ShieldCheck className="w-6 h-6 text-green-600" />;
      case 'Good': return <Shield className="w-6 h-6 text-blue-600" />;
      case 'Warning': return <ShieldAlert className="w-6 h-6 text-yellow-600" />;
      case 'Critical': return <ShieldX className="w-6 h-6 text-red-600" />;
      default: return <Shield className="w-6 h-6 text-gray-600" />;
    }
  };

  const getTrustLevelColor = (level: string) => {
    switch (level) {
      case 'Excellent': return 'bg-green-100 text-green-800 border-green-200';
      case 'Good': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Warning': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Critical': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (userRole === 'athlete') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-6 h-6 text-primary" />
            <h2 className="text-2xl">Security Status</h2>
          </div>
          <Badge className={`${getTrustLevelColor(securityMetrics.trustLevel)} border`}>
            {securityMetrics.trustLevel} Security
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm">Your Trust Score</CardTitle>
              {getTrustLevelIcon(securityMetrics.trustLevel)}
            </CardHeader>
            <CardContent>
              <div className="text-2xl">{securityMetrics.overallScore}%</div>
              <Progress value={securityMetrics.overallScore} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-1">High integrity rating</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm">Videos Verified</CardTitle>
              <CheckCircle className="w-4 h-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl">12</div>
              <p className="text-xs text-muted-foreground mt-1">All authentic</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm">Security Level</CardTitle>
              <Lock className="w-4 h-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl">Maximum</div>
              <p className="text-xs text-muted-foreground mt-1">All checks enabled</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Your Security Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { feature: 'Video Authenticity Check', status: 'Active', description: 'Every video is scanned for manipulation' },
                { feature: 'Motion Pattern Analysis', status: 'Active', description: 'AI detects unnatural movements' },
                { feature: 'Device Verification', status: 'Active', description: 'Camera and device integrity confirmed' },
                { feature: 'Blockchain Verification', status: 'Active', description: 'Results are cryptographically secured' }
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="text-sm">{item.feature}</p>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                    <Badge variant="outline" className="mt-1 text-xs">
                      {item.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Admin/Official view
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Shield className="w-6 h-6 text-primary" />
          <h2 className="text-2xl">Security Center</h2>
        </div>
        <Badge className={`${getTrustLevelColor(securityMetrics.trustLevel)} border`}>
          System Health: {securityMetrics.trustLevel}
        </Badge>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="detections">Detections</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm">Security Score</CardTitle>
                <ShieldCheck className="w-4 h-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl">{securityMetrics.overallScore}%</div>
                <Progress value={securityMetrics.overallScore} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm">Detection Rate</CardTitle>
                <Eye className="w-4 h-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl">{securityMetrics.detectionRate}%</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {securityMetrics.threatsBlocked} threats blocked
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm">Total Scans</CardTitle>
                <Activity className="w-4 h-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl">{securityMetrics.totalScans.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {securityMetrics.verifiedVideos.toLocaleString()} verified
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm">False Positives</CardTitle>
                <TrendingUp className="w-4 h-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl">{securityMetrics.falsePositives}%</div>
                <p className="text-xs text-muted-foreground mt-1">Very low rate</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>System Health</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">API Uptime</span>
                    <div className="text-right">
                      <div className="text-sm">{systemHealth.apiUptime}%</div>
                      <Progress value={systemHealth.apiUptime} className="w-20 h-2" />
                    </div>
                  </div>

                  {[
                    { label: 'Detection Engine', status: systemHealth.detectionEngine },
                    { label: 'Blockchain Sync', status: systemHealth.blockchainSync },
                    { label: 'AI Models', status: systemHealth.aiModels }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm">{item.label}</span>
                      <Badge variant="outline" className="text-green-600">
                        {item.status}
                      </Badge>
                    </div>
                  ))}

                  <div className="flex items-center justify-between text-xs text-muted-foreground border-t pt-3">
                    <span>Last Update</span>
                    <span>{systemHealth.lastUpdate}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Detection Patterns</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {detectionPatterns.map((pattern, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="text-sm">{pattern.type}</p>
                        <p className="text-xs text-muted-foreground">
                          {pattern.count} detected this week
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline">{pattern.trend}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="detections" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Security Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentDetections.map((detection) => (
                  <div key={detection.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className={`w-3 h-3 rounded-full ${
                        detection.severity === 'High' ? 'bg-red-500' :
                        detection.severity === 'Medium' ? 'bg-yellow-500' :
                        'bg-green-500'
                      }`}></div>
                      
                      <div>
                        <p className="text-sm">{detection.type}</p>
                        <p className="text-xs text-muted-foreground">
                          {detection.user} • {detection.timestamp}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Badge className={getSeverityColor(detection.severity)}>
                        {detection.severity}
                      </Badge>
                      <Badge variant="outline">
                        {detection.confidence}% confidence
                      </Badge>
                      <Badge variant={detection.action === 'Blocked' ? 'destructive' : 'secondary'}>
                        {detection.action}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Alert Configuration</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { type: 'High Severity Threats', enabled: true },
                    { type: 'Medium Severity Threats', enabled: true },
                    { type: 'Unusual Activity Patterns', enabled: false },
                    { type: 'System Performance Issues', enabled: true }
                  ].map((alert, index) => (
                    <div key={index} className="flex items-center justify-between p-2 border rounded">
                      <span className="text-sm">{alert.type}</span>
                      <Badge variant={alert.enabled ? 'default' : 'outline'}>
                        {alert.enabled ? 'Enabled' : 'Disabled'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Response Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Generate Security Report
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Users className="w-4 h-4 mr-2" />
                    Review Flagged Users
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Settings className="w-4 h-4 mr-2" />
                    Update Detection Rules
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <FileText className="w-4 h-4 mr-2" />
                    Export Audit Log
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Detection Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center p-8 border-2 border-dashed rounded-lg">
                    <BarChart3 className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-sm text-muted-foreground">
                      Analytics charts would be displayed here showing detection trends over time
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Risk Assessment</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl text-green-600">Low</div>
                      <p className="text-xs text-muted-foreground">Current Risk</p>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl text-blue-600">Stable</div>
                      <p className="text-xs text-muted-foreground">Trend</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>System Vulnerability</span>
                      <span className="text-green-600">2%</span>
                    </div>
                    <Progress value={2} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Threat Level</span>
                      <span className="text-green-600">5%</span>
                    </div>
                    <Progress value={5} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Detection Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm">Detection Sensitivity</label>
                    <div className="flex items-center gap-4">
                      <span className="text-xs">Low</span>
                      <Progress value={80} className="flex-1" />
                      <span className="text-xs">High</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Current: High (80%)</p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm">Auto-block Threshold</label>
                    <div className="flex items-center gap-4">
                      <span className="text-xs">50%</span>
                      <Progress value={70} className="flex-1" />
                      <span className="text-xs">95%</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Current: 85% confidence</p>
                  </div>

                  <div className="pt-4 border-t">
                    <h4 className="text-sm mb-3">Verification Features</h4>
                    <div className="space-y-2">
                      {[
                        'Video Authenticity Check',
                        'Motion Pattern Analysis',
                        'Device Fingerprinting',
                        'Blockchain Verification',
                        'Real-time Monitoring'
                      ].map((feature, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-sm">{feature}</span>
                          <Badge variant="default">Enabled</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Configuration</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Alert>
                    <Shield className="w-4 h-4" />
                    <AlertDescription>
                      Security settings require administrator privileges to modify.
                    </AlertDescription>
                  </Alert>

                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start" disabled>
                      <Zap className="w-4 h-4 mr-2" />
                      Update AI Models
                    </Button>
                    <Button variant="outline" className="w-full justify-start" disabled>
                      <Lock className="w-4 h-4 mr-2" />
                      Modify Encryption Keys
                    </Button>
                    <Button variant="outline" className="w-full justify-start" disabled>
                      <Settings className="w-4 h-4 mr-2" />
                      Advanced Configuration
                    </Button>
                  </div>

                  <div className="pt-4 border-t text-xs text-muted-foreground">
                    <p>Last security update: {systemHealth.lastUpdate}</p>
                    <p>Next scheduled update: 2024-10-08 08:00:00</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}