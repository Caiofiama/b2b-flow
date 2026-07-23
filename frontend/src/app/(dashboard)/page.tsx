'use client';

import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';
import { DashboardData } from '@/types';
import { KpiCards } from '@/components/dashboard/KpiCards';
import { SalesChart } from '@/components/dashboard/SalesChart';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Sparkles, TrendingUp, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { data } = useQuery<DashboardData>({
    queryKey: ['dashboard'],
    queryFn: () => apiFetch<DashboardData>('/dashboard'),
  });

  const now = new Date();
  const getMonthName = (monthsAgo: number) => {
    const d = new Date(now.getFullYear(), now.getMonth() - monthsAgo, 1);
    return d.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' });
  };

  // Demo fallback values if API backend hasn't populated data yet
  const fallbackDashboard: DashboardData = {
    kpis: {
      totalClients: 24,
      closedDealsCount: 18,
      expectedRevenueInCents: 34500000, // R$ 345.000,00
      closedRevenueInCents: 67800000,   // R$ 678.000,00
    },
    salesHistory: [
      { month: getMonthName(5), revenueInCents: 45000000, dealsCount: 4 },
      { month: getMonthName(4), revenueInCents: 62000000, dealsCount: 6 },
      { month: getMonthName(3), revenueInCents: 58000000, dealsCount: 5 },
      { month: getMonthName(2), revenueInCents: 89000000, dealsCount: 8 },
      { month: getMonthName(1), revenueInCents: 74000000, dealsCount: 7 },
      { month: getMonthName(0), revenueInCents: 98000000, dealsCount: 9 },
    ],
    recentOpportunities: [
      {
        id: 'opp-1',
        title: 'Plataforma CRM Enterprise',
        valueInCents: 15000000,
        stage: 3,
        clientId: 'c1',
        clientName: 'TechSolutions Ltda',
        assignedToUserId: 'u1',
        assignedToUserName: 'Carlos Mendes',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'opp-2',
        title: 'Licenciamento Anual SaaS',
        valueInCents: 4500000,
        stage: 4,
        clientId: 'c2',
        clientName: 'Inovação Digital',
        assignedToUserId: 'u1',
        assignedToUserName: 'Ana Souza',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'opp-3',
        title: 'Consultoria de IA & Analytics',
        valueInCents: 28000000,
        stage: 2,
        clientId: 'c3',
        clientName: 'Global Logistics',
        assignedToUserId: 'u1',
        assignedToUserName: 'Mariana Lima',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'opp-4',
        title: 'Migração Infraestrutura Cloud AWS',
        valueInCents: 12000000,
        stage: 4,
        clientId: 'c4',
        clientName: 'Grupo Varejo Mais',
        assignedToUserId: 'u1',
        assignedToUserName: 'Roberto Alves',
        createdAt: new Date().toISOString(),
      },
    ],
  };

  const activeData = data && data.kpis && data.kpis.totalClients > 0 ? data : fallbackDashboard;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 rounded-2xl border border-blue-500/20 bg-gradient-to-r from-blue-900/30 via-indigo-900/20 to-slate-900 p-6 backdrop-blur-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-blue-400 font-semibold text-xs uppercase tracking-wider">
            <Sparkles className="h-4 w-4" />
            <span>Bem-vindo ao B2B Flow</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            Resumo de Performance Comercial
          </h2>
          <p className="text-xs text-slate-400">
            Acompanhe o funil de vendas, oportunidades ativas e previsões de faturamento em tempo real.
          </p>
        </div>

        <Link href="/pipeline">
          <button className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white shadow-lg shadow-blue-500/20 hover:bg-blue-500 transition-colors">
            <span>Ver Pipeline Kanban</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </Link>
      </div>

      {/* KPI Cards */}
      <KpiCards kpis={activeData.kpis} />

      {/* Charts & Recent Deals Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        <SalesChart history={activeData.salesHistory} />

        {/* Recent Opportunities */}
        <Card className="col-span-full lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="h-4 w-4 text-blue-400" />
              <span>Últimos Negócios</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {activeData.recentOpportunities.map((opp) => (
              <div
                key={opp.id}
                className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/60 p-3 hover:border-slate-700 transition-colors"
              >
                <div className="space-y-0.5">
                  <p className="text-xs font-semibold text-slate-100">{opp.title}</p>
                  <p className="text-[11px] text-slate-400">{opp.clientName}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-emerald-400">
                    {formatCurrency(opp.valueInCents)}
                  </p>
                  <p className="text-[10px] text-slate-500">{formatDate(opp.createdAt)}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
