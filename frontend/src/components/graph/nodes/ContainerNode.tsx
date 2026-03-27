import { Handle, Position } from 'reactflow';
import { Box } from 'lucide-react';

export function ContainerNode({ data }: { data: any }) {
  return (
    <div className="bg-[#1E293B] border border-[#334155] rounded-xl shadow-lg px-4 py-3 min-w-[150px] flex items-center gap-3">
      <Handle type="target" position={Position.Top} className="!w-2.5 !h-2.5 !bg-[#1E293B] !border-2 !border-[#3B82F6]" />
      <div className="w-8 h-8 rounded-lg bg-[#0F172A] border border-[#334155] flex flex-shrink-0 items-center justify-center">
        <Box className="w-4 h-4 text-emerald-400" />
      </div>
      <span className="text-sm font-semibold text-slate-200">{data.label}</span>
      <Handle type="source" position={Position.Bottom} className="!w-2.5 !h-2.5 !bg-[#1E293B] !border-2 !border-[#3B82F6]" />
    </div>
  );
}
