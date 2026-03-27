'use client';

import { Search, Bell, Settings } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';

export function Header() {
  const auth = useAuth();
  const user = auth?.user;

  const firstName = user?.firstName || '';
  const lastName = user?.lastName || '';
  const hasName = firstName && lastName;
  const userName = hasName ? `${firstName} ${lastName}`.trim() : (user?.email || '');
  const userEmail = user?.email || '';
  const userInitials = hasName
    ? `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
    : userEmail.slice(0, 2).toUpperCase();

  return (
    <header className="h-16 bg-[#0B1121]/95 backdrop-blur-md border-b border-[#1E293B] flex items-center justify-between px-6 z-40 flex-shrink-0 shadow-sm">

      {/* Left empty spacer to balance the right side for absolute center */}
      <div className="flex-1 hidden md:block"></div>

      {/* Center Search */}
      <div className="flex-1 flex justify-center w-full max-w-2xl px-4">
        <div className="w-full relative group">
          <Search className="w-4 h-4 text-[#64748B] absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-blue-500 transition-colors" />
          <input
            type="text"
            placeholder="Suche nach Technologien, Containern, Usern..."
            className="w-full bg-[#1E293B]/60 hover:bg-[#1E293B]/80 border border-[#334155] rounded-xl py-2 pl-11 pr-4 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-[#334155] transition-all placeholder:text-[#64748B] shadow-inner"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 border border-[#334155] bg-[#0F172A] rounded px-1.5 py-0.5 text-[10px] text-[#64748B] font-mono hidden sm:block">
            Ctrl K
          </div>
        </div>
      </div>

      {/* Right Actions & Profile */}
      <div className="flex-1 flex items-center justify-end gap-3 flex-shrink-0">
        <div className="flex items-center gap-1 pr-4 border-r border-[#1E293B]">
          <button className="p-2 text-[#94A3B8] hover:text-white hover:bg-[#1E293B] rounded-lg transition-colors relative" title="Benachrichtigungen">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2.5 w-2 h-2 bg-blue-500 rounded-full border-2 border-[#0B1121]"></span>
          </button>
          <button className="p-2 text-[#94A3B8] hover:text-white hover:bg-[#1E293B] rounded-lg transition-colors" title="Einstellungen">
            <Settings className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center gap-3 cursor-pointer p-1.5 pr-3 hover:bg-[#1E293B] rounded-xl transition-colors border border-transparent hover:border-[#334155] group" title="Profil">
          <div className="w-9 h-9 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center border border-blue-500/30 font-bold text-sm shadow-inner group-hover:bg-blue-600/30 transition-colors">
            {userInitials}
          </div>
          <div className="hidden md:flex flex-col items-start leading-tight">
            <span className="text-sm font-semibold text-slate-200">{userName}</span>
            <span className="text-[11px] text-[#64748B]">{userEmail}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
