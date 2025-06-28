
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Users, Settings, BarChart3, Eye, CheckCircle, Clock, AlertTriangle } from 'lucide-react';

interface RecruiterPortalProps {
  onBack: () => void;
}

const RecruiterPortal = ({ onBack }: RecruiterPortalProps) => {
  const [selectedCandidate, setSelectedCandidate] = useState<number | null>(null);

  // Mock data
  const candidates = [
    {
      id: 1,
      name: 'Alice Johnson',
      round1: { score: 85, status: 'completed', time: '45 mins' },
      round2: { score: 78, status: 'completed', time: '40 mins' },
      round3: { score: 92, status: 'completed', time: '28 mins' },
      overall: 85,
      appliedFor: 'Software Engineer'
    },
    {
      id: 2,
      name: 'Bob Smith',
      round1: { score: 92, status: 'completed', time: '52 mins' },
      round2: { score: 88, status: 'in-progress', time: '20 mins' },
      round3: { score: null, status: 'pending', time: null },
      overall: 90,
      appliedFor: 'Full Stack Developer'
    },
    {
      id: 3,
      name: 'Carol Davis',
      round1: { score: 76, status: 'completed', time: '38 mins' },
      round2: { score: null, status: 'pending', time: null },
      round3: { score: null, status: 'pending', time: null },
      overall: 76,
      appliedFor: 'Frontend Developer'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500"><CheckCircle className="w-3 h-3 mr-1" />Completed</Badge>;
      case 'in-progress':
        return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" />In Progress</Badge>;
      case 'pending':
        return <Badge variant="outline">Pending</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={onBack} className="flex items-center space-x-2 text-slate-600 hover:text-slate-800">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </Button>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary">Recruiter Dashboard</Badge>
              <div className="text-right text-sm text-slate-600">
                <p>Active Assessments: 12</p>
                <p>Completed Today: 8</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Dashboard */}
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-800 mb-2">Recruiter Dashboard</h1>
            <p className="text-slate-600">Monitor candidate assessments and manage interview settings</p>
          </div>

          <Tabs defaultValue="candidates" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="candidates" className="flex items-center space-x-2">
                <Users className="w-4 h-4" />
                <span>Candidates</span>
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center space-x-2">
                <BarChart3 className="w-4 h-4" />
                <span>Analytics</span>
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center space-x-2">
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </TabsTrigger>
            </TabsList>

            {/* Candidates Tab */}
            <TabsContent value="candidates" className="space-y-6">
              <div className="grid gap-6">
                {candidates.map((candidate) => (
                  <Card key={candidate.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-xl">{candidate.name}</CardTitle>
                          <CardDescription>{candidate.appliedFor}</CardDescription>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-slate-800">
                            {candidate.overall}%
                          </div>
                          <p className="text-sm text-slate-600">Overall Score</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        {/* Round 1 */}
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-blue-800">Technical Round</h4>
                            {getStatusBadge(candidate.round1.status)}
                          </div>
                          {candidate.round1.score && (
                            <div>
                              <div className="text-xl font-bold text-blue-600">{candidate.round1.score}%</div>
                              <p className="text-sm text-blue-700">Time: {candidate.round1.time}</p>
                            </div>
                          )}
                        </div>

                        {/* Round 2 */}
                        <div className="bg-red-50 p-4 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-red-800">Live Interview</h4>
                            {getStatusBadge(candidate.round2.status)}
                          </div>
                          {candidate.round2.score && (
                            <div>
                              <div className="text-xl font-bold text-red-600">{candidate.round2.score}%</div>
                              <p className="text-sm text-red-700">Time: {candidate.round2.time}</p>
                            </div>
                          )}
                          {candidate.round2.status === 'in-progress' && (
                            <div>
                              <Progress value={45} className="mt-2" />
                              <p className="text-sm text-red-700 mt-1">Elapsed: {candidate.round2.time}</p>
                            </div>
                          )}
                        </div>

                        {/* Round 3 */}
                        <div className="bg-purple-50 p-4 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-purple-800">HR Simulation</h4>
                            {getStatusBadge(candidate.round3.status)}
                          </div>
                          {candidate.round3.score && (
                            <div>
                              <div className="text-xl font-bold text-purple-600">{candidate.round3.score}%</div>
                              <p className="text-sm text-purple-700">Time: {candidate.round3.time}</p>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 text-sm text-slate-600">
                          <AlertTriangle className="w-4 h-4" />
                          <span>2 integrity flags</span>
                        </div>
                        <Button variant="outline" size="sm" className="flex items-center space-x-2">
                          <Eye className="w-4 h-4" />
                          <span>View Details</span>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600">147</div>
                      <p className="text-slate-600">Total Candidates</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600">89</div>
                      <p className="text-slate-600">Completed</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-yellow-600">23</div>
                      <p className="text-slate-600">In Progress</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-slate-600">76%</div>
                      <p className="text-slate-600">Pass Rate</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Performance Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Excellent (90-100%)</span>
                        <span>23 candidates</span>
                      </div>
                      <Progress value={23} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Good (80-89%)</span>
                        <span>31 candidates</span>
                      </div>
                      <Progress value={31} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Average (70-79%)</span>
                        <span>28 candidates</span>
                      </div>
                      <Progress value={28} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Below Average (&lt;70%)</span>
                        <span>7 candidates</span>
                      </div>
                      <Progress value={7} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-6">
              <div className="grid gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Assessment Configuration</CardTitle>
                    <CardDescription>Customize the interview rounds and difficulty levels</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Technical Round Duration</label>
                        <select className="w-full p-2 border rounded-md">
                          <option>60 minutes</option>
                          <option>45 minutes</option>
                          <option>90 minutes</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Difficulty Level</label>
                        <select className="w-full p-2 border rounded-md">
                          <option>Medium</option>
                          <option>Easy</option>
                          <option>Hard</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Focus Areas</label>
                        <select className="w-full p-2 border rounded-md">
                          <option>DSA + Aptitude</option>
                          <option>DSA Only</option>
                          <option>Full Stack</option>
                        </select>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Proctoring Settings</CardTitle>
                    <CardDescription>Configure monitoring and security options</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Eye Tracking</h4>
                        <p className="text-sm text-slate-600">Monitor candidate attention during assessment</p>
                      </div>
                      <Button variant="outline" size="sm">Enabled</Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Screen Recording</h4>
                        <p className="text-sm text-slate-600">Record candidate screen activity</p>
                      </div>
                      <Button variant="outline" size="sm">Optional</Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Browser Lock</h4>
                        <p className="text-sm text-slate-600">Prevent tab switching during test</p>
                      </div>
                      <Button variant="outline" size="sm">Enabled</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default RecruiterPortal;
