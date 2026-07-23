'use client';

import { useAuthStore } from '@/stores/auth-store';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Settings, Shield, User, Database, Server } from 'lucide-react';

export default function SettingsPage() {
  const { user } = useAuthStore();

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <Settings className="h-6 w-6 text-blue-400" />
          <span>Configurações do Sistema</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Informações da conta, controle de acesso (RBAC) e status das integrações.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* User Account Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <User className="h-4 w-4 text-blue-400" />
              <span>Perfil do Usuário</span>
            </CardTitle>
            <CardDescription className="text-xs">Dados da sessão ativa</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <div className="flex justify-between py-1.5 border-b border-slate-800">
              <span className="text-slate-400">Nome:</span>
              <span className="font-semibold text-slate-200">{user?.name || 'Administrador B2B'}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-800">
              <span className="text-slate-400">E-mail:</span>
              <span className="font-semibold text-slate-200">{user?.email || 'admin@b2bflow.com'}</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-slate-400">Função (Role):</span>
              <Badge variant="default">{user?.role || 'Admin'}</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Security & RBAC Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Shield className="h-4 w-4 text-emerald-400" />
              <span>Segurança & Permissões (RBAC)</span>
            </CardTitle>
            <CardDescription className="text-xs">Níveis de acesso no sistema</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <div className="flex items-center justify-between py-1.5 border-b border-slate-800">
              <div>
                <p className="font-semibold text-slate-200">Admin</p>
                <p className="text-[10px] text-slate-400">Acesso total (Criar, Editar, Excluir)</p>
              </div>
              <Badge variant="success">Ativo</Badge>
            </div>
            <div className="flex items-center justify-between py-1.5 border-b border-slate-800">
              <div>
                <p className="font-semibold text-slate-200">Manager</p>
                <p className="text-[10px] text-slate-400">Gestão de Clientes e Pipeline</p>
              </div>
              <Badge variant="secondary">Habilitado</Badge>
            </div>
            <div className="flex items-center justify-between py-1.5">
              <div>
                <p className="font-semibold text-slate-200">Operator</p>
                <p className="text-[10px] text-slate-400">Visualização e atualização simples</p>
              </div>
              <Badge variant="secondary">Habilitado</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Infrastructure Status */}
        <Card className="col-span-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Server className="h-4 w-4 text-purple-400" />
              <span>Arquitetura de Infraestrutura</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-3 text-xs">
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-1">
              <div className="flex items-center gap-2 text-blue-400 font-semibold">
                <Server className="h-4 w-4" />
                <span>Front-End</span>
              </div>
              <p className="text-slate-300">Next.js 14 App Router</p>
              <p className="text-[10px] text-slate-500">Deploy: Vercel</p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-1">
              <div className="flex items-center gap-2 text-purple-400 font-semibold">
                <Database className="h-4 w-4" />
                <span>Back-End</span>
              </div>
              <p className="text-slate-300">.NET 8 Clean Architecture</p>
              <p className="text-[10px] text-slate-500">Deploy: Railway</p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-1">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                <Database className="h-4 w-4" />
                <span>Banco de Dados</span>
              </div>
              <p className="text-slate-300">PostgreSQL (EF Core 8)</p>
              <p className="text-[10px] text-slate-500">Host: Neon / Railway</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
