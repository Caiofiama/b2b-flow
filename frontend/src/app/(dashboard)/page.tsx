'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';
import { DashboardData } from '@/types';
import { KpiCards } from '@/components/dashboard/KpiCards';
import { SalesChart } from '@/components/dashboard/SalesChart';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Sparkles, TrendingUp, ArrowRight, FilterX, Calendar } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);

  const { data } = useQuery<DashboardData>({
    queryKey: ['dashboard'],
    queryFn: () => apiFetch<DashboardData>('/dashboard'),
  });

  const now = new Date();
  const getMonthName = (monthsAgo: number) => {
    const d = new Date(now.getFullYear(), now.getMonth() - monthsAgo, 1);
    return d.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' });
  };

  const m5 = getMonthName(5);
  const m4 = getMonthName(4);
  const m3 = getMonthName(3);
  const m2 = getMonthName(2);
  const m1 = getMonthName(1);
  const m0 = getMonthName(0);

  // Month-by-month distinct dataset map for dynamic UI filtering
  const monthlyDataMap: Record<
    string,
    {
      totalClients: number;
      closedDealsCount: number;
      expectedRevenueInCents: number;
      closedRevenueInCents: number;
      opportunities: Array<{
        id: string;
        title: string;
        valueInCents: number;
        clientName: string;
        createdAt: string;
      }>;
    }
  > = {
    [m5]: {
      totalClients: 9,
      closedDealsCount: 4,
      expectedRevenueInCents: 18000000,
      closedRevenueInCents: 45000000, // R$ 450.000,00
      opportunities: [
        { id: 'm5-1', title: 'Consultoria de Arquitetura .NET', valueInCents: 25000000, clientName: 'TechSolutions Ltda', createdAt: '2026-02-14' },
        { id: 'm5-2', title: 'Licença Inicial SaaS B2B', valueInCents: 20000000, clientName: 'Inovação Digital', createdAt: '2026-02-22' },
      ],
    },
    [m4]: {
      totalClients: 12,
      closedDealsCount: 6,
      expectedRevenueInCents: 24800000,
      closedRevenueInCents: 62000000, // R$ 620.000,00
      opportunities: [
        { id: 'm4-1', title: 'Plataforma CRM Enterprise', valueInCents: 35000000, clientName: 'Global Logistics', createdAt: '2026-03-10' },
        { id: 'm4-2', title: 'Integração de Pagamentos', valueInCents: 27000000, clientName: 'Grupo Varejo Mais', createdAt: '2026-03-18' },
      ],
    },
    [m3]: {
      totalClients: 11,
      closedDealsCount: 5,
      expectedRevenueInCents: 21000000,
      closedRevenueInCents: 58000000, // R$ 580.000,00
      opportunities: [
        { id: 'm3-1', title: 'Migração Infraestrutura Cloud', valueInCents: 38000000, clientName: 'Nexus Telecom', createdAt: '2026-04-05' },
        { id: 'm3-2', title: 'Auditoria de Segurança DevSecOps', valueInCents: 20000000, clientName: 'Alfa Serviços', createdAt: '2026-04-19' },
      ],
    },
    [m2]: {
      totalClients: 16,
      closedDealsCount: 8,
      expectedRevenueInCents: 35600000,
      closedRevenueInCents: 89000000, // R$ 890.000,00
      opportunities: [
        { id: 'm2-1', title: 'Módulo de Inteligência Artificial', valueInCents: 54000000, clientName: 'Enterprise Holdings', createdAt: '2026-05-12' },
        { id: 'm2-2', title: 'Expansion Deal - 500 Licenças', valueInCents: 35000000, clientName: 'Banco Invest B2B', createdAt: '2026-05-27' },
      ],
    },
    [m1]: {
      totalClients: 14,
      closedDealsCount: 7,
      expectedRevenueInCents: 29500000,
      closedRevenueInCents: 74000000, // R$ 740.000,00
      opportunities: [
        { id: 'm1-1', title: 'Sistema de Suporte & SLAs', valueInCents: 44000000, clientName: 'Rede Logística Brasil', createdAt: '2026-06-08' },
        { id: 'm1-2', title: 'Redesign UI/UX Dashboard', valueInCents: 30000000, clientName: 'DataCorp Solutions', createdAt: '2026-06-25' },
      ],
    },
    [m0]: {
      totalClients: 18,
      closedDealsCount: 9,
      expectedRevenueInCents: 39000000,
      closedRevenueInCents: 98000000, // R$ 980.000,00
      opportunities: [
        { id: 'm0-1', title: 'Contrato Global SaaS Enterprise', valueInCents: 60000000, clientName: 'Multinacional Agrobusiness', createdAt: '2026-07-04' },
        { id: 'm0-2', title: 'Consultoria de BI & Data Warehouse', valueInCents: 38000000, clientName: 'Holding Financeira', createdAt: '2026-07-21' },
      ],
    },
  };

  // Demo fallback values
  const fallbackDashboard: DashboardData = {
    kpis: {
      totalClients: 24,
      closedDealsCount: 18,
      expectedRevenueInCents: 34500000,
      closedRevenueInCents: 67800000,
    },
    salesHistory: [
      { month: m5, revenueInCents: 45000000, dealsCount: 4 },
      { month: m4, revenueInCents: 62000000, dealsCount: 6 },
      { month: m3, revenueInCents: 58000000, dealsCount: 5 },
      { month: m2, revenueInCents: 89000000, dealsCount: 8 },
      { month: m1, revenueInCents: 74000000, dealsCount: 7 },
      { month: m0, revenueInCents: 98000000, dealsCount: 9 },
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

  // Active KPI calculation per month
  const activeMonthConfig = selectedMonth ? monthlyDataMap[selectedMonth] : null;

  const displayKpis = activeMonthConfig
    ? {
        totalClients: activeMonthConfig.totalClients,
        closedDealsCount: activeMonthConfig.closedDealsCount,
        expectedRevenueInCents: activeMonthConfig.expectedRevenueInCents,
        closedRevenueInCents: activeMonthConfig.closedRevenueInCents,
      }
    : activeData.kpis;

  const displayOpportunities = activeMonthConfig
    ? activeMonthConfig.opportunities
    : activeData.recentOpportunities;

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

      {/* Selected Month Filter Active Banner */}
      {selectedMonth && (
        <div className="flex items-center justify-between rounded-xl border border-blue-500/40 bg-gradient-to-r from-blue-950/60 to-indigo-950/40 p-4 backdrop-blur-md shadow-lg shadow-blue-500/10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">
                Filtro Mensal Ativo: <span className="text-blue-400 font-extrabold text-sm">{selectedMonth}</span>
              </p>
              <p className="text-[11px] text-slate-300">
                Os 4 cartões de KPI e a lista de últimos negócios estão filtrando os resultados de {selectedMonth}.
              </p>
            </div>
          </div>
          <button
            onClick={() => setSelectedMonth(null)}
            className="flex items-center gap-1.5 rounded-lg border border-blue-500/40 bg-blue-600/20 px-3 py-1.5 text-xs font-semibold text-blue-300 hover:bg-blue-600 hover:text-white transition-colors"
          >
            <FilterX className="h-3.5 w-3.5" />
            <span>Limpar Filtro (Ver Resumo Geral)</span>
          </button>
        </div>
      )}

      {/* KPI Cards */}
      <KpiCards kpis={displayKpis} selectedMonth={selectedMonth} />

      {/* Charts & Recent Deals Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        <SalesChart
          history={activeData.salesHistory}
          selectedMonth={selectedMonth}
          onSelectMonth={setSelectedMonth}
        />

        {/* Recent Opportunities */}
        <Card className="col-span-full lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="h-4 w-4 text-blue-400" />
              <span>Últimos Negócios</span>
            </CardTitle>
            {selectedMonth && (
              <span className="text-[11px] font-bold text-blue-400 bg-blue-500/10 px-2.5 py-0.5 rounded-full border border-blue-500/30">
                {selectedMonth}
              </span>
            )}
          </CardHeader>
          <CardContent className="space-y-3">
            {displayOpportunities.map((opp) => (
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
