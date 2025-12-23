import React from 'react';
import { Star, ShieldAlert, ShieldCheck, TrendingUp, TrendingDown, ExternalLink } from 'lucide-react';

const SentimentRadar = ({ companyName = "Google", data }) => {
  // Use passed data or fallback to default structure if null (loading state handled by parent usually)
  const sentimentData = data || {
    aggregateScore: 0,
    totalReviews: "0",
    sentiment: "Analyzing...",
    sources: [],
    themes: [],
    aiSummary: {
      pros: [],
      cons: []
    }
  };

  return (
    <div className="w-full max-w-4xl rounded-2xl border border-white/10 bg-[#0B0C10]/80 p-6 backdrop-blur-xl shadow-2xl mb-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b border-white/5 pb-6">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            {companyName} 
            <span className="text-xs font-mono text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded border border-emerald-400/20">VERIFIED ENTITY</span>
          </h2>
          <p className="text-slate-400 text-sm mt-1">Market Sentiment Analysis • Last updated 24h ago</p>
        </div>
        
        {/* The "Trust Score" Badge */}
        <div className="mt-4 md:mt-0 flex items-center gap-4 bg-white/5 px-5 py-3 rounded-xl border border-white/10">
          <div className="text-right">
            <div className="text-xs text-slate-400 uppercase tracking-wider">Trust Score</div>
            <div className="text-3xl font-mono font-bold text-white">{sentimentData.aggregateScore}</div>
          </div>
          <div className="h-10 w-[1px] bg-white/10"></div>
          <div className="flex gap-1 text-yellow-500">
            {[...Array(5)].map((_, i) => (
                <Star 
                    key={i} 
                    size={18} 
                    fill={i < Math.round(sentimentData.aggregateScore) ? "currentColor" : "none"} 
                    className={i < Math.round(sentimentData.aggregateScore) ? "" : "opacity-50"}
                />
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Col: Source Breakdown & Heatmap */}
        <div className="lg:col-span-1 space-y-6">
          {/* Source Cards */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono text-slate-500 uppercase">Data Sources</h3>
            {sentimentData.sources.map((source) => (
              <div key={source.name} className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] transition-colors cursor-pointer group">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full bg-white/5 flex items-center justify-center font-bold ${source.color}`}>
                    {source.icon}
                  </div>
                  <span className="text-slate-300 text-sm font-medium">{source.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-white font-mono">{source.rating}</span>
                  <ExternalLink size={12} className="text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            ))}
          </div>

          {/* Trending Themes */}
          <div className="space-y-3">
             <h3 className="text-xs font-mono text-slate-500 uppercase">Topic Heatmap</h3>
             {sentimentData.themes.map((theme) => (
               <div key={theme.topic} className="flex items-center justify-between text-sm">
                 <span className="text-slate-400">{theme.topic}</span>
                 <div className="flex items-center gap-2">
                   <span className={`text-xs px-2 py-0.5 rounded ${theme.score === 'High' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-yellow-500/10 text-yellow-400'}`}>
                     {theme.score}
                   </span>
                   {theme.trend === 'up' ? <TrendingUp size={14} className="text-emerald-500"/> : <TrendingDown size={14} className="text-red-500"/>}
                 </div>
               </div>
             ))}
          </div>
        </div>

        {/* Right Col: AI Summary (Pros/Cons) */}
        <div className="lg:col-span-2">
          <div className="h-full rounded-xl border border-white/10 bg-gradient-to-br from-white/[0.02] to-transparent p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></span>
                AI Consensus Summary
              </h3>
              <span className="text-xs text-purple-400 border border-purple-500/30 bg-purple-500/10 px-2 py-1 rounded">GPT-4 Analysis</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Pros */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-emerald-400 mb-2">
                  <ShieldCheck size={16} />
                  <span className="text-xs font-bold uppercase tracking-wider">Strengths</span>
                </div>
                {sentimentData.aiSummary.pros.map((pro, i) => (
                  <div key={i} className="flex gap-3 text-sm text-slate-300 leading-relaxed p-2 rounded hover:bg-emerald-500/[0.05] transition-colors">
                    <span className="text-emerald-500 mt-1">✓</span>
                    {pro}
                  </div>
                ))}
              </div>

              {/* Cons */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-red-400 mb-2">
                  <ShieldAlert size={16} />
                  <span className="text-xs font-bold uppercase tracking-wider">Risk Factors</span>
                </div>
                {sentimentData.aiSummary.cons.map((con, i) => (
                  <div key={i} className="flex gap-3 text-sm text-slate-300 leading-relaxed p-2 rounded hover:bg-red-500/[0.05] transition-colors">
                    <span className="text-red-500 mt-1">⚠</span>
                    {con}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SentimentRadar;