import React, { useState } from 'react';
import { BarChart3, CheckCircle, XCircle, Clock, Calendar, TrendingUp, AlertTriangle, Lightbulb, Play, Pause, ChevronDown, ChevronUp, Eye, MessageSquare, Zap } from 'lucide-react';
import { Button } from './ui/button';
import { useNavigate, useLocation } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

export default function Results() {
  const navigate = useNavigate();
  const location = useLocation();
  const report = location.state?.report;

  // Process real report data if available
  const realQuestions = report?.events
    ?.filter(e => e.type === 'answer_submitted')
    .map((e, index) => ({
      id: index + 1,
      timestamp: new Date(e.timestamp || Date.now()).toLocaleTimeString([], {minute:'2-digit', second:'2-digit'}),
      question: e.question?.prompt || e.question || "Question text unavailable",
      yourAnswer: e.answer,
      idealAnswer: e.feedback?.notes ? e.feedback.notes.join(' ') : "Focus on structured problem solving.",
      feedback: e.feedback?.notes ? e.feedback.notes[0] : "Review the detailed notes.",
      score: Math.round((e.feedback?.technical_accuracy || 0.5) * 100)
    }));

  // Process real transcript
  const realTranscript = [];
  if (report?.events) {
    report.events.forEach((e) => {
      if (e.type === 'answer_submitted') {
        const time = new Date(e.timestamp || Date.now()).toLocaleTimeString([], {minute:'2-digit', second:'2-digit'});
        // Add Question
        realTranscript.push({
          time: time,
          speaker: "AI",
          text: e.question?.prompt || e.question || "Question unavailable"
        });
        // Add Answer
        realTranscript.push({
          time: time,
          speaker: "You",
          text: e.answer || "",
          // Simple keyword detection for demo purposes
          keyword: e.answer?.length > 50
        });
      }
    });
  }

  // Process real timeline
  const realTimeline = report?.events
    ?.filter(e => e.type === 'answer_submitted')
    .map((e, i) => ({
      time: `Q${i + 1}`,
      confidence: Math.round((e.feedback?.confidence || 0.5) * 100),
      nervousness: Math.round((1 - (e.feedback?.confidence || 0.5)) * 100),
      question: `Q${i + 1}`
    }));

  // Mock Data Generation for Advanced Features
  const mockTimelineData = Array.from({ length: 24 }, (_, i) => ({
    time: `${i}m`,
    confidence: 40 + Math.random() * 50 + (i > 10 ? 20 : 0), // Simulate improvement
    nervousness: 60 - Math.random() * 40 - (i > 10 ? 20 : 0),
    question: i % 5 === 0 ? `Q${i/5 + 1}` : null
  }));

  const mockTranscript = [
    { time: "00:15", speaker: "AI", text: "Could you describe a challenging technical problem you solved recently?" },
    { time: "00:24", speaker: "You", text: "Um, yeah. So, at my last job, we had this issue with... uh... database latency.", filler: true },
    { time: "00:35", speaker: "You", text: "I decided to implement Redis caching to reduce the load.", keyword: true },
    { time: "00:42", speaker: "You", text: "It actually, like, improved performance by 50%.", filler: true },
    { time: "01:10", speaker: "AI", text: "That's impressive. How did you handle cache invalidation?" },
    { time: "01:15", speaker: "You", text: "We used a write-through strategy.", keyword: true },
  ];

  const mockQuestions = [
    {
      id: 1,
      timestamp: "04:12",
      question: "How do you handle scalability in a distributed system?",
      yourAnswer: "I would just add more servers. Maybe use a load balancer.",
      idealAnswer: "I would start by analyzing the traffic patterns. For horizontal scaling, I'd introduce a Load Balancer (like Nginx) and ensure stateless services. For the database, I'd consider read replicas or sharding depending on the bottleneck.",
      feedback: "You immediately jumped to a solution without asking about traffic volume or constraints.",
      score: 65
    },
    {
      id: 2,
      timestamp: "08:45",
      question: "Explain the difference between TCP and UDP.",
      yourAnswer: "TCP is reliable, UDP is fast. TCP does handshakes.",
      idealAnswer: "TCP is connection-oriented and guarantees delivery, making it suitable for web browsing. UDP is connectionless and faster but unreliable, ideal for real-time streaming or gaming.",
      feedback: "Good high-level distinction, but you missed mentioning flow control and ordering.",
      score: 82
    }
  ];

  // Merge passed report with mock data for full UI demo
  const data = {
    ...report,
    hiring_probability: report?.hiring_probability || 0.78,
    summary: report?.areas_of_improvement 
      ? `Based on the analysis, here are the key takeaways. Areas to improve: ${report.areas_of_improvement.join(', ')}. Top tip: ${report.tips?.[0] || 'Keep practicing.'}` 
      : "Great technical depth in Python and System Design, but you rushed the behavioral section. Your confidence improved significantly after the first 5 minutes.",
    timeline: realTimeline?.length > 0 ? realTimeline : mockTimelineData,
    transcript: realTranscript?.length > 0 ? realTranscript : mockTranscript,
    detailed_feedback: realQuestions?.length > 0 ? realQuestions : mockQuestions
  };

  const [activeQuestion, setActiveQuestion] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="min-h-screen bg-[#121212] text-gray-300 font-sans selection:bg-[#FE7F2D]/30">
      
      {/* Top Navigation */}
      <header className="border-b border-white/10 bg-[#1a1b1c]/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#FE7F2D] rounded-lg flex items-center justify-center text-white font-bold">V</div>
                <span className="text-lg font-bold text-white tracking-tight">Vantage Analysis</span>
            </div>
            <div className="flex items-center gap-4">
                <div className="text-xs text-gray-500 font-mono">ID: {data.session_id?.slice(0, 8) || 'DEMO-882'}</div>
                <Button onClick={() => navigate('/dashboard')} variant="outline" className="border-white/10 hover:bg-white/5 text-xs h-8">
                    Exit to Dashboard
                </Button>
            </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        
        {/* HERO SECTION: Score & Summary */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Hero Score */}
            <div className="bg-[#1a1b1c] rounded-2xl p-8 border border-white/10 relative overflow-hidden flex items-center justify-between group">
                <div className="absolute inset-0 bg-gradient-to-br from-[#FE7F2D]/10 to-transparent opacity-50 group-hover:opacity-70 transition-opacity" />
                
                <div className="relative z-10">
                    <h2 className="text-gray-400 text-sm font-semibold uppercase tracking-wider mb-1">Hiring Probability</h2>
                    <div className="flex items-baseline gap-2">
                        <span className="text-6xl font-bold text-white tracking-tighter">{Math.round(data.hiring_probability * 100)}</span>
                        <span className="text-2xl text-gray-500 font-light">/100</span>
                    </div>
                    <div className="mt-4 flex items-center gap-2 text-[#FE7F2D] text-sm font-medium bg-[#FE7F2D]/10 px-3 py-1 rounded-full w-fit">
                        <TrendingUp size={14} />
                        <span>Top 15% of candidates</span>
                    </div>
                </div>

                {/* Circular Progress Visual */}
                <div className="relative w-32 h-32">
                    <svg className="w-full h-full transform -rotate-90">
                        <circle cx="64" cy="64" r="60" stroke="#333" strokeWidth="8" fill="transparent" />
                        <circle 
                            cx="64" cy="64" r="60" 
                            stroke="#FE7F2D" strokeWidth="8" 
                            fill="transparent" 
                            strokeDasharray={377} 
                            strokeDashoffset={377 - (377 * data.hiring_probability)} 
                            strokeLinecap="round" 
                            className="drop-shadow-[0_0_10px_rgba(254,127,45,0.5)]"
                        />
                    </svg>
                </div>
            </div>

            {/* AI Summary */}
            <div className="lg:col-span-2 bg-[#1a1b1c] rounded-2xl p-8 border border-white/10 flex flex-col justify-center relative">
                <div className="absolute top-6 right-6">
                    <Zap className="text-yellow-400 fill-yellow-400 animate-pulse" size={24} />
                </div>
                <h3 className="text-white text-lg font-semibold mb-3">AI Executive Summary</h3>
                <p className="text-gray-300 leading-relaxed text-lg">
                    "{data.summary}"
                </p>
                <div className="mt-6 flex flex-wrap gap-4">
                    {report?.tips?.length > 0 ? (
                        <>
                             <div className="flex items-center gap-2 text-sm text-gray-400">
                                <div className="w-2 h-2 rounded-full bg-green-500" />
                                {report.num_questions} Questions Completed
                            </div>
                            {report.areas_of_improvement?.slice(0, 1).map((area, i) => (
                                <div key={i} className="flex items-center gap-2 text-sm text-gray-400">
                                    <div className="w-2 h-2 rounded-full bg-yellow-500" />
                                    {area}
                                </div>
                            ))}
                            {report.mistakes?.slice(0, 1).map((mistake, i) => (
                                <div key={i} className="flex items-center gap-2 text-sm text-gray-400">
                                    <div className="w-2 h-2 rounded-full bg-red-500" />
                                    {mistake}
                                </div>
                            ))}
                        </>
                    ) : (
                        <>
                            <div className="flex items-center gap-2 text-sm text-gray-400">
                                <div className="w-2 h-2 rounded-full bg-green-500" />
                                Strong Technicals
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-400">
                                <div className="w-2 h-2 rounded-full bg-yellow-500" />
                                Pacing Issues
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-400">
                                <div className="w-2 h-2 rounded-full bg-red-500" />
                                Missed Edge Cases
                            </div>
                        </>
                    )}
                </div>
            </div>
        </section>

        {/* MIDDLE SECTION: Video & Transcript */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
            
            {/* Video Player with Eye Tracking Overlay */}
            <div className="lg:col-span-2 bg-black rounded-2xl border border-white/10 overflow-hidden relative group">
                {/* Mock Video Placeholder */}
                <div className="absolute inset-0 flex items-center justify-center bg-[#0a0a0a]">
                    <div className="text-center">
                        <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm mb-4 mx-auto cursor-pointer hover:scale-110 transition-transform" onClick={() => setIsPlaying(!isPlaying)}>
                            {isPlaying ? <Pause className="fill-white text-white" size={32} /> : <Play className="fill-white text-white ml-1" size={32} />}
                        </div>
                        <p className="text-gray-500 text-sm">Interview Recording (00:24:12)</p>
                    </div>
                </div>

                {/* Eye Tracking Heatmap Overlay (Mock) */}
                <div className="absolute inset-0 pointer-events-none opacity-30 mix-blend-screen">
                    <div className="absolute top-1/4 left-1/2 w-32 h-32 bg-green-500 rounded-full blur-3xl transform -translate-x-1/2" /> {/* Focus Zone */}
                    <div className="absolute bottom-10 left-10 w-24 h-24 bg-red-500 rounded-full blur-3xl" /> {/* Distraction Zone */}
                </div>

                <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 flex items-center gap-2">
                    <Eye size={14} className="text-green-400" />
                    <span className="text-xs text-white font-medium">Eye Contact: 88%</span>
                </div>
            </div>

            {/* Interactive Transcript */}
            <div className="bg-[#1a1b1c] rounded-2xl border border-white/10 flex flex-col overflow-hidden">
                <div className="p-4 border-b border-white/10 bg-[#212223]">
                    <h3 className="text-white font-semibold flex items-center gap-2">
                        <MessageSquare size={18} className="text-[#FE7F2D]" />
                        Transcript Analysis
                    </h3>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                    {data.transcript.map((entry, i) => (
                        <div key={i} className={`flex gap-3 ${entry.speaker === 'AI' ? 'opacity-70' : ''}`}>
                            <span className="text-xs text-gray-500 font-mono mt-1 shrink-0 cursor-pointer hover:text-[#FE7F2D]">{entry.time}</span>
                            <div>
                                <span className={`text-xs font-bold mb-1 block ${entry.speaker === 'AI' ? 'text-blue-400' : 'text-[#FE7F2D]'}`}>{entry.speaker}</span>
                                <p className="text-sm text-gray-300 leading-relaxed">
                                    {entry.text.split(' ').map((word, w) => {
                                        // Simple mock highlighting logic
                                        const isFiller = ['um', 'uh', 'like'].includes(word.replace(/[^a-zA-Z]/g, '').toLowerCase());
                                        const isKeyword = ['redis', 'caching', 'latency', 'write-through'].includes(word.replace(/[^a-zA-Z]/g, '').toLowerCase());
                                        
                                        if (entry.filler && isFiller) return <span key={w} className="bg-red-500/20 text-red-300 px-1 rounded mx-0.5">{word}</span>;
                                        if (entry.keyword && isKeyword) return <span key={w} className="bg-green-500/20 text-green-300 px-1 rounded mx-0.5">{word}</span>;
                                        return word + ' ';
                                    })}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        {/* BOTTOM SECTION: Sentiment Timeline */}
        <section className="bg-[#1a1b1c] rounded-2xl p-6 border border-white/10">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-white text-lg font-semibold flex items-center gap-2">
                    <TrendingUp size={20} className="text-[#FE7F2D]" />
                    Sentiment & Confidence Timeline
                </h3>
                <div className="flex gap-4 text-sm">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-1 bg-[#FE7F2D]" />
                        <span className="text-gray-400">Confidence</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-1 bg-gray-600" />
                        <span className="text-gray-400">Nervousness</span>
                    </div>
                </div>
            </div>
            
            <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data.timeline}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                        <XAxis dataKey="time" stroke="#666" tick={{fill: '#666'}} />
                        <YAxis stroke="#666" tick={{fill: '#666'}} />
                        <Tooltip 
                            contentStyle={{ backgroundColor: '#212223', borderColor: '#333', color: '#fff' }}
                            itemStyle={{ color: '#fff' }}
                        />
                        <ReferenceLine x="5m" stroke="white" strokeDasharray="3 3" label={{ value: 'Q1', fill: 'white', fontSize: 12 }} />
                        <ReferenceLine x="10m" stroke="white" strokeDasharray="3 3" label={{ value: 'Q2', fill: 'white', fontSize: 12 }} />
                        <ReferenceLine x="15m" stroke="white" strokeDasharray="3 3" label={{ value: 'Q3', fill: 'white', fontSize: 12 }} />
                        
                        <Line type="monotone" dataKey="confidence" stroke="#FE7F2D" strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
                        <Line type="monotone" dataKey="nervousness" stroke="#4b5563" strokeWidth={2} dot={false} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </section>

        {/* DEEP DIVE: Question Analysis */}
        <section className="space-y-6">
            <h3 className="text-xl font-bold text-white">Detailed Question Analysis</h3>
            {data.detailed_feedback.map((q) => (
                <div key={q.id} className="bg-[#1a1b1c] rounded-xl border border-white/10 overflow-hidden">
                    <div 
                        className="p-6 cursor-pointer hover:bg-white/5 transition-colors flex items-start justify-between"
                        onClick={() => setActiveQuestion(activeQuestion === q.id ? null : q.id)}
                    >
                        <div className="flex gap-4">
                            <div className="bg-[#212223] text-gray-400 font-mono text-sm px-3 py-1 rounded h-fit border border-white/10">
                                {q.timestamp}
                            </div>
                            <div>
                                <h4 className="text-white font-medium text-lg mb-1">{q.question}</h4>
                                <p className="text-red-400 text-sm flex items-center gap-2">
                                    <AlertTriangle size={14} />
                                    {q.feedback}
                                </p>
                            </div>
                        </div>
                        <div className={`transform transition-transform ${activeQuestion === q.id ? 'rotate-180' : ''}`}>
                            <ChevronDown className="text-gray-500" />
                        </div>
                    </div>

                    {/* Always visible summary for quick scanning */}
                    <div className="px-6 pb-4 text-sm text-gray-400 line-clamp-2">
                        {q.yourAnswer}
                    </div>

                    {activeQuestion === q.id && (
                        <div className="border-t border-white/10 bg-[#0f0f10] p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h5 className="text-gray-500 text-xs uppercase tracking-wider font-semibold mb-3">Your Answer</h5>
                                <div className="bg-[#1a1b1c] p-4 rounded-lg border border-white/5 text-gray-300 text-sm leading-relaxed">
                                    "{q.yourAnswer}"
                                </div>
                            </div>
                            <div>
                                <h5 className="text-[#FE7F2D] text-xs uppercase tracking-wider font-semibold mb-3 flex items-center gap-2">
                                    <Zap size={12} />
                                    AI Ideal Answer
                                </h5>
                                <div className="bg-[#FE7F2D]/5 p-4 rounded-lg border border-[#FE7F2D]/20 text-gray-200 text-sm leading-relaxed">
                                    "{q.idealAnswer}"
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </section>

      </main>
    </div>
  );
}

