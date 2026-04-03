import { Handle, Position } from 'reactflow';
import { Box } from 'lucide-react';

export function ContainerNode({ data }: { data: any }) {
  return (
    <div className="w-full h-full border border-blue-500/30 bg-gradient-to-b from-blue-900/10 to-blue-950/20 rounded-2xl shadow-[inset_0_1px_3px_rgba(59,130,246,0.2),0_8px_32px_rgba(0,0,0,0.5)] backdrop-blur-sm pointer-events-none relative transition-all group-hover:border-blue-500/50">
      
      {/* Glossy Header Highlight */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-400/60 to-transparent"></div>
      
      <div className="p-3 pb-0 flex items-center gap-2 pointer-events-auto">
        <div className="p-1.5 bg-blue-500/10 rounded-md border border-blue-500/30 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.25)] flex-shrink-0">
          <Box className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-bold text-blue-500/80 uppercase tracking-widest leading-none mb-1">Container</p>
          <h3 className="text-sm font-bold text-blue-100 truncate">{data.label}</h3>
        </div>
      </div>
      
      <Handle type="target" position={Position.Top} className="!w-1.5 !h-1.5 !bg-[#0F172A] !border !border-blue-500 opacity-0 pointer-events-none" />
      <Handle type="source" position={Position.Bottom} className="!w-1.5 !h-1.5 !bg-[#0F172A] !border !border-blue-500 opacity-0 pointer-events-none" />
    </div>
  );
}
