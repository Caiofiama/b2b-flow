'use client';

import { useEffect, useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { MonthlySales } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { FilterX } from 'lucide-react';

interface SalesChartProps {
  history?: MonthlySales[];
  selectedMonth?: string | null;
  onSelectMonth?: (month: string | null) => void;
}

export function SalesChart({ history = [], selectedMonth, onSelectMonth }: SalesChartProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const chartData = history.map((item) => ({
    month: item.month,
    revenue: item.revenueInCents / 100, // Recharts number
    deals: item.dealsCount,
    isSelected: selectedMonth === item.month,
  }));

  if (!isMounted) {
    return (
      <Card className="h-[400px]">
        <CardHeader>
          <CardTitle>Fluxo de Vendas (Últimos 6 meses)</CardTitle>
        </CardHeader>
        <CardContent className="h-64 flex items-center justify-center">
          <div className="h-full w-full animate-pulse rounded-lg bg-slate-800/40" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-full lg:col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span>Fluxo de Vendas (Últimos 6 meses)</span>
            {selectedMonth && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/20 px-2.5 py-0.5 text-xs font-semibold text-blue-400 border border-blue-500/30">
                Filtrando: {selectedMonth}
                {onSelectMonth && (
                  <button
                    onClick={() => onSelectMonth(null)}
                    className="hover:text-white transition-colors"
                    title="Limpar filtro"
                  >
                    <FilterX className="h-3 w-3" />
                  </button>
                )}
              </span>
            )}
          </div>
          <span className="text-xs font-normal text-slate-400">
            {selectedMonth ? 'Clique no mês para resetar' : 'Clique num mês para filtrar'}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="h-80 w-full pt-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            onClick={(state) => {
              if (state && state.activeLabel && onSelectMonth) {
                const clickedMonth = state.activeLabel;
                onSelectMonth(selectedMonth === clickedMonth ? null : clickedMonth);
              }
            }}
            className="cursor-pointer"
          >
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.5} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis dataKey="month" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis
              stroke="#64748b"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(val) => `R$ ${val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}`}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="rounded-lg border border-blue-500/40 bg-slate-900/90 backdrop-blur-md p-3 shadow-2xl text-xs space-y-1">
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-semibold text-slate-200">{data.month}</p>
                        <span className="text-[10px] text-blue-400 font-medium">Clique para filtrar</span>
                      </div>
                      <p className="text-blue-400 font-bold text-sm">
                        {formatCurrency(data.revenue * 100)}
                      </p>
                      <p className="text-slate-400">{data.deals} negócios fechados</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#3b82f6"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorRevenue)"
              activeDot={{
                r: 8,
                fill: '#60a5fa',
                stroke: '#ffffff',
                strokeWidth: 3,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
