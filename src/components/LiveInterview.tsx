import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Video, Eye, AlertCircle, Clock, Mic, MicOff, ChevronLeft, ChevronRight, Shield, Zap, Brain, Code2, AlertTriangle } from 'lucide-react';

interface LiveInterviewProps {
  onComplete: (score: number) => void;
  onBack: () => void;
}

interface MonitoringData {
  eyeTracking: 'good' | 'warning' | 'alert';
  faceVisibility: 'complete' | 'partial' | 'not_visible';
  faceCount: number;
}

const LiveInterview = ({ onComplete, onBack }: LiveInterviewProps) => {
  const [isStarted, setIsStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(2700); // 45 minutes
  const [screenRecording, setScreenRecording] = useState(false);
  const [micEnabled, setMicEnabled] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [isDisqualified, setIsDisqualified] = useState(false);
  const [disqualificationReason, setDisqualificationReason] = useState('');
  const [showExitConfirmation, setShowExitConfirmation] = useState(false);
  const [showViolationsPanel, setShowViolationsPanel] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Simplified monitoring states
  const [monitoringData, setMonitoringData] = useState<MonitoringData>({
    eyeTracking: 'good',
    faceVisibility: 'complete',
    faceCount: 1
  });
  
  const [faceNotCompleteTimer, setFaceNotCompleteTimer] = useState(0);
  const [violations, setViolations] = useState<string[]>([]);
  const [criticalViolations, setCriticalViolations] = useState<string[]>([]);
  const [warningViolations, setWarningViolations] = useState<string[]>([]);

  // 10 DSA Coding Questions
  const questions = [
    {
      question: 'Implement a function to reverse a linked list.',
      difficulty: 'Medium',
      points: 10,
      expectedApproach: 'Iterative or recursive reversal'
    },
    {
      question: 'Find the longest palindromic substring in a given string.',
      difficulty: 'Medium',
      points: 10,
      expectedApproach: 'Expand around centers or dynamic programming'
    },
    {
      question: 'Implement binary search in a sorted array.',
      difficulty: 'Easy',
      points: 8,
      expectedApproach: 'Divide and conquer with two pointers'
    },
    {
      question: 'Detect if a linked list has a cycle.',
      difficulty: 'Medium',
      points: 10,
      expectedApproach: 'Floyd\'s cycle detection (tortoise and hare)'
    },
    {
      question: 'Find the maximum depth of a binary tree.',
      difficulty: 'Easy',
      points: 8,
      expectedApproach: 'Recursive DFS or iterative BFS'
    },
    {
      question: 'Merge two sorted arrays in-place.',
      difficulty: 'Medium',
      points: 10,
      expectedApproach: 'Two pointers from end to beginning'
    },
    {
      question: 'Find the first non-repeating character in a string.',
      difficulty: 'Easy',
      points: 8,
      expectedApproach: 'Hash map for frequency counting'
    },
    {
      question: 'Implement a stack using queues.',
      difficulty: 'Medium',
      points: 10,
      expectedApproach: 'Two queues or one queue with rotation'
    },
    {
      question: 'Find the kth largest element in an array.',
      difficulty: 'Medium',
      points: 10,
      expectedApproach: 'Quick select or heap'
    },
    {
      question: 'Check if two strings are anagrams.',
      difficulty: 'Easy',
      points: 8,
      expectedApproach: 'Sorting or character frequency counting'
    }
  ];

  const calculateScore = () => {
    let totalScore = 0;
    let maxScore = questions.reduce((sum, q) => sum + q.points, 0);
    
    questions.forEach((q, index) => {
      const answer = answers[index];
      if (answer && answer.trim().length > 20) {
        const codeQuality = answer.length > 100 ? 0.8 : 0.6;
        totalScore += Math.floor(q.points * codeQuality);
      }
    });
    
    return { totalScore, maxScore };
  };

  const handleDisqualification = (reason: string) => {
    console.log('Student disqualified:', reason);
    setDisqualificationReason(reason);
    setIsDisqualified(true);
    setTimeout(() => {
      onComplete(0); // Zero score for disqualification
    }, 3000);
  };

  const flagViolation = (violation: string, type: 'critical' | 'warning') => {
    const timestamp = new Date().toLocaleTimeString();
    const violationWithTime = `${timestamp}: ${violation}`;
    
    if (type === 'critical') {
      setCriticalViolations(prev => [...prev, violationWithTime]);
    } else {
      setWarningViolations(prev => [...prev, violationWithTime]);
    }
    
    setViolations(prev => [...prev, violationWithTime]);
  };

  // Simulate monitoring - flag violations instead of immediate disqualification
  const simulateMonitoring = () => {
    const eyeStates: MonitoringData['eyeTracking'][] = ['good', 'good', 'good', 'warning', 'alert'];
    const faceVisibilityStates: MonitoringData['faceVisibility'][] = ['complete', 'complete', 'complete', 'partial', 'not_visible'];
    const faceCounts = [0, 1, 1, 1, 1, 2, 3]; // Simulate multiple faces occasionally

    const newEyeTracking = eyeStates[Math.floor(Math.random() * eyeStates.length)];
    const newFaceVisibility = faceVisibilityStates[Math.floor(Math.random() * faceVisibilityStates.length)];
    const newFaceCount = faceCounts[Math.floor(Math.random() * faceCounts.length)];

    const newMonitoringData: MonitoringData = {
      eyeTracking: newEyeTracking,
      faceVisibility: newFaceVisibility,
      faceCount: newFaceCount
    };

    setMonitoringData(newMonitoringData);

    // FLAG VIOLATIONS INSTEAD OF IMMEDIATE DISQUALIFICATION
    
    // 1. Multiple faces detected - CRITICAL VIOLATION
    if (newFaceCount > 1) {
      flagViolation(`Multiple faces detected (${newFaceCount} faces)`, 'critical');
    }

    // 2. No face or face not visible - WARNING VIOLATION
    if (newFaceCount === 0) {
      flagViolation('No face detected', 'warning');
    } else if (newFaceVisibility === 'not_visible') {
      flagViolation('Face not visible', 'warning');
    } else if (newFaceVisibility === 'partial') {
      flagViolation('Partial face visibility', 'warning');
    }

    // 3. Eye tracking violations - WARNING VIOLATIONS
    if (newEyeTracking === 'alert') {
      flagViolation('Looking away from screen', 'warning');
    } else if (newEyeTracking === 'warning') {
      flagViolation('Distracted behavior detected', 'warning');
    }
  };

  useEffect(() => {
    if (isStarted && !isDisqualified) {
      // Simulate camera access
      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then(stream => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch(err => console.log('Camera access denied:', err));

      // Timer
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // Monitoring simulation
      const monitoringTracker = setInterval(simulateMonitoring, 2000);

      return () => {
        clearInterval(timer);
        clearInterval(monitoringTracker);
      };
    }
  }, [isStarted, isDisqualified]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleComplete = () => {
    const { totalScore } = calculateScore();
    console.log('Interview completed with answers:', answers);
    setShowResults(true);
    setTimeout(() => {
      onComplete(totalScore);
    }, 3000);
  };

  const handleBackClick = () => {
    if (isStarted && Object.keys(answers).length > 0) {
      setShowExitConfirmation(true);
    } else {
      onBack();
    }
  };

  const handleConfirmExit = () => {
    setShowExitConfirmation(false);
    onBack();
  };

  const handleCancelExit = () => {
    setShowExitConfirmation(false);
  };

  const getFaceStatusBadgeVariant = () => {
    if (monitoringData.faceCount === 1 && monitoringData.faceVisibility === 'complete') {
      return 'default'; // Green - good
    } else if (monitoringData.faceCount === 1 && monitoringData.faceVisibility === 'partial') {
      return 'secondary'; // Yellow/Orange - acceptable
    } else {
      return 'destructive'; // Red - critical
    }
  };

  const getFaceStatusText = () => {
    if (monitoringData.faceCount === 0) return 'No Face Detected';
    if (monitoringData.faceCount === 1) {
      if (monitoringData.faceVisibility === 'complete') return 'Complete Face ✓';
      if (monitoringData.faceVisibility === 'partial') return 'Partial Face (OK)';
      return 'Face Not Visible';
    }
    return `${monitoringData.faceCount} Faces Detected`;
  };

  if (showResults) {
    const { totalScore, maxScore } = calculateScore();
    const percentage = Math.round((totalScore / maxScore) * 100);
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-600 via-teal-800 to-cyan-900 flex items-center justify-center p-4">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-emerald-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/2 -right-10 w-60 h-60 bg-teal-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute -bottom-10 left-1/2 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
        </div>

        <div className="relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 max-w-4xl w-full shadow-2xl">
          <div className="text-center space-y-6">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/50">
                <Brain className="w-10 h-10 text-white" />
              </div>
              <div className="absolute inset-0 w-20 h-20 bg-emerald-500/30 rounded-full blur-xl mx-auto animate-ping"></div>
            </div>
            
            <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-300 to-cyan-300 bg-clip-text text-transparent">
              Interview Complete
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Score Section */}
              <div className="space-y-6">
                <div className="relative">
                  <div className="text-8xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                    {percentage}%
                  </div>
                  <div className="absolute inset-0 text-8xl font-bold text-emerald-400/20 blur-sm">
                    {percentage}%
                  </div>
                </div>
                
                <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6">
                  <p className="text-2xl font-semibold text-white mb-2">
                    Score: {totalScore}/{maxScore}
                  </p>
                  <p className="text-emerald-200">
                    {percentage >= 70 ? '🚀 Outstanding coding skills!' : 
                     percentage >= 50 ? '⭐ Good problem-solving ability!' : '📚 Keep practicing DSA!'}
                  </p>
                </div>
              </div>

              {/* Violations Report */}
              <div className="space-y-6">
                <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6">
                  <h4 className="font-semibold text-white mb-4 flex items-center justify-center gap-2">
                    <Shield className="w-5 h-5" />
                    Proctoring Report
                  </h4>
                  
                  <div className="space-y-4">
                    {/* Critical Violations */}
                    {criticalViolations.length > 0 && (
                      <div className="bg-red-500/10 border border-red-400/30 rounded-lg p-4">
                        <h5 className="font-semibold text-red-300 mb-2 flex items-center gap-2">
                          <AlertCircle className="w-4 h-4" />
                          Critical Violations ({criticalViolations.length})
                        </h5>
                        <div className="space-y-1 max-h-32 overflow-y-auto">
                          {criticalViolations.slice(-5).map((violation, index) => (
                            <div key={index} className="text-red-200/80 text-sm bg-red-500/10 rounded px-2 py-1">
                              • {violation}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Warning Violations */}
                    {warningViolations.length > 0 && (
                      <div className="bg-yellow-500/10 border border-yellow-400/30 rounded-lg p-4">
                        <h5 className="font-semibold text-yellow-300 mb-2 flex items-center gap-2">
                          <AlertCircle className="w-4 h-4" />
                          Warning Violations ({warningViolations.length})
                        </h5>
                        <div className="space-y-1 max-h-32 overflow-y-auto">
                          {warningViolations.slice(-5).map((violation, index) => (
                            <div key={index} className="text-yellow-200/80 text-sm bg-yellow-500/10 rounded px-2 py-1">
                              • {violation}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* No Violations */}
                    {criticalViolations.length === 0 && warningViolations.length === 0 && (
                      <div className="bg-green-500/10 border border-green-400/30 rounded-lg p-4">
                        <div className="flex items-center justify-center gap-2 text-green-300">
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                          <span className="font-medium">No violations detected</span>
                        </div>
                      </div>
                    )}

                    {/* Summary */}
                    <div className="bg-slate-500/10 border border-slate-400/30 rounded-lg p-4">
                      <div className="flex justify-between text-sm text-slate-300">
                        <span>Total Monitoring Events:</span>
                        <span className="font-medium">{violations.length}</span>
                      </div>
                      <div className="flex justify-between text-sm text-slate-300">
                        <span>Interview Duration:</span>
                        <span className="font-medium">{Math.floor((2700 - timeLeft) / 60)}m {Math.floor((2700 - timeLeft) % 60)}s</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Button 
              onClick={onBack} 
              className="bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-500 hover:to-slate-600 text-white border-0 rounded-xl px-8 py-3 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Return to Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!isStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/2 -right-10 w-60 h-60 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute -bottom-10 left-1/2 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
        </div>

        <div className="relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 max-w-2xl w-full shadow-2xl">
          <div className="text-center space-y-6">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-500/50">
                <Video className="w-10 h-10 text-white" />
              </div>
              <div className="absolute inset-0 w-20 h-20 bg-indigo-500/30 rounded-full blur-xl mx-auto animate-ping"></div>
            </div>
            
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-300 to-pink-300 bg-clip-text text-transparent">
              Live Proctored Interview
            </h1>

            <div className="space-y-6">
              <div className="backdrop-blur-xl bg-indigo-500/10 border border-indigo-300/20 rounded-2xl p-6">
                <h3 className="font-semibold text-indigo-300 mb-4 flex items-center justify-center gap-2">
                  <Zap className="w-5 h-5" />
                  System Requirements
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2 text-indigo-200/80">
                    <div className="w-2 h-2 bg-indigo-400 rounded-full"></div>
                    Camera access required
                  </div>
                  <div className="flex items-center gap-2 text-indigo-200/80">
                    <div className="w-2 h-2 bg-indigo-400 rounded-full"></div>
                    Microphone access
                  </div>
                  <div className="flex items-center gap-2 text-indigo-200/80">
                    <div className="w-2 h-2 bg-indigo-400 rounded-full"></div>
                    Face detection monitoring
                  </div>
                  <div className="flex items-center gap-2 text-indigo-200/80">
                    <div className="w-2 h-2 bg-indigo-400 rounded-full"></div>
                    Duration: 45 minutes
                  </div>
                </div>
              </div>

              <div className="backdrop-blur-xl bg-amber-500/10 border border-amber-300/20 rounded-2xl p-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-6 h-6 text-amber-400 mt-0.5 flex-shrink-0" />
                  <div className="space-y-3">
                    <h4 className="font-medium text-amber-300">Critical Disqualification Rules</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-amber-200/80">
                        <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                        <strong>Multiple faces detected = Immediate disqualification</strong>
                      </div>
                      <div className="flex items-center gap-2 text-amber-200/80">
                        <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                        <strong>No face visible for &gt;10 seconds = Disqualification</strong>
                      </div>
                      <div className="flex items-center gap-2 text-green-300/80">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        Partial face visibility is acceptable
                      </div>
                      <div className="flex items-center gap-2 text-green-300/80">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        Eye tracking violations are monitored only
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex gap-4">
              <Button 
                onClick={handleBackClick} 
                variant="outline" 
                className="flex-1 bg-white/5 border-white/20 text-white hover:bg-white/10 rounded-xl backdrop-blur-sm transition-all duration-300"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
              <Button 
                onClick={() => setIsStarted(true)} 
                className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white border-0 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <Code2 className="w-4 h-4 mr-2" />
                Start Interview
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const answeredCount = Object.keys(answers).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 -right-10 w-60 h-60 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute -bottom-10 left-1/2 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Header */}
      <header className="relative backdrop-blur-xl bg-white/5 border-b border-white/10 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500/20 to-pink-500/20 rounded-full border border-red-300/30 backdrop-blur-sm">
                <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                <span className="text-red-200 font-medium text-sm">LIVE INTERVIEW</span>
              </div>
              
              <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full backdrop-blur-sm border border-white/10">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-white/70 text-sm">Recording</span>
              </div>
              
              <span className="text-white/60 text-sm">
                Question {currentQuestion + 1} of {questions.length}
              </span>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full backdrop-blur-sm border border-white/10">
                <Clock className="w-4 h-4 text-white/70" />
                <span className={`font-mono text-lg font-bold ${timeLeft < 300 ? 'text-red-400' : 'text-white'}`}>
                  {formatTime(timeLeft)}
                </span>
              </div>

              <div className={`px-4 py-2 rounded-full backdrop-blur-sm border ${
                answeredCount === questions.length 
                  ? 'bg-emerald-500/20 border-emerald-300/30 text-emerald-200' 
                  : 'bg-white/5 border-white/10 text-white/70'
              }`}>
                <span className="font-medium">{answeredCount}/{questions.length} Solved</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Interview Interface */}
      <div className="container mx-auto px-6 py-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Video Feed & Monitoring */}
          <Card className="lg:col-span-1">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center justify-between">
                Live Monitoring
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setMicEnabled(!micEnabled)}
                  className={micEnabled ? 'text-green-600' : 'text-red-600'}
                >
                  {micEnabled ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="aspect-video bg-slate-900 rounded-lg overflow-hidden relative">
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-3 left-3 flex items-center space-x-2">
                  <div className="flex items-center space-x-2 bg-black/50 rounded-full px-3 py-1">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="text-white text-xs">LIVE</span>
                  </div>
                </div>
              </div>
              
              {/* Simplified Monitoring Display */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium flex items-center">
                    <Eye className="w-4 h-4 mr-1" />
                    Eye Tracking
                  </span>
                  <Badge variant={
                    monitoringData.eyeTracking === 'good' ? 'default' : 'secondary'
                  }>
                    {monitoringData.eyeTracking === 'good' ? 'Focused' : 
                     monitoringData.eyeTracking === 'warning' ? 'Monitored' : 'Monitored'}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Face Status</span>
                  <Badge variant={getFaceStatusBadgeVariant()}>
                    {getFaceStatusText()}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Monitoring Events</span>
                  <div className="flex space-x-1">
                    {criticalViolations.length > 0 && (
                      <Badge variant="destructive" className="text-xs">
                        {criticalViolations.length} Critical
                      </Badge>
                    )}
                    {warningViolations.length > 0 && (
                      <Badge variant="secondary" className="text-xs">
                        {warningViolations.length} Warnings
                      </Badge>
                    )}
                    {criticalViolations.length === 0 && warningViolations.length === 0 && (
                      <Badge variant="default" className="text-xs">
                        Clean
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Status indicator */}
                <div className="bg-slate-50 p-3 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${
                      monitoringData.faceCount === 1 && (monitoringData.faceVisibility === 'complete' || monitoringData.faceVisibility === 'partial')
                        ? 'bg-green-500'
                        : 'bg-red-500'
                    }`}></div>
                    <span className="text-sm font-medium">
                      {monitoringData.faceCount === 1 && (monitoringData.faceVisibility === 'complete' || monitoringData.faceVisibility === 'partial')
                        ? 'Interview Status: ACTIVE'
                        : 'Interview Status: WARNING'
                      }
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3 border-t pt-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Screen Recording</label>
                  <Switch
                    checked={screenRecording}
                    onCheckedChange={setScreenRecording}
                  />
                </div>
                <Button variant="outline" onClick={handleBackClick} className="w-full">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Coding Area */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">DSA Coding Challenge</CardTitle>
                  <p className="text-slate-600 mt-1">{currentQ.question}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">{currentQ.difficulty}</Badge>
                  <Badge variant="secondary">{currentQ.points} points</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-slate-900 rounded-lg p-4 mb-4">
                <Textarea
                  placeholder={`// ${currentQ.question}
def solution():
    # Write your solution here
    # Expected approach: ${currentQ.expectedApproach}
    
    # Your code goes here
    pass`}
                  value={answers[currentQuestion] || ''}
                  onChange={(e) => setAnswers(prev => ({ ...prev, [currentQuestion]: e.target.value }))}
                  className="h-80 bg-transparent text-green-400 font-mono border-none resize-none focus:ring-0 text-sm"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
                  disabled={currentQuestion === 0}
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>

                <div className="flex items-center space-x-2">
                  {questions.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentQuestion(index)}
                      className={`w-8 h-8 rounded-full text-sm font-medium transition-colors ${
                        index === currentQuestion
                          ? 'bg-red-500 text-white'
                          : answers[index]
                          ? 'bg-green-500 text-white'
                          : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>

                {currentQuestion === questions.length - 1 ? (
                  <Button onClick={handleComplete} className="bg-green-500 hover:bg-green-600">
                    Submit Interview
                  </Button>
                ) : (
                  <Button
                    onClick={() => setCurrentQuestion(prev => Math.min(questions.length - 1, prev + 1))}
                  >
                    Next
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Floating Violations Panel */}
      {isStarted && (
        <div className="fixed bottom-4 right-4 z-40">
          <Button
            onClick={() => setShowViolationsPanel(!showViolationsPanel)}
            className="bg-red-500 hover:bg-red-600 text-white shadow-lg"
          >
            <AlertCircle className="w-4 h-4 mr-2" />
            Violations ({criticalViolations.length + warningViolations.length})
          </Button>
          
          {showViolationsPanel && (
            <Card className="absolute bottom-12 right-0 w-80 max-h-96 bg-white shadow-xl border border-red-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center justify-between">
                  <span>Real-time Violations</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowViolationsPanel(false)}
                    className="h-6 w-6 p-0"
                  >
                    ×
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 max-h-64 overflow-y-auto">
                {criticalViolations.length === 0 && warningViolations.length === 0 ? (
                  <div className="text-center text-green-600 text-sm py-4">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      ✓
                    </div>
                    No violations detected
                  </div>
                ) : (
                  <>
                    {criticalViolations.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="font-semibold text-red-600 text-sm flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          Critical ({criticalViolations.length})
                        </h4>
                        <div className="space-y-1">
                          {criticalViolations.slice(-3).map((violation, index) => (
                            <div key={index} className="text-xs bg-red-50 text-red-700 p-2 rounded border border-red-200">
                              {violation}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {warningViolations.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="font-semibold text-yellow-600 text-sm flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          Warnings ({warningViolations.length})
                        </h4>
                        <div className="space-y-1">
                          {warningViolations.slice(-3).map((violation, index) => (
                            <div key={index} className="text-xs bg-yellow-50 text-yellow-700 p-2 rounded border border-yellow-200">
                              {violation}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Exit Confirmation Dialog */}
      {showExitConfirmation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4 bg-white">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-xl">Leave Interview?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-600 text-center">
                You have answered {Object.keys(answers).length} questions. 
                Are you sure you want to leave? Your progress will be lost.
              </p>
              <div className="flex space-x-3">
                <Button 
                  variant="outline" 
                  onClick={handleCancelExit} 
                  className="flex-1"
                >
                  Continue Interview
                </Button>
                <Button 
                  onClick={handleConfirmExit} 
                  className="flex-1 bg-red-500 hover:bg-red-600"
                >
                  Leave Interview
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default LiveInterview;