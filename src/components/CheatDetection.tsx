import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Alert, AlertDescription } from './ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Shield, 
  ShieldCheck, 
  ShieldAlert, 
  ShieldX,
  Eye,
  Camera,
  Clock,
  Fingerprint,
  Zap,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Scan,
  Activity,
  Brain,
  Lock,
  Unlock,
  Timer,
  MapPin,
  Smartphone,
  Wifi
} from 'lucide-react';

interface CheatDetectionProps {
  videoData?: any;
  isRealTime?: boolean;
  onVerificationComplete?: (result: any) => void;
}

export function CheatDetection({ videoData, isRealTime = false, onVerificationComplete }: CheatDetectionProps) {
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'running' | 'completed'>('pending');
  const [verificationProgress, setVerificationProgress] = useState(0);
  const [activeTab, setActiveTab] = useState('overview');

  const verificationResults = {
    overallScore: 94,
    trustLevel: 'High',
    verified: true,
    checks: {
      videoAuthenticity: {
        score: 96,
        status: 'passed',
        details: 'No signs of digital manipulation detected',
        confidence: 'High'
      },
      motionConsistency: {
        score: 92,
        status: 'passed',
        details: 'Natural human movement patterns detected',
        confidence: 'High'
      },
      deviceVerification: {
        score: 98,
        status: 'passed',
        details: 'Trusted device with secure capture environment',
        confidence: 'High'
      },
      timelineIntegrity: {
        score: 95,
        status: 'passed',
        details: 'No temporal anomalies or speed manipulation',
        confidence: 'High'
      },
      biometricConsistency: {
        score: 89,
        status: 'warning',
        details: 'Minor variations in biometric markers',
        confidence: 'Medium'
      },
      environmentalFactors: {
        score: 91,
        status: 'passed',
        details: 'Consistent lighting and background conditions',
        confidence: 'High'
      }
    },
    riskFactors: [
      {
        type: 'low',
        message: 'Slight biometric variance detected (within normal range)',
        recommendation: 'Monitor future submissions for consistency'
      }
    ],
    blockchain: {
      hash: '0xa1b2c3d4e5f6789...',
      timestamp: '2024-10-01T14:30:00Z',
      verified: true
    }
  };

  const realtimeMetrics = {
    frameAnalysis: {
      totalFrames: 1247,
      processedFrames: 1247,
      suspiciousFrames: 3,
      confidence: 97.8
    },
    motionTracking: {
      naturalMovements: 98.2,
      artificialDetection: 1.8,
      speedConsistency: 94.5,
      accelerationNormal: 96.1
    },
    environmentalConsistency: {
      lightingStability: 92.3,
      backgroundConsistency: 98.7,
      cameraStability: 89.4,
      audioSync: 97.2
    }
  };

  useEffect(() => {
    if (isRealTime) {
      const interval = setInterval(() => {
        setVerificationProgress(prev => {
          if (prev >= 100) {
            setVerificationStatus('completed');
            return 100;
          }
          return prev + Math.random() * 5;
        });
      }, 500);

      return () => clearInterval(interval);
    }
  }, [isRealTime]);

  const startVerification = () => {
    setVerificationStatus('running');
    setVerificationProgress(0);
    
    const interval = setInterval(() => {
      setVerificationProgress(prev => {
        if (prev >= 100) {
          setVerificationStatus('completed');
          onVerificationComplete?.(verificationResults);
          clearInterval(interval);
          return 100;
        }
        return prev + Math.random() * 8;
      });
    }, 300);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'failed': return <XCircle className="w-5 h-5 text-red-600" />;
      default: return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'passed': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'failed': return 'text-red-600';
      default: return 'text-gray-400';
    }
  };

  const getTrustLevelColor = (level: string) => {
    switch (level) {
      case 'High': return 'bg-green-100 text-green-800 border-green-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Low': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Shield className="w-6 h-6 text-primary" />
          <h2 className="text-2xl">Authenticity Verification</h2>
        </div>
        {verificationStatus === 'completed' && (
          <Badge className={`${getTrustLevelColor(verificationResults.trustLevel)} border`}>
            Trust Level: {verificationResults.trustLevel}
          </Badge>
        )}
      </div>

      {/* Real-time Monitoring */}
      {isRealTime && (
        <Alert>
          <Activity className="w-4 h-4" />
          <AlertDescription>
            Real-time authenticity monitoring is active. AI systems are continuously analyzing the video stream for fraud detection.
          </AlertDescription>
        </Alert>
      )}

      {/* Verification Status */}
      {verificationStatus !== 'completed' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scan className="w-5 h-5" />
              {verificationStatus === 'pending' ? 'Ready to Verify' : 'Verification in Progress'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {verificationStatus === 'running' && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Analyzing video authenticity...</span>
                    <span>{Math.round(verificationProgress)}%</span>
                  </div>
                  <Progress value={verificationProgress} />
                </div>
              )}
              
              {verificationStatus === 'pending' && (
                <Button onClick={startVerification} className="w-full">
                  <Shield className="w-4 h-4 mr-2" />
                  Start Authenticity Verification
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Verification Results */}
      {verificationStatus === 'completed' && (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="detailed">Detailed Analysis</TabsTrigger>
            <TabsTrigger value="realtime">Real-time Metrics</TabsTrigger>
            <TabsTrigger value="blockchain">Verification Chain</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm">Overall Score</CardTitle>
                  <ShieldCheck className="w-4 h-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl text-green-600">{verificationResults.overallScore}%</div>
                  <Progress value={verificationResults.overallScore} className="mt-2" />
                  <p className="text-xs text-muted-foreground mt-1">Highly Authentic</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm">Verification Status</CardTitle>
                  {verificationResults.verified ? 
                    <CheckCircle className="w-4 h-4 text-green-600" /> : 
                    <XCircle className="w-4 h-4 text-red-600" />
                  }
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl ${verificationResults.verified ? 'text-green-600' : 'text-red-600'}`}>
                    {verificationResults.verified ? 'Verified' : 'Failed'}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {verificationResults.verified ? 'No fraud detected' : 'Suspicious activity found'}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm">Trust Level</CardTitle>
                  <Shield className="w-4 h-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl">{verificationResults.trustLevel}</div>
                  <p className="text-xs text-muted-foreground mt-1">Confidence rating</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Security Checks Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(verificationResults.checks).map(([key, check]) => (
                    <div key={key} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(check.status)}
                        <div>
                          <p className="text-sm capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                          <p className="text-xs text-muted-foreground">{check.details}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-sm ${getStatusColor(check.status)}`}>
                          {check.score}%
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {check.confidence}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {verificationResults.riskFactors.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-yellow-600" />
                    Risk Assessment
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {verificationResults.riskFactors.map((risk, index) => (
                      <Alert key={index}>
                        <AlertTriangle className="w-4 h-4" />
                        <AlertDescription>
                          <div className="space-y-1">
                            <p>{risk.message}</p>
                            <p className="text-xs text-blue-600">Recommendation: {risk.recommendation}</p>
                          </div>
                        </AlertDescription>
                      </Alert>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="detailed" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Camera className="w-5 h-5" />
                    Video Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Frame Integrity</span>
                        <span>98.7%</span>
                      </div>
                      <Progress value={98.7} />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Metadata Consistency</span>
                        <span>95.2%</span>
                      </div>
                      <Progress value={95.2} />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Compression Analysis</span>
                        <span>97.1%</span>
                      </div>
                      <Progress value={97.1} />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Deepfake Detection</span>
                        <span>99.4%</span>
                      </div>
                      <Progress value={99.4} />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Motion Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Natural Movement</span>
                        <span>94.8%</span>
                      </div>
                      <Progress value={94.8} />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Physics Compliance</span>
                        <span>96.3%</span>
                      </div>
                      <Progress value={96.3} />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Speed Consistency</span>
                        <span>92.7%</span>
                      </div>
                      <Progress value={92.7} />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Biomechanical Accuracy</span>
                        <span>89.2%</span>
                      </div>
                      <Progress value={89.2} />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Smartphone className="w-5 h-5" />
                    Device Verification
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">Device ID</span>
                      <Badge variant="outline">Verified</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Camera Calibration</span>
                      <Badge variant="outline">Authentic</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">GPS Location</span>
                      <Badge variant="outline">Consistent</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Network Security</span>
                      <Badge variant="outline">Secure</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="w-5 h-5" />
                    AI Fraud Detection
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">Pattern Recognition</span>
                      <span className="text-sm text-green-600">Normal</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Anomaly Detection</span>
                      <span className="text-sm text-green-600">No Anomalies</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Behavioral Analysis</span>
                      <span className="text-sm text-green-600">Consistent</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Risk Score</span>
                      <span className="text-sm text-green-600">Low (6%)</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="realtime" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Frame Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Total Frames</p>
                        <p className="text-lg">{realtimeMetrics.frameAnalysis.totalFrames}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Processed</p>
                        <p className="text-lg">{realtimeMetrics.frameAnalysis.processedFrames}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Suspicious</p>
                        <p className="text-lg text-yellow-600">{realtimeMetrics.frameAnalysis.suspiciousFrames}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Confidence</p>
                        <p className="text-lg text-green-600">{realtimeMetrics.frameAnalysis.confidence}%</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Motion Tracking</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(realtimeMetrics.motionTracking).map(([key, value]) => (
                      <div key={key} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                          <span>{value}%</span>
                        </div>
                        <Progress value={value} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Environmental Consistency</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.entries(realtimeMetrics.environmentalConsistency).map(([key, value]) => (
                      <div key={key} className="text-center">
                        <div className="text-2xl mb-1">{value}%</div>
                        <p className="text-xs text-muted-foreground capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </p>
                        <Progress value={value} className="mt-2 h-1" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="blockchain" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="w-5 h-5" />
                  Blockchain Verification
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-muted-foreground">Verification Hash</p>
                        <p className="text-sm bg-muted p-2 rounded break-all">{verificationResults.blockchain.hash}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Timestamp</p>
                        <p className="text-sm">{new Date(verificationResults.blockchain.timestamp).toLocaleString()}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="text-sm">Cryptographically Verified</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="text-sm">Immutable Record</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="text-sm">Tamper-Proof</span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="text-sm mb-3">Verification Chain</h4>
                    <div className="space-y-2">
                      {[
                        { step: 'Video Upload', status: 'Verified', time: '14:30:00' },
                        { step: 'Metadata Extraction', status: 'Verified', time: '14:30:15' },
                        { step: 'Frame Analysis', status: 'Verified', time: '14:31:45' },
                        { step: 'Motion Detection', status: 'Verified', time: '14:32:30' },
                        { step: 'Fraud Check', status: 'Verified', time: '14:33:15' },
                        { step: 'Blockchain Record', status: 'Verified', time: '14:33:45' }
                      ].map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-2 border rounded text-sm">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span>{item.step}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{item.status}</Badge>
                            <span className="text-muted-foreground">{item.time}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}