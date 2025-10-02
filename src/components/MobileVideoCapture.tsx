import React, { useState, useRef, useEffect } from 'react';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Capacitor } from '@capacitor/core';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { toast } from 'sonner@2.0.3';
import { 
  Camera as CameraIcon,
  Upload,
  Play,
  Square,
  RotateCcw,
  CheckCircle,
  AlertCircle,
  Video
} from 'lucide-react';

interface MobileVideoCaptureProps {
  onVideoCapture: (videoFile: File) => void;
  onAnalyze: () => void;
  selectedSport: string;
  isAnalyzing: boolean;
}

export function MobileVideoCapture({ 
  onVideoCapture, 
  onAnalyze, 
  selectedSport, 
  isAnalyzing 
}: MobileVideoCaptureProps) {
  const [hasVideo, setHasVideo] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const requestCameraPermission = async () => {
    try {
      if (Capacitor.isNativePlatform()) {
        // Use Capacitor Camera plugin for native apps
        const permissions = await Camera.requestPermissions();
        return permissions.camera === 'granted';
      } else {
        // Use web API for browser
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'user' }, 
          audio: true 
        });
        stream.getTracks().forEach(track => track.stop());
        return true;
      }
    } catch (error) {
      console.error('Camera permission denied:', error);
      toast.error('Camera permission is required for video recording');
      return false;
    }
  };

  const startRecording = async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) return;

    try {
      if (Capacitor.isNativePlatform()) {
        // For native apps, we'll need to use a different approach
        // This is a simplified version - you might need a custom plugin
        toast.info('Please use the upload option for video analysis');
        return;
      }

      // Web recording
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: true
      });

      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp9'
      });
      
      mediaRecorderRef.current = mediaRecorder;
      const chunks: BlobPart[] = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        setVideoBlob(blob);
        setPreviewUrl(URL.createObjectURL(blob));
        setHasVideo(true);
        
        // Convert to File object
        const file = new File([blob], `sportxcel-analysis-${Date.now()}.webm`, {
          type: 'video/webm'
        });
        onVideoCapture(file);
        
        toast.success('Video recorded successfully!');
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      
      intervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

    } catch (error) {
      console.error('Failed to start recording:', error);
      toast.error('Failed to start recording. Please try again.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('video/')) {
      toast.error('Please select a valid video file');
      return;
    }

    // Validate file size (max 100MB)
    const maxSize = 100 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error('Video file is too large. Please select a file under 100MB.');
      return;
    }

    try {
      setVideoBlob(file);
      setPreviewUrl(URL.createObjectURL(file));
      setHasVideo(true);
      onVideoCapture(file);
      toast.success('Video uploaded successfully!');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload video');
    }
  };

  const capturePhoto = async () => {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera,
      });

      toast.info('Photo captured! Video recording is recommended for better analysis.');
    } catch (error) {
      console.error('Photo capture failed:', error);
      toast.error('Failed to capture photo');
    }
  };

  const resetCapture = () => {
    setHasVideo(false);
    setVideoBlob(null);
    setRecordingTime(0);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      {/* Sport Selection Display */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Video className="h-5 w-5" />
            Video Analysis Setup
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <span>Selected Sport:</span>
            <Badge variant="secondary">{selectedSport}</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Video Preview */}
      {isRecording && (
        <Card>
          <CardContent className="p-4">
            <div className="relative">
              <video
                ref={videoRef}
                className="w-full h-64 bg-black rounded-lg object-cover"
                muted
                playsInline
              />
              <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full flex items-center gap-2">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                {formatTime(recordingTime)}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Video Preview After Recording/Upload */}
      {hasVideo && previewUrl && !isRecording && (
        <Card>
          <CardContent className="p-4">
            <video
              src={previewUrl}
              controls
              className="w-full h-64 bg-black rounded-lg object-cover"
              playsInline
            />
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="h-4 w-4" />
                <span>Video ready for analysis</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={resetCapture}
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Retake
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recording Controls */}
      {!hasVideo && (
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 gap-4">
              {/* Upload Option */}
              <div>
                <label className="block">
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <Button className="w-full" variant="outline">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Video from Gallery
                  </Button>
                </label>
              </div>

              {/* Recording Option */}
              {!Capacitor.isNativePlatform() && (
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-4">or</p>
                  {!isRecording ? (
                    <Button
                      onClick={startRecording}
                      className="w-full"
                      variant="default"
                    >
                      <CameraIcon className="h-4 w-4 mr-2" />
                      Start Recording
                    </Button>
                  ) : (
                    <Button
                      onClick={stopRecording}
                      className="w-full bg-red-500 hover:bg-red-600"
                    >
                      <Square className="h-4 w-4 mr-2" />
                      Stop Recording ({formatTime(recordingTime)})
                    </Button>
                  )}
                </div>
              )}

              {/* Photo Capture for Native */}
              {Capacitor.isNativePlatform() && (
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-4">or</p>
                  <Button
                    onClick={capturePhoto}
                    className="w-full"
                    variant="outline"
                  >
                    <CameraIcon className="h-4 w-4 mr-2" />
                    Capture Photo
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Analysis Button */}
      {hasVideo && (
        <Card>
          <CardContent className="p-6">
            <Button
              onClick={onAnalyze}
              disabled={isAnalyzing}
              className="w-full"
              size="lg"
            >
              {isAnalyzing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Analyzing Performance...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Analyze Performance
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Tips for Better Analysis */}
      <Card className="bg-blue-50 dark:bg-blue-950/20">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
            <AlertCircle className="h-5 w-5" />
            Tips for Better Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-blue-600 dark:text-blue-400">
          <ul className="space-y-2">
            <li>• Record in good lighting conditions</li>
            <li>• Keep the camera steady during recording</li>
            <li>• Ensure your full body is visible in the frame</li>
            <li>• Record for at least 10-30 seconds of activity</li>
            <li>• Avoid background noise and distractions</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}