import React, { useState, useEffect, useRef } from 'react';
import { 
  Home, 
  BookOpen, 
  MessageSquare, 
  User, 
  Search, 
  Bell, 
  TrendingUp, 
  Code, 
  Brain, 
  MessageCircle, 
  Plus, 
  ShoppingBag, 
  Calendar, 
  Award, 
  Star, 
  ChevronRight,
  LogOut,
  Send,
  Loader2,
  CheckCircle2,
  X,
  Trash2,
  MapPin,
  CreditCard,
  Wallet,
  Banknote,
  ShoppingCart,
  Terminal,
  Play,
  RotateCcw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from "@google/genai";

// --- Types ---
interface UserData {
  id: number;
  name: string;
  email: string;
  department: string;
  coding_progress: number;
  aptitude_progress: number;
  comm_progress: number;
  subscription: string;
}

interface Course {
  id: number;
  title: string;
  description: string;
  department: string;
  instructor: string;
  image: string;
  notes_url?: string;
  video_url?: string;
}

interface Book {
  id: number;
  title: string;
  price: number;
  seller_id: number;
  department: string;
  image: string;
  location?: string;
  stock?: number;
}

interface Contest {
  id: number;
  title: string;
  date: string;
  description: string;
  registered?: boolean;
}

interface Question {
  id: number;
  question: string;
  options: string[];
  correct_option: number;
}

// --- Components ---

const BackButton = ({ onClick, label = "Back to Dashboard" }: { onClick: () => void, label?: string }) => (
  <button 
    onClick={onClick}
    className="flex items-center gap-2 text-white/50 hover:text-brand-primary transition-colors mb-6 group"
  >
    <div className="p-2 rounded-lg bg-white/5 group-hover:bg-brand-primary/10 transition-colors">
      <ChevronRight className="rotate-180" size={18} />
    </div>
    <span className="text-sm font-medium">{label}</span>
  </button>
);

const Navbar = ({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (tab: string) => void }) => {
  const tabs = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'courses', icon: BookOpen, label: 'Courses' },
    { id: 'coding', icon: Terminal, label: 'IDE' },
    { id: 'chat', icon: MessageSquare, label: 'AI Mentor' },
    { id: 'profile', icon: User, label: 'Profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-brand-dark/95 backdrop-blur-md border-t border-white/10 px-6 py-3 flex justify-between items-center z-50 md:top-0 md:bottom-auto md:px-12 md:py-4">
      <div className="hidden md:flex items-center gap-2 mr-8">
        <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center shadow-lg shadow-brand-primary/30">
          <TrendingUp className="text-white" size={24} />
        </div>
        <span className="text-xl font-bold font-display tracking-tight">SkillUp AI</span>
      </div>
      
      <div className="flex flex-1 justify-around md:justify-end md:gap-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center gap-1 transition-all duration-300 ${
              activeTab === tab.id ? 'text-brand-primary scale-110' : 'text-white/50 hover:text-white'
            }`}
          >
            <tab.icon size={24} />
            <span className="text-[10px] font-medium md:text-sm">{tab.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

const AuthScreen = ({ onLogin }: { onLogin: (user: UserData) => void }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('CSE');
  const [error, setError] = useState('');

  const departments = ['CSE', 'ECE', 'MBA', 'Mechanical', 'Civil'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/signup';
    const body = isLogin ? { email, password } : { name, email, password, department };

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.success) {
        onLogin(data.user);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Connection error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-brand-darker">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card w-full max-w-md p-8"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-brand-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-brand-primary/20">
            <TrendingUp size={32} />
          </div>
          <h1 className="text-3xl font-bold font-display">SkillUp AI</h1>
          <p className="text-white/60 mt-2">Holistic Development Platform</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <>
              <div>
                <label className="text-sm font-medium text-white/70 ml-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 mt-1 focus:outline-none focus:border-brand-primary transition-colors"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-white/70 ml-1">Department</label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 mt-1 focus:outline-none focus:border-brand-primary transition-colors appearance-none"
                >
                  {departments.map(d => <option key={d} value={d} className="bg-brand-dark">{d}</option>)}
                </select>
              </div>
            </>
          )}
          <div>
            <label className="text-sm font-medium text-white/70 ml-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 mt-1 focus:outline-none focus:border-brand-primary transition-colors"
              placeholder="name@example.com"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-white/70 ml-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 mt-1 focus:outline-none focus:border-brand-primary transition-colors"
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-red-400 text-sm text-center">{error}</p>}

          <button type="submit" className="btn-primary w-full mt-4">
            {isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <p className="text-center mt-6 text-white/50 text-sm">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-brand-primary font-semibold hover:underline"
          >
            {isLogin ? 'Sign Up' : 'Sign In'}
          </button>
        </p>
      </motion.div>
    </div>
  );
};

const Dashboard = ({ user, setActiveTab, onStartTest, onStartAssessment }: { user: UserData, setActiveTab: (tab: string) => void, onStartTest: (contest: Contest) => void, onStartAssessment: (type: string) => void }) => {
  const [contests, setContests] = useState<Contest[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'New Course Available', message: 'Advanced AI for MBA is now live!', time: '2h ago', read: false },
    { id: 2, title: 'Contest Starting Soon', message: 'Weekly Aptitude Challenge starts in 1 hour.', time: '1h ago', read: false },
    { id: 3, title: 'Marketplace Update', message: 'Someone is interested in your Python book.', time: '30m ago', read: true },
  ]);

  const fetchContests = () => {
    fetch(`/api/contests?user_id=${user.id}`).then(res => res.json()).then(setContests);
  };

  useEffect(() => {
    fetchContests();
  }, []);

  const handleRegister = async (contestId: number) => {
    const res = await fetch('/api/contests/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: user.id, contest_id: contestId }),
    });
    const data = await res.json();
    if (data.success) {
      fetchContests();
    }
  };

  const skillCards = [
    { id: 'coding', title: 'Coding Skills', icon: Code, progress: user.coding_progress, color: 'from-blue-500 to-indigo-600' },
    { id: 'aptitude', title: 'Aptitude', icon: Brain, progress: user.aptitude_progress, color: 'from-purple-500 to-pink-600' },
    { id: 'comm', title: 'Communication', icon: MessageCircle, progress: user.comm_progress, color: 'from-emerald-500 to-teal-600' },
  ];

  return (
    <div className="pb-24 pt-8 md:pt-24 px-6 max-w-7xl mx-auto relative">
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold font-display">Welcome, {user.name}!</h2>
          <p className="text-white/60">{user.department} Student • {user.subscription === 'premium' ? 'Premium Member' : 'Free Plan'}</p>
        </div>
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors relative"
          >
            <Bell className={`${showNotifications ? 'text-brand-primary' : 'text-white/60'}`} />
            {notifications.some(n => !n.read) && (
              <span className="absolute top-2 right-2 w-2 h-2 bg-brand-primary rounded-full border-2 border-brand-darker"></span>
            )}
          </button>

          <AnimatePresence>
            {showNotifications && (
              <>
                <div 
                  className="fixed inset-0 z-[60]" 
                  onClick={() => setShowNotifications(false)}
                ></div>
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-80 glass-card p-4 z-[70] shadow-2xl border-white/10"
                >
                  <div className="flex justify-between items-center mb-4 pb-2 border-b border-white/10">
                    <h3 className="font-bold">Notifications</h3>
                    <button 
                      onClick={() => setNotifications(notifications.map(n => ({ ...n, read: true })))}
                      className="text-[10px] text-brand-primary font-bold uppercase hover:underline"
                    >
                      Mark all read
                    </button>
                  </div>
                  <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                    {notifications.length > 0 ? (
                      notifications.map(n => (
                        <div key={n.id} className={`p-3 rounded-xl transition-colors ${n.read ? 'bg-transparent' : 'bg-white/5 border border-white/5'}`}>
                          <div className="flex justify-between items-start mb-1">
                            <h4 className={`text-sm font-bold ${n.read ? 'text-white/70' : 'text-white'}`}>{n.title}</h4>
                            <span className="text-[10px] text-white/30">{n.time}</span>
                          </div>
                          <p className="text-xs text-white/50 leading-relaxed">{n.message}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-center py-8 text-white/30 text-sm italic">No new notifications</p>
                    )}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* Progress Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {skillCards.map((skill, idx) => (
          <motion.div 
            key={idx}
            whileHover={{ y: -5 }}
            onClick={() => onStartAssessment(skill.id)}
            className="glass-card p-6 relative overflow-hidden group cursor-pointer"
          >
            <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${skill.color} opacity-10 blur-2xl group-hover:opacity-20 transition-opacity`}></div>
            <div className="flex items-center gap-4 mb-4">
              <div className={`p-3 rounded-xl bg-gradient-to-br ${skill.color} shadow-lg`}>
                <skill.icon size={24} />
              </div>
              <h3 className="font-semibold text-lg">{skill.title}</h3>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-white/50">Progress</span>
                <span className="font-medium">{skill.progress}%</span>
              </div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${skill.progress}%` }}
                  className={`h-full bg-gradient-to-r ${skill.color}`}
                />
              </div>
              <p className="text-[10px] text-white/30 mt-2 italic group-hover:text-brand-primary transition-colors">Click to take assessment & boost progress</p>
            </div>
          </motion.div>
        ))}
      </section>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* AI Mentor Quick Access */}
          <div className="glass-card p-8 bg-gradient-to-br from-brand-primary/20 to-transparent border-brand-primary/20">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="w-20 h-20 bg-brand-primary rounded-full flex items-center justify-center shadow-2xl shadow-brand-primary/40 animate-pulse">
                <MessageSquare size={32} />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-2xl font-bold mb-2">Need Help with {user.department}?</h3>
                <p className="text-white/70 mb-4">Your AI Mentor is ready to assist you with coding, aptitude, or career advice.</p>
                <button 
                  onClick={() => setActiveTab('chat')}
                  className="btn-primary inline-flex items-center gap-2"
                >
                  Start Chatting <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Upcoming Contests */}
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold font-display">Upcoming Contests</h3>
              <button className="text-brand-primary text-sm font-semibold hover:underline">View All</button>
            </div>
            <div className="space-y-4">
              {contests.map((contest) => (
                <div key={contest.id} className="glass-card p-6 flex items-center justify-between group hover:bg-white/10 transition-colors">
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <span className="block text-2xl font-bold text-brand-primary">{contest.date.split('-')[2]}</span>
                      <span className="text-[10px] uppercase font-bold text-white/40">{new Date(contest.date).toLocaleString('default', { month: 'short' })}</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-lg group-hover:text-brand-primary transition-colors">{contest.title}</h4>
                      <p className="text-sm text-white/50">{contest.description}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      if (contest.registered) {
                        onStartTest(contest);
                      } else {
                        handleRegister(contest.id);
                      }
                    }}
                    className={`px-4 py-2 rounded-lg border text-sm font-bold transition-all ${
                      contest.registered 
                        ? 'border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white' 
                        : 'border-brand-primary/30 text-brand-primary hover:bg-brand-primary hover:text-white'
                    }`}
                  >
                    {contest.registered ? 'Start Test' : 'Register'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {/* Quick Actions */}
          <div className="glass-card p-6">
            <h3 className="font-bold mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Book Session', icon: Calendar, tab: 'sessions' },
                { label: 'Marketplace', icon: ShoppingBag, tab: 'marketplace' },
                { label: 'Contests', icon: Award, tab: 'contests' },
                { label: 'Feedback', icon: MessageCircle, tab: 'feedback' },
              ].map((action, i) => (
                <button 
                  key={i}
                  onClick={() => setActiveTab(action.tab)}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all border border-white/5"
                >
                  <action.icon size={20} className="text-brand-primary" />
                  <span className="text-xs font-medium">{action.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Subscription Promo */}
          {user.subscription !== 'premium' ? (
            <div className="glass-card p-6 bg-gradient-to-br from-yellow-500/10 to-transparent border-yellow-500/20">
              <div className="flex items-center gap-2 mb-3">
                <Star className="text-yellow-500 fill-yellow-500" size={20} />
                <h3 className="font-bold text-yellow-500">Go Premium</h3>
              </div>
              <p className="text-sm text-white/70 mb-4">Unlock advanced courses, unlimited AI mentoring, and exclusive contests.</p>
              <button 
                onClick={() => setActiveTab('subscription')}
                className="w-full py-3 rounded-xl bg-yellow-500 hover:bg-yellow-600 text-brand-dark font-bold transition-all shadow-lg shadow-yellow-500/20 active:scale-95"
              >
                Upgrade Now
              </button>
            </div>
          ) : (
            <div className="glass-card p-6 bg-gradient-to-br from-brand-primary/10 to-transparent border-brand-primary/20">
              <div className="flex items-center gap-2 mb-3">
                <Award className="text-brand-primary" size={20} />
                <h3 className="font-bold text-brand-primary">Premium Active</h3>
              </div>
              <p className="text-sm text-white/70 mb-4">You have full access to all features. Enjoy your learning journey!</p>
              <div className="w-full py-3 rounded-xl bg-brand-primary/10 text-brand-primary text-center font-bold border border-brand-primary/20">
                Member Since 2024
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const AIChat = ({ user, onBack }: { user: UserData, onBack: () => void }) => {
  const [messages, setMessages] = useState<{ role: 'user' | 'ai', text: string }[]>([
    { role: 'ai', text: `Hello ${user.name}! I'm your AI Mentor for ${user.department}. How can I help you today?` }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("API Key missing");
      }
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          { role: "user", parts: [{ text: `You are an AI Mentor for a student in the ${user.department} department. Help them with their study, career, coding, aptitude, or communication questions. Keep responses helpful, concise and encouraging. User says: ${userMsg}` }] }
        ],
        config: {
          systemInstruction: `You are a holistic skill development mentor at SkillUp AI. You specialize in ${user.department}.`
        }
      });
      
      setMessages(prev => [...prev, { role: 'ai', text: response.text || "I couldn't generate a response." }]);
    } catch (e) {
      console.error("Gemini Error:", e);
      setMessages(prev => [...prev, { role: 'ai', text: "Sorry, I'm having trouble connecting to my brain right now. Please check your API key configuration." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen pt-24 pb-24 px-6 flex flex-col max-w-4xl mx-auto">
      <BackButton onClick={onBack} />
      <div className="glass-card flex-1 flex flex-col overflow-hidden">
        <div className="p-4 border-bottom border-white/10 flex items-center gap-3 bg-white/5">
          <div className="w-10 h-10 bg-brand-primary rounded-full flex items-center justify-center">
            <MessageSquare size={20} />
          </div>
          <div>
            <h3 className="font-bold">AI Mentor</h3>
            <p className="text-[10px] text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span> Online
            </p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] p-4 rounded-2xl ${
                msg.role === 'user' 
                  ? 'bg-brand-primary text-white rounded-tr-none' 
                  : 'bg-white/10 text-white/90 rounded-tl-none border border-white/5'
              }`}>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
              </div>
            </motion.div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-white/10 p-4 rounded-2xl rounded-tl-none flex gap-2 items-center">
                <Loader2 className="animate-spin text-brand-primary" size={16} />
                <span className="text-xs text-white/50">AI is thinking...</span>
              </div>
            </div>
          )}
          <div ref={scrollRef} />
        </div>

        <div className="p-4 bg-brand-dark/50 border-t border-white/10">
          <div className="flex gap-2">
            <input 
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask about coding, aptitude, or career..."
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-primary transition-colors"
            />
            <button 
              onClick={handleSend}
              disabled={loading}
              className="p-3 bg-brand-primary rounded-xl hover:bg-brand-secondary transition-all disabled:opacity-50"
            >
              <Send size={24} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Courses = ({ user, onBack }: { user: UserData, onBack: () => void }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [filter, setFilter] = useState(user.department);
  const [enrolled, setEnrolled] = useState<number[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<Course | null>(null);
  const [statusMsg, setStatusMsg] = useState('');

  const showStatus = (msg: string) => {
    setStatusMsg(msg);
    setTimeout(() => setStatusMsg(''), 3000);
  };

  useEffect(() => {
    fetch(`/api/courses?department=${filter}`).then(res => res.json()).then(setCourses);
  }, [filter]);

  const handleEnroll = async (courseId: number) => {
    const res = await fetch('/api/courses/enroll', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: user.id, course_id: courseId }),
    });
    const data = await res.json();
    if (data.success) {
      setEnrolled(prev => [...prev, courseId]);
      showStatus('You are enrolled successfully!');
    }
  };

  const departments = ['CSE', 'ECE', 'MBA', 'Mechanical', 'Civil'];

  if (selectedVideo) {
    return (
      <div className="h-screen pt-24 pb-24 px-6 flex flex-col max-w-6xl mx-auto">
        <button 
          onClick={() => setSelectedVideo(null)}
          className="mb-6 flex items-center gap-2 text-white/60 hover:text-white transition-colors group"
        >
          <X size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span>Back to Courses</span>
        </button>
        
        <div className="flex-1 flex flex-col lg:flex-row gap-8 overflow-hidden">
          {/* Video Player Section */}
          <div className="flex-1 flex flex-col">
            <div className="aspect-video w-full bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/5">
              <iframe 
                width="100%" 
                height="100%" 
                src={selectedVideo.video_url} 
                title={selectedVideo.title}
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                allowFullScreen
              ></iframe>
            </div>
            <div className="mt-6">
              <h2 className="text-2xl font-bold mb-2">{selectedVideo.title}</h2>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-brand-primary flex items-center justify-center">
                    <User size={20} />
                  </div>
                  <div>
                    <p className="font-bold">{selectedVideo.instructor}</p>
                    <p className="text-xs text-white/40">Course Instructor</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 text-sm font-bold transition-all">
                    Like
                  </button>
                  <button className="px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 text-sm font-bold transition-all">
                    Share
                  </button>
                </div>
              </div>
              <div className="mt-6 p-4 rounded-xl bg-white/5 border border-white/5">
                <p className="text-sm text-white/70 leading-relaxed">
                  {selectedVideo.description}
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar / Notes Section */}
          <div className="lg:w-80 flex flex-col gap-6">
            <div className="glass-card p-6">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <BookOpen size={18} className="text-brand-primary" />
                Course Materials
              </h3>
              {selectedVideo.notes_url && (
                <a 
                  href={selectedVideo.notes_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all border border-white/5 group/note"
                >
                  <div className="w-8 h-8 rounded-lg bg-brand-primary/20 flex items-center justify-center text-brand-primary group-hover/note:bg-brand-primary group-hover/note:text-white transition-all">
                    <Plus size={16} />
                  </div>
                  <div>
                    <p className="text-xs font-bold">Lecture_Notes.pdf</p>
                    <p className="text-[10px] text-white/40">Download</p>
                  </div>
                </a>
              )}
            </div>

            <div className="glass-card p-6 flex-1 overflow-y-auto">
              <h3 className="font-bold mb-4">Up Next</h3>
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex gap-3 group cursor-pointer">
                    <div className="w-24 h-14 bg-white/5 rounded-lg overflow-hidden flex-shrink-0">
                      <img src={`https://picsum.photos/seed/${i+10}/100/60`} alt="Next" className="w-full h-full object-cover opacity-50 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div>
                      <p className="text-xs font-bold line-clamp-2 group-hover:text-brand-primary transition-colors">Module {i+1}: Advanced Concepts</p>
                      <p className="text-[10px] text-white/40">12:45</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-24 pt-24 px-6 max-w-7xl mx-auto">
      <BackButton onClick={onBack} />
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold font-display">Explore Courses</h2>
          <p className="text-white/60">Top-rated courses for your career growth</p>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto scrollbar-hide">
          {departments.map(d => (
            <button
              key={d}
              onClick={() => setFilter(d)}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                filter === d ? 'bg-brand-primary text-white' : 'bg-white/5 text-white/50 hover:bg-white/10'
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {statusMsg && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] bg-emerald-500 text-white px-6 py-3 rounded-xl shadow-2xl font-bold flex items-center gap-2"
          >
            <CheckCircle2 size={20} />
            {statusMsg}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {courses.map((course) => (
          <motion.div 
            key={course.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card overflow-hidden group flex flex-col"
          >
            <div className="relative h-48 overflow-hidden">
              <img 
                src={course.image} 
                alt={course.title} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-4 left-4 px-3 py-1 bg-brand-primary/90 backdrop-blur-md rounded-lg text-[10px] font-bold uppercase tracking-wider">
                {course.department}
              </div>
            </div>
            <div className="p-6 flex-1 flex flex-col">
              <h3 className="text-xl font-bold mb-2 group-hover:text-brand-primary transition-colors">{course.title}</h3>
              <p className="text-sm text-white/60 mb-4 line-clamp-2">{course.description}</p>
              
              {/* Notes Section */}
              {course.notes_url && (
                <div className="mt-auto pt-4 border-t border-white/5 mb-6">
                  <h4 className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-3">Study Materials</h4>
                  <a 
                    href={course.notes_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all border border-white/5 group/note"
                  >
                    <div className="w-8 h-8 rounded-lg bg-brand-primary/20 flex items-center justify-center text-brand-primary group-hover/note:bg-brand-primary group-hover/note:text-white transition-all">
                      <BookOpen size={16} />
                    </div>
                    <div>
                      <p className="text-xs font-bold">Lecture Notes.pdf</p>
                      <p className="text-[10px] text-white/40">Download Content</p>
                    </div>
                  </a>
                </div>
              )}

              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                    <User size={14} className="text-white/40" />
                  </div>
                  <span className="text-xs text-white/50">{course.instructor}</span>
                </div>
                <button 
                  onClick={() => {
                    if (enrolled.includes(course.id)) {
                      setSelectedVideo(course);
                    } else {
                      handleEnroll(course.id);
                    }
                  }}
                  className={`px-6 py-2 rounded-xl font-bold text-sm transition-all ${
                    enrolled.includes(course.id) 
                      ? 'bg-emerald-500 hover:bg-emerald-600 text-white' 
                      : 'bg-brand-primary hover:bg-brand-secondary text-white'
                  }`}
                >
                  {enrolled.includes(course.id) ? 'Watch Now' : 'Enroll Now'}
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const Marketplace = ({ user, onBack }: { user: UserData, onBack: () => void }) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [newBook, setNewBook] = useState({ title: '', price: '', department: user.department, location: '' });
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [isPosting, setIsPosting] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [isOrdering, setIsOrdering] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'details' | 'payment'>('details');
  const [paymentMethod, setPaymentMethod] = useState<string>('upi');
  const [cart, setCart] = useState<Book[]>([]);
  const [showCart, setShowCart] = useState(false);

  const fetchBooks = () => {
    fetch('/api/books').then(res => res.json()).then(setBooks);
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const showStatus = (text: string, type: 'success' | 'error' = 'success') => {
    setStatusMsg({ text, type });
    setTimeout(() => setStatusMsg(null), 3000);
  };

  const handleAddBook = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPosting(true);
    try {
      const res = await fetch('/api/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ...newBook, 
          price: parseFloat(newBook.price) || 0, 
          seller_id: user.id,
          image: `https://picsum.photos/seed/${Math.random()}/300/400`
        }),
      });
      if (res.ok) {
        setShowAdd(false);
        setNewBook({ title: '', price: '', department: user.department, location: '' });
        fetchBooks();
        showStatus('Book listed successfully!');
      }
    } catch (e) {
      showStatus('Failed to post ad', 'error');
    } finally {
      setIsPosting(false);
    }
  };

  const handleDeleteBook = async (bookId: number, skipConfirm = false) => {
    if (!skipConfirm && !confirm('Are you sure you want to delete this listing?')) return;
    
    // Optimistic update
    const previousBooks = [...books];
    setBooks(books.filter(b => b.id !== bookId));
    setDeletingId(bookId);

    try {
      const res = await fetch(`/api/books/${bookId}?user_id=${user.id}`, {
        method: 'DELETE',
      });
      
      if (res.ok) {
        showStatus('Listing deleted');
      } else {
        // Rollback on error
        setBooks(previousBooks);
        const errorData = await res.json();
        showStatus(errorData.message || 'Failed to delete', 'error');
      }
    } catch (e) {
      setBooks(previousBooks);
      showStatus('Network error', 'error');
    } finally {
      setDeletingId(null);
    }
  };

  const handleBuyBook = (book: Book) => {
    setSelectedBook(book);
    setPaymentStep('details');
    setShowCheckout(true);
  };

  const handleAddToCart = (book: Book) => {
    setCart(prev => [...prev, book]);
    showStatus(`${book.title} added to cart!`);
  };

  const handlePlaceOrder = async () => {
    if (paymentStep === 'details') {
      setPaymentStep('payment');
      return;
    }

    setIsOrdering(true);
    try {
      const res = await fetch('/api/books/buy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ book_id: selectedBook?.id }),
      });
      if (res.ok) {
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsOrdering(false);
        setShowCheckout(false);
        fetchBooks();
        showStatus('Order placed successfully! Seller notified.');
      } else {
        showStatus('Failed to place order', 'error');
      }
    } catch (e) {
      showStatus('Network error', 'error');
    } finally {
      setIsOrdering(false);
    }
  };

  return (
    <div className="pb-24 pt-24 px-6 max-w-7xl mx-auto">
      <BackButton onClick={onBack} />
      
      <AnimatePresence>
        {statusMsg && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-24 left-1/2 -translate-x-1/2 z-[110] text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 ${
              statusMsg.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'
            }`}
          >
            {statusMsg.type === 'success' ? <CheckCircle2 size={20} /> : <X size={20} />}
            <span>{statusMsg.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold font-display">Book Marketplace</h2>
          <p className="text-white/60">Buy or sell academic books within your campus</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setShowCart(true)}
            className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all relative"
          >
            <ShoppingCart size={20} />
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-brand-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {cart.length}
              </span>
            )}
          </button>
          <button 
            onClick={() => setShowAdd(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus size={20} /> Sell a Book
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {books.map((book) => (
          <motion.div 
            key={book.id}
            whileHover={{ y: -5 }}
            className={`glass-card overflow-hidden group ${book.stock === 0 ? 'opacity-75 grayscale-[0.5]' : ''}`}
          >
            <div className="aspect-[3/4] overflow-hidden relative">
              <img 
                src={book.image} 
                alt={book.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              {book.stock === 0 && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center">
                  <span className="px-3 py-1 bg-red-500 text-white text-[10px] font-bold uppercase tracking-widest rounded-full shadow-lg">
                    Out of Stock
                  </span>
                </div>
              )}
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start mb-1">
                <span className="text-[10px] font-bold text-brand-primary uppercase">{book.department}</span>
                {Number(book.seller_id) === Number(user.id) && (
                  <button 
                    onMouseEnter={() => {
                      if (deletingId !== book.id) {
                        handleDeleteBook(book.id, true);
                      }
                    }}
                    disabled={deletingId === book.id}
                    className="text-red-400 hover:text-red-500 transition-colors disabled:opacity-50 p-1 hover:bg-red-500/10 rounded-md group/del"
                    title="Hover to delete listing"
                  >
                    {deletingId === book.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} className="group-hover/del:scale-125 transition-transform" />}
                  </button>
                )}
              </div>
              <h3 className="font-bold text-sm mb-1 line-clamp-1">{book.title}</h3>
              <div className="flex items-center gap-1 text-white/40 text-[10px] mb-3">
                <MapPin size={10} />
                <span>{book.location || 'Campus Library'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-emerald-400">₹{book.price}</span>
                <button 
                  onClick={() => handleBuyBook(book)}
                  disabled={book.stock === 0}
                  className="p-2 rounded-lg bg-white/5 hover:bg-brand-primary transition-all group/buy disabled:opacity-50 disabled:hover:bg-white/5"
                >
                  <ShoppingBag size={16} className="group-hover/buy:scale-110 transition-transform" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {showCart && (
          <div className="fixed inset-0 z-[150] flex justify-end bg-brand-darker/80 backdrop-blur-sm">
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="w-full max-w-md bg-brand-dark border-l border-white/10 h-full flex flex-col"
            >
              <div className="p-6 border-b border-white/10 flex justify-between items-center">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <ShoppingCart size={20} className="text-brand-primary" />
                  Your Cart
                </h3>
                <button onClick={() => setShowCart(false)} className="p-2 hover:bg-white/5 rounded-full">
                  <X size={20} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-white/40">
                    <ShoppingCart size={48} className="mb-4 opacity-20" />
                    <p>Your cart is empty</p>
                  </div>
                ) : (
                  cart.map((item, i) => (
                    <div key={i} className="flex gap-4 p-3 rounded-xl bg-white/5 border border-white/5">
                      <img src={item.image} alt={item.title} className="w-16 h-20 object-cover rounded-lg" />
                      <div className="flex-1">
                        <h4 className="text-sm font-bold line-clamp-1">{item.title}</h4>
                        <p className="text-emerald-400 font-bold">₹{item.price}</p>
                        <button 
                          onClick={() => setCart(prev => prev.filter((_, idx) => idx !== i))}
                          className="text-[10px] text-red-400 hover:underline mt-2"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
              {cart.length > 0 && (
                <div className="p-6 border-t border-white/10 bg-white/5">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-white/60">Total</span>
                    <span className="text-xl font-bold text-emerald-400">₹{cart.reduce((acc, curr) => acc + curr.price, 0)}</span>
                  </div>
                  <button 
                    onClick={() => {
                      setShowCart(false);
                      showStatus('Checkout functionality coming soon!');
                    }}
                    className="w-full py-3 bg-brand-primary hover:bg-brand-secondary rounded-xl font-bold transition-all"
                  >
                    Proceed to Checkout
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}

        {showCheckout && selectedBook && (
          <div className="fixed inset-0 z-[160] flex items-center justify-center p-4 bg-brand-darker/90 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white text-gray-900 w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]"
            >
              {/* Product Image Section */}
              <div className="md:w-1/2 bg-gray-100 flex items-center justify-center p-8 relative">
                <button 
                  onClick={() => setShowCheckout(false)}
                  className="absolute top-4 left-4 p-2 rounded-full bg-white/80 text-gray-900 hover:bg-white shadow-md z-10 md:hidden"
                >
                  <X size={20} />
                </button>
                <img 
                  src={selectedBook.image} 
                  alt={selectedBook.title} 
                  className="max-w-full max-h-full object-contain shadow-xl rounded-lg"
                />
              </div>

              {/* Details Section */}
              <div className="md:w-1/2 p-8 overflow-y-auto">
                <div className="hidden md:flex justify-end mb-4">
                  <button onClick={() => setShowCheckout(false)} className="text-gray-400 hover:text-gray-900 transition-colors">
                    <X size={24} />
                  </button>
                </div>

                {paymentStep === 'details' ? (
                  <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="mb-6">
                      <h2 className="text-2xl font-bold mb-2">{selectedBook.title}</h2>
                      <div className="flex items-center gap-2 mb-4">
                        <div className="flex text-yellow-400">
                          {[1, 2, 3, 4, 5].map(i => <Star key={i} size={16} fill="currentColor" />)}
                        </div>
                        <span className="text-blue-600 text-sm hover:underline cursor-pointer">42 ratings</span>
                      </div>
                      <div className="h-[1px] bg-gray-200 w-full mb-6" />
                      
                      <div className="flex items-baseline gap-2 mb-2">
                        <span className="text-red-600 text-2xl font-light">-15%</span>
                        <span className="text-3xl font-bold">₹{selectedBook.price}</span>
                      </div>
                      <p className="text-sm text-gray-500 mb-4">M.R.P.: <span className="line-through">₹{Math.round(selectedBook.price * 1.15)}</span></p>
                      
                      <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 mb-6">
                        <div className="flex items-center gap-2 text-emerald-700 font-bold mb-1">
                          <CheckCircle2 size={18} />
                          <span>In Stock</span>
                        </div>
                        <p className="text-xs text-emerald-600">Eligible for FREE Shipping within campus.</p>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center gap-3 text-sm">
                          <MapPin size={18} className="text-gray-400" />
                          <span>Deliver to <span className="font-bold">{user.name}</span> - {selectedBook.location || 'Campus Library'}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                          <ShoppingBag size={18} className="text-gray-400" />
                          <span>Sold by <span className="text-blue-600 font-medium">Student Seller #{selectedBook.seller_id}</span></span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <button 
                        onClick={() => setPaymentStep('payment')}
                        className="w-full py-3 rounded-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold shadow-sm transition-all flex items-center justify-center gap-2"
                      >
                        Buy Now
                      </button>
                      <button 
                        onClick={() => {
                          handleAddToCart(selectedBook);
                          setShowCheckout(false);
                        }}
                        className="w-full py-3 rounded-full bg-orange-400 hover:bg-orange-500 text-gray-900 font-bold shadow-sm transition-all"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                    <button 
                      onClick={() => setPaymentStep('details')}
                      className="text-sm text-blue-600 hover:underline mb-6 flex items-center gap-1"
                    >
                      ← Back to details
                    </button>
                    <h2 className="text-xl font-bold mb-6">Select Payment Method</h2>
                    
                    <div className="space-y-3 mb-8">
                      {[
                        { id: 'upi', label: 'UPI (GPay, PhonePe, Paytm)', icon: Wallet },
                        { id: 'card', label: 'Credit or Debit Card', icon: CreditCard },
                        { id: 'cash', label: 'Cash on Handover', icon: Banknote },
                      ].map(method => (
                        <button
                          key={method.id}
                          onClick={() => setPaymentMethod(method.id)}
                          className={`w-full p-4 rounded-xl border-2 flex items-center gap-4 transition-all ${
                            paymentMethod === method.id 
                              ? 'border-brand-primary bg-brand-primary/5' 
                              : 'border-gray-100 hover:border-gray-200'
                          }`}
                        >
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            paymentMethod === method.id ? 'bg-brand-primary text-white' : 'bg-gray-100 text-gray-400'
                          }`}>
                            <method.icon size={20} />
                          </div>
                          <span className="font-bold text-sm">{method.label}</span>
                          <div className={`ml-auto w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            paymentMethod === method.id ? 'border-brand-primary' : 'border-gray-200'
                          }`}>
                            {paymentMethod === method.id && <div className="w-2.5 h-2.5 bg-brand-primary rounded-full" />}
                          </div>
                        </button>
                      ))}
                    </div>

                    <div className="bg-gray-50 p-4 rounded-xl mb-8">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-500">Item Total:</span>
                        <span>₹{selectedBook.price}</span>
                      </div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-500">Delivery:</span>
                        <span className="text-emerald-600 font-bold">FREE</span>
                      </div>
                      <div className="h-[1px] bg-gray-200 my-3" />
                      <div className="flex justify-between font-bold text-lg">
                        <span>Order Total:</span>
                        <span className="text-red-600">₹{selectedBook.price}</span>
                      </div>
                    </div>

                    <button 
                      onClick={handlePlaceOrder}
                      disabled={isOrdering}
                      className="w-full py-4 rounded-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold shadow-lg transition-all flex items-center justify-center gap-2"
                    >
                      {isOrdering ? <Loader2 className="animate-spin" /> : 'Place Your Order'}
                    </button>
                    <p className="text-[10px] text-center text-gray-400 mt-4">
                      By placing your order, you agree to SkillUp AI's conditions of use and privacy notice.
                    </p>
                  </div>
                )}

                <div className="mt-8 text-xs text-gray-500 leading-relaxed">
                  <p className="font-bold mb-2">About this item</p>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>Authentic academic resource for {selectedBook.department} students.</li>
                    <li>Well-maintained condition, minimal markings.</li>
                    <li>Quick campus handover at {selectedBook.location || 'Library'}.</li>
                    <li>Support fellow students by buying pre-owned.</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {showAdd && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-brand-darker/80 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="glass-card w-full max-w-md p-8 relative"
            >
              <button onClick={() => setShowAdd(false)} className="absolute top-4 right-4 text-white/50 hover:text-white">
                <X size={24} />
              </button>
              <h3 className="text-2xl font-bold mb-6">List Your Book</h3>
              <form onSubmit={handleAddBook} className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-white/70">Book Title</label>
                  <input 
                    required
                    type="text" 
                    value={newBook.title}
                    onChange={e => setNewBook({...newBook, title: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 mt-1 focus:outline-none focus:border-brand-primary"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-white/70">Price (₹)</label>
                  <input 
                    required
                    type="number" 
                    value={newBook.price}
                    onChange={e => setNewBook({...newBook, price: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 mt-1 focus:outline-none focus:border-brand-primary"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-white/70">Pickup Location</label>
                  <input 
                    required
                    type="text" 
                    placeholder="e.g. Block A, Library, Hostel 3"
                    value={newBook.location}
                    onChange={e => setNewBook({...newBook, location: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 mt-1 focus:outline-none focus:border-brand-primary"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-white/70">Department</label>
                  <select 
                    value={newBook.department}
                    onChange={e => setNewBook({...newBook, department: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 mt-1 focus:outline-none focus:border-brand-primary appearance-none"
                  >
                    {['CSE', 'ECE', 'MBA', 'Mechanical', 'Civil', 'Science', 'Arts', 'Medical', 'Law'].map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <button 
                  type="submit" 
                  disabled={isPosting}
                  className="btn-primary w-full mt-4 flex items-center justify-center gap-2"
                >
                  {isPosting ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      Posting...
                    </>
                  ) : 'Post Ad'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Sessions = ({ user, onBack }: { user: UserData, onBack: () => void }) => {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [mentor, setMentor] = useState('Dr. Sarah (AI Specialist)');
  const [booked, setBooked] = useState(false);

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/sessions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: user.id, mentor_name: mentor, date, time }),
    });
    if (res.ok) setBooked(true);
  };

  return (
    <div className="pb-24 pt-24 px-6 max-w-4xl mx-auto">
      <BackButton onClick={onBack} />
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold font-display mb-4">Book a Session</h2>
        <p className="text-white/60">Get personalized mentorship or clear your doubts with experts.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <h3 className="text-xl font-bold">Select Mentor</h3>
          {[
            { name: 'Dr. Sarah', role: 'AI Specialist', img: 'https://picsum.photos/seed/sarah/100' },
            { name: 'Prof. James', role: 'Aptitude Expert', img: 'https://picsum.photos/seed/james/100' },
            { name: 'Ms. Emily', role: 'Comm. Coach', img: 'https://picsum.photos/seed/emily/100' },
          ].map((m, i) => (
            <div 
              key={i}
              onClick={() => setMentor(m.name)}
              className={`glass-card p-4 flex items-center gap-4 cursor-pointer border-2 transition-all ${
                mentor.includes(m.name) ? 'border-brand-primary bg-brand-primary/10' : 'border-transparent hover:bg-white/5'
              }`}
            >
              <img src={m.img} alt={m.name} className="w-12 h-12 rounded-full object-cover" />
              <div>
                <h4 className="font-bold">{m.name}</h4>
                <p className="text-xs text-white/50">{m.role}</p>
              </div>
              {mentor.includes(m.name) && <CheckCircle2 className="ml-auto text-brand-primary" />}
            </div>
          ))}
        </div>

        <div className="glass-card p-8">
          {booked ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12"
            >
              <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={48} className="text-emerald-500" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Session Booked!</h3>
              <p className="text-white/60 mb-6">You will receive a meeting link via email shortly.</p>
              <button onClick={() => setBooked(false)} className="btn-primary">Book Another</button>
            </motion.div>
          ) : (
            <form onSubmit={handleBook} className="space-y-6">
              <div>
                <label className="text-sm font-medium text-white/70">Date</label>
                <input 
                  required
                  type="date" 
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 mt-1 focus:outline-none focus:border-brand-primary"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-white/70">Time Slot</label>
                <select 
                  required
                  value={time}
                  onChange={e => setTime(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 mt-1 focus:outline-none focus:border-brand-primary appearance-none"
                >
                  <option value="" className="bg-brand-dark">Select Time</option>
                  <option value="10:00 AM" className="bg-brand-dark">10:00 AM - 11:00 AM</option>
                  <option value="02:00 PM" className="bg-brand-dark">02:00 PM - 03:00 PM</option>
                  <option value="04:00 PM" className="bg-brand-dark">04:00 PM - 05:00 PM</option>
                  <option value="07:00 PM" className="bg-brand-dark">07:00 PM - 08:00 PM</option>
                </select>
              </div>
              <button type="submit" className="btn-primary w-full">Confirm Booking</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

const Subscription = ({ user, onUpdate, onBack }: { user: UserData, onUpdate: (u: UserData) => void, onBack: () => void }) => {
  const plans = [
    { 
      name: 'Free', 
      price: '0', 
      features: ['Basic Courses', 'Limited AI Chat', 'Public Contests'],
      current: user.subscription === 'free'
    },
    { 
      name: 'Premium', 
      price: '499', 
      features: ['Advanced Courses', 'Unlimited AI Mentor', 'Exclusive Contests', '1-on-1 Sessions', 'Certificate of Completion'],
      current: user.subscription === 'premium',
      popular: true
    }
  ];

  const handleUpgrade = async () => {
    // Mock upgrade
    const updatedUser = { ...user, subscription: 'premium' };
    onUpdate(updatedUser);
  };

  return (
    <div className="pb-24 pt-24 px-6 max-w-5xl mx-auto">
      <BackButton onClick={onBack} />
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold font-display mb-4">Choose Your Plan</h2>
        <p className="text-white/60">Unlock your full potential with SkillUp AI Premium.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {plans.map((plan, i) => (
          <motion.div 
            key={i}
            whileHover={{ scale: 1.02 }}
            className={`glass-card p-8 relative ${plan.popular ? 'border-brand-primary border-2 shadow-2xl shadow-brand-primary/20' : ''}`}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-brand-primary px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                Most Popular
              </div>
            )}
            <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-4xl font-bold">₹{plan.price}</span>
              <span className="text-white/50">/month</span>
            </div>
            <ul className="space-y-4 mb-8">
              {plan.features.map((f, j) => (
                <li key={j} className="flex items-center gap-3 text-sm text-white/80">
                  <CheckCircle2 size={18} className="text-brand-primary shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <button 
              disabled={plan.current}
              onClick={plan.name === 'Premium' ? handleUpgrade : undefined}
              className={`w-full py-4 rounded-xl font-bold transition-all ${
                plan.current 
                  ? 'bg-white/5 text-white/30 cursor-default' 
                  : plan.popular ? 'btn-primary' : 'bg-white/10 hover:bg-white/20'
              }`}
            >
              {plan.current ? 'Current Plan' : 'Get Started'}
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const Feedback = ({ user, onBack }: { user: UserData, onBack: () => void }) => {
  const [content, setContent] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: user.id, content }),
    });
    if (res.ok) setSubmitted(true);
  };

  return (
    <div className="pb-24 pt-24 px-6 max-w-2xl mx-auto">
      <BackButton onClick={onBack} />
      <div className="glass-card p-8">
        <h2 className="text-3xl font-bold font-display mb-2">Share Your Feedback</h2>
        <p className="text-white/60 mb-8">Help us improve SkillUp AI for students like you.</p>

        {submitted ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={48} className="text-emerald-500" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Thank You!</h3>
            <p className="text-white/60 mb-6">Your feedback has been received.</p>
            <button onClick={() => setSubmitted(false)} className="btn-primary">Submit More</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="text-sm font-medium text-white/70">Your Message</label>
              <textarea 
                required
                rows={5}
                value={content}
                onChange={e => setContent(e.target.value)}
                placeholder="Tell us what you think..."
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 mt-1 focus:outline-none focus:border-brand-primary resize-none"
              />
            </div>
            <button type="submit" className="btn-primary w-full">Submit Feedback</button>
          </form>
        )}
      </div>
    </div>
  );
};

const ContestTest = ({ contest, onBack }: { contest: Contest, onBack: () => void }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [finished, setFinished] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/contests/${contest.id}/questions`)
      .then(res => res.json())
      .then(data => {
        setQuestions(data);
        setLoading(false);
      });
  }, [contest.id]);

  const handleSelect = (optIdx: number) => {
    setAnswers({ ...answers, [questions[currentIdx].id]: optIdx });
  };

  const calculateScore = () => {
    let score = 0;
    questions.forEach(q => {
      if (answers[q.id] === q.correct_option) score++;
    });
    return score;
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-brand-primary" size={48} /></div>;

  if (finished) {
    const score = calculateScore();
    return (
      <div className="min-h-screen pt-24 px-6 flex flex-col items-center justify-center max-w-2xl mx-auto">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass-card p-12 text-center w-full">
          <Award className="text-yellow-500 mx-auto mb-6" size={64} />
          <h2 className="text-3xl font-bold mb-4">Test Completed!</h2>
          <p className="text-white/60 mb-8">You scored {score} out of {questions.length}</p>
          <div className="text-5xl font-bold text-brand-primary mb-12">{Math.round((score / questions.length) * 100)}%</div>
          <button onClick={onBack} className="btn-primary w-full">Back to Dashboard</button>
        </motion.div>
      </div>
    );
  }

  const q = questions[currentIdx];

  return (
    <div className="min-h-screen pt-24 px-6 max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold font-display">{contest.title}</h2>
          <p className="text-white/50">Question {currentIdx + 1} of {questions.length}</p>
        </div>
        <button onClick={onBack} className="text-white/50 hover:text-white">Exit Test</button>
      </div>

      <div className="glass-card p-8 mb-8">
        <h3 className="text-xl font-medium mb-8">{q.question}</h3>
        <div className="space-y-4">
          {q.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              className={`w-full p-4 rounded-xl border text-left transition-all ${
                answers[q.id] === i 
                  ? 'border-brand-primary bg-brand-primary/10 text-white' 
                  : 'border-white/10 bg-white/5 text-white/70 hover:bg-white/10'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs ${
                  answers[q.id] === i ? 'border-brand-primary bg-brand-primary' : 'border-white/20'
                }`}>
                  {String.fromCharCode(65 + i)}
                </div>
                {opt}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-between">
        <button 
          disabled={currentIdx === 0}
          onClick={() => setCurrentIdx(currentIdx - 1)}
          className="px-6 py-3 rounded-xl bg-white/5 text-white/50 disabled:opacity-20"
        >
          Previous
        </button>
        {currentIdx === questions.length - 1 ? (
          <button 
            onClick={() => setFinished(true)}
            className="btn-primary px-12"
          >
            Finish Test
          </button>
        ) : (
          <button 
            onClick={() => setCurrentIdx(currentIdx + 1)}
            className="btn-primary px-12"
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
};

const SkillAssessment = ({ type, user, onBack, onComplete }: { type: string, user: UserData, onBack: () => void, onComplete: (newProgress: number) => void }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [finished, setFinished] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const codingCategories = [
    { id: 'arrays', title: 'Arrays & Hashing', icon: '📊', count: 15 },
    { id: 'strings', title: 'String Manipulation', icon: '🔤', count: 12 },
    { id: 'linked_lists', title: 'Linked Lists', icon: '🔗', count: 10 },
    { id: 'stacks', title: 'Stacks & Queues', icon: '📚', count: 8 },
    { id: 'trees', title: 'Trees & Graphs', icon: '🌳', count: 14 },
    { id: 'dp', title: 'Dynamic Programming', icon: '🧠', count: 20 },
  ];

  const aptitudeCategories = [
    { id: 'quant', title: 'Quantitative Aptitude', icon: '🔢', count: 20 },
    { id: 'logical', title: 'Logical Reasoning', icon: '🧩', count: 15 },
    { id: 'data', title: 'Data Interpretation', icon: '📈', count: 10 },
    { id: 'verbal_reasoning', title: 'Verbal Reasoning', icon: '🗣️', count: 12 },
  ];

  const commCategories = [
    { id: 'verbal_ability', title: 'Verbal Ability', icon: '📖', count: 15 },
    { id: 'reading', title: 'Reading Comprehension', icon: '📑', count: 8 },
    { id: 'etiquette', title: 'Professional Etiquette', icon: '👔', count: 12 },
    { id: 'non_verbal', title: 'Non-Verbal Comm', icon: '🤝', count: 10 },
  ];

  const skillData: Record<string, { title: string, questions: any }> = {
    coding: {
      title: 'Coding Skills Assessment',
      questions: {
        arrays: [
          { id: 101, question: "What is the time complexity of accessing an element in an array by index?", options: ["O(1)", "O(n)", "O(log n)", "O(n^2)"], correct: 0 },
          { id: 102, question: "Which of these is NOT a characteristic of a static array?", options: ["Fixed size", "Contiguous memory", "Dynamic resizing", "Fast access"], correct: 2 },
          { id: 103, question: "In a 2D array arr[3][4], how many elements are there?", options: ["7", "12", "16", "34"], correct: 1 },
          { id: 104, question: "What is the result of deleting an element from the middle of an array of size n?", options: ["O(1)", "O(log n)", "O(n)", "O(n^2)"], correct: 2 },
          { id: 105, question: "Which algorithm is used to find the maximum sum subarray?", options: ["Binary Search", "Kadane's Algorithm", "Dijkstra's", "Kruskal's"], correct: 1 },
        ],
        strings: [
          { id: 201, question: "What is the time complexity of checking if a string is a palindrome?", options: ["O(1)", "O(n)", "O(n^2)", "O(log n)"], correct: 1 },
          { id: 202, question: "Which function is used to find the length of a string in C++?", options: ["size()", "length()", "Both", "None"], correct: 2 },
          { id: 203, question: "What is a 'substring'?", options: ["A non-contiguous sequence", "A contiguous sequence", "A reversed string", "A prefix only"], correct: 1 },
          { id: 204, question: "Which data structure is best for prefix matching?", options: ["Hash Map", "Trie", "Stack", "Queue"], correct: 1 },
          { id: 205, question: "What is the result of 'abc' + 'def' in most languages?", options: ["'abc def'", "'abcdef'", "'abc+def'", "Error"], correct: 1 },
        ],
        linked_lists: [
          { id: 301, question: "What is the time complexity to insert at the head of a linked list?", options: ["O(1)", "O(n)", "O(log n)", "O(n^2)"], correct: 0 },
          { id: 302, question: "Which linked list allows traversal in both directions?", options: ["Singly Linked List", "Doubly Linked List", "Circular Linked List", "None"], correct: 1 },
          { id: 303, question: "What does the 'next' pointer in the last node of a singly linked list point to?", options: ["Head", "Previous node", "NULL", "Itself"], correct: 2 },
          { id: 304, question: "How do you detect a cycle in a linked list?", options: ["Binary Search", "Floyd's Cycle-Finding Algorithm", "Merge Sort", "Quick Sort"], correct: 1 },
          { id: 305, question: "What is the main disadvantage of a linked list compared to an array?", options: ["Dynamic size", "No random access", "Contiguous memory", "Easy insertion"], correct: 1 },
        ],
        stacks: [
          { id: 401, question: "Which principle does a Stack follow?", options: ["FIFO", "LIFO", "LILO", "None"], correct: 1 },
          { id: 402, question: "Which operation is used to add an element to a stack?", options: ["Pop", "Push", "Peek", "Enqueue"], correct: 1 },
          { id: 403, question: "What is 'Stack Overflow'?", options: ["Popping from empty stack", "Pushing to full stack", "Accessing middle element", "None"], correct: 1 },
          { id: 404, question: "Which application uses a stack?", options: ["Breadth First Search", "Function Call Management", "Task Scheduling", "Buffer Management"], correct: 1 },
          { id: 405, question: "What is the time complexity of 'Peek' operation?", options: ["O(1)", "O(n)", "O(log n)", "O(n^2)"], correct: 0 },
        ],
        trees: [
          { id: 501, question: "What is the maximum number of children a node in a binary tree can have?", options: ["1", "2", "3", "Unlimited"], correct: 1 },
          { id: 502, question: "Which traversal visits nodes in the order: Left, Root, Right?", options: ["Pre-order", "In-order", "Post-order", "Level-order"], correct: 1 },
          { id: 503, question: "What is the height of a balanced binary tree with n nodes?", options: ["O(n)", "O(log n)", "O(n^2)", "O(1)"], correct: 1 },
          { id: 504, question: "Which data structure is used for Level Order Traversal?", options: ["Stack", "Queue", "Hash Map", "Linked List"], correct: 1 },
          { id: 505, question: "In a Binary Search Tree, where are values smaller than the root located?", options: ["Right subtree", "Left subtree", "Both", "None"], correct: 1 },
        ],
        dp: [
          { id: 601, question: "What are the two main properties of Dynamic Programming?", options: ["Greedy and Sorting", "Overlapping Subproblems and Optimal Substructure", "Recursion and Iteration", "None"], correct: 1 },
          { id: 602, question: "What is 'Memoization'?", options: ["Bottom-up approach", "Top-down approach", "Iterative approach", "None"], correct: 1 },
          { id: 603, question: "Which problem is a classic example of DP?", options: ["Binary Search", "Knapsack Problem", "Quick Sort", "Linear Search"], correct: 1 },
          { id: 604, question: "What is the time complexity of finding the nth Fibonacci number using DP?", options: ["O(2^n)", "O(n)", "O(log n)", "O(n^2)"], correct: 1 },
          { id: 605, question: "What is the 'Tabulation' method in DP?", options: ["Recursive approach", "Iterative bottom-up approach", "Greedy approach", "None"], correct: 1 },
        ]
      }
    },
    aptitude: {
      title: 'Aptitude Assessment',
      questions: {
        quant: [
          { id: 701, question: "If a car travels at 60 km/h, how far does it travel in 2.5 hours?", options: ["120 km", "140 km", "150 km", "160 km"], correct: 2 },
          { id: 702, question: "What is 25% of 80?", options: ["15", "20", "25", "30"], correct: 1 },
          { id: 703, question: "A shopkeeper sells an item for ₹120 with a 20% profit. What was the cost price?", options: ["₹100", "₹90", "₹110", "₹95"], correct: 0 },
          { id: 704, question: "If the ratio of two numbers is 3:4 and their sum is 70, what is the smaller number?", options: ["20", "30", "40", "50"], correct: 1 },
          { id: 705, question: "What is the average of first five prime numbers?", options: ["5.2", "5.4", "5.6", "5.8"], correct: 2 },
        ],
        logical: [
          { id: 801, question: "Find the missing number: 1, 4, 9, 16, ?", options: ["20", "24", "25", "30"], correct: 2 },
          { id: 802, question: "If 'APPLE' is coded as 'BQQMF', how is 'BANANA' coded?", options: ["CBOBOB", "CBPOPO", "CBOBPB", "DBPBPB"], correct: 0 },
          { id: 803, question: "Pointing to a man, a woman said, 'His mother is the only daughter of my mother.' How is the woman related to the man?", options: ["Sister", "Mother", "Aunt", "Grandmother"], correct: 1 },
          { id: 804, question: "Which word does not belong with the others?", options: ["Leopard", "Cougar", "Tiger", "Elephant"], correct: 3 },
          { id: 805, question: "If 3x + 5 = 20, what is the value of x?", options: ["3", "4", "5", "6"], correct: 2 },
        ],
        data: [
          { id: 901, question: "In a pie chart representing expenses, Rent is 90 degrees. What percentage of total expenses is Rent?", options: ["20%", "25%", "30%", "35%"], correct: 1 },
          { id: 902, question: "If a bar graph shows sales of 50, 70, 40, 60 units in 4 months, what is the total sales?", options: ["200", "220", "240", "260"], correct: 1 },
          { id: 903, question: "What is the median of the data: 10, 20, 30, 40, 50?", options: ["20", "25", "30", "35"], correct: 2 },
          { id: 904, question: "If a table shows 500 students and 40% are girls, how many are boys?", options: ["200", "250", "300", "350"], correct: 2 },
          { id: 905, question: "What is the mode of the data: 2, 3, 3, 4, 5, 5, 5, 6?", options: ["3", "4", "5", "6"], correct: 2 },
        ],
        verbal_reasoning: [
          { id: 1001, question: "Find the odd one out: Book, Pen, Pencil, Laptop", options: ["Book", "Pen", "Pencil", "Laptop"], correct: 3 },
          { id: 1002, question: "Complete the analogy: Ocean : Water :: Desert : ?", options: ["Sand", "Heat", "Cactus", "Camel"], correct: 0 },
          { id: 1003, question: "If all A are B and all B are C, then:", options: ["All A are C", "Some A are not C", "No A is C", "None"], correct: 0 },
          { id: 1004, question: "Choose the synonym of 'Abundant':", options: ["Scarcity", "Plentiful", "Rare", "Small"], correct: 1 },
          { id: 1005, question: "Rearrange 'T-E-L-P-A' to form a meaningful word:", options: ["PLATE", "PLEAT", "LEAPT", "All of these"], correct: 3 },
        ]
      }
    },
    comm: {
      title: 'Communication Skills Assessment',
      questions: {
        verbal_ability: [
          { id: 1101, question: "Which of these is a synonym for 'Eloquent'?", options: ["Silent", "Articulate", "Confused", "Rude"], correct: 1 },
          { id: 1102, question: "Choose the correct spelling:", options: ["Accomodate", "Accommodate", "Acomodate", "Acommodate"], correct: 1 },
          { id: 1103, question: "What is the antonym of 'Optimistic'?", options: ["Hopeful", "Pessimistic", "Cheerful", "Neutral"], correct: 1 },
          { id: 1104, question: "Identify the part of speech for 'Quickly':", options: ["Noun", "Verb", "Adverb", "Adjective"], correct: 2 },
          { id: 1105, question: "Complete the sentence: 'She ___ to the store yesterday.'", options: ["go", "goes", "went", "gone"], correct: 2 },
        ],
        reading: [
          { id: 1201, question: "What is the primary goal of skimming a text?", options: ["Detailed analysis", "Finding specific facts", "Getting the general idea", "Memorizing"], correct: 2 },
          { id: 1202, question: "What does 'context clues' mean?", options: ["Dictionary definitions", "Hints within the text", "Pictures", "Page numbers"], correct: 1 },
          { id: 1203, question: "What is an 'inference'?", options: ["A direct quote", "A conclusion based on evidence", "A summary", "A title"], correct: 1 },
          { id: 1204, question: "Which part of a passage usually contains the main idea?", options: ["First paragraph", "Last paragraph", "Middle", "Both A and B"], correct: 3 },
          { id: 1205, question: "What is 'active reading'?", options: ["Reading while walking", "Engaging with the text", "Reading fast", "Reading aloud"], correct: 1 },
        ],
        etiquette: [
          { id: 1301, question: "Which is the most formal way to start an email to a professor?", options: ["Hey!", "Hi there,", "Dear Professor,", "Yo Prof,"], correct: 2 },
          { id: 1302, question: "What should you do if you are running late for a meeting?", options: ["Ignore it", "Inform the host immediately", "Just walk in late", "Cancel without notice"], correct: 1 },
          { id: 1303, question: "In a professional setting, when should you use 'Reply All'?", options: ["Always", "Never", "Only when everyone needs the info", "When you want to show off"], correct: 2 },
          { id: 1304, question: "What is the appropriate way to introduce yourself in an interview?", options: ["Just say your name", "Name and a brief professional summary", "Talk about your hobbies", "Wait for them to ask"], correct: 1 },
          { id: 1305, question: "How should you handle a disagreement in a team meeting?", options: ["Shout", "Stay silent", "Express your view respectfully", "Leave the room"], correct: 2 },
        ],
        non_verbal: [
          { id: 1401, question: "What does maintaining eye contact usually signal?", options: ["Aggression", "Confidence and interest", "Boredom", "Dishonesty"], correct: 1 },
          { id: 1402, question: "What is the first step in active listening?", options: ["Interrupting", "Paying attention", "Formulating a response", "Checking your phone"], correct: 1 },
          { id: 1403, question: "What does 'empathy' mean in communication?", options: ["Speaking loudly", "Understanding others' feelings", "Ignoring feedback", "Using complex words"], correct: 1 },
          { id: 1404, question: "Which of these is a non-verbal communication cue?", options: ["Vocabulary", "Eye contact", "Tone of voice", "Sentence structure"], correct: 1 },
          { id: 1405, question: "What does crossing your arms often communicate?", options: ["Openness", "Defensiveness or discomfort", "Happiness", "Agreement"], correct: 1 },
        ]
      }
    }
  };

  const data = skillData[type] || skillData.coding;
  
  // Determine which questions to show
  let questions: any[] = [];
  if (selectedCategory) {
    questions = (data.questions as any)[selectedCategory] || [];
  }

  const handleSelect = (optIdx: number) => {
    setAnswers({ ...answers, [questions[currentIdx].id]: optIdx });
  };

  const calculateScore = () => {
    let score = 0;
    questions.forEach(q => {
      if (answers[q.id] === q.correct) score++;
    });
    return score;
  };

  const handleFinish = async () => {
    const score = calculateScore();
    const performance = Math.round((score / questions.length) * 100);
    
    // Update progress on server
    const currentProgress = type === 'coding' ? user.coding_progress : type === 'aptitude' ? user.aptitude_progress : user.comm_progress;
    const boost = Math.round(performance / 10); // Smaller boost for categorized tests
    const newProgress = Math.min(100, currentProgress + boost);

    await fetch('/api/user/update-progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: user.id, type, value: newProgress }),
    });

    onComplete(newProgress);
    setFinished(true);
  };

  if (!selectedCategory) {
    const categories = type === 'coding' ? codingCategories : type === 'aptitude' ? aptitudeCategories : commCategories;
    const title = type === 'coding' ? 'Coding Practice' : type === 'aptitude' ? 'Aptitude Practice' : 'Communication Practice';
    
    return (
      <div className="min-h-screen pt-24 px-6 max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl font-bold font-display">{title}</h2>
            <p className="text-white/60">Select a topic to start practicing and boost your progress</p>
          </div>
          <button onClick={onBack} className="text-white/50 hover:text-white">Back</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <motion.div
              key={cat.id}
              whileHover={{ y: -5, scale: 1.02 }}
              onClick={() => setSelectedCategory(cat.id)}
              className="glass-card p-8 cursor-pointer group hover:border-brand-primary/50 transition-all"
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform inline-block">{cat.icon}</div>
              <h3 className="text-xl font-bold mb-2">{cat.title}</h3>
              <p className="text-white/40 text-sm mb-6">{cat.count} curated questions</p>
              <div className="flex items-center text-brand-primary font-bold text-sm">
                Start Topic <ChevronRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  if (finished) {
    const score = calculateScore();
    const categories = type === 'coding' ? codingCategories : type === 'aptitude' ? aptitudeCategories : commCategories;
    return (
      <div className="min-h-screen pt-24 px-6 flex flex-col items-center justify-center max-w-2xl mx-auto">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass-card p-12 text-center w-full">
          <Award className="text-brand-primary mx-auto mb-6" size={64} />
          <h2 className="text-3xl font-bold mb-4">Topic Complete!</h2>
          <p className="text-white/60 mb-8">You scored {score} out of {questions.length} in {selectedCategory ? categories.find(c => c.id === selectedCategory)?.title : type}</p>
          <div className="text-5xl font-bold text-brand-primary mb-6">{Math.round((score / questions.length) * 100)}%</div>
          <p className="text-emerald-400 font-medium mb-12">Your {type} progress has increased!</p>
          <div className="flex gap-4">
            <button onClick={() => { setFinished(false); setSelectedCategory(null); setCurrentIdx(0); setAnswers({}); }} className="btn-primary flex-1">Try Another Topic</button>
            <button onClick={onBack} className="px-8 py-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all">Dashboard</button>
          </div>
        </motion.div>
      </div>
    );
  }

  const q = questions[currentIdx];
  const categories = type === 'coding' ? codingCategories : type === 'aptitude' ? aptitudeCategories : commCategories;

  if (!q) return <div className="pt-24 text-center">Loading questions...</div>;

  return (
    <div className="min-h-screen pt-24 px-6 max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold font-display">
            {categories.find(c => c.id === selectedCategory)?.title}
          </h2>
          <p className="text-white/50">Question {currentIdx + 1} of {questions.length}</p>
        </div>
        <button onClick={() => { setSelectedCategory(null); setCurrentIdx(0); setAnswers({}); }} className="text-white/50 hover:text-white">Exit Topic</button>
      </div>

      <div className="glass-card p-8 mb-8">
        <h3 className="text-xl font-medium mb-8 leading-relaxed">{q.question}</h3>
        <div className="space-y-4">
          {q.options.map((opt: string, i: number) => (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              className={`w-full p-4 rounded-xl border text-left transition-all ${
                answers[q.id] === i 
                  ? 'border-brand-primary bg-brand-primary/10 text-white' 
                  : 'border-white/10 bg-white/5 text-white/70 hover:bg-white/10'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs ${
                  answers[q.id] === i ? 'border-brand-primary bg-brand-primary' : 'border-white/20'
                }`}>
                  {String.fromCharCode(65 + i)}
                </div>
                {opt}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-between">
        <button 
          disabled={currentIdx === 0}
          onClick={() => setCurrentIdx(currentIdx - 1)}
          className="px-6 py-3 rounded-xl bg-white/5 text-white/50 disabled:opacity-20"
        >
          Previous
        </button>
        {currentIdx === questions.length - 1 ? (
          <button 
            onClick={handleFinish}
            className="btn-primary px-12"
          >
            Finish Topic
          </button>
        ) : (
          <button 
            onClick={() => setCurrentIdx(currentIdx + 1)}
            className="btn-primary px-12"
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
};

const CodingPlayground = ({ onBack }: { onBack: () => void }) => {
  const [code, setCode] = useState(`// Welcome to SkillUp IDE\n// Write your solution here\n\nfunction solve(n) {\n  // Your code here\n  return n;\n}\n\nconsole.log(solve(5));`);
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(0);

  const questions = [
    {
      title: "Two Sum",
      difficulty: "Easy",
      description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
      example: "Input: nums = [2,7,11,15], target = 9\nOutput: [0,1]",
      starterCode: "function twoSum(nums, target) {\n  // Write your code here\n}"
    },
    {
      title: "Reverse Integer",
      difficulty: "Medium",
      description: "Given a signed 32-bit integer x, return x with its digits reversed. If reversing x causes the value to go outside the signed 32-bit integer range, then return 0.",
      example: "Input: x = 123\nOutput: 321",
      starterCode: "function reverse(x) {\n  // Write your code here\n}"
    },
    {
      title: "Palindrome Number",
      difficulty: "Easy",
      description: "Given an integer x, return true if x is a palindrome, and false otherwise.",
      example: "Input: x = 121\nOutput: true",
      starterCode: "function isPalindrome(x) {\n  // Write your code here\n}"
    }
  ];

  const handleRun = () => {
    setIsRunning(true);
    setOutput('Running test cases...');
    
    // Simulate code execution
    setTimeout(() => {
      setOutput('✅ Test Case 1: Passed\n✅ Test Case 2: Passed\n✅ Test Case 3: Passed\n\nResult: Success\nRuntime: 45ms');
      setIsRunning(false);
    }, 1500);
  };

  const handleReset = () => {
    setCode(questions[selectedQuestion].starterCode);
    setOutput('');
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-6 max-w-7xl mx-auto flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold font-display flex items-center gap-3">
            <Terminal className="text-brand-primary" /> SkillUp IDE
          </h2>
          <p className="text-white/50 text-sm">Practice coding problems and improve your skills</p>
        </div>
        <button onClick={onBack} className="text-white/50 hover:text-white">Back</button>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-6 overflow-hidden">
        {/* Question Panel */}
        <div className="lg:w-1/3 flex flex-col gap-6 overflow-y-auto pr-2">
          <div className="glass-card p-6">
            <h3 className="font-bold mb-4">Select Problem</h3>
            <div className="space-y-3">
              {questions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setSelectedQuestion(i);
                    setCode(q.starterCode);
                    setOutput('');
                  }}
                  className={`w-full p-4 rounded-xl border text-left transition-all ${
                    selectedQuestion === i 
                      ? 'border-brand-primary bg-brand-primary/10' 
                      : 'border-white/5 bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-sm">{q.title}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                      q.difficulty === 'Easy' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {q.difficulty}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="glass-card p-6 flex-1">
            <h3 className="text-xl font-bold mb-4">{questions[selectedQuestion].title}</h3>
            <p className="text-sm text-white/70 mb-6 leading-relaxed">
              {questions[selectedQuestion].description}
            </p>
            <div className="bg-black/30 p-4 rounded-xl border border-white/5">
              <p className="text-xs font-bold text-brand-primary mb-2 uppercase tracking-wider">Example</p>
              <pre className="text-xs text-white/50 font-mono whitespace-pre-wrap">
                {questions[selectedQuestion].example}
              </pre>
            </div>
          </div>
        </div>

        {/* Editor Panel */}
        <div className="flex-1 flex flex-col gap-4">
          <div className="flex-1 glass-card flex flex-col overflow-hidden border-brand-primary/20">
            <div className="flex items-center justify-between px-4 py-2 border-b border-white/10 bg-white/5">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/50" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/50" />
                <span className="ml-4 text-xs font-mono text-white/40">solution.js</span>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={handleReset}
                  className="p-2 rounded-lg hover:bg-white/10 text-white/50 transition-colors"
                  title="Reset Code"
                >
                  <RotateCcw size={16} />
                </button>
                <button 
                  onClick={handleRun}
                  disabled={isRunning}
                  className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white text-xs font-bold transition-all"
                >
                  {isRunning ? <Loader2 size={14} className="animate-spin" /> : <Play size={14} fill="currentColor" />}
                  Run Code
                </button>
              </div>
            </div>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              spellCheck={false}
              className="flex-1 bg-transparent p-6 font-mono text-sm text-emerald-400 focus:outline-none resize-none leading-relaxed"
            />
          </div>

          {/* Console Output */}
          <div className="h-48 glass-card flex flex-col overflow-hidden">
            <div className="px-4 py-2 border-b border-white/10 bg-white/5">
              <span className="text-xs font-bold text-white/40 uppercase tracking-widest">Console Output</span>
            </div>
            <div className="flex-1 p-4 font-mono text-xs overflow-y-auto bg-black/20">
              {output ? (
                <pre className="text-white/80 whitespace-pre-wrap">{output}</pre>
              ) : (
                <span className="text-white/20 italic">Run your code to see the output here...</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Profile = ({ user, onLogout, onBack }: { user: UserData, onLogout: () => void, onBack: () => void }) => {
  return (
    <div className="pb-24 pt-24 px-6 max-w-4xl mx-auto">
      <BackButton onClick={onBack} />
      <div className="glass-card p-8 mb-8">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="w-32 h-32 rounded-3xl bg-brand-primary flex items-center justify-center text-4xl font-bold shadow-2xl shadow-brand-primary/30">
            {user.name.charAt(0)}
          </div>
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-3xl font-bold font-display mb-1">{user.name}</h2>
            <p className="text-white/60 mb-4">{user.email}</p>
            <div className="flex flex-wrap justify-center md:justify-start gap-3">
              <span className="px-4 py-1.5 rounded-full bg-brand-primary/20 text-brand-primary text-xs font-bold border border-brand-primary/30">
                {user.department}
              </span>
              <span className="px-4 py-1.5 rounded-full bg-yellow-500/20 text-yellow-500 text-xs font-bold border border-yellow-500/30 capitalize">
                {user.subscription} Plan
              </span>
            </div>
          </div>
          <button 
            onClick={onLogout}
            className="p-4 rounded-2xl bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all border border-red-500/20"
          >
            <LogOut size={24} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="glass-card p-6">
          <h3 className="font-bold mb-6 flex items-center gap-2">
            <TrendingUp size={20} className="text-brand-primary" /> Learning Stats
          </h3>
          <div className="space-y-6">
            {[
              { label: 'Courses Completed', value: '12', color: 'text-blue-400' },
              { label: 'Contests Won', value: '3', color: 'text-purple-400' },
              { label: 'Sessions Attended', value: '8', color: 'text-emerald-400' },
              { label: 'Skill Points', value: '2,450', color: 'text-yellow-400' },
            ].map((stat, i) => (
              <div key={i} className="flex justify-between items-center">
                <span className="text-white/60 text-sm">{stat.label}</span>
                <span className={`text-xl font-bold ${stat.color}`}>{stat.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card p-6">
          <h3 className="font-bold mb-6 flex items-center gap-2">
            <Award size={20} className="text-brand-primary" /> Recent Achievements
          </h3>
          <div className="space-y-4">
            {[
              'Python Master Certification',
              'Top 10% in Weekly Aptitude',
              'Communication Pro Badge',
            ].map((ach, i) => (
              <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-white/5 border border-white/5">
                <div className="w-10 h-10 rounded-lg bg-brand-primary/20 flex items-center justify-center">
                  <Star size={18} className="text-brand-primary" />
                </div>
                <span className="text-sm font-medium">{ach}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [user, setUser] = useState<UserData | null>(null);
  const [activeTab, setActiveTab] = useState('home');
  const [activeContest, setActiveContest] = useState<Contest | null>(null);
  const [activeAssessment, setActiveAssessment] = useState<string | null>(null);

  // Persist user session
  useEffect(() => {
    const savedUser = localStorage.getItem('skillup_user');
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const handleLogin = (userData: UserData) => {
    setUser(userData);
    localStorage.setItem('skillup_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('skillup_user');
    setActiveTab('home');
  };

  const updateLocalProgress = (type: string, newValue: number) => {
    if (!user) return;
    const updatedUser = { ...user };
    if (type === 'coding') updatedUser.coding_progress = newValue;
    if (type === 'aptitude') updatedUser.aptitude_progress = newValue;
    if (type === 'comm') updatedUser.comm_progress = newValue;
    setUser(updatedUser);
    localStorage.setItem('skillup_user', JSON.stringify(updatedUser));
  };

  if (!user) {
    return <AuthScreen onLogin={handleLogin} />;
  }

  if (activeContest) {
    return <ContestTest contest={activeContest} onBack={() => setActiveContest(null)} />;
  }

  if (activeAssessment) {
    return (
      <SkillAssessment 
        type={activeAssessment} 
        user={user} 
        onBack={() => setActiveAssessment(null)} 
        onComplete={(val) => updateLocalProgress(activeAssessment, val)}
      />
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'home': return <Dashboard user={user} setActiveTab={setActiveTab} onStartTest={setActiveContest} onStartAssessment={setActiveAssessment} />;
      case 'chat': return <AIChat user={user} onBack={() => setActiveTab('home')} />;
      case 'courses': return <Courses user={user} onBack={() => setActiveTab('home')} />;
      case 'coding': return <CodingPlayground onBack={() => setActiveTab('home')} />;
      case 'marketplace': return <Marketplace user={user} onBack={() => setActiveTab('home')} />;
      case 'sessions': return <Sessions user={user} onBack={() => setActiveTab('home')} />;
      case 'subscription': return <Subscription user={user} onUpdate={setUser} onBack={() => setActiveTab('home')} />;
      case 'feedback': return <Feedback user={user} onBack={() => setActiveTab('home')} />;
      case 'profile': return <Profile user={user} onLogout={handleLogout} onBack={() => setActiveTab('home')} />;
      default: return <Dashboard user={user} setActiveTab={setActiveTab} onStartTest={setActiveContest} onStartAssessment={setActiveAssessment} />;
    }
  };

  return (
    <div className="min-h-screen bg-brand-darker selection:bg-brand-primary/30">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="animate-in fade-in duration-500">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Background Orbs */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-primary/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-secondary/10 blur-[120px] rounded-full"></div>
      </div>
    </div>
  );
}
