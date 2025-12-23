import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Building, 
  Code, 
  Globe, 
  Newspaper, 
  Zap, 
  TrendingUp, 
  Shield, 
  Target,
  Briefcase,
  Users,
  ArrowRight,
  Loader2,
  LayoutDashboard,
  FileText,
  Activity,
  History,
  Settings,
  DollarSign,
  Trello
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

import { searchCompanyIntel } from '../services/api';
import SentimentRadar from './SentimentRadar';

const CompanyIntel = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [searched, setSearched] = useState(false);
  const location = useLocation();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    
    setLoading(true);
    setSearched(true);
    setData(null);
    
    try {
      const result = await searchCompanyIntel(searchTerm);
      // Enrich result with UI-specific fields that the API doesn't return
      const enrichedData = {
        ...result,
        name: searchTerm,
        logo: `https://logo.clearbit.com/${searchTerm.toLowerCase().replace(/\s/g, '')}.com`,
        // Ensure arrays exist to prevent rendering errors
        techStack: result.techStack || [],
        values: result.values || [],
        topics: result.topics || [],
        tips: result.tips || [],
        news: result.news || []
      };
      setData(enrichedData);
    } catch (error) {
      console.error("Failed to fetch company intel", error);
    } finally {
      setLoading(false);
    }
  };

  const NavLink = ({ to, icon: Icon, label, active }) => (
    <Link
      to={to}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
        active 
          ? 'bg-orange-500/10 text-orange-500 border border-orange-500/20' 
          : 'text-gray-400 hover:bg-white/5 hover:text-white'
      }`}
    >
      <Icon className={`w-5 h-5 ${active ? 'text-orange-500' : 'text-gray-500 group-hover:text-white'}`} />
      <span className="font-medium">{label}</span>
      {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.5)]" />}
    </Link>
  );

  return (
    <div className="min-h-screen bg-[#0B0C10] text-white font-sans selection:bg-orange-500/30">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-screen w-72 bg-[#0B0C10] border-r border-white/10 p-6 flex flex-col z-50">
        <div className="flex items-center gap-3 px-2 mb-12">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/20">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">Vantage</h1>
            <p className="text-xs text-gray-500 font-medium">Interview Intelligence</p>
          </div>
        </div>

        <nav className="space-y-2 flex-1">
          <NavLink to="/dashboard" icon={LayoutDashboard} label="Mission Control" />
          <NavLink to="/tracker" icon={Trello} label="Mission Status" />
          <NavLink to="/dojo" icon={Code} label="Code Dojo" />
          <NavLink to="/resume" icon={FileText} label="Resume Architect" />
          <NavLink to="/recon" icon={Target} label="Recon Room" active />
          <NavLink to="/pathfinder" icon={TrendingUp} label="Pathfinder" />
          <NavLink to="/negotiator" icon={DollarSign} label="The Negotiator" />
          <NavLink to="/results" icon={Activity} label="Analytics" />
          <NavLink to="/history" icon={History} label="Mission History" />
          <NavLink to="/settings" icon={Settings} label="Settings" />
        </nav>

        <div className="mt-auto pt-6 border-t border-white/10">
          <div className="p-4 rounded-xl bg-gradient-to-br from-gray-900 to-black border border-white/10">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center">
                <Users className="w-4 h-4 text-orange-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">Pro Plan</p>
                <p className="text-xs text-gray-500">Active until Dec 31</p>
              </div>
            </div>
            <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
              <div className="bg-orange-500 h-full w-3/4" />
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="pl-72 min-h-screen relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] left-[20%] w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px]" />
        </div>

        <div className="relative z-10 p-8 max-w-7xl mx-auto">
          
          {/* Header / Search Area */}
          <div className={`transition-all duration-500 ease-in-out flex flex-col items-center ${searched ? 'pt-0 mb-8' : 'pt-[20vh]'}`}>
            {!searched && (
              <div className="text-center mb-8 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm font-medium mb-4">
                  <Target className="w-4 h-4" />
                  <span>Company Intelligence Unit</span>
                </div>
                <h1 className="text-5xl font-bold tracking-tight text-white mb-2">
                  Know Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">Target</span>
                </h1>
                <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                  Access deep intelligence on company stacks, culture codes, and interview patterns.
                </p>
              </div>
            )}

            <form onSubmit={handleSearch} className={`w-full max-w-2xl relative group ${searched ? '' : 'scale-110'}`}>
              <div className="absolute inset-0 bg-orange-500/20 rounded-2xl blur-xl group-hover:bg-orange-500/30 transition-all opacity-0 group-hover:opacity-100" />
              <div className="relative flex items-center bg-[#0B0C10] border border-white/10 rounded-2xl p-2 shadow-2xl focus-within:border-orange-500/50 transition-all">
                <Search className="w-6 h-6 text-gray-500 ml-4" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Enter Target Company (e.g., Google, Netflix)..."
                  className="w-full bg-transparent border-none text-white text-lg px-4 py-3 focus:ring-0 placeholder:text-gray-600"
                />
                <button 
                  type="submit"
                  disabled={loading}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ArrowRight className="w-5 h-5" />}
                  {loading ? 'Scanning...' : 'Initialize'}
                </button>
              </div>
            </form>
          </div>

          {/* Dossier Content */}
          {searched && !loading && data && (
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
              
              {/* Company Header */}
              <div className="flex items-center gap-6 mb-8">
                <div className="w-20 h-20 rounded-2xl bg-white p-2 flex items-center justify-center shadow-lg shadow-orange-500/10">
                  <img 
                    src={data.logo} 
                    alt={`${data.name} Logo`} 
                    className="w-full h-full object-contain"
                    onError={(e) => {e.target.src = 'https://via.placeholder.com/150?text=' + data.name[0]}}
                  />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-white">{data.name}</h2>
                  <div className="flex items-center gap-2 text-gray-400 mt-1">
                    <Globe className="w-4 h-4" />
                    <span>Global Tech Giant</span>
                    <span className="w-1 h-1 rounded-full bg-gray-600 mx-2" />
                    <span className="text-orange-500">High Hiring Volume</span>
                  </div>
                </div>
              </div>

              {/* Sentiment Radar */}
              {data.sentiment && <SentimentRadar companyName={data.name} data={data.sentiment} />}

              {/* Grid Layout */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Tech Stack Radar */}
                <div className="md:col-span-2 bg-gray-900/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                      <Code className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-semibold">Tech Stack Radar</h3>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {data.techStack && data.techStack.length > 0 ? (
                      data.techStack.map((tech, idx) => (
                        <div key={idx} className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:border-orange-500/30 hover:bg-orange-500/5 transition-colors cursor-default">
                          <span className="text-gray-300 font-mono text-sm">{tech}</span>
                        </div>
                      ))
                    ) : (
                      <div className="text-gray-500 text-sm italic">No tech stack data available.</div>
                    )}
                  </div>
                </div>

                {/* Culture Code */}
                <div className="bg-gray-900/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
                      <Building className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-semibold">Culture Code</h3>
                  </div>
                  <ul className="space-y-3">
                    {data.values.map((value, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-sm text-gray-300">
                        <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1.5 shrink-0" />
                        {value}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Question Probability */}
                <div className="md:col-span-1 bg-gray-900/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-lg bg-green-500/10 text-green-400">
                      <TrendingUp className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-semibold">Topic Probability</h3>
                  </div>
                  <div className="space-y-4">
                    {data.topics.map((item, idx) => (
                      <div key={idx}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-300">{item.topic}</span>
                          <span className="text-green-400 font-mono">{item.probability}%</span>
                        </div>
                        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full"
                            style={{ width: `${item.probability}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Insider Tips */}
                <div className="md:col-span-2 bg-gray-900/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-32 bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />
                  <div className="flex items-center gap-3 mb-6 relative z-10">
                    <div className="p-2 rounded-lg bg-orange-500/10 text-orange-400">
                      <Zap className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-semibold">Insider Intel</h3>
                  </div>
                  <div className="grid gap-4 relative z-10">
                    {data.tips.map((tip, idx) => (
                      <div key={idx} className="flex gap-4 p-4 rounded-xl bg-black/20 border border-white/5">
                        <div className="w-6 h-6 rounded-full bg-orange-500/20 flex items-center justify-center shrink-0 text-orange-500 text-xs font-bold">
                          {idx + 1}
                        </div>
                        <p className="text-gray-300 text-sm leading-relaxed">{tip}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent News Ticker */}
                <div className="md:col-span-3 bg-gray-900/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-pink-500/10 text-pink-400">
                      <Newspaper className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-semibold">Intelligence Feed</h3>
                  </div>
                  <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                    {data.news.map((newsItem, idx) => (
                      <div key={idx} className="min-w-[300px] p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs font-mono text-pink-400">LATEST</span>
                          <span className="text-xs text-gray-500">2h ago</span>
                        </div>
                        <p className="text-sm text-gray-200 font-medium">{newsItem}</p>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CompanyIntel;
