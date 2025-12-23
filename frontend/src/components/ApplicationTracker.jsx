import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { 
  LayoutDashboard, 
  Code, 
  FileText, 
  Target, 
  DollarSign, 
  Activity, 
  History, 
  Settings, 
  Briefcase, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  MoreHorizontal,
  Plus,
  Calendar,
  MessageSquare,
  Trello,
  Zap
} from 'lucide-react';

// Mock Data
const initialData = {
  columns: {
    'wishlist': {
      id: 'wishlist',
      title: 'Wishlist',
      color: 'border-slate-500',
      items: [
        { id: 'job-1', company: 'Netflix', role: 'Senior Backend Engineer', logo: 'https://logo.clearbit.com/netflix.com', daysAgo: 2, status: 'active' },
        { id: 'job-2', company: 'Airbnb', role: 'Staff Software Engineer', logo: 'https://logo.clearbit.com/airbnb.com', daysAgo: 5, status: 'active' },
      ]
    },
    'applied': {
      id: 'applied',
      title: 'Applied',
      color: 'border-blue-500',
      items: [
        { id: 'job-3', company: 'Stripe', role: 'Product Engineer', logo: 'https://logo.clearbit.com/stripe.com', daysAgo: 15, status: 'stagnant' },
        { id: 'job-4', company: 'Uber', role: 'Backend Developer', logo: 'https://logo.clearbit.com/uber.com', daysAgo: 3, status: 'active' },
      ]
    },
    'phone': {
      id: 'phone',
      title: 'Phone Screen',
      color: 'border-purple-500',
      items: [
        { id: 'job-5', company: 'DoorDash', role: 'Senior Engineer', logo: 'https://logo.clearbit.com/doordash.com', daysAgo: 1, status: 'active' },
      ]
    },
    'technical': {
      id: 'technical',
      title: 'Technical Round',
      color: 'border-orange-500',
      items: [
        { id: 'job-6', company: 'Google', role: 'L5 Software Engineer', logo: 'https://logo.clearbit.com/google.com', daysAgo: 4, status: 'active' },
      ]
    },
    'offer': {
      id: 'offer',
      title: 'Offer',
      color: 'border-green-500',
      items: []
    },
    'rejected': {
      id: 'rejected',
      title: 'Rejected',
      color: 'border-red-500',
      items: [
        { id: 'job-7', company: 'Meta', role: 'Production Engineer', logo: 'https://logo.clearbit.com/meta.com', daysAgo: 20, status: 'active' },
      ]
    }
  },
  columnOrder: ['wishlist', 'applied', 'phone', 'technical', 'offer', 'rejected']
};

const ApplicationTracker = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(initialData);
  const [showMockModal, setShowMockModal] = useState(false);
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);
  const [activeJob, setActiveJob] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newJob, setNewJob] = useState({
    company: '',
    role: '',
    column: 'wishlist'
  });

  const handleAddJob = (e) => {
    e.preventDefault();
    if (!newJob.company || !newJob.role) return;

    const newId = `job-${Date.now()}`;
    const newJobItem = {
      id: newId,
      company: newJob.company,
      role: newJob.role,
      logo: `https://logo.clearbit.com/${newJob.company.toLowerCase().replace(/\s/g, '')}.com`,
      daysAgo: 0,
      status: 'active'
    };

    const column = data.columns[newJob.column];
    const newColumn = {
      ...column,
      items: [newJobItem, ...column.items]
    };

    setData({
      ...data,
      columns: {
        ...data.columns,
        [newColumn.id]: newColumn
      }
    });

    setShowAddModal(false);
    setNewJob({ company: '', role: '', column: 'wishlist' });
  };

  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const start = data.columns[source.droppableId];
    const finish = data.columns[destination.droppableId];

    // Moving within the same column
    if (start === finish) {
      const newItems = Array.from(start.items);
      const [removed] = newItems.splice(source.index, 1);
      newItems.splice(destination.index, 0, removed);

      const newColumn = {
        ...start,
        items: newItems,
      };

      setData({
        ...data,
        columns: {
          ...data.columns,
          [newColumn.id]: newColumn,
        },
      });
      return;
    }

    // Moving from one column to another
    const startItems = Array.from(start.items);
    const [removed] = startItems.splice(source.index, 1);
    const finishItems = Array.from(finish.items);
    finishItems.splice(destination.index, 0, removed);

    const newStart = {
      ...start,
      items: startItems,
    };

    const newFinish = {
      ...finish,
      items: finishItems,
    };

    setData({
      ...data,
      columns: {
        ...data.columns,
        [newStart.id]: newStart,
        [newFinish.id]: newFinish,
      },
    });

    // Smart Actions Logic
    if (destination.droppableId === 'technical') {
      setActiveJob(removed);
      setShowMockModal(true);
    } else if (destination.droppableId === 'rejected') {
      setActiveJob(removed);
      setShowAnalysisModal(true);
    }
  };

  const NavLink = ({ to, icon: Icon, label, active }) => (
    <button
      onClick={() => navigate(to)}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
        active 
          ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' 
          : 'text-gray-400 hover:bg-white/5 hover:text-white'
      }`}
    >
      <Icon className={`w-5 h-5 ${active ? 'text-blue-500' : 'text-gray-500 group-hover:text-white'}`} />
      <span className="font-medium">{label}</span>
      {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />}
    </button>
  );

  return (
    <div className="flex h-screen bg-[#0B0C10] text-slate-300 font-sans overflow-hidden selection:bg-blue-500/30">
      
      {/* Sidebar */}
      <aside className="w-72 bg-[#0B0C10] border-r border-white/10 p-6 flex flex-col z-50">
        <div className="flex items-center gap-3 px-2 mb-12">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Trello className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">Mission Status</h1>
            <p className="text-xs text-gray-500 font-medium">Application Tracker</p>
          </div>
        </div>

        <nav className="space-y-2 flex-1">
          <NavLink to="/dashboard" icon={LayoutDashboard} label="Mission Control" />
          <NavLink to="/tracker" icon={Trello} label="Mission Status" active />
          <NavLink to="/dojo" icon={Code} label="Code Dojo" />
          <NavLink to="/resume" icon={FileText} label="Resume Architect" />
          <NavLink to="/recon" icon={Target} label="Recon Room" />
          <NavLink to="/negotiator" icon={DollarSign} label="The Negotiator" />
          <NavLink to="/results" icon={Activity} label="Analytics" />
          <NavLink to="/history" icon={History} label="Mission History" />
          <NavLink to="/settings" icon={Settings} label="Settings" />
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Background Gradients */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] left-[20%] w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-[100px]" />
        </div>

        {/* Header */}
        <header className="h-20 border-b border-white/10 flex items-center justify-between px-8 bg-[#0B0C10]/50 backdrop-blur-md z-10">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold text-white">Pipeline Overview</h2>
            <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-gray-400">
              Active Applications: {Object.values(data.columns).reduce((acc, col) => acc + col.items.length, 0)}
            </div>
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors font-medium text-sm"
          >
            <Plus size={16} />
            Add Application
          </button>
        </header>

        {/* Kanban Board */}
        <div className="flex-1 overflow-x-auto overflow-y-hidden p-8">
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="flex gap-6 h-full min-w-max">
              {data.columnOrder.map((columnId) => {
                const column = data.columns[columnId];
                return (
                  <div key={column.id} className="w-80 flex flex-col h-full">
                    {/* Column Header */}
                    <div className={`flex items-center justify-between mb-4 pb-2 border-b-2 ${column.color}`}>
                      <h3 className="font-bold text-white">{column.title}</h3>
                      <span className="text-xs text-gray-500 font-mono bg-white/5 px-2 py-1 rounded">
                        {column.items.length}
                      </span>
                    </div>

                    {/* Droppable Area */}
                    <Droppable droppableId={column.id}>
                      {(provided, snapshot) => (
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          className={`flex-1 rounded-xl transition-colors p-2 ${
                            snapshot.isDraggingOver ? 'bg-white/5' : 'bg-transparent'
                          }`}
                        >
                          {column.items.map((item, index) => (
                            <Draggable key={item.id} draggableId={item.id} index={index}>
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className={`mb-3 p-4 rounded-xl border transition-all group relative ${
                                    item.status === 'stagnant' 
                                      ? 'bg-gray-900/50 border-gray-800 opacity-60 hover:opacity-100' 
                                      : 'bg-[#151515] border-white/10 hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/10'
                                  } ${snapshot.isDragging ? 'rotate-2 scale-105 z-50 shadow-2xl' : ''}`}
                                >
                                  <div className="flex items-start justify-between mb-3">
                                    <div className="w-10 h-10 rounded-lg bg-white p-1.5 flex items-center justify-center">
                                      <img 
                                        src={item.logo} 
                                        alt={item.company} 
                                        className="w-full h-full object-contain"
                                        onError={(e) => {e.target.src = 'https://via.placeholder.com/40?text=' + item.company[0]}}
                                      />
                                    </div>
                                    <button className="text-gray-600 hover:text-white transition-colors">
                                      <MoreHorizontal size={16} />
                                    </button>
                                  </div>
                                  
                                  <h4 className="font-bold text-white mb-1">{item.company}</h4>
                                  <p className="text-sm text-gray-400 mb-4">{item.role}</p>
                                  
                                  <div className="flex items-center justify-between text-xs">
                                    <div className={`flex items-center gap-1.5 ${item.status === 'stagnant' ? 'text-red-400' : 'text-gray-500'}`}>
                                      <Clock size={12} />
                                      <span>{item.daysAgo}d ago</span>
                                    </div>
                                    {item.status === 'stagnant' && (
                                      <div className="flex items-center gap-1 text-red-400 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">
                                        <AlertTriangle size={10} />
                                        <span>Stagnant</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </div>
                );
              })}
            </div>
          </DragDropContext>
        </div>

        {/* Add Application Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-[#151515] border border-white/10 rounded-2xl p-8 max-w-md w-full shadow-2xl relative">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white">Add New Mission</h3>
                <button onClick={() => setShowAddModal(false)} className="text-gray-500 hover:text-white">
                  <XCircle size={24} />
                </button>
              </div>
              
              <form onSubmit={handleAddJob} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Target Company</label>
                  <input
                    type="text"
                    value={newJob.company}
                    onChange={(e) => setNewJob({...newJob, company: e.target.value})}
                    placeholder="e.g. SpaceX"
                    className="w-full bg-[#0B0C10] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500/50"
                    autoFocus
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Role / Position</label>
                  <input
                    type="text"
                    value={newJob.role}
                    onChange={(e) => setNewJob({...newJob, role: e.target.value})}
                    placeholder="e.g. Flight Software Engineer"
                    className="w-full bg-[#0B0C10] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500/50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Initial Status</label>
                  <select
                    value={newJob.column}
                    onChange={(e) => setNewJob({...newJob, column: e.target.value})}
                    className="w-full bg-[#0B0C10] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500/50 appearance-none"
                  >
                    {data.columnOrder.map(colId => (
                      <option key={colId} value={colId}>{data.columns[colId].title}</option>
                    ))}
                  </select>
                </div>

                <div className="pt-4 flex gap-3">
                  <button 
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl font-medium transition-colors"
                  >
                    Initialize Mission
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Smart Action Modals */}
        {showMockModal && activeJob && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-[#151515] border border-white/10 rounded-2xl p-8 max-w-md w-full shadow-2xl relative">
              <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center mb-4 text-orange-500">
                <Zap size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Technical Round Detected!</h3>
              <p className="text-gray-400 mb-6">
                You just moved <strong>{activeJob.company}</strong> to the Technical Round. Would you like to schedule a targeted mock interview for this role?
              </p>
              <div className="flex gap-3">
                <button 
                  onClick={() => {
                    navigate('/interview/live', { state: { role: activeJob.role, company: activeJob.company } });
                    setShowMockModal(false);
                  }}
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-medium transition-colors"
                >
                  Start Mock Interview
                </button>
                <button 
                  onClick={() => setShowMockModal(false)}
                  className="flex-1 bg-white/5 hover:bg-white/10 text-gray-300 py-3 rounded-xl font-medium transition-colors"
                >
                  Maybe Later
                </button>
              </div>
            </div>
          </div>
        )}

        {showAnalysisModal && activeJob && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-[#151515] border border-white/10 rounded-2xl p-8 max-w-md w-full shadow-2xl relative">
              <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center mb-4 text-red-500">
                <Activity size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Mission Failed</h3>
              <p className="text-gray-400 mb-6">
                <strong>{activeJob.company}</strong> has been moved to Rejected. Let's analyze what went wrong to improve your chances next time.
              </p>
              <div className="flex gap-3">
                <button 
                  onClick={() => {
                    navigate('/results'); // Or a specific analysis page
                    setShowAnalysisModal(false);
                  }}
                  className="flex-1 bg-red-600 hover:bg-red-500 text-white py-3 rounded-xl font-medium transition-colors"
                >
                  Analyze Failure
                </button>
                <button 
                  onClick={() => setShowAnalysisModal(false)}
                  className="flex-1 bg-white/5 hover:bg-white/10 text-gray-300 py-3 rounded-xl font-medium transition-colors"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default ApplicationTracker;
