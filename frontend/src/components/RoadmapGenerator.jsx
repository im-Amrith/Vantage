import React, { useState, useCallback } from 'react';
import ReactFlow, { Background, Controls, MiniMap, useNodesState, useEdgesState } from 'reactflow';
import 'reactflow/dist/style.css';
import { BookOpen, Youtube, CheckCircle, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const RoadmapGenerator = () => {
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  // React Flow State
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState(null);

  const generateRoadmap = async () => {
    if (!role.trim()) return;
    setLoading(true);
    setSelectedNode(null);
    try {
        // Call your Backend API
        const response = await fetch(`/api/roadmap/generate?role=${encodeURIComponent(role)}`);
        const data = await response.json();
        
        if (!data.steps) {
            console.error("Invalid roadmap data", data);
            setLoading(false);
            return;
        }

        // Transform Backend JSON to React Flow format
        const newNodes = data.steps.map((step, index) => ({
        id: step.id,
        position: { x: 250, y: index * 200 }, // Vertical layout
        data: { label: step.topic, description: step.description, resources: step.resources, status: 'pending' },
        style: { 
            background: '#0B0C10', 
            color: '#fff', 
            border: '1px solid #f97316', // Orange-500
            borderRadius: '12px',
            padding: '16px',
            width: 250,
            fontSize: '14px',
            fontWeight: 'bold',
            textAlign: 'center',
            boxShadow: '0 4px 6px -1px rgba(249, 115, 22, 0.1), 0 2px 4px -1px rgba(249, 115, 22, 0.06)'
        }
        }));

        const newEdges = data.steps.slice(0, -1).map((step, index) => ({
        id: `e${index}-${index+1}`,
        source: step.id,
        target: data.steps[index+1].id,
        animated: true,
        style: { stroke: '#f97316', strokeWidth: 2 },
        type: 'smoothstep'
        }));

        setNodes(newNodes);
        setEdges(newEdges);

        if (newNodes.length > 0) {
            setSelectedNode(newNodes[0].data);
        }
    } catch (error) {
        console.error("Failed to generate roadmap", error);
    } finally {
        setLoading(false);
    }
  };

  const onNodeClick = (event, node) => {
    setSelectedNode(node.data);
  };

  return (
    <div className="flex h-screen bg-[#050505] text-white font-sans">
      {/* LEFT: Controls */}
      <div className="w-2/5 p-6 border-r border-white/10 flex flex-col gap-6 z-10 bg-[#0B0C10] shadow-xl">
        <div className="flex items-center gap-4 mb-4">
            <button onClick={() => navigate('/dashboard')} className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                <ArrowLeft className="w-5 h-5 text-gray-400" />
            </button>
            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">
            Pathfinder
            </h2>
        </div>
        
        <div className="flex gap-2">
          <input 
            type="text" 
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="e.g. AI Engineer" 
            className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 focus:border-orange-500 outline-none text-sm"
            onKeyDown={(e) => e.key === 'Enter' && generateRoadmap()}
          />
          <button 
            onClick={generateRoadmap}
            disabled={loading}
            className="bg-orange-600 hover:bg-orange-500 px-4 py-2 rounded-lg font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '...' : 'Go'}
          </button>
        </div>

        <div className="text-xs text-gray-500 leading-relaxed">
            Enter a target role to generate a personalized learning path powered by AI and curated resources.
        </div>

        {/* Selected Node Details Drawer */}
        {selectedNode && (
          <div className="mt-4 animate-in slide-in-from-left duration-300 border-t border-white/10 pt-6">
            <h3 className="text-xl font-bold mb-2 text-orange-400">{selectedNode.label}</h3>
            {selectedNode.description && (
                <p className="text-sm text-gray-300 mb-6 leading-relaxed border-l-2 border-orange-500/30 pl-3">
                    {selectedNode.description}
                </p>
            )}
            
            <div className="space-y-6">
              {/* Videos Section */}
              {selectedNode.resources.videos && selectedNode.resources.videos.length > 0 && (
                  <div>
                    <h4 className="flex items-center gap-2 text-sm text-gray-400 mb-3 font-medium uppercase tracking-wider">
                    <Youtube size={16} className="text-red-500"/> Recommended Videos
                    </h4>
                    <div className="space-y-3">
                        {selectedNode.resources.videos.map((video, idx) => (
                            <a key={idx} href={video.video_url} target="_blank" rel="noopener noreferrer" className="block bg-white/5 p-3 rounded-xl hover:bg-white/10 transition group border border-white/5 hover:border-white/10">
                                <div className="relative aspect-video mb-2 rounded-lg overflow-hidden bg-black">
                                    <img src={video.thumbnail} alt="Thumbnail" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                                </div>
                                <p className="text-sm font-semibold truncate text-gray-200 group-hover:text-white">{video.video_title}</p>
                            </a>
                        ))}
                    </div>
                </div>
              )}

              {/* Articles Section */}
              {selectedNode.resources.articles && selectedNode.resources.articles.length > 0 && (
                  <div>
                    <h4 className="flex items-center gap-2 text-sm text-gray-400 mb-3 font-medium uppercase tracking-wider">
                    <BookOpen size={16} className="text-green-500"/> Recommended Readings
                    </h4>
                    <div className="space-y-2">
                        {selectedNode.resources.articles.map((article, idx) => (
                            <a key={idx} href={article.article_url} target="_blank" rel="noopener noreferrer" className="block bg-white/5 p-4 rounded-xl hover:bg-white/10 transition text-sm text-blue-400 hover:text-blue-300 truncate border border-white/5 hover:border-white/10">
                                {article.article_title}
                            </a>
                        ))}
                    </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* RIGHT: The Graph */}
      <div className="w-3/5 h-full bg-[#050505]">
        <ReactFlow 
          nodes={nodes} 
          edges={edges} 
          onNodesChange={onNodesChange} 
          onEdgesChange={onEdgesChange}
          onNodeClick={onNodeClick}
          fitView
          attributionPosition="bottom-right"
        >
          <Background color="#222" gap={20} size={1} />
          <Controls className="bg-[#0B0C10] border-white/10 text-white fill-white" />
          <MiniMap style={{ background: '#0B0C10' }} nodeColor="#f97316" maskColor="rgba(0, 0, 0, 0.6)" />
        </ReactFlow>
      </div>
    </div>
  );
};

export default RoadmapGenerator;
