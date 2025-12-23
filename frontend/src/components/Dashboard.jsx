import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { getDashboardStats } from '../services/api';
import { 
  LayoutDashboard, 
  FileText, 
  Settings, 
  Bell, 
  Target,
  Brain,
  Zap,
  AlertTriangle,
  History,
  Activity,
  ChevronRight,
  Play,
  Code,
  DollarSign,
  Trello,
  Loader2
} from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState('Senior Backend Developer');
  const [jobDescription, setJobDescription] = useState('');
  const [focusMode, setFocusMode] = useState('technical'); // 'technical' or 'behavioral'
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getDashboardStats();
        setDashboardData(data);
      } catch (error) {
        console.error("Failed to fetch dashboard stats", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleInitialize = () => {
    navigate('/interview/live', { 
      state: { 
        role, 
        jobDescription, 
        mode: focusMode 
      } 
    });
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0B0C10] text-white">
        <Loader2 className="w-10 h-10 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen font-sans text-slate-300 selection:bg-orange-500/30">
      
      {/* Floating Sidebar */}
      <aside className="fixed left-4 top-4 bottom-4 w-64 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-xl flex flex-col p-4 shadow-2xl z-50">
        <div className="flex items-center gap-3 mb-10 px-2 mt-2">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-600 to-orange-500 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-orange-500/20">V</div>
          <span className="text-xl font-bold text-white tracking-tight">Vantage</span>
        </div>

        <nav className="space-y-2 mb-8 flex-1">
          <button className="w-full flex items-center gap-3 px-4 py-3 text-white bg-white/5 rounded-xl font-medium border border-white/5 shadow-sm ring-1 ring-white/5">
            <LayoutDashboard size={20} className="text-orange-500" />
            <span>Mission Control</span>
          </button>
          <button onClick={() => navigate('/tracker')} className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-white/5 hover:text-white rounded-xl transition-all">
            <Trello size={20} />
            <span>Mission Status</span>
          </button>
          <button onClick={() => navigate('/dojo')} className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-white/5 hover:text-white rounded-xl transition-all">
            <Code size={20} />
            <span>Code Dojo</span>
          </button>
          <button onClick={() => navigate('/resume')} className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-white/5 hover:text-white rounded-xl transition-all">
            <FileText size={20} />
            <span>Resume Architect</span>
          </button>
          <button onClick={() => navigate('/recon')} className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-white/5 hover:text-white rounded-xl transition-all">
            <Target size={20} />
            <span>Recon Room</span>
          </button>
          <button onClick={() => navigate('/negotiator')} className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-white/5 hover:text-white rounded-xl transition-all">
            <DollarSign size={20} />
            <span>The Negotiator</span>
          </button>
          <button onClick={() => navigate('/results')} className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-white/5 hover:text-white rounded-xl transition-all">
            <Activity size={20} />
            <span>Analytics</span>
          </button>
          <button onClick={() => navigate('/history')} className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-white/5 hover:text-white rounded-xl transition-all">
            <History size={20} />
            <span>History</span>
          </button>
          <button onClick={() => navigate('/settings')} className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-white/5 hover:text-white rounded-xl transition-all">
            <Settings size={20} />
            <span>Settings</span>
          </button>
        </nav>

        <div className="pt-6 border-t border-white/5">
            <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 cursor-pointer transition-colors">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-orange-500 to-pink-500 p-[2px]">
                    <div className="w-full h-full rounded-full bg-[#0B0C10] overflow-hidden">
                        <img src="https://i.pravatar.cc/150?img=11" alt="User" className="w-full h-full object-cover" />
                    </div>
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">Alex Chen</p>
                    <p className="text-xs text-slate-500 truncate">Pro Member</p>
                </div>
            </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-[calc(16rem+2rem)] p-8">
        <header className="flex justify-between items-center mb-8">
            <div>
                <h1 className="text-2xl font-bold text-white mb-1 tracking-tight">Welcome back, Alex</h1>
                <p className="text-slate-400 text-sm">Ready for your next simulation?</p>
            </div>
            <div className="flex items-center gap-4">
                <div className="px-4 py-2 bg-white/[0.02] rounded-full border border-white/5 text-sm font-medium text-slate-400 flex items-center gap-2 backdrop-blur-md">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                    System Online
                </div>
                <button className="p-2 bg-white/[0.02] rounded-full border border-white/5 text-slate-400 hover:text-white transition-colors relative backdrop-blur-md">
                    <Bell size={20} />
                    <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-orange-500 rounded-full border-2 border-[#0B0C10]" />
                </button>
            </div>
        </header>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto">
            
            {/* A. Launchpad (Top Left - Large 2x2) */}
            <div className="md:col-span-2 p-[1px] rounded-3xl bg-gradient-to-b from-white/10 to-transparent">
                <div className="h-full bg-[#0B0C10]/80 backdrop-blur-md rounded-3xl p-8 relative overflow-hidden group">
                    {/* Grid Pattern Overlay */}
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none"></div>
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] opacity-20 pointer-events-none"></div>
                    
                    <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none group-hover:bg-orange-500/20 transition-all duration-1000" />
                    
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-3 bg-orange-500/10 rounded-xl text-orange-500 border border-orange-500/20 shadow-[0_0_15px_rgba(249,115,22,0.1)]">
                                <Target size={24} />
                            </div>
                            <h2 className="text-xl font-bold text-white tracking-tight">New Simulation</h2>
                        </div>

                        <div className="space-y-8">
                            <div className="grid grid-cols-2 gap-8">
                                <div className="space-y-2 group/input">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Target Role</label>
                                    <div className="relative">
                                        <select 
                                            value={role}
                                            onChange={(e) => setRole(e.target.value)}
                                            className="w-full bg-transparent border-b border-white/10 px-1 py-3 text-white font-mono focus:border-orange-500 outline-none appearance-none cursor-pointer transition-colors rounded-none"
                                        >
                                            <option className="bg-[#0B0C10]">Senior Backend Developer</option>
                                            <option className="bg-[#0B0C10]">Full Stack Engineer</option>
                                            <option className="bg-[#0B0C10]">DevOps Specialist</option>
                                            <option className="bg-[#0B0C10]">Product Manager</option>
                                        </select>
                                        <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-orange-500 transition-all duration-300 group-hover/input:w-full"></div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Focus Mode</label>
                                    <div className="flex bg-white/[0.03] p-1 rounded-xl border border-white/5">
                                        <button 
                                            onClick={() => setFocusMode('technical')}
                                            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${focusMode === 'technical' ? 'bg-white/10 text-white shadow-sm ring-1 ring-white/10' : 'text-slate-400 hover:text-white'}`}
                                        >
                                            Technical
                                        </button>
                                        <button 
                                            onClick={() => setFocusMode('behavioral')}
                                            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${focusMode === 'behavioral' ? 'bg-white/10 text-white shadow-sm ring-1 ring-white/10' : 'text-slate-400 hover:text-white'}`}
                                        >
                                            Behavioral
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2 group/input">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Job Description Context</label>
                                <div className="relative">
                                    <textarea 
                                        value={jobDescription}
                                        onChange={(e) => setJobDescription(e.target.value)}
                                        placeholder="// Paste JD here..."
                                        className="w-full h-32 bg-transparent border border-white/10 rounded-xl px-4 py-3 text-white font-mono text-sm placeholder-slate-700 focus:border-orange-500/50 focus:bg-white/[0.02] outline-none resize-none transition-all"
                                    />
                                </div>
                            </div>

                            <button 
                                onClick={handleInitialize}
                                className="w-full relative overflow-hidden rounded-xl bg-gradient-to-r from-orange-600 to-orange-500 px-8 py-4 font-bold text-white shadow-[0_0_20px_rgba(255,100,0,0.3)] transition-all hover:scale-[1.01] hover:shadow-[0_0_30px_rgba(255,100,0,0.5)] group/btn"
                            >
                                <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                                <span className="relative z-10 flex items-center justify-center gap-2 tracking-widest">
                                    INITIALIZE SIMULATION
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* B. Skill Matrix (Top Right - Square 1x2) */}
            <div className="p-[1px] rounded-3xl bg-gradient-to-b from-white/10 to-transparent">
                <div className="h-full bg-[#0B0C10]/80 backdrop-blur-md rounded-3xl p-6 flex flex-col relative overflow-hidden">
                    <div className="flex items-center justify-between mb-6 relative z-10">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            <Brain size={20} className="text-purple-500" />
                            Skill Matrix
                        </h3>
                        <span className="text-[10px] font-mono text-slate-500 bg-white/5 px-2 py-1 rounded border border-white/5">LAST 5 SESSIONS</span>
                    </div>
                    
                    <div className="flex-1 min-h-[250px] relative z-10">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={dashboardData?.skill_matrix || []}>
                                <defs>
                                    <linearGradient id="radarFill" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#f97316" stopOpacity={0.5}/>
                                        <stop offset="95%" stopColor="#f97316" stopOpacity={0.1}/>
                                    </linearGradient>
                                </defs>
                                <PolarGrid stroke="#334155" strokeDasharray="3 3" />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10, fontFamily: 'JetBrains Mono' }} />
                                <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
                                <Radar
                                    name="Mike"
                                    dataKey="A"
                                    stroke="#f97316"
                                    strokeWidth={2}
                                    fill="url(#radarFill)"
                                    fillOpacity={1}
                                    style={{ filter: 'drop-shadow(0px 0px 8px rgba(249, 115, 22, 0.5))' }}
                                />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-4 text-center relative z-10">
                        <p className="text-xs font-mono text-slate-400">
                            <span className="text-green-400">▲ 12%</span> vs last week
                        </p>
                    </div>
                </div>
            </div>

            {/* C. Weakness Tracker (Bottom Left - Wide 2x1) */}
            <div className="md:col-span-2 p-[1px] rounded-3xl bg-gradient-to-b from-white/10 to-transparent">
                <div className="h-full bg-[#0B0C10]/80 backdrop-blur-md rounded-3xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            <AlertTriangle size={20} className="text-yellow-500" />
                            Critical Alerts
                        </h3>
                        <button className="text-xs text-orange-500 hover:text-orange-400 font-mono">VIEW_ALL</button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {dashboardData?.critical_alerts?.map((alert) => (
                            <div key={alert.id} className={`bg-white/[0.02] p-4 rounded-xl border border-white/5 flex items-start gap-4 group transition-colors ${
                                alert.type === 'critical' ? 'hover:border-red-500/30' : 'hover:border-yellow-500/30'
                            }`}>
                                <div className={`p-2 rounded-lg mt-1 shadow-[0_0_10px_rgba(0,0,0,0.2)] ${
                                    alert.type === 'critical' ? 'bg-red-500/10 text-red-500' : 'bg-yellow-500/10 text-yellow-500'
                                }`}>
                                    {alert.type === 'critical' ? <Zap size={18} /> : <Activity size={18} />}
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-white font-medium mb-1">{alert.title}</h4>
                                    <p className="text-xs text-slate-400 mb-3">{alert.description}</p>
                                    {alert.action_label && (
                                        <button className="text-xs bg-white/5 hover:bg-white/10 text-white px-3 py-1.5 rounded-lg transition-colors flex items-center gap-2 border border-white/5">
                                            <Play size={12} /> {alert.action_label}
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* D. Recent Missions (Bottom Right - List 1x2) */}
            <div className="p-[1px] rounded-3xl bg-gradient-to-b from-white/10 to-transparent">
                <div className="h-full bg-[#0B0C10]/80 backdrop-blur-md rounded-3xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            <History size={20} className="text-blue-500" />
                            Recent Missions
                        </h3>
                    </div>

                    <div className="space-y-3">
                        {dashboardData?.recent_missions?.map((mission, i) => (
                            <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group border border-transparent hover:border-white/5">
                                <div>
                                    <h4 className="text-sm font-medium text-white group-hover:text-orange-500 transition-colors">{mission.role}</h4>
                                    <p className="text-xs text-slate-500 font-mono">{mission.date}</p>
                                </div>
                                <div className="text-right">
                                    <div className={`text-xs font-bold px-2 py-1 rounded-lg mb-1 inline-block border font-mono ${
                                        mission.status === 'Passed' 
                                            ? 'text-green-400 bg-green-400/10 border-green-400/20' 
                                            : 'text-red-400 bg-red-400/10 border-red-400/20'
                                    }`}>
                                        {mission.score}%
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="w-full mt-4 py-2 text-xs text-slate-400 hover:text-white border border-white/5 rounded-lg hover:bg-white/5 transition-colors font-mono">
                        VIEW_ALL_HISTORY
                    </button>
                </div>
            </div>

        </div>
      </main>
    </div>
  );
};

export default Dashboard;
