import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Brain, Shield, CheckCircle, ArrowRight, Code, Video, MessageSquare, Star, Quote, Sparkles, Zap, Globe, Lock } from 'lucide-react';
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
      <div className="min-h-screen relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-900 via-purple-900 to-indigo-900">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-400/20 via-transparent to-transparent"></div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-blue-400/20 via-transparent to-transparent"></div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-r from-cyan-400/20 to-blue-400/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-32 right-16 w-32 h-32 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-gradient-to-r from-emerald-400/20 to-teal-400/20 rounded-full blur-xl animate-pulse delay-500"></div>
        
        <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
          <div className="w-full max-w-md">
            {/* Glassmorphism Card */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
              <Card className="relative backdrop-blur-xl bg-white/10 dark:bg-black/20 border border-white/20 dark:border-white/10 rounded-2xl shadow-2xl">
                <CardHeader className="text-center pb-6">
                  <div className="relative mx-auto mb-6">
                    <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-purple-500/25">
                      <Shield className="w-10 h-10 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full flex items-center justify-center">
                      <Lock className="w-3 h-3 text-white" />
                    </div>
                  </div>
                  <CardTitle className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    Admin Portal
                  </CardTitle>
                  <CardDescription className="text-gray-300/80 text-lg">
                    Secure access to recruiter dashboard
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 px-8 pb-8">
                  <div className="space-y-4">
                    <div className="relative">
                      <label htmlFor="admin-id" className="block text-sm font-medium text-gray-300 mb-2">
                        Admin ID
                      </label>
                      <input
                        id="admin-id"
                        type="text"
                        value={adminCredentials.id}
                        onChange={(e) => setAdminCredentials(prev => ({ ...prev, id: e.target.value }))}
                        placeholder="Enter admin ID"
                        className="w-full p-4 backdrop-blur-sm bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                      />
                    </div>
                    <div className="relative">
                      <label htmlFor="admin-password" className="block text-sm font-medium text-gray-300 mb-2">
                        Password
                      </label>
                      <input
                        id="admin-password"
                        type="password"
                        value={adminCredentials.password}
                        onChange={(e) => setAdminCredentials(prev => ({ ...prev, password: e.target.value }))}
                        placeholder="Enter password"
                        className="w-full p-4 backdrop-blur-sm bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                      />
                    </div>
                  </div>
                  
                  {loginError && (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 backdrop-blur-sm">
                      <span className="text-red-300 text-sm">{loginError}</span>
                    </div>
                  )}
                  
                  <div className="flex space-x-3 pt-2">
                    <Button 
                      variant="outline" 
                      onClick={() => setShowAdminLogin(false)}
                      className="flex-1 bg-white/5 border-white/20 text-white hover:bg-white/10 backdrop-blur-sm rounded-xl h-12"
                    >
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleAdminLogin}
                      className="flex-1 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white border-0 rounded-xl h-12 shadow-xl shadow-purple-500/25"
                    >
                      <Lock className="w-4 h-4 mr-2" />
                      Access
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
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
    <div className="min-h-screen relative overflow-hidden">
      {/* Advanced Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-purple-400/30 via-transparent to-transparent"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-blue-400/30 via-transparent to-transparent"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-400/20 via-transparent to-transparent"></div>
      </div>
      
      {/* Floating Orbs */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-cyan-400/30 to-blue-400/30 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-40 right-32 w-40 h-40 bg-gradient-to-r from-purple-400/30 to-pink-400/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/3 right-20 w-24 h-24 bg-gradient-to-r from-emerald-400/30 to-teal-400/30 rounded-full blur-3xl animate-pulse delay-500"></div>
      <div className="absolute bottom-20 left-40 w-36 h-36 bg-gradient-to-r from-orange-400/20 to-red-400/20 rounded-full blur-3xl animate-pulse delay-700"></div>

      {/* Header */}
      <header className="relative z-10 backdrop-blur-xl bg-white/5 border-b border-white/10 sticky top-0">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-cyan-500/25">
                  <Brain className="w-7 h-7 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full animate-pulse"></div>
              </div>
              <div>
                <span className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Recruitix
                </span>
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-3 h-3 text-purple-400" />
                  <span className="text-xs text-purple-300">AI-Powered</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <Badge className="bg-gradient-to-r from-purple-500/20 to-indigo-500/20 text-purple-200 border-purple-400/30 backdrop-blur-sm">
                <Zap className="w-3 h-3 mr-1" />
                Beta v2.0
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 container mx-auto px-6 py-20">
        <div className="text-center max-w-6xl mx-auto">
          <div className="relative mb-8">
            <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent mb-6 leading-tight">
              AI-Powered
              <br />
              <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Interview System
              </span>
            </h1>
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full"></div>
          </div>
          
          <p className="text-2xl md:text-3xl text-purple-200 mb-4 font-semibold">
            Smart. Fair. Scalable Hiring.
          </p>
          <p className="text-lg text-gray-300/80 mb-16 max-w-3xl mx-auto leading-relaxed">
            Transform your recruitment process with AI-driven assessments, real-time proctoring, 
            and intelligent candidate evaluation for modern hiring needs.
          </p>

          {/* Enhanced Login Options */}
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-20">
            {/* Candidate Portal Card */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600 to-cyan-600 rounded-3xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
              <Card className="relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl group-hover:shadow-emerald-500/25 transition-all duration-500 transform group-hover:-translate-y-2">
                <CardHeader className="text-center pb-6">
                  <div className="relative mx-auto mb-6">
                    <div className="w-20 h-20 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-emerald-500/25 group-hover:scale-110 transition-transform duration-500">
                      <Users className="w-10 h-10 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center animate-pulse">
                      <Sparkles className="w-3 h-3 text-white" />
                    </div>
                  </div>
                  <CardTitle className="text-3xl font-bold text-white mb-2">Candidate Portal</CardTitle>
                  <CardDescription className="text-gray-300/80 text-lg">
                    Take your assessment and showcase your skills
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 px-8 pb-8">
                  <div className="bg-white/5 rounded-2xl p-4 backdrop-blur-sm border border-white/10">
                    <div className="flex items-center justify-between text-sm text-gray-300">
                      <span>Assessment Duration</span>
                      <span className="text-emerald-400 font-semibold">90 minutes</span>
                    </div>
                  </div>
                  <Button 
                    className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-semibold py-4 rounded-2xl shadow-2xl shadow-emerald-500/25 group-hover:shadow-emerald-500/40 transition-all duration-500 text-lg"
                    onClick={() => setShowAuth(true)}
                  >
                    <Sparkles className="w-5 h-5 mr-2" />
                    Start Assessment
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Recruiter Portal Card */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-3xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
              <Card className="relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl group-hover:shadow-purple-500/25 transition-all duration-500 transform group-hover:-translate-y-2">
                <CardHeader className="text-center pb-6">
                  <div className="relative mx-auto mb-6">
                    <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-purple-500/25 group-hover:scale-110 transition-transform duration-500">
                      <Shield className="w-10 h-10 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-pink-400 to-rose-400 rounded-full flex items-center justify-center animate-pulse">
                      <Lock className="w-3 h-3 text-white" />
                    </div>
                  </div>
                  <CardTitle className="text-3xl font-bold text-white mb-2">Recruiter Dashboard</CardTitle>
                  <CardDescription className="text-gray-300/80 text-lg">
                    Manage assessments and evaluate candidates
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 px-8 pb-8">
                  <div className="bg-white/5 rounded-2xl p-4 backdrop-blur-sm border border-white/10">
                    <div className="flex items-center justify-between text-sm text-gray-300">
                      <span>Security Level</span>
                      <span className="text-purple-400 font-semibold">Enterprise</span>
                    </div>
                  </div>
                  <Button 
                    className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-semibold py-4 rounded-2xl shadow-2xl shadow-purple-500/25 group-hover:shadow-purple-500/40 transition-all duration-500 text-lg"
                    onClick={handleRecruiterAccess}
                  >
                    <Shield className="w-5 h-5 mr-2" />
                    Access Dashboard
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                  </Button>
                  <p className="text-xs text-gray-400/80 text-center backdrop-blur-sm bg-white/5 rounded-xl py-2 px-3">
                    Admin credentials required (ID: admin, Password: admin@123)
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Enhanced Features Preview */}
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-20">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl blur opacity-20 group-hover:opacity-60 transition duration-1000"></div>
              <div className="relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 group-hover:-translate-y-1 transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-blue-500/25">
                  <Code className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Technical Assessment</h3>
                <p className="text-gray-300/80">25 questions with role-specific customization and real-time code execution</p>
                <div className="mt-4 flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                  <span className="text-xs text-blue-300">Live Code Analysis</span>
                </div>
              </div>
            </div>
            
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-red-600 to-pink-600 rounded-2xl blur opacity-20 group-hover:opacity-60 transition duration-1000"></div>
              <div className="relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 group-hover:-translate-y-1 transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-red-500/25">
                  <Video className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Live Interview</h3>
                <p className="text-gray-300/80">10 coding problems with AI-powered monitoring and behavior analysis</p>
                <div className="mt-4 flex items-center space-x-2">
                  <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                  <span className="text-xs text-red-300">Real-time Proctoring</span>
                </div>
              </div>
            </div>
            
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl blur opacity-20 group-hover:opacity-60 transition duration-1000"></div>
              <div className="relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 group-hover:-translate-y-1 transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-purple-500/25">
                  <MessageSquare className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">HR Simulation</h3>
                <p className="text-gray-300/80">10 behavioral questions with advanced AI sentiment and personality analysis</p>
                <div className="mt-4 flex items-center space-x-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                  <span className="text-xs text-purple-300">AI Psychology Insights</span>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Customer Reviews */}
          <div className="mb-16">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-12">
              What Our Users Say
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-2xl blur opacity-20 group-hover:opacity-50 transition duration-1000"></div>
                  <Card className="relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl group-hover:-translate-y-1 transition-all duration-300">
                    <CardContent className="p-8">
                      <div className="flex mb-6">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <div className="relative mb-6">
                        <Quote className="w-8 h-8 text-purple-400/50 absolute -top-2 -left-2" />
                        <p className="text-gray-300/90 leading-relaxed pl-6">{testimonial.content}</p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold">{testimonial.name.charAt(0)}</span>
                        </div>
                        <div>
                          <p className="font-semibold text-white">{testimonial.name}</p>
                          <p className="text-sm text-gray-400">{testimonial.role}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          {/* Call to Action */}
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-3xl blur opacity-25"></div>
            <div className="relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-12">
              <h3 className="text-3xl font-bold text-white mb-4">Ready to Transform Your Hiring?</h3>
              <p className="text-gray-300/80 mb-8 text-lg">Join thousands of companies using AI-powered recruitment</p>
              <div className="flex items-center justify-center space-x-2 text-purple-300">
                <Globe className="w-5 h-5" />
                <span>Trusted by 500+ companies worldwide</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;