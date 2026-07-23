'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, KanbanSquare, Settings, LogOut, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { useSidebarStore } from '@/stores/sidebar-store';
import { useAuthStore } from '@/stores/auth-store';
import { apiFetch } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { isOpen, toggle } = useSidebarStore();
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    try {
      await apiFetch('/auth/logout', { method: 'POST' });
      logout();
      toast.success('Sessão encerrada');
      router.push('/login');
    } catch {
      toast.error('Erro ao encerrar sessão');
    }
  };

  const navItems = [
    { label: 'Dashboard', href: '/', icon: LayoutDashboard },
    { label: 'Clientes', href: '/clients', icon: Users },
    { label: 'Pipeline Sales', href: '/pipeline', icon: KanbanSquare },
    { label: 'Configurações', href: '/settings', icon: Settings },
  ];

  return (
    <aside
      className={`relative flex flex-col border-r border-slate-800 bg-slate-950/80 backdrop-blur-xl transition-all duration-300 z-30 ${
        isOpen ? 'w-64' : 'w-20'
      }`}
    >
      {/* Brand Header */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-slate-800/80">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 shadow-lg shadow-blue-500/20">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          {isOpen && (
            <span className="font-bold text-lg bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent tracking-tight whitespace-nowrap">
              B2B Flow
            </span>
          )}
        </div>

        <button
          onClick={toggle}
          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
        >
          {isOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </button>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 space-y-1.5 p-3 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3.5 rounded-xl px-3.5 py-3 text-sm font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-blue-600/15 text-blue-400 border border-blue-500/20 shadow-md shadow-blue-500/5'
                  : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
              }`}
            >
              <Icon className={`h-5 w-5 shrink-0 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
              {isOpen && <span className="whitespace-nowrap">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* User Footer & Logout */}
      <div className="border-t border-slate-800/80 p-3 space-y-2">
        {isOpen && user && (
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-slate-900/60 border border-slate-800">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600/30 text-blue-400 font-semibold text-xs border border-blue-500/40">
              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-xs font-semibold text-slate-200 truncate">{user.name}</span>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider">{user.role}</span>
            </div>
          </div>
        )}

        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3.5 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-colors"
        >
          <LogOut className="h-5 w-5 shrink-0" />
          {isOpen && <span>Sair</span>}
        </button>
      </div>
    </aside>
  );
}
