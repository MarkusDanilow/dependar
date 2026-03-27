import { Handle, Position } from "reactflow";
import { Zap, Package, Database, Settings, HardDrive, Save } from "lucide-react";

const getIconForTech = (name: string) => {
  const n = name.toLowerCase();
  if (n.includes("next") || n.includes("express")) return <Zap className="w-5 h-5 text-amber-500" />;
  if (n.includes("react") || n.includes("tailwind")) return <Package className="w-5 h-5 text-amber-600/80" />;
  if (n.includes("postgres")) return <HardDrive className="w-5 h-5 text-slate-300" />;
  if (n.includes("redis")) return <Save className="w-5 h-5 text-red-400" />;
  if (n.includes("docker")) return (
    <svg viewBox="0 0 24 24" className="w-5 h-5 text-cyan-500" fill="currentColor">
      <path d="M11.983 15.834c-1.353 0-2.434-.972-2.5-2.222H6.945c.066 2.508 2.378 4.545 5.038 4.545 2.628 0 4.908-1.992 5.035-4.455h-2.534c-.114 1.194-1.168 2.132-2.501 2.132zm-6.248-3.083h12.53V10.43H5.735v2.321zm2.148-3.66h2.246V6.768H7.883v2.323zm3.179 0h2.245V6.768h-2.245v2.323zm3.178 0h2.247V6.768h-2.247v2.323zM7.883 5.424h2.246V3.1H7.883v2.324zm3.179 0h2.245V3.1h-2.245v2.324z"/>
    </svg>
  );
  if (n.includes("node")) return <Settings className="w-5 h-5 text-slate-200" />;
  return <Database className="w-5 h-5 text-slate-400" />;
};

const getStatusColor = (name: string) => {
  const n = name.toLowerCase();
  if (n.includes("redis")) return "bg-red-500";
  if (n.includes("node") || n.includes("express")) return "bg-amber-500";
  return "bg-emerald-400";
};

export function CustomNode({ data }: { data: any }) {
  let name = data.name || data.label || "Unknown";
  let version = data.version || "";
  
  if (data.label && data.label.includes(" v")) {
    const parts = data.label.split(" v");
    name = parts[0];
    version = "v" + parts.slice(1).join(" v");
  }

  const icon = getIconForTech(name);
  const statusColor = getStatusColor(name);

  return (
    <div className="bg-[#192334] border border-[#2D3F58] rounded-xl shadow-2xl px-5 py-4 min-w-[160px] flex items-center gap-4 relative">
      <Handle 
        type="target" 
        position={Position.Top} 
        className="!w-2.5 !h-2.5 !bg-[#1E293B] !border-2 !border-[#60A5FA] !rounded-full !-top-1.5" 
      />
      <div className="flex-shrink-0 flex items-center justify-center drop-shadow-md">
        {icon}
      </div>
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${statusColor}`} />
          <span className="text-sm font-semibold text-[#F1F5F9] tracking-wide">{name}</span>
        </div>
        <span className="text-[11px] text-[#64748B] font-mono mt-1">{version}</span>
      </div>
      <Handle 
        type="source" 
        position={Position.Bottom} 
        className="!w-2.5 !h-2.5 !bg-[#1E293B] !border-2 !border-[#60A5FA] !rounded-full !-bottom-1.5" 
      />
    </div>
  );
}
