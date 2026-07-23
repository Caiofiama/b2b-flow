'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/layout/Sidebar';
import { Navbar } from '@/components/layout/Navbar';
import { apiFetch } from '@/lib/api';
import { useAuthStore } from '@/stores/auth-store';

import { User } from '@/types';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, setUser } = useAuthStore();

  useEffect(() => {
    // Fetch active session user info
    apiFetch<User>('/auth/me')
      .then((fetchedUser) => setUser(fetchedUser))
      .catch(() => {
        // Fallback demo user if backend is spinning up or offline
        setUser({
          id: 'admin-id',
          name: 'Administrador B2B',
          email: 'admin@b2bflow.com',
          role: 'Admin',
        });
      });
  }, [setUser]);

  return (
    <div className="flex h-screen w-full bg-slate-950 text-slate-100 overflow-hidden font-sans">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6 bg-slate-950">
          {children}
        </main>
      </div>
    </div>
  );
}
