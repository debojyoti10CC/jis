import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { User, BookOpen, Video, MessageSquare, Trophy, ArrowLeft, Play } from 'lucide-react';
import TechnicalRound from './TechnicalRound';
import LiveInterview from './LiveInterview';
import HRSimulation from './HRSimulation';

interface CandidatePortalProps {
  onBack: () => void;
  userInfo: any;
}

const CandidatePortal = ({ onBack, userInfo }: CandidatePortalProps) => {
  const [currentRound, setCurrentRound] = useState<'dashboard' | 'technical' | 'live' | 'hr'>('dashboard');
  const [completedRounds, setCompletedRounds] = useState<string[]>([]);
  const [scores, setScores] = useState<{ [key: string]: { score: number; percentage: number } }>({});

  const handleRoundComplete = (round: string, score: number, percentage: number) => {
    setCompletedRounds(prev => [...prev, round]);
    setScores(prev => ({ ...prev, [round]: { score, percentage } }));
    setCurrentRound('dashboard');
  };

  const rounds = [
    {
      id: 'technical',
      title: 'Technical Assessment',
      description: '25 questions covering DSA, Quantitative, and Aptitude',
      duration: '60 minutes',
      icon: BookOpen,
      color: 'bg-blue-500',
      hoverColor: 'hover:bg-blue-600'
    },
    {
      id: 'live',
      title: 'Live Coding Interview',
      description: '10 coding problems with real-time evaluation',
      duration: '90 minutes',
      icon: Video,
      color: 'bg-red-500',
      hoverColor: 'hover:bg-red-600'
    },
    {
      id: 'hr',
      title: 'HR Interview Simulation',
      description: 'AI-powered behavioral assessment',
      duration: '45 minutes',
      icon: MessageSquare,
      color: 'bg-purple-500',
      hoverColor: 'hover:bg-purple-600'
    }
  ];

  if (currentRound === 'technical') {
      return <TechnicalRound onComplete={handleRoundComplete} onBack={() => setCurrentRound('dashboard')} />;
    }

  if (currentRound === 'live') {
    return <LiveInterview onComplete={(score: number) => handleRoundComplete('live', score, (score / 10) * 100)} onBack={() => setCurrentRound('dashboard')} />;
  }

  if (currentRound === 'hr') {
    return <HRSimulation onComplete={(score: number) => handleRoundComplete('hr', score, score)} onBack={() => setCurrentRound('dashboard')} />;
  }

  const overallProgress = (completedRounds.length / rounds.length) * 100;
  const averageScore = completedRounds.length > 0 
    ? Object.values(scores).reduce((sum, { percentage }) => sum + percentage, 0) / completedRounds.length 
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-blue-900 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="outline"
            onClick={onBack}
            className="bg-white text-black border-slate-300 hover:bg-slate-100"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-2">Interview Dashboard</h1>
            <p className="text-slate-300">Welcome back, {userInfo?.displayName || 'Candidate'}!</p>
          </div>
          <div className="w-32" />
        </div>

        {/* Progress Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-slate-800/80 backdrop-blur-sm border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Overall Progress</p>
                  <p className="text-2xl font-bold text-white">{overallProgress.toFixed(0)}%</p>
                </div>
                <Trophy className="w-8 h-8 text-yellow-400" />
              </div>
              <Progress value={overallProgress} className="mt-4" />
            </CardContent>
          </Card>

          <Card className="bg-slate-800/80 backdrop-blur-sm border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Completed Rounds</p>
                  <p className="text-2xl font-bold text-white">{completedRounds.length}/{rounds.length}</p>
                </div>
                <User className="w-8 h-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/80 backdrop-blur-sm border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Average Score</p>
                  <p className="text-2xl font-bold text-white">{averageScore.toFixed(1)}%</p>
                </div>
                <Trophy className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Interview Rounds */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {rounds.map((round) => {
            const isCompleted = completedRounds.includes(round.id);
            const roundScore = scores[round.id];
            const Icon = round.icon;

            return (
              <Card key={round.id} className="bg-slate-800/80 backdrop-blur-sm border-slate-700 hover:border-slate-600 transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 ${round.color} rounded-lg flex items-center justify-center`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    {isCompleted && (
                      <Badge className="bg-green-500 text-white">
                        Completed
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-xl text-white">{round.title}</CardTitle>
                  <CardDescription className="text-slate-300">{round.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">Duration:</span>
                      <span className="text-slate-300">{round.duration}</span>
                    </div>
                    
                    {isCompleted && roundScore && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400">Score:</span>
                          <span className="text-green-400 font-semibold">
                            {roundScore.score}/{round.id === 'technical' ? '25' : round.id === 'live' ? '10' : '100'}
                          </span>
                        </div>
                        <Progress value={roundScore.percentage} className="h-2" />
                        <p className="text-xs text-slate-400 text-center">
                          {roundScore.percentage.toFixed(1)}%
                        </p>
                      </div>
                    )}
                    
                    <Button 
                      className={`w-full ${round.color} ${round.hoverColor} text-white font-semibold`}
                      onClick={() => setCurrentRound(round.id as any)}
                    >
                      <Play className="w-4 h-4 mr-2" />
                      {isCompleted ? 'Retake' : 'Start'} Round
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CandidatePortal;
