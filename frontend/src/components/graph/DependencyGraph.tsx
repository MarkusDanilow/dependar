'use client';

import { useEffect, useState } from 'react';
import ReactFlow, { Background, Controls, useNodesState, useEdgesState, Node } from 'reactflow';
import 'reactflow/dist/style.css';
import { Loader2, X, Activity, Server, Box, Cpu, Folder, AlertTriangle } from 'lucide-react';
import { fetchApi } from '@/lib/api';

import { ProjectNode } from './nodes/ProjectNode';
import { ContainerNode } from './nodes/ContainerNode';
import { TechnologyNode } from './nodes/TechnologyNode';
import { HostNode } from './nodes/HostNode';
import { RuntimeEdge } from './edges/RuntimeEdge';
import { BuildtimeEdge } from './edges/BuildtimeEdge';
import { useGetGraph } from '@/hooks/useGraph';

const nodeTypes = {
  project: ProjectNode,
  container: ContainerNode,
  technology: TechnologyNode,
  host: HostNode,
};

const edgeTypes = {
  runtime: RuntimeEdge,
  buildtime: BuildtimeEdge,
};

export function DependencyGraph() {
  const { data, isLoading: loading, error } = useGetGraph();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  useEffect(() => {
    if (data) {
      setNodes(data.nodes || []);
      setEdges(data.edges || []);
    }
  }, [data, setNodes, setEdges]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full w-full bg-[#0B1121]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full bg-[#0B1121] text-red-400 gap-2">
        <p className="font-semibold">{(error as any)?.message || 'Fehler'}</p>
      </div>
    );
  }

  const handleNodeClick = (event: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  };

  const renderNodeDetails = () => {
    if (!selectedNode) return null;
    const { type, data } = selectedNode;
    
    let Icon = Activity;
    if (type === 'host') Icon = Server;
    if (type === 'project') Icon = Folder;
    if (type === 'container') Icon = Box;
    if (type === 'technology') Icon = Cpu;

    const isVuln = data.hasCve;

    return (
      <div className="absolute top-0 right-0 h-full w-[350px] bg-[#0F172A] border-l border-[#334155] shadow-2xl z-50 transform transition-transform animate-in slide-in-from-right flex flex-col">
        <div className="p-4 border-b border-[#334155] flex items-center justify-between bg-[#1E293B]">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${isVuln ? 'bg-red-500/20 text-red-500' : 'bg-blue-500/20 text-blue-500'}`}>
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-200 capitalize">{type} Details</h2>
              <p className="text-xs text-slate-400 truncate max-w-[200px]">{data.label}</p>
            </div>
          </div>
          <button onClick={() => setSelectedNode(null)} className="p-1 hover:bg-[#334155] rounded text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-5 flex-1 overflow-y-auto space-y-6">
          <div>
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Identifier</h3>
            <p className="text-base text-slate-200 bg-[#1E293B] p-3 rounded-lg border border-[#334155]">{data.label}</p>
          </div>

          {data.version && (
             <div>
               <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Version</h3>
               <p className="text-sm text-slate-300 font-mono bg-[#1E293B] p-2 rounded-lg border border-[#334155] inline-block">{data.version}</p>
             </div>
          )}

          {data.description && (
             <div>
               <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Description</h3>
               <p className="text-sm text-slate-300">{data.description}</p>
             </div>
          )}

          {type === 'technology' && data.vulnCounts && (
            <div>
               <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Security Stance</h3>
               <div className="grid grid-cols-2 gap-3">
                 <div className={`p-3 rounded-xl border ${data.vulnCounts.critical > 0 ? 'bg-red-500/10 border-red-500/30' : 'bg-slate-800/50 border-slate-700'}`}>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Critical</span>
                    <span className={`text-2xl font-bold ${data.vulnCounts.critical > 0 ? 'text-red-400' : 'text-slate-500'}`}>{data.vulnCounts.critical}</span>
                 </div>
                 <div className={`p-3 rounded-xl border ${data.vulnCounts.high > 0 ? 'bg-orange-500/10 border-orange-500/30' : 'bg-slate-800/50 border-slate-700'}`}>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">High</span>
                    <span className={`text-2xl font-bold ${data.vulnCounts.high > 0 ? 'text-orange-400' : 'text-slate-500'}`}>{data.vulnCounts.high}</span>
                 </div>
               </div>
               {isVuln && (
                 <div className="mt-3 bg-red-500/10 border border-red-500/30 p-3 rounded-lg flex items-start gap-2">
                   <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                   <p className="text-[11px] text-red-400 leading-relaxed">This technology has active unpatched vulnerabilities. Please check the Vulnerability Dashboard for more details.</p>
                 </div>
               )}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full h-full relative" style={{ background: '#0B1121' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={handleNodeClick}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        className="bg-[#0B1121]"
        minZoom={0.2}
        maxZoom={2}
      >
        <Background color="#334155" gap={24} size={1.5} />
        <Controls 
          className="bg-[#1E293B] border-[#334155] fill-slate-300 shadow-xl" 
          showInteractive={false} 
        />
      </ReactFlow>
      
      {renderNodeDetails()}
    </div>
  );
}
