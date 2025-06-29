import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  User, 
  BookOpen, 
  Video, 
  MessageSquare, 
  Trophy, 
  ArrowLeft, 
  Play, 
  Clock, 
  Star, 
  TrendingUp, 
  Calendar, 
  Award, 
  Target, 
  Zap,
  ChevronRight,
  Download,
  Share2,
  Bell,
  Settings,
  Medal,
  BarChart3,
  Brain,
  Code,
  Users,
  CheckCircle,
  XCircle,
  AlertCircle,
  Sparkles
} from 'lucide-react';
import TechnicalRound from './TechnicalRound';
import LiveInterview from './LiveInterview';
import HRSimulation from './HRSimulation';

interface CandidatePortalProps {
  onBack: () => void;
  userInfo: any;
}

const CandidatePortal = ({ onBack, userInfo }: CandidatePortalProps) => {
  const [currentRound, setCurrentRound] = useState('dashboard');
  const [completedRounds, setCompletedRounds] = useState(['technical']);
  const [scores, setScores] = useState({
    technical: { score: 22, percentage: 88 },
    live: { score: 8, percentage: 80 },
  });
  const [currentTime, setCurrentTime] = useState(new Date());
  const [notifications, setNotifications] = useState([
    { id: 1, message: "Technical round completed successfully!", type: "success", time: "2 hours ago" },
    { id: 2, message: "Live interview scheduled for tomorrow", type: "info", time: "1 day ago" },
  ]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleRoundComplete = (round, score, percentage) => {
    setCompletedRounds(prev => [...prev, round]);
    setScores(prev => ({ ...prev, [round]: { score, percentage } }));
    setCurrentRound('dashboard');
  };

  const rounds = [
    {
      id: 'technical',
      title: 'Technical Assessment',
      subtitle: 'Core Programming Skills',
      description: '25 questions covering DSA, Quantitative, and Aptitude',
      detailedDescription: 'Comprehensive evaluation of your technical knowledge including algorithms, data structures, problem-solving abilities, and quantitative reasoning.',
      duration: '60 minutes',
      icon: BookOpen,
      color: 'from-blue-500 to-cyan-500',
      difficulty: 'Intermediate',
      topics: ['Algorithms', 'Data Structures', 'Mathematics', 'Logic'],
      passingScore: 70
    },
    {
      id: 'live',
      title: 'Live Coding Interview',
      subtitle: 'Real-time Problem Solving',
      description: '10 coding problems with real-time evaluation',
      detailedDescription: 'Interactive coding session with live feedback, focusing on problem-solving approach, code quality, and communication skills.',
      duration: '90 minutes',
      icon: Video,
      color: 'from-red-500 to-pink-500',
      difficulty: 'Advanced',
      topics: ['Live Coding', 'System Design', 'Debugging', 'Communication'],
      passingScore: 75
    },
    {
      id: 'hr',
      title: 'HR Interview Simulation',
      subtitle: 'Behavioral Assessment',
      description: 'AI-powered behavioral assessment',
      detailedDescription: 'Comprehensive behavioral evaluation focusing on cultural fit, communication skills, leadership potential, and professional values.',
      duration: '45 minutes',
      icon: MessageSquare,
      color: 'from-purple-500 to-indigo-500',
      difficulty: 'Beginner',
      topics: ['Communication', 'Leadership', 'Teamwork', 'Culture Fit'],
      passingScore: 65
    }
  ];

  const achievements = [
    { id: 1, title: 'Quick Starter', description: 'Completed first assessment', icon: Zap, earned: true },
    { id: 2, title: 'High Performer', description: 'Scored above 85%', icon: Trophy, earned: true },
    { id: 3, title: 'Consistent', description: 'Maintained good performance', icon: Target, earned: false },
    { id: 4, title: 'Interview Ready', description: 'Completed all rounds', icon: Award, earned: false },
  ];

  const overallProgress = (completedRounds.length / rounds.length) * 100;
  const averageScore = completedRounds.length > 0 
    ? Object.values(scores).reduce((sum, { percentage }) => sum + percentage, 0) / completedRounds.length 
    : 0;

  const getScoreColor = (percentage) => {
    if (percentage >= 85) return 'text-green-400';
    if (percentage >= 70) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getStatusIcon = (roundId) => {
    const isCompleted = completedRounds.includes(roundId);
    const score = scores[roundId]?.percentage || 0;
    const passingScore = rounds.find(r => r.id === roundId)?.passingScore || 70;
    
    if (!isCompleted) return <Clock className="w-5 h-5 text-slate-400" />;
    if (score >= passingScore) return <CheckCircle className="w-5 h-5 text-green-400" />;
    return <XCircle className="w-5 h-5 text-red-400" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse delay-500"></div>
      </div>

      {/* Conditional Rendering for Different Rounds */}
      {currentRound === 'technical' && (
        <TechnicalRound 
          onComplete={handleRoundComplete}
          onBack={() => setCurrentRound('dashboard')}
        />
      )}

      {currentRound === 'live' && (
        <LiveInterview 
          onComplete={(score) => handleRoundComplete('live', score, (score / 10) * 100)}
          onBack={() => setCurrentRound('dashboard')}
        />
      )}

      {currentRound === 'hr' && (
        <HRSimulation 
          onComplete={() => handleRoundComplete('hr', 0, 75)} // Default score for HR
          onBack={() => setCurrentRound('dashboard')}
        />
      )}

      {/* Dashboard View */}
      {currentRound === 'dashboard' && (
        <div className="relative z-10 p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <Button
                variant="outline"
                onClick={onBack}
                className="bg-white/10 backdrop-blur-md text-white border-white/20 hover:bg-white/20 transition-all duration-300"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
              
              <div className="text-center">
                <h1 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Interview Dashboard
                </h1>
                <p className="text-slate-300 text-lg">Welcome back, {userInfo?.displayName || 'Candidate'}!</p>
                <p className="text-slate-400 text-sm mt-1">
                  {currentTime.toLocaleDateString()} • {currentTime.toLocaleTimeString()}
                </p>
              </div>
              
              <div className="flex items-center space-x-4">
                <Button variant="outline" className="bg-white/10 backdrop-blur-md text-white border-white/20 hover:bg-white/20">
                  <Bell className="w-4 h-4" />
                </Button>
                <Button variant="outline" className="bg-white/10 backdrop-blur-md text-white border-white/20 hover:bg-white/20">
                  <Settings className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-300 text-sm font-medium">Overall Progress</p>
                      <p className="text-3xl font-bold text-white">{overallProgress.toFixed(0)}%</p>
                      <p className="text-xs text-slate-400 mt-1">
                        {completedRounds.length} of {rounds.length} completed
                      </p>
                    </div>
                    <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-3 rounded-full">
                      <Trophy className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <Progress value={overallProgress} className="mt-4 h-2" />
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-300 text-sm font-medium">Average Score</p>
                      <p className={`text-3xl font-bold ${getScoreColor(averageScore)}`}>
                        {averageScore.toFixed(1)}%
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        {averageScore >= 85 ? 'Excellent' : averageScore >= 70 ? 'Good' : 'Needs Improvement'}
                      </p>
                    </div>
                    <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-3 rounded-full">
                      <BarChart3 className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-300 text-sm font-medium">Achievements</p>
                      <p className="text-3xl font-bold text-white">
                        {achievements.filter(a => a.earned).length}
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        {achievements.filter(a => !a.earned).length} pending
                      </p>
                    </div>
                    <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-3 rounded-full">
                      <Medal className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-300 text-sm font-medium">Rank</p>
                      <p className="text-3xl font-bold text-white">#12</p>
                      <p className="text-xs text-slate-400 mt-1">
                        Top 15% of candidates
                      </p>
                    </div>
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-full">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-8">
                {/* Interview Rounds */}
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                    <Brain className="w-6 h-6 mr-2" />
                    Interview Rounds
                  </h2>
                  <div className="space-y-6">
                    {rounds.map((round) => {
                      const isCompleted = completedRounds.includes(round.id);
                      const roundScore = scores[round.id];
                      const Icon = round.icon;

                      return (
                        <Card key={round.id} className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-all duration-300 group">
                          <CardHeader className="pb-4">
                            <div className="flex items-start justify-between">
                              <div className="flex items-center space-x-4">
                                <div className={`w-16 h-16 bg-gradient-to-r ${round.color} rounded-xl flex items-center justify-center shadow-lg`}>
                                  <Icon className="w-8 h-8 text-white" />
                                </div>
                                <div>
                                  <div className="flex items-center space-x-2 mb-1">
                                    <CardTitle className="text-xl text-white">{round.title}</CardTitle>
                                    {getStatusIcon(round.id)}
                                  </div>
                                  <p className="text-slate-300 text-sm font-medium">{round.subtitle}</p>
                                  <p className="text-slate-400 text-sm">{round.description}</p>
                                </div>
                              </div>
                              <div className="flex flex-col items-end space-y-2">
                                {isCompleted && (
                                  <Badge className="bg-green-500/20 text-green-400 border-green-500/20">
                                    Completed
                                  </Badge>
                                )}
                                <Badge variant="outline" className="text-slate-300 border-slate-600">
                                  {round.difficulty}
                                </Badge>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <p className="text-slate-300 text-sm leading-relaxed">
                              {round.detailedDescription}
                            </p>
                            
                            <div className="flex flex-wrap gap-2">
                              {round.topics.map((topic, index) => (
                                <Badge key={index} variant="outline" className="text-xs text-slate-400 border-slate-600">
                                  {topic}
                                </Badge>
                              ))}
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div className="flex items-center justify-between">
                                <span className="text-slate-400">Duration:</span>
                                <span className="text-slate-300 font-medium">{round.duration}</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-slate-400">Passing Score:</span>
                                <span className="text-slate-300 font-medium">{round.passingScore}%</span>
                              </div>
                            </div>
                            
                            {isCompleted && roundScore && (
                              <div className="space-y-3 p-4 bg-white/5 rounded-lg">
                                <div className="flex justify-between items-center">
                                  <span className="text-slate-300 font-medium">Your Score:</span>
                                  <span className={`font-bold text-lg ${getScoreColor(roundScore.percentage)}`}>
                                    {roundScore.score}/{round.id === 'technical' ? '25' : round.id === 'live' ? '10' : '100'}
                                  </span>
                                </div>
                                <Progress value={roundScore.percentage} className="h-3" />
                                <div className="flex justify-between text-xs">
                                  <span className="text-slate-400">
                                    {roundScore.percentage >= round.passingScore ? 'Passed' : 'Failed'}
                                  </span>
                                  <span className={getScoreColor(roundScore.percentage)}>
                                    {roundScore.percentage.toFixed(1)}%
                                  </span>
                                </div>
                              </div>
                            )}
                            
                            <Button 
                              className={`w-full bg-gradient-to-r ${round.color} hover:opacity-90 text-white font-semibold transition-all duration-300 group-hover:shadow-lg`}
                              onClick={() => setCurrentRound(round.id)}
                            >
                              <Play className="w-4 h-4 mr-2" />
                              {isCompleted ? 'Retake' : 'Start'} Round
                              <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                            </Button>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Achievements */}
                <Card className="bg-white/10 backdrop-blur-md border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Sparkles className="w-5 h-5 mr-2" />
                      Achievements
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {achievements.map((achievement) => {
                      const Icon = achievement.icon;
                      return (
                        <div key={achievement.id} className={`flex items-center space-x-3 p-3 rounded-lg ${achievement.earned ? 'bg-yellow-500/10 border border-yellow-500/20' : 'bg-slate-800/20'}`}>
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${achievement.earned ? 'bg-yellow-500' : 'bg-slate-600'}`}>
                            <Icon className="w-4 h-4 text-white" />
                          </div>
                          <div className="flex-1">
                            <p className={`text-sm font-medium ${achievement.earned ? 'text-yellow-400' : 'text-slate-300'}`}>
                              {achievement.title}
                            </p>
                            <p className="text-xs text-slate-400">{achievement.description}</p>
                          </div>
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card className="bg-white/10 backdrop-blur-md border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Clock className="w-5 h-5 mr-2" />
                      Recent Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {notifications.map((notification) => (
                      <div key={notification.id} className="flex items-start space-x-3 p-3 bg-white/5 rounded-lg">
                        <div className={`w-2 h-2 rounded-full mt-2 ${notification.type === 'success' ? 'bg-green-400' : 'bg-blue-400'}`}></div>
                        <div className="flex-1">
                          <p className="text-sm text-slate-300">{notification.message}</p>
                          <p className="text-xs text-slate-400 mt-1">{notification.time}</p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card className="bg-white/10 backdrop-blur-md border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button variant="outline" className="w-full bg-white/5 text-white border-white/20 hover:bg-white/10">
                      <Download className="w-4 h-4 mr-2" />
                      Download Report
                    </Button>
                    <Button variant="outline" className="w-full bg-white/5 text-white border-white/20 hover:bg-white/10">
                      <Share2 className="w-4 h-4 mr-2" />
                      Share Progress
                    </Button>
                    <Button variant="outline" className="w-full bg-white/5 text-white border-white/20 hover:bg-white/10">
                      <Calendar className="w-4 h-4 mr-2" />
                      Schedule Interview
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CandidatePortal;

