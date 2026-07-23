'use client';

import { usePathname } from 'next/navigation';
import { Search, Bell, Sparkles } from 'lucide-react';
import { Input } from '@/components/ui/input';

export function Navbar() {
  const pathname = usePathname();

  const getPageTitle = (path: string) => {
    if (path === '/') return 'Dashboard Visão Geral';
    if (path.startsWith('/clients')) return 'Gestão de Clientes';
    if (path.startsWith('/pipeline')) return 'Pipeline de Vendas (Kanban)';
    if (path.startsWith('/settings')) return 'Configurações do Sistema';
    return 'B2B Flow';
  };

  return (
    <header className="sticky top-0 z-20 flex h-16 w-full items-center justify-between border-b border-slate-800 bg-slate-950/70 px-6 backdrop-blur-xl">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold text-white tracking-tight">
          {getPageTitle(pathname)}
        </h1>
      </div>

      <div className="flex items-center gap-4">
        {/* Search bar */}
        <div className="relative hidden md:block w-64">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
          <Input
            placeholder="Pesquisar..."
            className="pl-9 bg-slate-900/80 border-slate-800 text-xs text-slate-200"
          />
        </div>

        {/* AI Badge indicator */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium">
          <Sparkles className="h-3.5 w-3.5 text-blue-400 animate-pulse" />
          <span>IA Ativa</span>
        </div>

        {/* Notification Bell */}
        <button className="relative rounded-lg p-2 text-slate-400 hover:bg-slate-900 hover:text-white transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-blue-500 ring-2 ring-slate-950" />
        </button>
      </div>
    </header>
  );
}
