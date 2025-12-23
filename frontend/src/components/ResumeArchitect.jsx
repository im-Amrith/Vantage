import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Document, Page, pdfjs } from 'react-pdf';
import nlp from 'compromise';
import { 
  LayoutDashboard, 
  FileText, 
  Settings, 
  History, 
  Code, 
  ChevronLeft, 
  Upload, 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  Wand2, 
  Search,
  ArrowRight,
  Target,
  DollarSign
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function ResumeArchitect() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeSuggestion, setActiveSuggestion] = useState(null);

  // Mock Analysis Data
  const mockAnalysis = {
    score: 72,
    missingKeywords: ['Kubernetes', 'CI/CD', 'GraphQL', 'System Design'],
    foundKeywords: ['React', 'Python', 'Node.js', 'AWS', 'Docker'],
    weakVerbs: [
      { text: 'Worked on', suggestion: 'Spearheaded the development of', context: 'Worked on the payment processing system.' },
      { text: 'Did', suggestion: 'Executed', context: 'Did performance optimization.' },
      { text: 'Helped', suggestion: 'Collaborated with', context: 'Helped the design team.' }
    ],
    strongMetrics: [
      'Increased throughput by 20%',
      'Reduced latency by 150ms'
    ]
  };

  const onFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      analyzeResume(selectedFile);
    }
  };

  const analyzeResume = (file) => {
    setIsAnalyzing(true);
    // Simulate analysis delay
    setTimeout(() => {
      setAnalysis(mockAnalysis);
      setIsAnalyzing(false);
    }, 2000);
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  // Gauge Data
  const gaugeData = analysis ? [
    { name: 'Score', value: analysis.score },
    { name: 'Remaining', value: 100 - analysis.score }
  ] : [];
  const gaugeColors = ['#F97316', '#1e293b'];

  return (
    <div className="flex h-screen bg-[#0B0C10] text-slate-300 font-sans overflow-hidden selection:bg-orange-500/30">
      
      {/* LEFT PANEL: The Document (50%) */}
      <div className="w-1/2 flex flex-col border-r border-white/5 bg-[#0B0C10] relative">
        {/* Header */}
        <header className="h-16 border-b border-white/5 flex items-center justify-between px-6 bg-white/[0.02]">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/dashboard')} className="p-2 hover:bg-white/5 rounded-lg transition-colors">
              <ChevronLeft size={20} />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center text-white font-bold">V</div>
              <span className="font-bold text-white tracking-tight">Resume Architect</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <label className="cursor-pointer px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-sm font-medium text-white transition-all flex items-center gap-2">
              <Upload size={16} />
              <span>Upload PDF</span>
              <input type="file" accept=".pdf" onChange={onFileChange} className="hidden" />
            </label>
          </div>
        </header>

        {/* PDF Viewer Area */}
        <div className="flex-1 bg-[#1a1b1c] overflow-y-auto relative flex items-center justify-center p-8">
          {!file ? (
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto border border-white/10 border-dashed">
                <Upload size={32} className="text-slate-500" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Upload your Resume</h3>
                <p className="text-slate-500 text-sm">Supported format: PDF</p>
              </div>
            </div>
          ) : (
            <div className="shadow-2xl relative">
              <Document
                file={file}
                onLoadSuccess={onDocumentLoadSuccess}
                className="max-w-full"
                loading={
                  <div className="flex items-center gap-2 text-orange-500">
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    Loading PDF...
                  </div>
                }
              >
                <Page 
                  pageNumber={1} 
                  renderTextLayer={false} 
                  renderAnnotationLayer={false}
                  width={600}
                  className="border border-white/10"
                />
              </Document>

              {/* Mock Heatmap Overlays (Visual Demo) */}
              {analysis && (
                <>
                  {/* Weak Verb Overlay */}
                  <div 
                    className="absolute top-[25%] left-[10%] w-[40%] h-6 bg-red-500/20 border border-red-500/50 cursor-pointer hover:bg-red-500/30 transition-colors group"
                    onClick={() => setActiveSuggestion(analysis.weakVerbs[0])}
                  >
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-red-500 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      Weak Verb Detected
                    </div>
                  </div>

                  {/* Strong Metric Overlay */}
                  <div className="absolute top-[35%] right-[10%] w-[30%] h-6 bg-green-500/20 border border-green-500/50"></div>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* RIGHT PANEL: The Diagnostics (50%) */}
      <div className="w-1/2 flex flex-col bg-[#0B0C10]">
        {/* Header */}
        <div className="h-16 border-b border-white/5 flex items-center px-8">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Target size={20} className="text-orange-500" />
            Blueprint Diagnostics
          </h2>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
          {isAnalyzing ? (
            <div className="flex flex-col items-center justify-center h-full space-y-4">
              <div className="w-12 h-12 border-4 border-orange-500/30 border-t-orange-500 rounded-full animate-spin" />
              <p className="text-slate-400 animate-pulse">Scanning document structure...</p>
            </div>
          ) : !analysis ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-500 space-y-4">
              <FileText size={48} className="opacity-20" />
              <p>Upload a resume to generate diagnostics</p>
            </div>
          ) : (
            <>
              {/* Pass Rate Gauge */}
              <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 flex items-center gap-8">
                <div className="w-32 h-32 relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={gaugeData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={55}
                        startAngle={180}
                        endAngle={0}
                        paddingAngle={0}
                        dataKey="value"
                        stroke="none"
                      >
                        {gaugeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={gaugeColors[index]} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pt-4">
                    <span className="text-3xl font-bold text-white">{analysis.score}</span>
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider">ATS Score</span>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-bold mb-2">Optimization Status</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    Your resume is readable but lacks key technical keywords found in the target job description. Action verbs need strengthening.
                  </p>
                </div>
              </div>

              {/* Keyword Gap Analysis */}
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-red-500/5 border border-red-500/10 rounded-2xl p-6">
                  <h3 className="text-sm font-bold text-red-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <XCircle size={16} /> Missing Keywords
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {analysis.missingKeywords.map((kw, i) => (
                      <span key={i} className="px-2 py-1 rounded bg-red-500/10 text-red-400 text-xs border border-red-500/20">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="bg-green-500/5 border border-green-500/10 rounded-2xl p-6">
                  <h3 className="text-sm font-bold text-green-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <CheckCircle size={16} /> Found Keywords
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {analysis.foundKeywords.map((kw, i) => (
                      <span key={i} className="px-2 py-1 rounded bg-green-500/10 text-green-400 text-xs border border-green-500/20">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Items / Rewrite Suggestions */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-white">Impact Analysis</h3>
                
                {/* Active Suggestion Popover (Simulated inline for now) */}
                {activeSuggestion && (
                  <div className="bg-[#1a1b1c] border border-orange-500 rounded-xl p-4 mb-4 animate-in fade-in slide-in-from-top-2 shadow-2xl shadow-orange-500/10">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2 text-orange-500 font-bold text-sm">
                        <Wand2 size={16} />
                        AI Rewrite Suggestion
                      </div>
                      <button onClick={() => setActiveSuggestion(null)} className="text-slate-500 hover:text-white">
                        <XCircle size={16} />
                      </button>
                    </div>
                    <div className="grid grid-cols-[1fr,auto,1fr] gap-4 items-center text-sm">
                      <div className="p-3 bg-red-500/10 rounded-lg border border-red-500/20 text-slate-300">
                        "{activeSuggestion.text}..."
                      </div>
                      <ArrowRight size={16} className="text-slate-600" />
                      <div className="p-3 bg-green-500/10 rounded-lg border border-green-500/20 text-green-300 font-medium">
                        "{activeSuggestion.suggestion}..."
                      </div>
                    </div>
                    <button className="w-full mt-3 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-xs font-bold transition-colors">
                      APPLY CHANGE
                    </button>
                  </div>
                )}

                <div className="space-y-3">
                  {analysis.weakVerbs.map((item, i) => (
                    <div 
                      key={i} 
                      onClick={() => setActiveSuggestion(item)}
                      className="p-4 bg-white/[0.02] border border-white/5 rounded-xl hover:bg-white/5 hover:border-orange-500/30 transition-all cursor-pointer group"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-red-400 uppercase tracking-wider flex items-center gap-2">
                          <AlertTriangle size={12} /> Weak Verb
                        </span>
                        <span className="text-xs text-slate-500 group-hover:text-orange-500 transition-colors">Click to fix</span>
                      </div>
                      <p className="text-slate-400 text-sm">
                        "<span className="text-red-400 border-b border-red-400/50">{item.text}</span> {item.context.replace(item.text, '').trim()}"
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
