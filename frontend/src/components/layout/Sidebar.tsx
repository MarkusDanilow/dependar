'use client';

import Link from 'next/link';
import { Home, Cpu, HardDrive, Users, LogOut, Box, ShieldAlert } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Sicherheitslücken', href: '/vulnerabilities', icon: ShieldAlert },
  { name: 'Projekte', href: '/projects', icon: HardDrive },
  { name: 'Container', href: '/containers', icon: Box },
  { name: 'Technologien', href: '/technologies', icon: Cpu },
  { name: 'Benutzer', href: '/users', icon: Users },
];

export function Sidebar() {
  const auth = useAuth();
  const logout = auth?.logout || (() => {});
  const user = auth?.user;
  const pathname = usePathname();

  const firstName = user?.firstName || '';
  const lastName = user?.lastName || '';
  const hasName = firstName && lastName;
  const userName = hasName ? `${firstName} ${lastName}`.trim() : (user?.email || 'Gast');
  const userEmail = user?.email || '';
  const userInitials = hasName
    ? `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
    : userEmail.slice(0, 2).toUpperCase() || '??';

  return (
    <aside className="w-64 h-screen bg-slate-800 border-r border-slate-700 flex flex-col z-50">
      <div className="p-6">
        <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-blue-500 flex items-center justify-center shadow-lg">
            <span className="text-xs text-white">D</span>
          </div>
          Dependar
        </h1>
      </div>
      <nav className="flex-1 px-4 space-y-2">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${pathname === item.href
              ? 'bg-blue-600/20 text-blue-400'
              : 'text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
          >
            <item.icon className={`w-4 h-4 ${pathname === item.href ? 'text-blue-500' : ''}`} />
            <span className={`text-sm font-medium ${pathname === item.href ? 'text-white' : ''}`}>{item.name}</span>
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t border-slate-700">
        <div className="flex items-center justify-between group cursor-pointer hover:bg-slate-700 p-2 rounded-lg transition-colors" onClick={logout} title="Abmelden">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center shadow-md">
              <span className="text-xs font-bold text-white">{userInitials}</span>
            </div>
            <div className="flex flex-col overflow-hidden max-w-[120px]">
              <span className="text-xs font-bold text-white truncate">{userName}</span>
              <span className="text-[10px] text-slate-400 truncate">{userEmail}</span>
            </div>
          </div>
          <LogOut className="w-4 h-4 text-slate-400 group-hover:text-red-400 transition-colors" />
        </div>
      </div>
    </aside>
  );
}
