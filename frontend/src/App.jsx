import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import InterviewHUD from './components/InterviewHUD';
import InterviewSetup from './components/InterviewSetup';
import Results from './components/Results';
import Settings from './components/Settings';
import History from './components/History';
import CodeDojo from './components/CodeDojo';
import ResumeArchitect from './components/ResumeArchitect';
import CompanyIntel from './components/CompanyIntel';
import Negotiator from './components/Negotiator';
import ApplicationTracker from './components/ApplicationTracker';

function App() {
  return (
    <Router>
      <div className="bg-noise"></div>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/tracker" element={<ApplicationTracker />} />
        <Route path="/interview" element={<InterviewSetup />} />
        <Route path="/interview/live" element={<InterviewHUD />} />
        <Route path="/results" element={<Results />} />
        <Route path="/history" element={<History />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/dojo" element={<CodeDojo />} />
        <Route path="/resume" element={<ResumeArchitect />} />
        <Route path="/recon" element={<CompanyIntel />} />
        <Route path="/negotiator" element={<Negotiator />} />
      </Routes>
    </Router>
  );
}

export default App;
