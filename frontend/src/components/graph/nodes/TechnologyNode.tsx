import { Handle, Position } from 'reactflow';
import { Cpu, AlertTriangle } from 'lucide-react';

export function TechnologyNode({ data }: { data: any }) {
  const isVulnerable = data.hasCve;
  
  const borderColor = isVulnerable ? 'border-red-500/80 shadow-[0_0_15px_rgba(239,68,68,0.2)]' : 'border-[#334155]';
  const bgColor = isVulnerable ? 'bg-red-500/10' : 'bg-[#1E293B]';

  return (
    <div className={`${bgColor} ${borderColor} border rounded-xl shadow-xl px-4 py-3 min-w-[150px] flex items-center gap-3 transition-colors`}>
      <Handle type="target" position={Position.Top} className={`!w-2.5 !h-2.5 !bg-[#1E293B] !border-2 !border-[#8B5CF6]`} />
      
      <div className="flex-shrink-0">
        {isVulnerable ? (
          <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">
             <AlertTriangle className="w-4 h-4 text-red-500" />
          </div>
        ) : (
          <div className="w-8 h-8 rounded-full bg-violet-500/20 flex items-center justify-center">
             <Cpu className="w-4 h-4 text-violet-400" />
          </div>
        )}
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-white">{data.label}</span>
        </div>
        <span className="text-[11px] text-[#64748B] font-mono mt-0.5">{data.version}</span>
      </div>
      
      <Handle type="source" position={Position.Bottom} className={`!w-2.5 !h-2.5 !bg-[#1E293B] !border-2 !border-[#8B5CF6]`} />
    </div>
  );
}
