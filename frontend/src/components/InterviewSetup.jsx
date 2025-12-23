import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getInterviewHistory } from '../services/api';
import { Button } from './ui/button';
import { ArrowLeft, Clock, Calendar, Trophy, Briefcase, FileText } from 'lucide-react';

export default function InterviewSetup() {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [formData, setFormData] = useState({
    role: 'Software Engineer',
    jobDescription: '',
    numQuestions: 5
  });

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await getInterviewHistory();
        setHistory(data);
      } catch (error) {
        console.error("Failed to fetch history", error);
      }
    };
    fetchHistory();
  }, []);

  const handleStart = () => {
    navigate('/interview/live', { state: formData });
  };

  return (
    <div className="min-h-screen bg-[#212223] text-white font-sans p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button 
            onClick={() => navigate('/dashboard')}
            className="bg-[#2a2b2d] hover:bg-[#3a3b3d] text-white rounded-full p-3 h-12 w-12 flex items-center justify-center"
          >
            <ArrowLeft size={20} />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">New Interview Session</h1>
            <p className="text-gray-400 text-sm">Configure your AI interviewer and review past sessions</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Configuration */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-[#1a1b1c] border border-white/10 rounded-xl p-6 shadow-lg">
              <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
                <Briefcase className="text-[#FE7F2D]" size={20} />
                Session Configuration
              </h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Target Role</label>
                  <input 
                    type="text" 
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                    className="w-full bg-[#212223] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#FE7F2D] transition-colors"
                    placeholder="e.g. Senior Product Designer"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Job Description / Context</label>
                  <textarea 
                    value={formData.jobDescription}
                    onChange={(e) => setFormData({...formData, jobDescription: e.target.value})}
                    className="w-full bg-[#212223] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#FE7F2D] transition-colors h-32 resize-none"
                    placeholder="Paste the job description or key requirements here..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Number of Questions</label>
                  <div className="flex gap-4">
                    {[3, 5, 7].map(num => (
                      <button
                        key={num}
                        onClick={() => setFormData({...formData, numQuestions: num})}
                        className={`flex-1 py-3 rounded-lg border transition-all ${formData.numQuestions === num ? 'bg-[#FE7F2D]/10 border-[#FE7F2D] text-[#FE7F2D]' : 'bg-[#212223] border-white/10 text-gray-400 hover:border-white/30'}`}
                      >
                        {num} Questions
                      </button>
                    ))}
                  </div>
                </div>

                <Button 
                  onClick={handleStart}
                  className="w-full bg-[#FE7F2D] hover:bg-[#e66e20] text-white font-bold py-4 rounded-lg text-lg shadow-lg shadow-orange-900/20 mt-4"
                >
                  Start Interview
                </Button>
              </div>
            </div>
          </div>

          {/* Right Column: History */}
          <div className="lg:col-span-1">
            <div className="bg-[#1a1b1c] border border-white/10 rounded-xl p-6 shadow-lg h-full">
              <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
                <Clock className="text-gray-400" size={20} />
                Recent History
              </h2>

              <div className="space-y-4">
                {history.map((item) => (
                  <div key={item.id} className="bg-[#212223] border border-white/5 rounded-lg p-4 hover:border-white/20 transition-colors cursor-pointer group">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium text-white group-hover:text-[#FE7F2D] transition-colors">{item.role}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full ${item.status === 'Completed' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                        {item.status}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar size={12} />
                        {item.date}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={12} />
                        {item.duration}
                      </div>
                      <div className="flex items-center gap-1 ml-auto font-bold text-gray-300">
                        <Trophy size={12} className="text-yellow-500" />
                        {item.score}%
                      </div>
                    </div>
                  </div>
                ))}

                {history.length === 0 && (
                  <div className="text-center text-gray-500 py-10">
                    <FileText className="w-12 h-12 mx-auto mb-3 opacity-20" />
                    <p>No previous interviews found.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
