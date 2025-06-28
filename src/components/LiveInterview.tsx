import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Video, Eye, AlertCircle, Clock, Mic, MicOff, ChevronLeft, ChevronRight } from 'lucide-react';

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
  const videoRef = useRef<HTMLVideoElement>(null);

  // Simplified monitoring states
  const [monitoringData, setMonitoringData] = useState<MonitoringData>({
    eyeTracking: 'good',
    faceVisibility: 'complete',
    faceCount: 1
  });
  
  const [faceNotCompleteTimer, setFaceNotCompleteTimer] = useState(0);
  const [violations, setViolations] = useState<string[]>([]);

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

  // Simulate monitoring - only face detection matters for disqualification
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

    // CRITICAL DISQUALIFICATION CRITERIA - Only face-related violations
    
    // 1. Multiple faces detected - IMMEDIATE DISQUALIFICATION
    if (newFaceCount > 1) {
      const violation = `Multiple faces detected (${newFaceCount} faces) - CRITICAL`;
      setViolations(prev => [...prev, violation]);
      handleDisqualification('Multiple faces detected in the frame');
      return;
    }

    // 2. No face or face not visible - Timer-based disqualification (10 seconds)
    if (newFaceCount === 0 || newFaceVisibility === 'not_visible') {
      setFaceNotCompleteTimer(prev => {
        const newTimer = prev + 1;
        if (newTimer >= 5) { // 10 seconds (since this runs every 2 seconds, 5 * 2 = 10)
          const reason = newFaceCount === 0 
            ? 'No face detected for more than 10 seconds'
            : 'Face not visible for more than 10 seconds';
          handleDisqualification(reason);
          return 0;
        }
        return newTimer;
      });
      
      // Log violations but don't disqualify immediately
      if (newFaceCount === 0) {
        setViolations(prev => [...prev, 'No face detected - WARNING']);
      } else if (newFaceVisibility === 'not_visible') {
        setViolations(prev => [...prev, 'Face not visible - WARNING']);
      }
    } 
    // 3. Partial face visibility - Reset timer but log violation (NOT disqualifying)
    else if (newFaceVisibility === 'partial') {
      setFaceNotCompleteTimer(0); // Reset timer - partial face is acceptable
      setViolations(prev => [...prev, 'Partial face visibility - MONITORED (No disqualification)']);
    }
    // 4. Complete face and single person - Reset timer and all is good
    else {
      setFaceNotCompleteTimer(0); // Reset timer when face is complete and single
    }

    // NON-DISQUALIFYING VIOLATIONS - Just log for monitoring
    
    // Eye tracking violations - log but NEVER disqualify
    if (newEyeTracking === 'alert') {
      setViolations(prev => [...prev, 'Looking away from screen - MONITORED (No disqualification)']);
    } else if (newEyeTracking === 'warning') {
      setViolations(prev => [...prev, 'Distracted behavior - MONITORED (No disqualification)']);
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

  // Disqualification Screen
  if (isDisqualified) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-100 to-red-200 flex items-center justify-center">
        <Card className="w-full max-w-2xl mx-4 border-red-500">
          <CardHeader className="text-center bg-red-50">
            <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl text-red-800">Interview Terminated</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4 pt-6">
            <div className="text-xl font-semibold text-red-700">DISQUALIFIED</div>
            <p className="text-red-600 font-medium">{disqualificationReason}</p>
            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
              <h4 className="font-semibold text-red-800 mb-2">Violation Details:</h4>
              <ul className="text-red-700 text-sm space-y-1 text-left">
                {violations.slice(-5).map((violation, index) => (
                  <li key={index}>• {violation}</li>
                ))}
              </ul>
            </div>
            <p className="text-sm text-red-600">
              Your interview has been terminated due to critical face detection violations. Final Score: 0/100
            </p>
            <Button onClick={onBack} variant="outline" className="mt-4">
              Return to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (showResults) {
    const { totalScore, maxScore } = calculateScore();
    const percentage = Math.round((totalScore / maxScore) * 100);
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-red-50 flex items-center justify-center">
        <Card className="w-full max-w-2xl mx-4">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Live Interview Results</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="text-6xl font-bold text-red-600">{percentage}%</div>
            <p className="text-xl">Score: {totalScore}/{maxScore}</p>
            <p className="text-slate-600">
              {percentage >= 70 ? 'Outstanding coding skills!' : 
               percentage >= 50 ? 'Good problem-solving ability!' : 'Keep practicing DSA!'}
            </p>
            <div className="bg-slate-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Proctoring Summary:</h4>
              <p className="text-sm text-slate-600">{violations.length} monitoring events detected during the interview</p>
              <p className="text-xs text-green-600 mt-1">✓ No critical violations - Interview completed successfully</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-red-50 flex items-center justify-center">
        <Card className="w-full max-w-2xl mx-4">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Video className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl">Live Proctored Interview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-red-50 p-4 rounded-lg">
              <h3 className="font-semibold text-red-800 mb-2">Requirements:</h3>
              <ul className="text-red-700 text-sm space-y-1">
                <li>• Camera access required for proctoring</li>
                <li>• Microphone access for verbal responses</li>
                <li>• Face detection monitoring</li>
                <li>• Eye tracking monitoring (informational only)</li>
                <li>• Screen recording is optional</li>
                <li>• Duration: 45 minutes</li>
              </ul>
            </div>

            <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
              <div className="flex items-start space-x-2">
                <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-amber-800">Disqualification Rules (Only 2 Rules)</h4>
                  <ul className="text-amber-700 text-sm mt-1 space-y-1">
                    <li>• <strong>Multiple faces detected = Immediate disqualification</strong></li>
                    <li>• <strong>No face visible for {'>'}10 seconds = Disqualification</strong></li>
                    <li>• ✓ Partial face visibility is acceptable</li>
                    <li>• ✓ Any facial expression is allowed</li>
                    <li>• ✓ Eye tracking violations are monitored only</li>
                    <li>• ✓ All other behaviors are monitored but won't disqualify</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-4">
              <Button variant="outline" onClick={onBack} className="flex-1">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
              <Button onClick={() => setIsStarted(true)} className="flex-1 bg-red-500 hover:bg-red-600">
                Start Interview
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const answeredCount = Object.keys(answers).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-red-50">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Badge variant="destructive">LIVE INTERVIEW</Badge>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-slate-600">Recording</span>
              </div>
              <span className="text-sm text-slate-600">
                Question {currentQuestion + 1} of {questions.length}
              </span>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2 text-slate-600">
                <Clock className="w-4 h-4" />
                <span className={`font-mono text-lg ${timeLeft < 300 ? 'text-red-500 font-bold' : ''}`}>
                  {formatTime(timeLeft)}
                </span>
              </div>

              <Badge variant={answeredCount === questions.length ? "default" : "secondary"}>
                {answeredCount}/{questions.length} Solved
              </Badge>
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
                
                {/* Face visibility warning - only for critical violations */}
                {(monitoringData.faceCount === 0 || monitoringData.faceCount > 1 || monitoringData.faceVisibility === 'not_visible') && (
                  <div className="absolute top-3 left-3 right-3">
                    <div className="bg-red-500/80 text-white px-3 py-2 rounded text-sm font-medium">
                      {monitoringData.faceCount === 0 
                        ? `No face detected - WARNING (${faceNotCompleteTimer * 2}s)`
                        : monitoringData.faceCount > 1
                        ? `CRITICAL: Multiple faces detected (${monitoringData.faceCount})`
                        : monitoringData.faceVisibility === 'not_visible'
                        ? `Face not visible - WARNING (${faceNotCompleteTimer * 2}s)`
                        : ''
                      }
                    </div>
                  </div>
                )}
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
                  <Badge variant={violations.length === 0 ? 'default' : 'secondary'}>
                    {violations.length}
                  </Badge>
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
                <Button variant="outline" onClick={onBack} className="w-full">
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
    </div>
  );
};

export default LiveInterview;