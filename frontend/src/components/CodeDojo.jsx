import React, { useState, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { 
  Play, 
  Cpu, 
  Zap, 
  MessageSquare, 
  CheckCircle, 
  XCircle, 
  RotateCcw, 
  Settings, 
  ChevronLeft,
  Code,
  Terminal,
  Maximize2,
  Lightbulb,
  FileText
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { executeCode } from '../services/api';

export default function CodeDojo() {
  const navigate = useNavigate();
  const [language, setLanguage] = useState('python');
  const [code, setCode] = useState(`# Problem: Invert Binary Tree
# Given the root of a binary tree, invert the tree, and return its root.

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def invertTree(root: TreeNode) -> TreeNode:
    # Write your solution here
    pass
`);
  const [output, setOutput] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [showSensei, setShowSensei] = useState(false);
  const [complexity, setComplexity] = useState(null);
  const [activeTab, setActiveTab] = useState('tests');

  // Mock Test Cases
  const [testCases, setTestCases] = useState([
    { id: 1, input: "root = [4,2,7,1,3,6,9]", expected: "[4,7,2,9,6,3,1]", status: "pending" },
    { id: 2, input: "root = [2,1,3]", expected: "[2,3,1]", status: "pending" },
    { id: 3, input: "root = []", expected: "[]", status: "pending" },
  ]);

  const handleRun = async () => {
    setIsRunning(true);
    setOutput(null);
    setComplexity(null);
    
    // Reset test cases to pending
    setTestCases(prev => prev.map(tc => ({ ...tc, status: "pending", actual: null })));

    try {
      const result = await executeCode(code, language);
      
      if (result.error) {
        setOutput(result.error);
        // Mark all as failed if system error
        setTestCases(prev => prev.map(tc => ({ ...tc, status: "failed" })));
      } else {
        // Update test cases based on result
        const newTestCases = testCases.map(tc => {
          const res = result.results.find(r => r.id === tc.id);
          return {
            ...tc,
            status: res?.passed ? "passed" : "failed",
            actual: res?.actual
          };
        });
        setTestCases(newTestCases);
        
        const passedCount = result.results.filter(r => r.passed).length;
        const totalCount = result.results.length;
        
        let outMsg = "";
        if (result.output) {
             outMsg += `Output:\n${result.output}\n\n`;
        }
        outMsg += `Test Run Completed: ${passedCount}/${totalCount} Passed`;
        setOutput(outMsg);

        if (result.complexity) {
          setComplexity(result.complexity);
        }
      }
    } catch (error) {
      setOutput(`Execution failed: ${error.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  const handleSenseiHint = () => {
    setShowSensei(true);
  };

  return (
    <div className="flex h-screen bg-[#0B0C10] text-slate-300 font-sans overflow-hidden selection:bg-orange-500/30">
      
      {/* LEFT PANEL: The Mission (40%) */}
      <div className="w-[40%] flex flex-col border-r border-white/5 bg-[#0B0C10] relative">
        {/* Header */}
        <header className="h-16 border-b border-white/5 flex items-center justify-between px-6 bg-white/[0.02]">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/dashboard')} className="p-2 hover:bg-white/5 rounded-lg transition-colors">
              <ChevronLeft size={20} />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center text-white font-bold">V</div>
              <span className="font-bold text-white tracking-tight">Code Dojo</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-xs font-mono border border-green-500/20">EASY</span>
            <span className="text-xs text-slate-500 font-mono">Success Rate: 78%</span>
          </div>
        </header>

        {/* Problem Content */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <h1 className="text-3xl font-bold text-white mb-6">Invert Binary Tree</h1>
          
          <div className="prose prose-invert max-w-none">
            <p className="text-slate-400 leading-relaxed mb-6">
              Given the root of a binary tree, invert the tree, and return its root.
            </p>

            <div className="bg-white/5 rounded-xl p-6 border border-white/5 mb-8">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Example 1</h3>
              <div className="font-mono text-sm space-y-2">
                <div className="flex gap-4">
                  <span className="text-slate-500 w-16">Input:</span>
                  <span className="text-orange-400">root = [4,2,7,1,3,6,9]</span>
                </div>
                <div className="flex gap-4">
                  <span className="text-slate-500 w-16">Output:</span>
                  <span className="text-green-400">[4,7,2,9,6,3,1]</span>
                </div>
              </div>
            </div>

            <div className="bg-white/5 rounded-xl p-6 border border-white/5 mb-8">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Constraints</h3>
              <ul className="list-disc list-inside text-slate-400 space-y-2 text-sm">
                <li>The number of nodes in the tree is in the range [0, 100].</li>
                <li>-100 &lt;= Node.val &lt;= 100</li>
              </ul>
            </div>
          </div>
        </div>

        {/* AI Sensei Widget (Floating) */}
        <div className="absolute bottom-8 right-8 z-10">
          {showSensei && (
            <div className="mb-4 w-80 bg-[#1a1b1c] border border-orange-500/30 rounded-2xl p-4 shadow-2xl animate-in slide-in-from-bottom-5 fade-in duration-300">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-orange-500/10 rounded-lg text-orange-500">
                  <Lightbulb size={18} />
                </div>
                <div>
                  <p className="text-sm text-white font-medium mb-1">Sensei says:</p>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    "Have you considered using recursion here? Think about how swapping the left and right children at each node might solve the problem for the entire tree."
                  </p>
                </div>
                <button onClick={() => setShowSensei(false)} className="text-slate-500 hover:text-white">
                  <XCircle size={14} />
                </button>
              </div>
            </div>
          )}
          <button 
            onClick={handleSenseiHint}
            className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-orange-600 to-orange-500 text-white rounded-full shadow-[0_0_20px_rgba(249,115,22,0.3)] hover:scale-105 transition-all font-bold text-sm"
          >
            <MessageSquare size={18} />
            Ask Sensei
          </button>
        </div>
      </div>

      {/* RIGHT PANEL: The Console (60%) */}
      <div className="w-[60%] flex flex-col bg-[#1e1e1e]">
        {/* Editor Toolbar */}
        <div className="h-16 bg-[#1e1e1e] border-b border-white/5 flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg border border-white/5">
              <Code size={14} className="text-blue-400" />
              <select 
                value={language} 
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-transparent text-xs text-white outline-none font-mono uppercase"
              >
                <option value="python">Python 3</option>
                <option value="javascript">JavaScript</option>
                <option value="cpp">C++</option>
                <option value="java">Java</option>
              </select>
            </div>
            <button className="p-2 text-slate-400 hover:text-white transition-colors">
              <Settings size={16} />
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => setCode('')}
              className="p-2 text-slate-400 hover:text-white transition-colors"
              title="Reset Code"
            >
              <RotateCcw size={16} />
            </button>
            <button 
              onClick={handleRun}
              disabled={isRunning}
              className={`flex items-center gap-2 px-6 py-2 rounded-lg font-bold text-sm transition-all ${
                isRunning 
                  ? 'bg-white/10 text-slate-500 cursor-not-allowed' 
                  : 'bg-green-600 hover:bg-green-500 text-white shadow-[0_0_15px_rgba(34,197,94,0.3)]'
              }`}
            >
              {isRunning ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Running...
                </>
              ) : (
                <>
                  <Play size={16} fill="currentColor" />
                  Run Code
                </>
              )}
            </button>
          </div>
        </div>

        {/* Monaco Editor */}
        <div className="flex-1 relative">
          <Editor
            height="100%"
            defaultLanguage="python"
            language={language}
            value={code}
            onChange={(value) => setCode(value)}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
              lineHeight: 24,
              padding: { top: 20 },
              scrollBeyondLastLine: false,
              smoothScrolling: true,
              cursorBlinking: "smooth",
              cursorSmoothCaretAnimation: "on",
            }}
          />
        </div>

        {/* Bottom Panel: Test Cases & Console */}
        <div className="h-64 bg-[#0B0C10] border-t border-white/5 flex flex-col">
          {/* Tabs */}
          <div className="flex border-b border-white/5">
            <button 
                onClick={() => setActiveTab('tests')}
                className={`px-6 py-3 text-sm font-medium transition-colors ${activeTab === 'tests' ? 'text-white border-b-2 border-orange-500 bg-white/5' : 'text-slate-500 hover:text-white'}`}
            >
              Test Cases
            </button>
            <button 
                onClick={() => setActiveTab('console')}
                className={`px-6 py-3 text-sm font-medium transition-colors ${activeTab === 'console' ? 'text-white border-b-2 border-orange-500 bg-white/5' : 'text-slate-500 hover:text-white'}`}
            >
              Console Output
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 p-6 overflow-y-auto flex gap-6">
            {activeTab === 'tests' ? (
            <>
            {/* Test Case Matrix */}
            <div className="flex-1 space-y-4">
              <div className="grid grid-cols-3 gap-4">
                {testCases.map((tc) => (
                  <div 
                    key={tc.id} 
                    className={`p-4 rounded-xl border transition-all ${
                      tc.status === 'passed' 
                        ? 'bg-green-500/5 border-green-500/20' 
                        : tc.status === 'failed'
                        ? 'bg-red-500/5 border-red-500/20'
                        : 'bg-white/5 border-white/5'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-bold text-slate-500 uppercase">Case {tc.id}</span>
                      {tc.status === 'passed' && <CheckCircle size={14} className="text-green-500" />}
                      {tc.status === 'failed' && <XCircle size={14} className="text-red-500" />}
                      {tc.status === 'pending' && <div className="w-2 h-2 rounded-full bg-slate-600" />}
                    </div>
                    <div className="font-mono text-xs text-slate-300 truncate" title={tc.input}>{tc.input}</div>
                    {tc.status === 'failed' && tc.actual && (
                        <div className="mt-2 pt-2 border-t border-red-500/20">
                            <div className="text-[10px] text-slate-500">Expected: {tc.expected}</div>
                            <div className="text-[10px] text-red-400">Actual: {tc.actual}</div>
                        </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Complexity HUD */}
            {complexity && (
              <div className="w-64 bg-[#1a1b1c] rounded-xl border border-white/10 p-4 animate-in fade-in slide-in-from-right-5 duration-500">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Zap size={12} className="text-orange-500" />
                  Performance Analysis
                </h4>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-400">Time Complexity</span>
                    <span className="text-sm font-mono font-bold text-green-400 bg-green-400/10 px-2 py-0.5 rounded border border-green-400/20">
                      {complexity.time}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-400">Space Complexity</span>
                    <span className="text-sm font-mono font-bold text-green-400 bg-green-400/10 px-2 py-0.5 rounded border border-green-400/20">
                      {complexity.space}
                    </span>
                  </div>
                  <div className="h-px bg-white/5 my-2" />
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-center p-2 bg-white/5 rounded-lg">
                      <div className="text-[10px] text-slate-500 uppercase">Runtime</div>
                      <div className="text-sm font-mono text-white">{complexity.runtime}</div>
                    </div>
                    <div className="text-center p-2 bg-white/5 rounded-lg">
                      <div className="text-[10px] text-slate-500 uppercase">Memory</div>
                      <div className="text-sm font-mono text-white">{complexity.memory}</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            </>
            ) : (
                <div className="flex-1 font-mono text-sm text-slate-300 whitespace-pre-wrap">
                    {output || "No output available."}
                </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
