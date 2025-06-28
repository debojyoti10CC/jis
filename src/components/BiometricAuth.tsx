import { useState, useRef, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Camera, Shield, Eye, Mic, AlertTriangle, CheckCircle, X, Mail, Lock, User as UserIcon } from 'lucide-react';
import { auth, googleProvider, db } from '@/lib/firebase';
import { signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, User } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

interface BiometricAuthProps {
  onAuthComplete: (user: User, biometricId: string) => void;
  onBack: () => void;
}

interface ViolationLog {
  type: 'face_not_detected' | 'multiple_faces' | 'looking_away' | 'voice_mismatch' | 'prolonged_absence';
  timestamp: number;
  severity: 'warning' | 'critical';
}

const BiometricAuth = ({ onAuthComplete, onBack }: BiometricAuthProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [captureProgress, setCaptureProgress] = useState(0);
  const [violations, setViolations] = useState<ViolationLog[]>([]);
  const [biometricStatus, setBiometricStatus] = useState<'idle' | 'capturing' | 'processing' | 'complete' | 'failed'>('idle');
  const [faceDetected, setFaceDetected] = useState(false);
  const [eyeTracking, setEyeTracking] = useState({ x: 0, y: 0 });
  const [voicePattern, setVoicePattern] = useState(0);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [credentials, setCredentials] = useState({ email: '', password: '', name: '' });
  const [authError, setAuthError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      setAuthError('');
      const result = await signInWithPopup(auth, googleProvider);
      setUser(result.user);
      
      // Check if user already has biometric data
      const userDoc = await getDoc(doc(db, 'users', result.user.uid));
      if (userDoc.exists() && userDoc.data().biometricId) {
        onAuthComplete(result.user, userDoc.data().biometricId);
      } else {
        // Start biometric enrollment
        startBiometricCapture();
      }
    } catch (error: any) {
      console.error('Google Sign-In failed:', error);
      if (error.code === 'auth/unauthorized-domain') {
        setAuthError('Google Sign-In is not available in this environment. Please use email authentication instead.');
      } else {
        setAuthError('Failed to sign in with Google. Please try email authentication.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailAuth = async () => {
    try {
      setIsLoading(true);
      setAuthError('');
      
      let result;
      if (authMode === 'signup') {
        result = await createUserWithEmailAndPassword(auth, credentials.email, credentials.password);
      } else {
        result = await signInWithEmailAndPassword(auth, credentials.email, credentials.password);
      }
      
      setUser(result.user);
      
      // Check if user already has biometric data
      const userDoc = await getDoc(doc(db, 'users', result.user.uid));
      if (userDoc.exists() && userDoc.data().biometricId) {
        onAuthComplete(result.user, userDoc.data().biometricId);
      } else {
        // Start biometric enrollment
        startBiometricCapture();
      }
    } catch (error: any) {
      console.error('Email authentication failed:', error);
      setAuthError(error.message || 'Authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const startBiometricCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 640, height: 480 }, 
        audio: true 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsCapturing(true);
        setBiometricStatus('capturing');
        
        // Start face detection and analysis
        startFaceDetection();
        startVoiceAnalysis();
      }
    } catch (error) {
      console.error('Camera/Microphone access denied:', error);
      setBiometricStatus('failed');
    }
  };

  const startFaceDetection = () => {
    intervalRef.current = setInterval(() => {
      if (videoRef.current && canvasRef.current) {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const video = videoRef.current;
        
        if (ctx && video.videoWidth > 0) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          ctx.drawImage(video, 0, 0);
          
          // Simulate face detection (in real implementation, use ML models)
          const faceDetected = Math.random() > 0.1; // 90% chance of face detection
          setFaceDetected(faceDetected);
          
          // Simulate eye tracking
          setEyeTracking({
            x: Math.random() * 100 - 50,
            y: Math.random() * 100 - 50
          });
          
          // Check for violations
          if (!faceDetected) {
            addViolation('face_not_detected', 'warning');
          }
          
          if (Math.abs(eyeTracking.x) > 40 || Math.abs(eyeTracking.y) > 40) {
            addViolation('looking_away', 'warning');
          }
          
          // Update progress
          setCaptureProgress(prev => {
            const newProgress = Math.min(prev + 2, 100);
            if (newProgress === 100) {
              completeBiometricEnrollment();
            }
            return newProgress;
          });
        }
      }
    }, 100);
  };

  const startVoiceAnalysis = () => {
    // Simulate voice pattern analysis
    const voiceInterval = setInterval(() => {
      setVoicePattern(Math.random() * 100);
    }, 500);
    
    setTimeout(() => clearInterval(voiceInterval), 50000);
  };

  const addViolation = (type: ViolationLog['type'], severity: ViolationLog['severity']) => {
    const newViolation: ViolationLog = {
      type,
      timestamp: Date.now(),
      severity
    };
    
    setViolations(prev => {
      const updated = [...prev, newViolation];
      
      // Three strikes policy
      const criticalViolations = updated.filter(v => v.severity === 'critical').length;
      const recentWarnings = updated.filter(v => 
        v.severity === 'warning' && 
        Date.now() - v.timestamp < 10000
      ).length;
      
      if (criticalViolations >= 3 || recentWarnings >= 5) {
        handleSecurityBreach();
      }
      
      return updated;
    });
  };

  const handleSecurityBreach = () => {
    setBiometricStatus('failed');
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    // In a real app, this would redirect to homepage with security notice
    alert('Security breach detected. Multiple violations recorded.');
    onBack();
  };

  const completeBiometricEnrollment = async () => {
    if (!user) return;
    
    setBiometricStatus('processing');
    
    // Generate biometric ID (in real implementation, this would be encrypted embeddings)
    const biometricId = `bio_${user.uid}_${Date.now()}`;
    
    try {
      // Store biometric data in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        displayName: user.displayName || credentials.name,
        biometricId,
        enrollmentDate: new Date(),
        violations: violations
      });
      
      setBiometricStatus('complete');
      
      // Stop camera
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      
      setTimeout(() => {
        onAuthComplete(user, biometricId);
      }, 2000);
      
    } catch (error) {
      console.error('Failed to store biometric data:', error);
      setBiometricStatus('failed');
    }
  };

  const getStatusColor = () => {
    switch (biometricStatus) {
      case 'capturing': return 'bg-blue-500';
      case 'processing': return 'bg-yellow-500';
      case 'complete': return 'bg-green-500';
      case 'failed': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-blue-900 flex items-center justify-center">
        <Card className="w-full max-w-md mx-4 bg-slate-800/90 backdrop-blur-sm border-slate-700">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl text-white">Secure Authentication</CardTitle>
            <CardDescription className="text-slate-300">
              {authMode === 'signin' ? 'Sign in to your account' : 'Create a new account'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Email Authentication Form */}
            <div className="space-y-4">
              {authMode === 'signup' && (
                <div className="space-y-2">
                  <label htmlFor="name" className="text-slate-300 text-sm">Full Name</label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                    <input
                      id="name"
                      type="text"
                      value={credentials.name}
                      onChange={(e) => setCredentials(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter your full name"
                      className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              )}
              
              <div className="space-y-2">
                <label htmlFor="email" className="text-slate-300 text-sm">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <input
                    id="email"
                    type="email"
                    value={credentials.email}
                    onChange={(e) => setCredentials(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="Enter your email"
                    className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="password" className="text-slate-300 text-sm">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <input
                    id="password"
                    type="password"
                    value={credentials.password}
                    onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {authError && (
              <div className="text-red-400 text-sm bg-red-900/20 border border-red-800 rounded-md p-3">
                {authError}
              </div>
            )}

            <Button 
              onClick={handleEmailAuth}
              disabled={isLoading || !credentials.email || !credentials.password || (authMode === 'signup' && !credentials.name)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isLoading ? 'Please wait...' : authMode === 'signin' ? 'Sign In' : 'Create Account'}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-slate-600" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-slate-800 px-2 text-slate-400">Or continue with</span>
              </div>
            </div>

            <Button 
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              variant="outline"
              className="w-full border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </Button>

            <div className="text-center">
              <button
                onClick={() => setAuthMode(authMode === 'signin' ? 'signup' : 'signin')}
                className="text-blue-400 hover:text-blue-300 text-sm"
              >
                {authMode === 'signin' ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
              </button>
            </div>

            <Button variant="outline" onClick={onBack} className="w-full border-slate-600 text-slate-300 hover:bg-slate-700">
              Back to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-blue-900 p-6">
      <div className="max-w-4xl mx-auto">
        <Card className="bg-slate-800/90 backdrop-blur-sm border-slate-700">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl text-white flex items-center">
                  <Camera className="w-6 h-6 mr-2" />
                  Biometric Enrollment
                </CardTitle>
                <CardDescription className="text-slate-300">
                  Welcome {user.displayName || user.email}! Complete your secure biometric setup
                </CardDescription>
              </div>
              <Badge className={`${getStatusColor()} text-white`}>
                {biometricStatus.toUpperCase()}
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-slate-300">
                <span>Enrollment Progress</span>
                <span>{captureProgress}%</span>
              </div>
              <Progress value={captureProgress} className="h-2" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Video Feed */}
              <div className="space-y-4">
                <div className="relative">
                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    className="w-full h-64 bg-slate-700 rounded-lg object-cover"
                  />
                  <canvas ref={canvasRef} className="hidden" />
                  
                  {/* Face Detection Overlay */}
                  {isCapturing && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className={`w-48 h-48 border-2 rounded-lg ${faceDetected ? 'border-green-400' : 'border-red-400'}`}>
                        <div className="w-full h-full flex items-center justify-center">
                          {faceDetected ? (
                            <CheckCircle className="w-8 h-8 text-green-400" />
                          ) : (
                            <X className="w-8 h-8 text-red-400" />
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {!isCapturing && biometricStatus === 'idle' && (
                  <Button 
                    onClick={startBiometricCapture}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    Start Biometric Enrollment
                  </Button>
                )}
              </div>

              {/* Real-time Metrics */}
              <div className="space-y-4">
                <Card className="bg-slate-700/50 border-slate-600">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-white flex items-center">
                      <Eye className="w-5 h-5 mr-2" />
                      Live Monitoring
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300">Face Detection</span>
                      <Badge variant={faceDetected ? "default" : "destructive"}>
                        {faceDetected ? "Active" : "Not Detected"}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm text-slate-300">
                        <span>Eye Tracking</span>
                        <span>X: {eyeTracking.x.toFixed(1)}, Y: {eyeTracking.y.toFixed(1)}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm text-slate-300">
                        <span>Voice Pattern</span>
                        <span>{voicePattern.toFixed(1)}%</span>
                      </div>
                      <Progress value={voicePattern} className="h-2" />
                    </div>
                  </CardContent>
                </Card>

                {/* Security Violations */}
                <Card className="bg-slate-700/50 border-slate-600">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-white flex items-center">
                      <AlertTriangle className="w-5 h-5 mr-2" />
                      Security Log ({violations.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {violations.length === 0 ? (
                        <p className="text-slate-400 text-sm">No violations detected</p>
                      ) : (
                        violations.map((violation, index) => (
                          <div key={index} className="flex items-center justify-between text-sm">
                            <span className="text-slate-300">{violation.type.replace('_', ' ')}</span>
                            <Badge variant={violation.severity === 'critical' ? "destructive" : "secondary"}>
                              {violation.severity}
                            </Badge>
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {biometricStatus === 'complete' && (
              <div className="text-center">
                <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Enrollment Complete!</h3>
                <p className="text-slate-300">Your biometric profile has been securely stored.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BiometricAuth;
