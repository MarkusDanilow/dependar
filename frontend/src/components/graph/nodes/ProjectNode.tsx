import { Handle, Position } from 'reactflow';
import { HardDrive } from 'lucide-react';

export function ProjectNode({ data }: { data: any }) {
  return (
    <div className="w-full h-full border border-indigo-500/30 bg-gradient-to-b from-indigo-900/10 to-transparent rounded-[32px] backdrop-blur-md pointer-events-none relative overflow-hidden shadow-[inset_0_1px_2px_rgba(99,102,241,0.2),0_10px_40px_rgba(0,0,0,0.6)] group hover:border-indigo-500/50 transition-colors">
      
      {/* Decorative corners */}
      <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-indigo-500/50 rounded-tl-[32px]"></div>
      <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-indigo-500/50 rounded-tr-[32px]"></div>
      <div className="absolute bottom-0 left-0 w-12 h-12 border-b-2 border-l-2 border-indigo-500/50 rounded-bl-[32px]"></div>
      <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-indigo-500/50 rounded-br-[32px]"></div>
      
      <div className="p-5 pb-0 flex items-center gap-3 pointer-events-auto">
        <div className="p-2.5 bg-indigo-500/10 rounded-xl border border-indigo-500/30 text-indigo-400 shadow-[0_0_20px_rgba(99,102,241,0.3)]">
          <HardDrive className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <p className="text-[12px] font-bold text-indigo-500 uppercase tracking-[0.2em] leading-none mb-1">Application Project</p>
          <h2 className="text-xl font-bold text-indigo-50 tracking-wide">{data.label}</h2>
        </div>
      </div>

      <Handle type="target" position={Position.Top} className="!w-2 !h-2 !bg-[#0F172A] !border !border-indigo-500 opacity-0 pointer-events-none" />
      <Handle type="source" position={Position.Bottom} className="!w-2 !h-2 !bg-[#0F172A] !border !border-indigo-500 opacity-0 pointer-events-none" />
    </div>
  );
}
