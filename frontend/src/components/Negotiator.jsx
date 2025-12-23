import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  Lock, 
  Shield, 
  DollarSign, 
  Briefcase, 
  TrendingUp, 
  AlertTriangle, 
  MessageSquare,
  ChevronLeft,
  LayoutDashboard,
  Code,
  FileText,
  Target,
  Activity,
  History,
  Settings,
  User,
  Bot,
  Trello
} from 'lucide-react';

const Negotiator = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      sender: 'hr', 
      text: "Hi Alex, we're excited to extend an offer for the Senior Backend Developer role. We've put together a competitive package: $120k base, 0.05% equity, and a $10k sign-on bonus. We believe this reflects the market rate and your experience level.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [leverage, setLeverage] = useState(50); // 0-100
  const [outcomeProb, setOutcomeProb] = useState(85); // Probability of success
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Offer Details
  const [offer, setOffer] = useState({
    base: 120000,
    equity: 0.05,
    signOn: 10000
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Mock AI Coach Whisper
  const getGhostText = () => {
    if (leverage < 40) return "Don't apologize. Reiterate your value.";
    if (leverage > 70) return "You have the upper hand. Ask for more equity.";
    return "Ask if the sign-on bonus is flexible.";
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const newMsg = {
      id: messages.length + 1,
      sender: 'user',
      text: inputValue,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, newMsg]);
    setInputValue('');
    setIsTyping(true);

    // Simulate HR Response & Leverage Update
    setTimeout(() => {
      analyzeResponse(inputValue);
    }, 1500);
  };

  const analyzeResponse = (text) => {
    // Simple keyword-based mock logic for demo
    const lowerText = text.toLowerCase();
    let newLeverage = leverage;
    let hrResponse = "";
    let newOffer = { ...offer };

    if (lowerText.includes('competing') || lowerText.includes('offer') || lowerText.includes('google')) {
      newLeverage = Math.min(100, leverage + 15);
      hrResponse = "I see. We certainly want to be competitive. While we have some constraints, let me see if I can get approval for a higher sign-on bonus.";
      setOutcomeProb(Math.min(95, outcomeProb + 5));
    } else if (lowerText.includes('excited') && (lowerText.includes('accept') || lowerText.includes('yes'))) {
      newLeverage = Math.max(0, leverage - 20);
      hrResponse = "That's fantastic news! We're thrilled to have you on board. I'll send over the paperwork immediately.";
      setOutcomeProb(100);
    } else if (lowerText.includes('disappointed') || lowerText.includes('low')) {
      newLeverage = Math.min(100, leverage + 5);
      hrResponse = "I understand your perspective. However, this is the top of our band for this role. We might have some flexibility on equity.";
      setOutcomeProb(Math.max(0, outcomeProb - 10));
    } else {
      newLeverage = Math.max(0, leverage - 5);
      hrResponse = "We believe this is a very strong offer given the current market conditions.";
      setOutcomeProb(Math.max(0, outcomeProb - 2));
    }

    setLeverage(newLeverage);
    setIsTyping(false);
    setMessages(prev => [...prev, {
      id: prev.length + 1,
      sender: 'hr',
      text: hrResponse,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);
  };

  const NavLink = ({ to, icon: Icon, label, active }) => (
    <button
      onClick={() => navigate(to)}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
        active 
          ? 'bg-green-500/10 text-green-500 border border-green-500/20' 
          : 'text-gray-400 hover:bg-white/5 hover:text-white'
      }`}
    >
      <Icon className={`w-5 h-5 ${active ? 'text-green-500' : 'text-gray-500 group-hover:text-white'}`} />
      <span className="font-medium">{label}</span>
      {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />}
    </button>
  );

  return (
    <div className="flex h-screen bg-[#050505] text-slate-300 font-sans overflow-hidden selection:bg-green-500/30">
      
      {/* Sidebar */}
      <aside className="w-72 bg-[#0a0a0a] border-r border-white/5 p-6 flex flex-col z-50">
        <div className="flex items-center gap-3 px-2 mb-12">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-600 to-emerald-500 flex items-center justify-center shadow-lg shadow-green-500/20">
            <DollarSign className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">Negotiator</h1>
            <p className="text-xs text-gray-500 font-medium">Salary Simulator</p>
          </div>
        </div>

        <nav className="space-y-2 flex-1">
          <NavLink to="/dashboard" icon={LayoutDashboard} label="Mission Control" />
          <NavLink to="/tracker" icon={Trello} label="Mission Status" />
          <NavLink to="/dojo" icon={Code} label="Code Dojo" />
          <NavLink to="/resume" icon={FileText} label="Resume Architect" />
          <NavLink to="/recon" icon={Target} label="Recon Room" />
          <NavLink to="/negotiator" icon={DollarSign} label="The Negotiator" active />
          <NavLink to="/results" icon={Activity} label="Analytics" />
          <NavLink to="/history" icon={History} label="Mission History" />
          <NavLink to="/settings" icon={Settings} label="Settings" />
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex relative">
        
        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-[#050505] relative">
          {/* Header */}
          <header className="h-16 border-b border-white/5 flex items-center justify-between px-6 bg-[#0a0a0a]/50 backdrop-blur-md z-10">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-sm font-mono text-green-500 flex items-center gap-2">
                <Lock size={12} />
                ENCRYPTED CONNECTION
              </span>
            </div>
            <div className="text-xs text-gray-500 font-mono">SESSION ID: NEG-9921</div>
          </header>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
            {messages.map((msg) => (
              <motion.div 
                key={msg.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[70%] ${msg.sender === 'user' ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                  <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-lg ${
                    msg.sender === 'user' 
                      ? 'bg-green-600/20 border border-green-500/30 text-green-100 rounded-tr-none' 
                      : 'bg-[#1a1a1a] border border-white/10 text-gray-300 rounded-tl-none'
                  }`}>
                    {msg.text}
                  </div>
                  <span className="text-[10px] text-gray-600 font-mono px-1">{msg.timestamp}</span>
                </div>
              </motion.div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-[#1a1a1a] border border-white/10 p-4 rounded-2xl rounded-tl-none flex gap-1">
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-6 bg-[#0a0a0a] border-t border-white/5">
            <div className="relative">
              {/* Ghost Text */}
              {!inputValue && (
                <div className="absolute left-4 top-4 text-gray-600 pointer-events-none text-sm italic flex items-center gap-2">
                  <Bot size={14} className="text-green-500/50" />
                  <span>{getGhostText()}</span>
                </div>
              )}
              <form onSubmit={handleSendMessage} className="relative">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="w-full bg-[#151515] border border-white/10 rounded-xl pl-4 pr-12 py-4 text-white focus:outline-none focus:border-green-500/50 focus:ring-1 focus:ring-green-500/20 transition-all"
                />
                <button 
                  type="submit"
                  className="absolute right-2 top-2 p-2 bg-green-600 hover:bg-green-500 text-white rounded-lg transition-colors"
                >
                  <Send size={18} />
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Right Panel: Stats & Offer */}
        <div className="w-80 bg-[#0a0a0a] border-l border-white/5 p-6 flex flex-col gap-6">
          
          {/* Offer Card */}
          <div className="bg-[#151515] border border-white/10 rounded-2xl p-5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-16 bg-green-500/5 rounded-full blur-2xl group-hover:bg-green-500/10 transition-all" />
            <div className="flex items-center gap-2 mb-4 text-green-400">
              <Briefcase size={18} />
              <span className="font-bold text-sm tracking-wider">CURRENT OFFER</span>
            </div>
            
            <div className="space-y-4 relative z-10">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Base Salary</p>
                <p className="text-2xl font-bold text-white">${offer.base.toLocaleString()}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Equity</p>
                  <p className="text-lg font-semibold text-white">{offer.equity}%</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Sign-on</p>
                  <p className="text-lg font-semibold text-white">${offer.signOn.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Leverage Meter */}
          <div className="flex-1 bg-[#151515] border border-white/10 rounded-2xl p-5 flex flex-col items-center relative overflow-hidden">
            <h3 className="text-sm font-bold text-gray-400 mb-6 w-full flex items-center justify-between">
              <span>LEVERAGE</span>
              <span className="text-xs font-mono text-gray-600">{leverage}%</span>
            </h3>
            
            <div className="flex-1 w-12 bg-[#0a0a0a] rounded-full relative overflow-hidden border border-white/5">
              <motion.div 
                className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-red-500 via-yellow-500 to-green-500"
                initial={{ height: '50%' }}
                animate={{ height: `${leverage}%` }}
                transition={{ type: "spring", stiffness: 100, damping: 20 }}
              />
              {/* Grid lines */}
              <div className="absolute inset-0 flex flex-col justify-between py-2 pointer-events-none">
                {[...Array(10)].map((_, i) => (
                  <div key={i} className="w-full h-[1px] bg-black/20" />
                ))}
              </div>
            </div>

            <div className="mt-6 w-full text-center">
              <p className={`text-sm font-medium ${
                leverage > 60 ? 'text-green-400' : leverage < 40 ? 'text-red-400' : 'text-yellow-400'
              }`}>
                {leverage > 60 ? 'STRONG POSITION' : leverage < 40 ? 'LOSING GROUND' : 'NEUTRAL'}
              </p>
            </div>
          </div>

          {/* Outcome Predictor */}
          <div className="bg-[#151515] border border-white/10 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-500 uppercase">Success Probability</span>
              <span className={`text-sm font-bold ${outcomeProb > 70 ? 'text-green-400' : 'text-orange-400'}`}>
                {outcomeProb}%
              </span>
            </div>
            <div className="h-2 bg-[#0a0a0a] rounded-full overflow-hidden">
              <motion.div 
                className={`h-full rounded-full ${outcomeProb > 70 ? 'bg-green-500' : 'bg-orange-500'}`}
                initial={{ width: '0%' }}
                animate={{ width: `${outcomeProb}%` }}
              />
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default Negotiator;
