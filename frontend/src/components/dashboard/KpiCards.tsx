'use client';

import { motion } from 'framer-motion';
import { Users, CheckCircle2, TrendingUp, DollarSign } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { KpiSummary } from '@/types';
import { formatCurrency } from '@/lib/utils';

interface KpiCardsProps {
  kpis?: KpiSummary;
}

export function KpiCards({ kpis }: KpiCardsProps) {
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
        return (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className={`relative overflow-hidden bg-gradient-to-b ${card.color}`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    {card.title}
                  </span>
                  <div className={`p-2.5 rounded-xl ${card.iconBg}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
                <div className="mt-4 text-2xl font-bold text-white tracking-tight">
                  {card.value}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
