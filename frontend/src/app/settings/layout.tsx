'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Settings, Key, Zap } from 'lucide-react';

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const tabs = [
    { name: 'API Keys', href: '/settings/apikeys', icon: Key },
    { name: 'Scan Quellen', href: '/settings/sources', icon: Zap },
  ];

  return (
    <div className="p-8 space-y-6 animate-in fade-in duration-500 w-full">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Settings className="text-slate-400" /> Einstellungen
        </h1>
        <p className="text-slate-400 mt-1">Verwalte zentrale Konfigurationen der Dependar Plattform.</p>
      </div>

      <div className="border-b border-slate-700">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const isActive = pathname === tab.href;
            return (
              <Link
                key={tab.name}
                href={tab.href}
                className={`
                  flex items-center gap-2 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors
                  ${isActive
                    ? 'border-blue-500 text-blue-400'
                    : 'border-transparent text-slate-400 hover:text-slate-300 hover:border-slate-600'
                  }
                `}
              >
                <tab.icon className={`w-4 h-4 ${isActive ? 'text-blue-500' : 'text-slate-500'}`} />
                {tab.name}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="pt-2">
        {children}
      </div>
    </div>
  );
}
