import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  Settings, 
  History as HistoryIcon,
  Calendar,
  Clock,
  ChevronRight,
  Filter,
  Download,
  Trash2,
  Search,
  Code,
  Activity,
  Target,
  DollarSign,
  Trello
} from 'lucide-react';

export default function History() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');

  // Mock History Data
  const [history, setHistory] = useState([
    { 
      id: 1, 
      role: "Senior Backend Developer", 
      date: "2024-12-22", 
      duration: "45m", 
      score: 88, 
      type: "Technical",
      status: "Completed"
    },
    { 
      id: 2, 
      role: "Full Stack Engineer", 
      date: "2024-12-20", 
      duration: "30m", 
      score: 72, 
      type: "Behavioral",
      status: "Completed"
    },
    { 
      id: 3, 
      role: "System Architect", 
      date: "2024-12-18", 
      duration: "15m", 
      score: 0, 
      type: "System Design",
      status: "Aborted"
    },
    { 
      id: 4, 
      role: "DevOps Engineer", 
      date: "2024-12-15", 
      duration: "55m", 
      score: 92, 
      type: "Technical",
      status: "Completed"
    },
  ]);

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-400';
    if (score >= 70) return 'text-orange-400';
    return 'text-red-400';
  };

  const getStatusColor = (status) => {
    if (status === 'Completed') return 'bg-green-500/10 text-green-400 border-green-500/20';
    if (status === 'Aborted') return 'bg-red-500/10 text-red-400 border-red-500/20';
    return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
  };

  return (
    <div className="flex min-h-screen font-sans text-slate-300 selection:bg-orange-500/30">
      
      {/* Floating Sidebar */}
      <aside className="fixed left-4 top-4 bottom-4 w-64 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-xl flex flex-col p-4 shadow-2xl z-50">
        <div className="flex items-center gap-3 mb-10 px-2 mt-2">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-600 to-orange-500 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-orange-500/20">V</div>
          <span className="text-xl font-bold text-white tracking-tight">Vantage</span>
        </div>

        <nav className="space-y-2 mb-8 flex-1">
          <button onClick={() => navigate('/dashboard')} className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-white/5 hover:text-white rounded-xl transition-all">
            <LayoutDashboard size={20} />
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
          <button className="w-full flex items-center gap-3 px-4 py-3 text-white bg-white/5 rounded-xl font-medium border border-white/5 shadow-sm ring-1 ring-white/5">
            <HistoryIcon size={20} className="text-orange-500" />
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
                <h1 className="text-2xl font-bold text-white mb-1 tracking-tight">Session History</h1>
                <p className="text-slate-400 text-sm">Review your past performance and track your progress.</p>
            </div>
            <div className="flex items-center gap-4">
                <div className="relative">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input 
                        type="text" 
                        placeholder="Search sessions..." 
                        className="bg-white/[0.02] border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:border-orange-500 outline-none transition-colors w-64"
                    />
                </div>
                <button className="p-2 rounded-xl bg-white/[0.02] border border-white/10 text-slate-400 hover:text-white hover:bg-white/5 transition-colors">
                    <Filter size={20} />
                </button>
                <button className="p-2 rounded-xl bg-white/[0.02] border border-white/10 text-slate-400 hover:text-white hover:bg-white/5 transition-colors">
                    <Download size={20} />
                </button>
            </div>
        </header>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[
                { label: 'Total Sessions', value: '24', change: '+3 this week', color: 'text-white' },
                { label: 'Avg. Score', value: '85%', change: '+2.4% vs last week', color: 'text-orange-500' },
                { label: 'Time Practiced', value: '12h 30m', change: 'Top 10% of users', color: 'text-blue-400' },
                { label: 'Completion Rate', value: '92%', change: 'Consistent', color: 'text-green-400' },
            ].map((stat, i) => (
                <div key={i} className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-sm">
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">{stat.label}</p>
                    <p className={`text-2xl font-bold font-mono ${stat.color} mb-1`}>{stat.value}</p>
                    <p className="text-xs text-slate-500">{stat.change}</p>
                </div>
            ))}
        </div>

        {/* History List */}
        <div className="rounded-3xl border border-white/5 bg-white/[0.02] backdrop-blur-xl overflow-hidden">
            <div className="p-6 border-b border-white/5 flex justify-between items-center">
                <h3 className="font-bold text-white">Recent Activity</h3>
                <button className="text-xs text-slate-500 hover:text-white transition-colors">View All</button>
            </div>
            <div className="divide-y divide-white/5">
                {history.map((item) => (
                    <div key={item.id} className="p-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors group cursor-pointer">
                        <div className="flex items-center gap-6">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${item.status === 'Completed' ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' : 'bg-slate-500/10 border-slate-500/20 text-slate-400'}`}>
                                <HistoryIcon size={24} />
                            </div>
                            <div>
                                <h4 className="text-white font-bold mb-1 group-hover:text-orange-500 transition-colors">{item.role}</h4>
                                <div className="flex items-center gap-4 text-xs text-slate-500 font-mono">
                                    <span className="flex items-center gap-1">
                                        <Calendar size={12} /> {item.date}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Clock size={12} /> {item.duration}
                                    </span>
                                    <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-slate-400">
                                        {item.type}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-8">
                            <div className="text-right">
                                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Score</p>
                                <p className={`text-xl font-bold font-mono ${getScoreColor(item.score)}`}>
                                    {item.status === 'Aborted' ? '--' : `${item.score}%`}
                                </p>
                            </div>
                            <div className="text-right">
                                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded border ${getStatusColor(item.status)}`}>
                                    {item.status}
                                </span>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-slate-500 group-hover:bg-orange-500 group-hover:text-white transition-all">
                                <ChevronRight size={16} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </main>
    </div>
  );
}
