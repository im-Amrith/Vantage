import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  FileText, 
  Video, 
  Cpu, 
  Shield, 
  Upload, 
  Trash2,
  Activity,
  CheckCircle,
  Mic, 
  Camera, 
  Volume2, 
  Zap, 
  AlertTriangle,
  Save,
  LayoutDashboard,
  History,
  Settings as SettingsIcon,
  Bell,
  ChevronRight,
  Code,
  Target,
  DollarSign,
  Trello
} from 'lucide-react';
import { Button } from './ui/button';
import { auth } from '../lib/firebase';
import { getResumes, uploadResume } from '../services/api';

export default function Settings() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('identity');
  const fileInputRef = useRef(null);
  
  // State for Identity
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    photoURL: "",
    title: "Computer Science Student",
    level: "Junior"
  });

  // State for Knowledge Base
  const [resumes, setResumes] = useState([]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setProfile(prev => ({
          ...prev,
          name: user.displayName || "User",
          email: user.email,
          photoURL: user.photoURL
        }));
      }
    });
    loadResumes();
    return () => unsubscribe();
  }, []);

  const loadResumes = async () => {
    try {
      const data = await getResumes();
      setResumes(data);
    } catch (error) {
      console.error("Failed to load resumes", error);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    try {
      await uploadResume(file);
      loadResumes();
    } catch (error) {
      console.error("Failed to upload resume", error);
    }
  };

  // Mock State for Simulation

  // Mock State for Simulation
  const [persona, setPersona] = useState('tech_lead');
  const [strictness, setStrictness] = useState(70);

  // Mock State for Calibration
  const [isMicTesting, setIsMicTesting] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    // Simple mock camera preview
    if (activeTab === 'calibration') {
      const startCamera = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } catch (err) {
          console.error("Camera access denied or not available", err);
        }
      };
      startCamera();
      
      return () => {
        // Cleanup stream
        if (videoRef.current && videoRef.current.srcObject) {
          const tracks = videoRef.current.srcObject.getTracks();
          tracks.forEach(track => track.stop());
        }
      };
    }
  }, [activeTab]);

  const renderContent = () => {
    switch (activeTab) {
      case 'identity':
        return (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center gap-8">
              <div className="relative group cursor-pointer">
                <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-orange-500 to-pink-500 p-[2px] shadow-[0_0_20px_rgba(249,115,22,0.3)]">
                  <div className="w-full h-full rounded-full bg-[#0B0C10] overflow-hidden relative">
                    <img src={profile.photoURL || "https://i.pravatar.cc/150?img=11"} alt="Profile" className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Camera size={24} className="text-white" />
                    </div>
                  </div>
                </div>
                <div className="absolute bottom-0 right-0 w-8 h-8 bg-green-500 rounded-full border-4 border-[#0B0C10] flex items-center justify-center">
                    <CheckCircle size={14} className="text-[#0B0C10]" />
                </div>
              </div>
              
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-white">{profile.name}</h2>
                <p className="text-slate-400 font-mono text-sm">{profile.title}</p>
                <div className="flex gap-2 mt-2">
                    <span className="px-3 py-1 rounded-full bg-orange-500/10 text-orange-500 text-xs font-mono border border-orange-500/20">PRO_MEMBER</span>
                    <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-500 text-xs font-mono border border-blue-500/20">LEVEL_4</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2 group">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Display Name</label>
                <div className="relative">
                    <input 
                    type="text" 
                    value={profile.name}
                    onChange={(e) => setProfile({...profile, name: e.target.value})}
                    className="w-full bg-transparent border-b border-white/10 px-1 py-3 text-white font-mono focus:border-orange-500 outline-none transition-colors"
                    />
                    <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-orange-500 transition-all duration-300 group-focus-within:w-full"></div>
                </div>
              </div>
              <div className="space-y-2 group">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Current Title</label>
                <div className="relative">
                    <input 
                    type="text" 
                    value={profile.title}
                    onChange={(e) => setProfile({...profile, title: e.target.value})}
                    className="w-full bg-transparent border-b border-white/10 px-1 py-3 text-white font-mono focus:border-orange-500 outline-none transition-colors"
                    />
                    <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-orange-500 transition-all duration-300 group-focus-within:w-full"></div>
                </div>
              </div>
              <div className="space-y-2 group">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Target Level</label>
                <div className="relative">
                    <select 
                    value={profile.level}
                    onChange={(e) => setProfile({...profile, level: e.target.value})}
                    className="w-full bg-transparent border-b border-white/10 px-1 py-3 text-white font-mono focus:border-orange-500 outline-none appearance-none cursor-pointer"
                    >
                    <option className="bg-[#0B0C10]">Intern</option>
                    <option className="bg-[#0B0C10]">Junior</option>
                    <option className="bg-[#0B0C10]">Mid-Level</option>
                    <option className="bg-[#0B0C10]">Senior</option>
                    <option className="bg-[#0B0C10]">Staff / Principal</option>
                    </select>
                    <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-orange-500 transition-all duration-300 group-focus-within:w-full"></div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'knowledge':
        return (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <FileText size={20} className="text-blue-500" />
                Resume Repository
              </h3>
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept=".pdf" 
                onChange={handleFileChange} 
              />
              <button 
                onClick={handleUploadClick}
                className="relative overflow-hidden rounded-lg bg-white/5 hover:bg-white/10 px-4 py-2 font-medium text-white border border-white/10 transition-all flex items-center gap-2 group"
              >
                <Upload size={16} className="group-hover:text-orange-500 transition-colors" />
                <span>Upload New</span>
              </button>
            </div>

            <div className="space-y-3">
              {resumes.map((resume) => (
                <div key={resume.id} className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-xl group hover:border-orange-500/30 transition-all hover:bg-white/[0.04]">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-500/10 rounded-lg text-blue-400 border border-blue-500/20">
                      <FileText size={20} />
                    </div>
                    <div>
                      <p className="text-white font-medium font-mono text-sm">{resume.name}</p>
                      <p className="text-xs text-slate-500 font-mono">Uploaded: {resume.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {resume.is_default ? (
                      <span className="text-[10px] bg-green-500/10 text-green-400 px-2 py-1 rounded border border-green-500/20 font-mono tracking-wider">ACTIVE_CONTEXT</span>
                    ) : (
                      <button className="text-xs text-slate-500 hover:text-white transition-colors font-mono">SET_DEFAULT</button>
                    )}
                    <button className="text-slate-600 hover:text-red-400 transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-8 border-t border-white/5">
              <h3 className="text-lg font-bold text-white mb-6">Portfolio Links</h3>
              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2 group">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">GitHub URL</label>
                    <input 
                    type="text" 
                    placeholder="https://github.com/username"
                    className="w-full bg-transparent border-b border-white/10 px-1 py-3 text-white font-mono text-sm focus:border-orange-500 outline-none transition-colors placeholder-slate-700"
                    />
                </div>
                <div className="space-y-2 group">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">LinkedIn URL</label>
                    <input 
                    type="text" 
                    placeholder="https://linkedin.com/in/username"
                    className="w-full bg-transparent border-b border-white/10 px-1 py-3 text-white font-mono text-sm focus:border-orange-500 outline-none transition-colors placeholder-slate-700"
                    />
                </div>
              </div>
            </div>
          </div>
        );

      case 'calibration':
        return (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Video Preview */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Camera Source</label>
                  <span className="text-[10px] text-green-400 flex items-center gap-2 font-mono bg-green-400/10 px-2 py-1 rounded border border-green-400/20">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                    SIGNAL_STABLE
                  </span>
                </div>
                <div className="aspect-video bg-black rounded-xl border border-white/10 overflow-hidden relative group">
                  <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover opacity-80" />
                  
                  {/* HUD Overlay */}
                  <div className="absolute inset-0 border border-white/5 pointer-events-none">
                    <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-white/20"></div>
                    <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-white/20"></div>
                    <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-white/20"></div>
                    <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-white/20"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 border border-white/10 rounded-full flex items-center justify-center">
                        <div className="w-1 h-1 bg-orange-500 rounded-full"></div>
                    </div>
                  </div>

                  <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur px-3 py-1.5 rounded-lg text-xs text-white font-mono border border-white/10 flex items-center gap-2">
                    <Camera size={12} className="text-orange-500" />
                    FaceTime HD Camera
                  </div>
                </div>
                <select className="w-full bg-[#0B0C10] border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-orange-500 transition-colors font-mono">
                  <option>FaceTime HD Camera</option>
                  <option>OBS Virtual Camera</option>
                </select>
              </div>

              {/* Audio Test */}
              <div className="space-y-4">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Microphone Source</label>
                <div className="h-48 bg-[#0B0C10] rounded-xl border border-white/10 flex items-center justify-center relative overflow-hidden">
                  {/* Grid Background */}
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:16px_16px] opacity-20"></div>
                  
                  {isMicTesting ? (
                    <div className="flex items-end gap-1 h-24">
                      {[...Array(20)].map((_, i) => (
                        <div 
                          key={i} 
                          className="w-2 bg-gradient-to-t from-orange-600 to-orange-400 rounded-t-sm animate-pulse shadow-[0_0_10px_rgba(249,115,22,0.5)]"
                          style={{ 
                            height: `${Math.random() * 100}%`,
                            animationDuration: `${0.1 + Math.random() * 0.2}s`
                          }} 
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-slate-500 text-sm flex flex-col items-center gap-3">
                      <div className="p-4 bg-white/5 rounded-full border border-white/5">
                        <Mic size={24} />
                      </div>
                      <span className="font-mono text-xs">INITIATE_AUDIO_TEST</span>
                    </div>
                  )}
                </div>
                <div className="flex gap-3">
                  <select className="flex-1 bg-[#0B0C10] border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-orange-500 transition-colors font-mono">
                    <option>Default Microphone</option>
                    <option>External USB Mic</option>
                  </select>
                  <button 
                    onClick={() => setIsMicTesting(!isMicTesting)}
                    className={`px-6 rounded-xl font-medium transition-all border ${isMicTesting ? 'bg-red-500/10 text-red-500 border-red-500/50 hover:bg-red-500/20' : 'bg-white/5 text-white border-white/10 hover:bg-white/10'}`}
                  >
                    {isMicTesting ? 'STOP' : 'TEST'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'simulation':
        return (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div>
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <Cpu size={20} className="text-purple-500" />
                Interviewer Persona
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { id: 'recruiter', name: 'The Recruiter', desc: 'Friendly, focus on behavioral & culture fit.', icon: User, color: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-400/20' },
                  { id: 'tech_lead', name: 'The Tech Lead', desc: 'Balanced, asks clarifying technical questions.', icon: Cpu, color: 'text-orange-400', bg: 'bg-orange-400/10', border: 'border-orange-400/20' },
                  { id: 'bar_raiser', name: 'The Bar Raiser', desc: 'Ruthless, interrupts often, challenges assumptions.', icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-400/10', border: 'border-red-400/20' },
                ].map((p) => (
                  <div 
                    key={p.id}
                    onClick={() => setPersona(p.id)}
                    className={`p-5 rounded-xl border cursor-pointer transition-all relative overflow-hidden group ${persona === p.id ? `${p.bg} ${p.border} ring-1 ring-${p.color.split('-')[1]}` : 'bg-white/[0.02] border-white/5 hover:border-white/10'}`}
                  >
                    {persona === p.id && (
                        <div className={`absolute inset-0 bg-gradient-to-br ${p.color.replace('text', 'from')}/10 to-transparent opacity-50`} />
                    )}
                    <div className="relative z-10">
                        <div className={`${p.color} mb-4 p-2 bg-white/5 rounded-lg w-fit`}>
                        <p.icon size={24} />
                        </div>
                        <h4 className="text-white font-bold mb-2">{p.name}</h4>
                        <p className="text-xs text-slate-400 leading-relaxed">{p.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6 p-6 bg-white/[0.02] rounded-2xl border border-white/5">
              <div className="flex justify-between items-end">
                <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Strictness Level</label>
                    <p className="text-xs text-slate-400 mt-1">Adjusts how critical the AI is of your answers.</p>
                </div>
                <span className="text-xl font-mono font-bold text-orange-500">{strictness}%</span>
              </div>
              
              <div className="relative h-2 bg-white/10 rounded-full">
                <div 
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-orange-600 to-orange-400 rounded-full"
                    style={{ width: `${strictness}%` }}
                />
                <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={strictness} 
                    onChange={(e) => setStrictness(e.target.value)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div 
                    className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg pointer-events-none transition-all"
                    style={{ left: `${strictness}%`, transform: `translate(-50%, -50%)` }}
                />
              </div>

              <div className="flex justify-between text-[10px] font-mono text-slate-500 uppercase tracking-wider">
                <span>Forgiving</span>
                <span>Standard</span>
                <span>Ruthless</span>
              </div>
            </div>
          </div>
        );

      case 'account':
        return (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white">Appearance</h3>
              <div className="flex gap-4">
                {['System', 'Light', 'Dark'].map((theme) => (
                  <button 
                    key={theme}
                    className={`px-6 py-3 rounded-xl border text-sm font-medium transition-all ${theme === 'Dark' ? 'bg-orange-500 text-white border-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.3)]' : 'bg-white/[0.02] text-slate-400 border-white/10 hover:text-white hover:bg-white/5'}`}
                  >
                    {theme}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="pt-8 border-t border-white/5">
                <h3 className="text-lg font-bold text-white mb-4 text-red-500">Danger Zone</h3>
                <p className="text-sm text-slate-400 mb-4">Once you delete your account, there is no going back. Please be certain.</p>
                <button className="px-6 py-3 rounded-xl border border-red-500/30 text-red-500 bg-red-500/5 hover:bg-red-500/10 transition-colors text-sm font-medium">
                    Delete Account
                </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen font-sans text-slate-300 selection:bg-orange-500/30">
      
      {/* Floating Sidebar (Duplicated from Dashboard) */}
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
          <button onClick={() => navigate('/history')} className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-white/5 hover:text-white rounded-xl transition-all">
            <History size={20} />
            <span>History</span>
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-white bg-white/5 rounded-xl font-medium border border-white/5 shadow-sm ring-1 ring-white/5">
            <SettingsIcon size={20} className="text-orange-500" />
            <span>Settings</span>
          </button>
        </nav>


      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-[calc(16rem+2rem)] p-8">
        <header className="flex justify-between items-center mb-8">
            <div>
                <h1 className="text-2xl font-bold text-white mb-1 tracking-tight">Settings</h1>
                <p className="text-slate-400 text-sm">Configure your interview environment and persona.</p>
            </div>
            <div className="flex items-center gap-4">
                <button className="relative overflow-hidden rounded-lg bg-gradient-to-r from-orange-600 to-orange-500 px-6 py-2 font-bold text-white shadow-[0_0_20px_rgba(255,100,0,0.3)] transition-all hover:scale-[1.02] text-sm">
                    <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                    SAVE CHANGES
                </button>
            </div>
        </header>

        <div className="max-w-5xl mx-auto">
            {/* Tab Navigation */}
            <div className="flex overflow-x-auto gap-2 mb-8 pb-2 border-b border-white/5">
                {[
                    { id: 'identity', label: 'Identity', icon: User },
                    { id: 'knowledge', label: 'Knowledge Base', icon: Shield },
                    { id: 'calibration', label: 'A/V Calibration', icon: Video },
                    { id: 'simulation', label: 'Simulation Config', icon: Cpu },
                    { id: 'account', label: 'Account', icon: SettingsIcon },
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                            activeTab === tab.id 
                            ? 'bg-white/10 text-white shadow-sm ring-1 ring-white/10' 
                            : 'text-slate-400 hover:text-white hover:bg-white/5'
                        }`}
                    >
                        <tab.icon size={16} className={activeTab === tab.id ? 'text-orange-500' : ''} />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <div className="p-[1px] rounded-3xl bg-gradient-to-b from-white/10 to-transparent">
                <div className="bg-[#0B0C10]/80 backdrop-blur-md rounded-3xl p-8 min-h-[500px] relative overflow-hidden">
                    {/* Background Noise & Grid */}
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none"></div>
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] opacity-20 pointer-events-none"></div>
                    
                    <div className="relative z-10">
                        {renderContent()}
                    </div>
                </div>
            </div>
        </div>
      </main>
    </div>
  );
}