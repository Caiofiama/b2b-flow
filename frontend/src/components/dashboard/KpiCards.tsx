'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Users, CheckCircle2, TrendingUp, DollarSign } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { KpiSummary } from '@/types';
import { formatCurrency } from '@/lib/utils';

interface KpiCardsProps {
  kpis?: KpiSummary;
  selectedMonth?: string | null;
}

export function KpiCards({ kpis, selectedMonth }: KpiCardsProps) {
  const cards = [
    {
      title: 'Total de Clientes',
      value: kpis?.totalClients ?? 0,
      icon: Users,
      color: 'from-blue-500/20 to-blue-600/5 text-blue-400 border-blue-500/30',
      iconBg: 'bg-blue-500/20 text-blue-400',
    },
    {
      title: 'Negócios Fechados',
      value: kpis?.closedDealsCount ?? 0,
      icon: CheckCircle2,
      color: 'from-emerald-500/20 to-emerald-600/5 text-emerald-400 border-emerald-500/30',
      iconBg: 'bg-emerald-500/20 text-emerald-400',
    },
    {
      title: 'Faturamento Previsto',
      value: formatCurrency(kpis?.expectedRevenueInCents ?? 0),
      icon: TrendingUp,
      color: 'from-amber-500/20 to-amber-600/5 text-amber-400 border-amber-500/30',
      iconBg: 'bg-amber-500/20 text-amber-400',
    },
    {
      title: 'Faturamento Realizado',
      value: formatCurrency(kpis?.closedRevenueInCents ?? 0),
      icon: DollarSign,
      color: 'from-purple-500/20 to-purple-600/5 text-purple-400 border-purple-500/30',
      iconBg: 'bg-purple-500/20 text-purple-400',
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, index) => {
        const Icon = card.icon;
        const animationKey = `${card.title}-${card.value}-${selectedMonth || 'all'}`;

        return (
          <AnimatePresence mode="wait" key={card.title}>
            <motion.div
              key={animationKey}
              initial={{ scale: 0.95, opacity: 0.7 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.25, delay: index * 0.05 }}
            >
              <Card
                className={`relative overflow-hidden bg-gradient-to-b ${card.color} ${
                  selectedMonth ? 'ring-1 ring-blue-500/40 shadow-lg shadow-blue-500/10' : ''
                }`}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      {card.title}
                    </span>
                    <div className={`p-2.5 rounded-xl ${card.iconBg}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-baseline justify-between">
                    <span className="text-2xl font-extrabold text-white tracking-tight">
                      {card.value}
                    </span>
                    {selectedMonth && (
                      <span className="text-[10px] font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20">
                        {selectedMonth}
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>
        );
      })}
    </div>
  );
}
