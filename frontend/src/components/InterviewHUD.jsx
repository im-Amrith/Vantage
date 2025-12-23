import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import VideoFeed from './VideoFeed';
import { Button } from './ui/button';
import { Mic, MicOff, Video, VideoOff, PhoneOff, FileText, MessageSquare, Link as LinkIcon, ChevronRight, ChevronLeft, User, Upload } from 'lucide-react';
import { useMedia } from '../hooks/useMedia';
import { uploadResume, startInterview, submitAnswer, endInterviewSession } from '../services/api';

export default function InterviewHUD() {
  const navigate = useNavigate();
  const location = useLocation();
  const { role, jobDescription, numQuestions } = location.state || { 
    role: "Software Engineer", 
    jobDescription: "Standard SWE Role", 
    numQuestions: 3 
  };

  const { videoRef, stream } = useMedia({ enabled: true });
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [status, setStatus] = useState('Listening');
  const [showSidebar, setShowSidebar] = useState(true);
  const [activeTab, setActiveTab] = useState('resume');
  
  // Backend State
  const [resumeId, setResumeId] = useState(null);
  const [resumeUrl, setResumeUrl] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState("Please upload your resume to start the interview.");
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef(null);

  // Timer State
  const [elapsedTime, setElapsedTime] = useState(0);

  // Speech Recognition State
  const recognitionRef = useRef(null);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');

  // Stats
  const stats = [
    { label: 'Confidence', value: '85%', color: 'text-gray-300' },
    { label: 'Pace', value: 'Optimal', color: 'text-gray-300' },
    { label: 'Clarity', value: 'High', color: 'text-gray-300' },
  ];

  useEffect(() => {
    let interval;
    if (sessionId) {
      interval = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [sessionId]);

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    // Initialize Speech Recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = 'en-US'; // Improve accuracy by setting language

        recognitionRef.current.onresult = (event) => {
            let currentInterim = '';
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    setTranscript(prev => {
                        const newPart = event.results[i][0].transcript.trim();
                        return prev ? `${prev} ${newPart}` : newPart;
                    });
                } else {
                    currentInterim += event.results[i][0].transcript;
                }
            }
            setInterimTranscript(currentInterim);
        };

        recognitionRef.current.onend = () => {
            // Auto-restart if we are still in Speaking state
            if (status === 'Speaking' && recognitionRef.current) {
                try {
                    recognitionRef.current.start();
                } catch (e) {
                    // Ignore if already started
                }
            }
        };

        recognitionRef.current.onerror = (event) => {
            console.error("Speech recognition error", event.error);
            if (event.error === 'not-allowed') {
                alert("Microphone access denied. Please enable it.");
            }
        };
    }

    return () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }
    };
  }, []);

  // Toggle listening based on status
  useEffect(() => {
      if (status === 'Speaking' && recognitionRef.current) {
          try {
            recognitionRef.current.start();
          } catch (e) {
            // Already started
          }
      } else if (status !== 'Speaking' && recognitionRef.current) {
          recognitionRef.current.stop();
      }
  }, [status]);


  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setIsProcessing(true);
      setResumeUrl(URL.createObjectURL(file));
      const data = await uploadResume(file);
      setResumeId(data.resume_id);
      
      // Auto-start interview after upload
      const sessionData = await startInterview({
        resumeId: data.resume_id,
        role: role,
        jobDescription: jobDescription,
        numQuestions: numQuestions
      });
      
      setSessionId(sessionData.session_id);
      setCurrentQuestion(sessionData.current_question.prompt);
      setStatus('Listening'); // AI is waiting for user to speak
    } catch (error) {
      console.error("Upload failed", error);
      setCurrentQuestion("Error starting interview. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleMicClick = () => {
      if (status === 'Listening') {
          setStatus('Speaking'); // User starts speaking
          setTranscript('');
          setInterimTranscript('');
      } else if (status === 'Speaking') {
          setStatus('Thinking'); // User finished, AI thinks
          handleAnswerSubmit();
      }
  };

  const handleAnswerSubmit = async () => {
      if (!sessionId) return;
      
      const fullAnswer = transcript + interimTranscript;

      try {
          const result = await submitAnswer(sessionId, fullAnswer || "No answer provided.");
          
          if (result.report) {
              navigate('/results', { state: { report: result.report } });
          } else if (result.next_question) {
              setCurrentQuestion(result.next_question.prompt);
              setStatus('Listening');
          }
      } catch (error) {
          console.error("Submission failed", error);
          setStatus('Listening');
      }
  };

  const toggleMute = () => {
    if (stream) {
      stream.getAudioTracks().forEach(track => track.enabled = !isMuted);
      setIsMuted(!isMuted);
    }
  };

  const toggleVideo = () => {
    if (stream) {
      stream.getVideoTracks().forEach(track => track.enabled = !isVideoOff);
      setIsVideoOff(!isVideoOff);
    }
  };

  const endInterview = async () => {
    if (sessionId) {
      try {
        const report = await endInterviewSession(sessionId);
        navigate('/results', { state: { report } });
      } catch (error) {
        console.error("Failed to end interview", error);
        navigate('/results'); // Fallback
      }
    } else {
      navigate('/results');
    }
  };

  return (
    <div className="h-screen w-full bg-[#212223] flex overflow-hidden text-white font-sans">
      
      {/* Main Content Area (Video + Overlays) */}
      <div className={`relative flex-1 flex flex-col transition-all duration-300 ease-in-out ${showSidebar ? 'mr-0' : 'mr-0'}`}>
        
        {/* Video Feed Background */}
        <div className="absolute inset-0 z-0 bg-black">
           <VideoFeed videoRef={videoRef} className="h-full w-full object-cover opacity-90" />
        </div>

        {/* Top Overlay: AI Question */}
        <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-20 w-3/4 max-w-2xl">
          <div className="bg-black/60 backdrop-blur-md border border-white/10 rounded-2xl p-6 text-center shadow-xl transition-all duration-500">
            <h3 className="text-[#FE7F2D] text-sm font-semibold uppercase tracking-wider mb-2">Current Question</h3>
            <p className="text-xl font-medium text-white leading-relaxed">
              "{currentQuestion}"
            </p>
          </div>
        </div>

        {/* Left Overlay: Live Stats */}
        <div className="absolute left-8 top-1/3 z-20">
          <div className="bg-black/50 backdrop-blur-md border border-white/10 rounded-xl p-4 w-48 space-y-4 shadow-lg">
            <h4 className="text-gray-400 text-xs font-semibold uppercase tracking-wider border-b border-white/10 pb-2">Live Analysis</h4>
            {stats.map((stat, index) => (
              <div key={index} className="flex flex-col">
                <span className="text-gray-400 text-sm">{stat.label}</span>
                <span className={`text-lg font-bold ${stat.color}`}>{stat.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Center AI Avatar (Visualizer) */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none">
           {/* Subtle pulse effect behind the "camera" focus */}
        </div>

        {/* Real-time Transcript */}
        {(transcript || interimTranscript) && (
          <div className="absolute bottom-32 left-1/2 transform -translate-x-1/2 w-3/4 max-w-3xl text-center z-30">
             <p className="text-white/90 text-xl font-medium drop-shadow-md bg-black/40 backdrop-blur-sm px-6 py-3 rounded-xl inline-block">
               "{transcript}{interimTranscript}"
             </p>
          </div>
        )}

        {/* Bottom Controls */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30 flex items-center gap-6 bg-black/60 backdrop-blur-xl px-8 py-4 rounded-full border border-white/10">
          
          {/* Status Indicator (Moved to Bottom) */}
          <div className="flex items-center gap-3 mr-4 border-r border-white/10 pr-6">
            <div className={`w-3 h-3 rounded-full ${status === 'Speaking' ? 'bg-green-500 animate-pulse' : status === 'Thinking' ? 'bg-[#FE7F2D] animate-bounce' : 'bg-blue-500'}`} />
            <span className="text-white font-medium text-sm uppercase tracking-wider">{status}</span>
             <span className="text-gray-400 text-xs ml-2 font-mono">{formatTime(elapsedTime)}</span>
          </div>

          <Button
            onClick={handleMicClick}
            className={`rounded-full p-4 w-14 h-14 flex items-center justify-center transition-all shadow-lg ${status === 'Speaking' ? 'bg-green-600 hover:bg-green-700 animate-pulse' : 'bg-[#2a2b2d] hover:bg-[#3a3b3d] border border-white/10'}`}
          >
            {status === 'Speaking' ? <Mic className="w-6 h-6 text-white" /> : <MicOff className="w-6 h-6 text-gray-400" />}
          </Button>

          <Button
            onClick={endInterview}
            className="rounded-full px-8 h-14 bg-red-600 hover:bg-red-700 text-white font-semibold tracking-wide shadow-lg shadow-red-900/20 flex items-center gap-2"
          >
            <PhoneOff className="w-5 h-5" />
            End Interview
          </Button>

          <Button
            onClick={toggleVideo}
            className={`rounded-full p-4 w-14 h-14 flex items-center justify-center transition-all shadow-lg ${isVideoOff ? 'bg-red-500 hover:bg-red-600' : 'bg-[#2a2b2d] hover:bg-[#3a3b3d] border border-white/10'}`}
          >
            {isVideoOff ? <VideoOff className="w-6 h-6 text-white" /> : <Video className="w-6 h-6 text-white" />}
          </Button>

          <Button
            onClick={() => setShowSidebar(!showSidebar)}
            className={`rounded-full p-4 w-14 h-14 flex items-center justify-center transition-all shadow-lg ml-4 ${showSidebar ? 'bg-[#FE7F2D] text-white' : 'bg-[#2a2b2d] text-gray-400 border border-white/10'}`}
          >
            {showSidebar ? <ChevronRight className="w-6 h-6" /> : <FileText className="w-6 h-6" />}
          </Button>
        </div>
      </div>

      {/* Sidebar (Resume/CV) */}
      {showSidebar && (
        <div className="w-[400px] bg-[#1a1b1c] border-l border-white/10 flex flex-col z-30 shadow-2xl">
          {/* Sidebar Tabs */}
          <div className="flex items-center border-b border-white/10">
            <button
              onClick={() => setActiveTab('resume')}
              className={`flex-1 py-4 text-sm font-medium transition-colors ${activeTab === 'resume' ? 'text-[#FE7F2D] border-b-2 border-[#FE7F2D] bg-white/5' : 'text-gray-400 hover:text-white'}`}
            >
              Resume/CV
            </button>
            
            <button
              onClick={() => setActiveTab('messages')}
              className={`flex-1 py-4 text-sm font-medium transition-colors ${activeTab === 'messages' ? 'text-[#FE7F2D] border-b-2 border-[#FE7F2D] bg-white/5' : 'text-gray-400 hover:text-white'}`}
            >
              Messages
            </button>
          </div>

          {/* Sidebar Content */}
          <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
            {activeTab === 'resume' && (
              <div className="space-y-6 h-full flex flex-col">
                {/* Upload Box */}
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-[#212223] border border-dashed border-white/20 rounded-xl p-6 flex flex-col items-center justify-center text-center hover:border-[#FE7F2D]/50 transition-colors cursor-pointer group shrink-0"
                >
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept=".pdf" 
                    onChange={handleFileUpload}
                  />
                  <div className="w-12 h-12 rounded-full bg-[#FE7F2D]/10 flex items-center justify-center mb-3 group-hover:bg-[#FE7F2D]/20 transition-colors">
                    {isProcessing ? <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#FE7F2D]"></div> : <Upload className="w-6 h-6 text-[#FE7F2D]" />}
                  </div>
                  <p className="text-sm text-gray-300 font-medium">{resumeId ? "Resume Uploaded" : "Upload your CV/Resume"}</p>
                  <p className="text-xs text-gray-500 mt-1">PDF up to 10MB</p>
                </div>

                {/* Resume Preview */}
                <div className="flex-1 bg-[#212223] rounded-lg overflow-hidden border border-white/10 relative min-h-[400px]">
                   {resumeUrl ? (
                     <iframe src={resumeUrl} className="w-full h-full" title="Resume Preview" />
                   ) : (
                     <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500 opacity-50">
                        <FileText className="w-16 h-16 mb-4" />
                        <p>No resume to display</p>
                     </div>
                   )}
                </div>
              </div>
            )}
            
            {activeTab === 'links' && (
               <div className="text-center text-gray-500 mt-10">
                  <LinkIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No work links added yet.</p>
               </div>
            )}

            {activeTab === 'messages' && (
               <div className="text-center text-gray-500 mt-10">
                  <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No messages.</p>
               </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

