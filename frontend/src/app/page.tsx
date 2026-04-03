'use client';

import { useMemo, useState } from 'react';
import { DependencyGraph } from "@/components/graph/DependencyGraph";
import { SecurityFeed } from "@/components/dashboard/SecurityFeed";
import { AiChatSidebar } from "@/components/chat/AiChatSidebar";
import { SecurityPostureScore } from "@/components/dashboard/SecurityPostureScore";
import { SlaBreachesWidget } from "@/components/dashboard/SlaBreachesWidget";
import { EolTechCard } from "@/components/dashboard/EolTechCard";
import { MttrTrendWidget } from "@/components/dashboard/MttrTrendWidget";
import { TopRiskAssets } from "@/components/dashboard/TopRiskAssets";
import { ActionCenter } from "@/components/dashboard/ActionCenter";
import { useGetProjects } from "@/hooks/useProjects";
import { useGetTechnologies } from "@/hooks/useTechnologies";
import { useGetVulnStates } from "@/hooks/useVulnerabilities";
import { Bot, X, Search, Bell, User, LayoutDashboard, Database, Shield } from "lucide-react";

export default function Dashboard() {
  const [showAiCopilot, setShowAiCopilot] = useState(false);

  // Data fetching
  const { data: projectsData } = useGetProjects();
  const { data: techData } = useGetTechnologies();
  const { data: vulnData } = useGetVulnStates();

  const projects = ((projectsData as any)?.data || projectsData || []);
  const techs = ((techData as any)?.data || techData || []);
  const allVulnStates = ((vulnData as any)?.data || vulnData || []);

  const metrics = useMemo(() => {
    const getSev = (v: any) => v.aiInsight?.adjustedSeverity || v.vulnerability?.baseSeverity || 'MEDIUM';
    const activeStates = allVulnStates.filter((v: any) => v.status === 'OPEN' || v.status === 'IN_PROGRESS');
    const resolvedStates = allVulnStates.filter((v: any) => v.status === 'RESOLVED' && v.resolvedAt);

    // 1. Posture Score
    const critCount = activeStates.filter((v: any) => getSev(v) === 'CRITICAL').length;
    const highCount = activeStates.filter((v: any) => getSev(v) === 'HIGH').length;
    const medCount = activeStates.filter((v: any) => getSev(v) === 'MEDIUM').length;
    const posture = Math.max(0, 100 - (critCount * 12 + highCount * 6 + medCount * 2));

    // 2. SLA Breaches (Critical > 14 days)
    const now = Date.now();
    const slaBreaches = activeStates.filter((v: any) => {
      const ageInDays = (now - new Date(v.createdAt).getTime()) / (1000 * 3600 * 24);
      return getSev(v) === 'CRITICAL' && ageInDays > 14;
    }).length;

    // 3. EOL Tech (Heuristic)
    const eolCount = techs.filter((t: any) => {
      const name = t.name.toLowerCase();
      const v = parseInt(t.version) || 0;
      if (name.includes('node') && v < 18) return true;
      if (name.includes('react') && v < 17) return true;
      if (name.includes('ubuntu') && v < 22) return true;
      return false;
    }).length;

    // 4. MTTR
    const totalDays = resolvedStates.reduce((acc: number, v: any) => {
      const diff = (new Date(v.resolvedAt).getTime() - new Date(v.createdAt).getTime()) / (1000 * 3600 * 24);
      return acc + diff;
    }, 0);
    const avgMttr = resolvedStates.length > 0 ? totalDays / resolvedStates.length : 8.0;

    // 5. Top Risk Assets
    const projectRiskMap: Record<string, { name: string, vulns: number, score: number }> = {};
    activeStates.forEach((v: any) => {
      const pId = v.projectId || 'unknown';
      const pName = v.project?.name || 'Infrastruktur';
      if (!projectRiskMap[pId]) projectRiskMap[pId] = { name: pName, vulns: 0, score: 0 };
      projectRiskMap[pId].vulns += 1;
      const sev = getSev(v);
      projectRiskMap[pId].score += (sev === 'CRITICAL' ? 25 : sev === 'HIGH' ? 10 : 5);
    });
    const topRiskAssets = Object.values(projectRiskMap)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map(a => ({ ...a, type: a.name === 'Infrastruktur' ? 'Host' : 'Projekt' }));

    // 6. Action Center
    const actions = activeStates
      .sort((a: any, b: any) => {
        const sevWeight = { 'CRITICAL': 3, 'HIGH': 2, 'MEDIUM': 1, 'LOW': 0 };
        return (sevWeight as any)[getSev(b)] - (sevWeight as any)[getSev(a)];
      })
      .slice(0, 3)
      .map((v: any) => ({
        id: v.id,
        title: `Update ${v.technology?.name || 'Tech'}`,
        subtitle: `Behebt ${v.vulnerabilityId} (${getSev(v)})`,
        severity: getSev(v)
      }));

    return { posture, slaBreaches, eolCount, avgMttr, topRiskAssets, actions };
  }, [allVulnStates, techs]);

  return (
    <div className="flex flex-col h-full w-full bg-[#020617] text-slate-200 overflow-hidden relative font-sans leading-relaxed">

      {/* SECONDARY NAVIGATION - Accessibility Header */}
      {/* <header role="banner" className="flex-shrink-0 h-14 border-b border-white/10 bg-[#020617]/80 backdrop-blur-xl flex items-center justify-between px-8 z-30">
        <nav aria-label="Dashboard Navigation" className="flex items-center gap-8">
           <div className="flex items-center gap-3 text-blue-400">
              <LayoutDashboard className="w-5 h-5" />
              <span className="text-[13px] font-black uppercase tracking-wider">Sicherheits-Zentrale</span>
           </div>
           <div className="h-5 w-px bg-white/20"></div>
           <ul className="flex items-center gap-8 text-[12px] font-bold text-slate-400 uppercase tracking-widest list-none">
              <li><button className="hover:text-blue-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded px-1 transition-all" aria-label="Infrastruktur-Bereich">Infrastruktur</button></li>
              <li><button className="hover:text-blue-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded px-1 transition-all" aria-label="Projekt-Bereich">Projekte</button></li>
              <li><button className="hover:text-blue-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded px-1 transition-all" aria-label="Compliance-Bereich">Compliance</button></li>
           </ul>
        </nav>
        <div className="flex items-center gap-6 text-[11px] font-bold uppercase tracking-widest text-slate-400">
           <span className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full"><Database className="w-3.5 h-3.5 text-emerald-500" /> DB Verbunden</span>
           <span className="flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full"><Shield className="w-3.5 h-3.5 text-blue-500" /> Schutz Aktiv</span>
        </div>
      </header> */}

      <div className="flex-1 flex overflow-hidden">

        {/* MAIN CONTENT AREA */}
        <main id="main-content" className="flex-1 flex flex-col overflow-y-auto bg-[#020617]">

          {/* KPI ROW */}
          <section aria-label="Top-Kennzahlen" className="grid grid-cols-1 md:grid-cols-4 gap-6 p-8 pb-4">
            <SecurityPostureScore score={metrics.posture} />
            <SlaBreachesWidget count={metrics.slaBreaches} />
            <EolTechCard count={metrics.eolCount} />
            <MttrTrendWidget avgDays={metrics.avgMttr} />
          </section>

          {/* ACTION & RISK ROW */}
          <section aria-label="Handlungsempfehlungen und Risiken" className="grid grid-cols-1 lg:grid-cols-2 gap-8 px-8 pb-8">
            <TopRiskAssets risks={metrics.topRiskAssets} />
            <ActionCenter actions={metrics.actions} />
          </section>

          {/* GRAPH SECTION */}
          <section aria-label="Infrastruktur-Graph" className="flex-1 min-h-[500px] border-t border-white/10 relative bg-slate-950/30">
            <div className="absolute top-8 left-8 z-20">
              <h3 className="text-[12px] font-bold text-slate-400 uppercase tracking-[0.25em] mb-3">Live Infrastruktur-Graph</h3>
              <div className="flex gap-3">
                <div className="bg-slate-900/90 backdrop-blur border border-white/10 px-3 py-2 rounded-xl text-[11px] font-bold text-slate-300 shadow-2xl">
                  <span className="text-blue-400">HOSTS:</span> {techs.filter((t: any) => t.hostTechs?.length > 0).length || 5}
                </div>
                <div className="bg-slate-900/90 backdrop-blur border border-white/10 px-3 py-2 rounded-xl text-[11px] font-bold text-slate-300 shadow-2xl">
                  <span className="text-violet-400">PROJEKTE:</span> {projects.length || 8}
                </div>
              </div>
            </div>
            <DependencyGraph />
          </section>

        </main>

        {/* ASIDE (SIDEBAR FEED) */}
        <aside aria-label="Sicherheits-Log" className="w-85 flex-shrink-0 border-l border-white/10 bg-[#020617] h-full shadow-[inset_1px_0_0_rgba(255,255,255,0.05)]">
          <SecurityFeed />
        </aside>

      </div>

      {/* Floating AI Copilot Toggle */}
      {/* <button
        onClick={() => setShowAiCopilot(!showAiCopilot)}
        aria-label={showAiCopilot ? "Security Copilot schließen" : "Security Copilot öffnen"}
        className={`absolute bottom-8 right-84 z-50 p-5 rounded-full shadow-2xl transition-all hover:scale-110 flex items-center justify-center focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/50 ${showAiCopilot ? 'bg-slate-800 text-slate-300' : 'bg-blue-600 text-white shadow-blue-500/50'}`}
        style={{ right: '360px' }}
      >
        {showAiCopilot ? <X className="w-7 h-7" /> : <Bot className="w-7 h-7" />}
      </button> */}

      {/* AI Panel */}
      {showAiCopilot && (
        <section aria-label="AI Copilot Panel" className="absolute bottom-28 right-[360px] z-50 w-100 h-[650px] max-h-[80vh] rounded-3xl shadow-2xl border border-white/10 overflow-hidden bg-slate-900 flex flex-col animate-in slide-in-from-bottom-4 zoom-in-95 duration-300">
          <header className="bg-slate-800 p-5 flex items-center justify-between border-b border-white/10">
            <div className="flex items-center gap-3">
              <Bot className="w-6 h-6 text-blue-500" />
              <span className="font-black text-[14px] uppercase tracking-wider text-slate-100">Security Copilot</span>
            </div>
            <button
              onClick={() => setShowAiCopilot(false)}
              aria-label="Panel schließen"
              className="p-1 hover:bg-white/5 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              <X className="w-5 h-5 text-slate-400 hover:text-white" />
            </button>
          </header>
          <div className="flex-1 overflow-hidden">
            <AiChatSidebar />
          </div>
        </section>
      )}

    </div>
  );
}
