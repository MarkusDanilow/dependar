import { DependencyGraph } from "@/components/graph/DependencyGraph";
import { AiChatSidebar } from "@/components/chat/AiChatSidebar";

export default function Dashboard() {
  return (
    <div className="flex flex-1 h-full w-full bg-slate-900 overflow-hidden relative">
      <div className="flex-1 h-full relative">
        <DependencyGraph />
      </div>
      <AiChatSidebar />
    </div>
  );
}
