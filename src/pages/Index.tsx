
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Brain, Shield, CheckCircle, ArrowRight, Code, Video, MessageSquare, Star, Quote } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import CandidatePortal from '@/components/CandidatePortal';
import RecruiterPortal from '@/components/RecruiterPortal';
import BiometricAuth from '@/components/BiometricAuth';
import { User } from 'firebase/auth';

const Index = () => {
  const [userType, setUserType] = useState<'candidate' | 'recruiter' | null>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminCredentials, setAdminCredentials] = useState({ id: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [userInfo, setUserInfo] = useState<any>(null);

  const handleAuthComplete = (user: User, biometricId: string) => {
    setUserInfo({ ...user, biometricId });
    setShowAuth(false);
    setUserType('candidate');
  };

  const handleAdminLogin = () => {
    if (adminCredentials.id === 'admin' && adminCredentials.password === 'admin@123') {
      setUserType('recruiter');
      setShowAdminLogin(false);
      setLoginError('');
    } else {
      setLoginError('Invalid credentials. Please try again.');
    }
  };

  const handleRecruiterAccess = () => {
    setShowAdminLogin(true);
  };

  if (showAuth) {
    return <BiometricAuth onAuthComplete={handleAuthComplete} onBack={() => setShowAuth(false)} />;
  }

  if (userType === 'candidate') {
    return <CandidatePortal onBack={() => setUserType(null)} userInfo={userInfo} />;
  }

  if (userType === 'recruiter') {
    return <RecruiterPortal onBack={() => setUserType(null)} />;
  }

  if (showAdminLogin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50 dark:from-slate-900 dark:to-purple-900 flex items-center justify-center">
        <Card className="w-full max-w-md mx-4 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl dark:text-white">Admin Login</CardTitle>
            <CardDescription className="dark:text-slate-300">Enter your admin credentials to access the recruiter dashboard</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="admin-id" className="dark:text-white">Admin ID</label>
              <input
                id="admin-id"
                type="text"
                value={adminCredentials.id}
                onChange={(e) => setAdminCredentials(prev => ({ ...prev, id: e.target.value }))}
                placeholder="Enter admin ID"
                className="w-full p-2 border rounded-md dark:bg-slate-700 dark:text-white dark:border-slate-600"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="admin-password" className="dark:text-white">Password</label>
              <input
                id="admin-password"
                type="password"
                value={adminCredentials.password}
                onChange={(e) => setAdminCredentials(prev => ({ ...prev, password: e.target.value }))}
                placeholder="Enter password"
                className="w-full p-2 border rounded-md dark:bg-slate-700 dark:text-white dark:border-slate-600"
              />
            </div>
            {loginError && (
              <div className="flex items-center space-x-2 text-red-600 dark:text-red-400 text-sm">
                <span>{loginError}</span>
              </div>
            )}
            <div className="flex space-x-3">
              <Button 
                variant="outline" 
                onClick={() => setShowAdminLogin(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleAdminLogin}
                className="flex-1 bg-purple-500 hover:bg-purple-600"
              >
                Login
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "HR Director at TechCorp",
      content: "Recruitix transformed our hiring process. The AI-powered insights helped us identify top talent 3x faster.",
      rating: 5
    },
    {
      name: "Michael Chen",
      role: "Software Engineer",
      content: "The assessment was comprehensive yet fair. I appreciated the real-time feedback and the variety of question types.",
      rating: 5
    },
    {
      name: "Emily Rodriguez",
      role: "Talent Acquisition Lead",
      content: "The live proctoring and detailed analytics give us confidence in our hiring decisions. Highly recommended!",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-900">
      {/* Header */}
      <header className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-800 dark:text-white">Recruitix</span>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                Beta v2.0
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-slate-800 dark:text-white mb-6 leading-tight">
            AI-Powered Interview System
          </h1>
          <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 mb-4 font-medium">
            Smart. Fair. Scalable Hiring.
          </p>
          <p className="text-lg text-slate-500 dark:text-slate-400 mb-12 max-w-2xl mx-auto">
            Transform your recruitment process with AI-driven assessments, real-time proctoring, 
            and intelligent candidate evaluation for modern hiring needs.
          </p>

          {/* Login Options */}
          <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto mb-16">
            <Card className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-green-200 dark:hover:border-green-700 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl text-slate-800 dark:text-white">Candidate Portal</CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-300">
                  Take your assessment and showcase your skills
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold py-3 group-hover:shadow-lg transition-all duration-300"
                  onClick={() => setShowAuth(true)}
                >
                  Start Assessment
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-purple-200 dark:hover:border-purple-700 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl text-slate-800 dark:text-white">Recruiter Dashboard</CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-300">
                  Manage assessments and evaluate candidates
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-semibold py-3 group-hover:shadow-lg transition-all duration-300"
                  onClick={handleRecruiterAccess}
                >
                  Access Dashboard
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
                <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
                  Admin credentials required (ID: admin, Password: admin@123)
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Features Preview */}
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-16">
            <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-xl p-6 border border-slate-200 dark:border-slate-700">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Code className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">Technical Assessment</h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm">25 questions with role-specific customization</p>
            </div>
            
            <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-xl p-6 border border-slate-200 dark:border-slate-700">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Video className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">Live Interview</h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm">10 coding problems with real-time monitoring</p>
            </div>
            
            <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-xl p-6 border border-slate-200 dark:border-slate-700">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">HR Simulation</h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm">10 behavioral questions with AI analysis</p>
            </div>
          </div>

          {/* Customer Reviews */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-8">What Our Users Say</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <Quote className="w-6 h-6 text-slate-400 mb-2" />
                    <p className="text-slate-600 dark:text-slate-300 mb-4">{testimonial.content}</p>
                    <div>
                      <p className="font-semibold text-slate-800 dark:text-white">{testimonial.name}</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{testimonial.role}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
