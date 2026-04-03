import { Handle, Position } from 'reactflow';
import { Server, Cpu, HardDrive, Activity } from 'lucide-react';

export function HostNode({ data }: { data: any }) {
  return (
    <div className="bg-[#0B1121]/80 border-2 border-blue-500/30 border-dashed rounded-[40px] w-full h-full p-6 flex flex-col relative group transition-all hover:border-blue-500/60 shadow-[inset_0_0_60px_rgba(59,130,246,0.05)]">
      
      {/* Glossy Header Badge */}
      <div className="absolute top-0 left-8 -mt-6 bg-[#0F172A] px-5 py-2.5 rounded-xl border border-blue-500/40 shadow-[0_10px_30px_rgba(59,130,246,0.2)] flex items-center gap-3 backdrop-blur-xl z-10 pointer-events-auto">
        <Server className="w-6 h-6 text-blue-500 animate-pulse" />
        <div>
           <p className="text-[10px] text-blue-400 font-bold uppercase tracking-[0.2em] leading-none mb-0.5">Physical Host / VM</p>
           <span className="text-xl font-black text-slate-100 tracking-wider">{data.label}</span>
        </div>
      </div>
      
      {/* Decorative LED dots */}
      <div className="absolute top-4 right-8 flex gap-2">
         <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse"></div>
         <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)] animate-[pulse_2s_ease-in-out_infinite]"></div>
         <div className="w-2 h-2 rounded-full bg-slate-700"></div>
      </div>


      <Handle type="target" position={Position.Top} className="opacity-0 w-0 h-0 pointer-events-none" />
      <Handle type="source" position={Position.Bottom} className="opacity-0 w-0 h-0 pointer-events-none" />
    </div>
  );
}
