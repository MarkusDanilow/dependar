'use client';

import { useEffect, useState } from 'react';
import ReactFlow, { Background, Controls, useNodesState, useEdgesState, MiniMap } from 'reactflow';
import 'reactflow/dist/style.css';
import { Loader2 } from 'lucide-react';
import { fetchApi } from '@/lib/api';

import { ProjectNode } from './nodes/ProjectNode';
import { ContainerNode } from './nodes/ContainerNode';
import { TechnologyNode } from './nodes/TechnologyNode';
import { RuntimeEdge } from './edges/RuntimeEdge';
import { BuildtimeEdge } from './edges/BuildtimeEdge';

const nodeTypes = {
  project: ProjectNode,
  container: ContainerNode,
  technology: TechnologyNode,
};

const edgeTypes = {
  runtime: RuntimeEdge,
  buildtime: BuildtimeEdge,
};

export function DependencyGraph() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadGraph() {
      try {
        const res = await fetchApi('/graph/full');
        setNodes(res.data?.nodes || []);
        setEdges(res.data?.edges || []);
      } catch (err: any) {
        setError(err.message || 'Fehler beim Laden des Graphen');
      } finally {
        setLoading(false);
      }
    }
    loadGraph();
  }, [setNodes, setEdges]);

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
        <p className="font-semibold">{error}</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative" style={{ background: '#0B1121' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
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
        <MiniMap 
          className="bg-[#1E293B] border border-[#334155] rounded-xl overflow-hidden shadow-2xl !bottom-4 !right-4" 
          maskColor="#0F172A88" 
          nodeColor="#3B82F6" 
        />
      </ReactFlow>
    </div>
  );
}
