import { Handle, Position } from 'reactflow';
import { Folder } from 'lucide-react';

export function ProjectNode({ data }: { data: any }) {
  return (
    <div className="bg-slate-800/30 border-2 border-slate-700/50 border-dashed rounded-3xl w-full h-full p-5 flex flex-col relative group">
      <div className="flex items-center gap-2 mb-2 bg-[#0F172A]/80 w-max px-3 py-1.5 rounded-lg border border-[#334155]/50 backdrop-blur-sm -mt-8 -ml-2 shadow-lg z-10">
        <Folder className="w-4 h-4 text-blue-400" />
        <span className="text-sm font-bold text-slate-200 tracking-wide">{data.label}</span>
      </div>
      {data.description && <p className="text-[11px] text-slate-500 max-w-[80%] leading-tight">{data.description}</p>}
      
      <Handle type="target" position={Position.Top} className="opacity-0 w-0 h-0" />
      <Handle type="source" position={Position.Bottom} className="opacity-0 w-0 h-0" />
    </div>
  );
}
