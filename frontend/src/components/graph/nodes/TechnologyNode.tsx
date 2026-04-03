import { Handle, Position } from 'reactflow';
import { AlertTriangle, ShieldCheck } from 'lucide-react';
import { TechIcon } from '@/components/icons/TechIcons';

export function TechnologyNode({ data }: { data: any }) {
  const isVulnerable = data.hasCve;
  
  const vulnCounts = data.vulnCounts || { critical: 0, high: 0, medium: 0 };
  const totalIssueCount = vulnCounts.critical + vulnCounts.high + vulnCounts.medium;

  // Modern Enterprise Styling
  const borderColor = isVulnerable 
    ? 'border-red-500/80 shadow-[0_0_20px_rgba(239,68,68,0.3)]' 
    : 'border-emerald-500/30 hover:border-emerald-500/60 shadow-[0_4px_20px_rgba(0,0,0,0.5)]';
    
  const bgColor = isVulnerable 
    ? 'bg-gradient-to-br from-slate-900 to-red-950/40 backdrop-blur-md' 
    : 'bg-gradient-to-br from-slate-900 to-slate-800/80 backdrop-blur-md';

  return (
    <div className={`${bgColor} ${borderColor} border-2 rounded-xl px-4 py-3 h-[80px] w-[280px] flex items-center justify-between gap-4 transition-all duration-300 group`}>
      <Handle type="target" position={Position.Top} className={`!w-2 !h-2 !bg-[#0F172A] !border !border-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity`} />
      
      <div className="flex items-center gap-3 w-full">
        <div className="flex-shrink-0 relative">
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center border ${isVulnerable ? 'bg-red-500/10 border-red-500/30 text-red-400' : 'bg-slate-800 border-slate-700 text-emerald-400 group-hover:text-emerald-300 group-hover:border-emerald-500/50'} transition-colors shadow-inner`}>
             <TechIcon name={data.label} className="w-7 h-7" />
          </div>
          {isVulnerable && totalIssueCount > 0 && (
            <div className="absolute -top-2 -right-2 bg-red-600 rounded-full w-5 h-5 flex items-center justify-center border-2 border-slate-900 shadow-[0_0_10px_rgba(239,68,68,0.8)] animate-pulse">
               <span className="text-[10px] font-bold text-white leading-none">{totalIssueCount}</span>
            </div>
          )}
        </div>

        <div className="flex flex-col flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm font-bold text-slate-100 truncate flex-1">{data.label}</span>
          </div>
          <div className="flex items-center justify-between mt-1">
            <span className="text-[11px] text-slate-400 font-mono tracking-tight bg-slate-950/50 px-1.5 py-0.5 rounded border border-slate-800 truncate max-w-[80px]">{data.version}</span>
            
            <div className="flex items-center gap-1">
              {!isVulnerable && <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />}
              {isVulnerable && totalIssueCount > 0 && (
                <div className="flex items-center gap-1 bg-black/40 px-1.5 py-0.5 rounded border border-white/5 shadow-inner">
                  {vulnCounts.critical > 0 && <span className="flex items-center gap-0.5 text-[9px] font-bold text-red-500"><span className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_5px_rgba(239,68,68,1)]"></span>{vulnCounts.critical}</span>}
                  {vulnCounts.high > 0 && <span className="flex items-center gap-0.5 text-[9px] font-bold text-orange-500 ml-1"><span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>{vulnCounts.high}</span>}
                  {vulnCounts.medium > 0 && <span className="flex items-center gap-0.5 text-[9px] font-bold text-yellow-500 ml-1"><span className="w-1.5 h-1.5 rounded-full bg-yellow-500"></span>{vulnCounts.medium}</span>}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <Handle type="source" position={Position.Bottom} className={`!w-2 !h-2 !bg-[#0F172A] !border !border-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity`} />
    </div>
  );
}
