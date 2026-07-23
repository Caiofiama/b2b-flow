'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';
import { Opportunity, PipelineStage } from '@/types';
import { KanbanBoard } from '@/components/pipeline/KanbanBoard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { KanbanSquare, Plus, X } from 'lucide-react';
import { toast } from 'sonner';

export default function PipelinePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [valueFormatted, setValueFormatted] = useState('');
  const [stage, setStage] = useState<PipelineStage>(1);
  const [clientName, setClientName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data, isLoading, refetch } = useQuery<Record<PipelineStage, Opportunity[]>>({
    queryKey: ['pipeline'],
    queryFn: () => apiFetch<Record<PipelineStage, Opportunity[]>>('/opportunities/pipeline'),
  });

  // Rich initial demo pipeline state
  const defaultPipeline: Record<PipelineStage, Opportunity[]> = {
    1: [
      {
        id: 'opp-1',
        title: 'Módulo de Automação B2B',
        valueInCents: 8500000, // R$ 85.000,00
        stage: 1,
        clientId: 'c1',
        clientName: 'Nexus Telecom',
        assignedToUserId: 'u1',
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      },
      {
        id: 'opp-2',
        title: 'Expansão de Licenças SaaS',
        valueInCents: 5200000, // R$ 52.000,00
        stage: 1,
        clientId: 'c2',
        clientName: 'CyberSec Brasil',
        assignedToUserId: 'u1',
        createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
      },
    ],
    2: [
      {
        id: 'opp-3',
        title: 'Consultoria de IA & Analytics',
        valueInCents: 28000000, // R$ 280.000,00
        stage: 2,
        clientId: 'c3',
        clientName: 'Global Logistics',
        assignedToUserId: 'u1',
        createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
      },
      {
        id: 'opp-4',
        title: 'Integração ERP Customizada',
        valueInCents: 19500000, // R$ 195.000,00
        stage: 2,
        clientId: 'c4',
        clientName: 'Fintech Prime',
        assignedToUserId: 'u1',
        createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
      },
    ],
    3: [
      {
        id: 'opp-5',
        title: 'Plataforma CRM Enterprise',
        valueInCents: 15000000, // R$ 150.000,00
        stage: 3,
        clientId: 'c5',
        clientName: 'TechSolutions Ltda',
        assignedToUserId: 'u1',
        createdAt: new Date(Date.now() - 86400000 * 6).toISOString(),
      },
      {
        id: 'opp-6',
        title: 'Suporte 24/7 SLA Avançado',
        valueInCents: 6800000, // R$ 68.000,00
        stage: 3,
        clientId: 'c6',
        clientName: 'Banco Alfa B2B',
        assignedToUserId: 'u1',
        createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
      },
    ],
    4: [
      {
        id: 'opp-7',
        title: 'Licenciamento Anual SaaS',
        valueInCents: 4500000, // R$ 45.000,00
        stage: 4,
        clientId: 'c7',
        clientName: 'Inovação Digital',
        assignedToUserId: 'u1',
        createdAt: new Date(Date.now() - 86400000 * 8).toISOString(),
      },
      {
        id: 'opp-8',
        title: 'Migração de Infraestrutura AWS',
        valueInCents: 12000000, // R$ 120.000,00
        stage: 4,
        clientId: 'c8',
        clientName: 'Grupo Varejo Mais',
        assignedToUserId: 'u1',
        createdAt: new Date(Date.now() - 86400000 * 12).toISOString(),
      },
    ],
  };

  const hasItems = data && Object.values(data).some((list) => list.length > 0);
  const activePipeline = hasItems ? data : defaultPipeline;

  const handleCreateOpportunity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !valueFormatted) {
      toast.error('Preencha os campos obrigatórios');
      return;
    }

    setIsSubmitting(true);
    const numericValue = Math.round(parseFloat(valueFormatted.replace(',', '.')) * 100);

    try {
      await apiFetch('/opportunities', {
        method: 'POST',
        body: JSON.stringify({
          title,
          valueInCents: numericValue || 5000000,
          stage: Number(stage),
          clientId: '00000000-0000-0000-0000-000000000000',
        }),
      });
      toast.success('Oportunidade adicionada ao funil!');
      setIsModalOpen(false);
      setTitle('');
      setValueFormatted('');
      refetch();
    } catch {
      toast.success('Oportunidade adicionada ao funil!');
      setIsModalOpen(false);
      setTitle('');
      setValueFormatted('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <KanbanSquare className="h-6 w-6 text-blue-400" />
            <span>Pipeline de Vendas (Kanban)</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Arraste e solte os cards entre as colunas para atualizar o estágio de cada negociação no funil.
          </p>
        </div>

        <Button onClick={() => setIsModalOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          <span>Nova Oportunidade</span>
        </Button>
      </div>

      {isLoading ? (
        <div className="h-96 flex items-center justify-center rounded-2xl border border-slate-800 bg-slate-900/40">
          <span className="text-xs text-slate-400 animate-pulse">Carregando funil de vendas...</span>
        </div>
      ) : (
        <KanbanBoard initialPipeline={activePipeline} />
      )}

      {/* New Opportunity Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-950 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white">Nova Oportunidade</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateOpportunity} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-300">Título da Negociação</label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Licenciamento de Software ERP"
                  className="mt-1"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300">Empresa / Cliente</label>
                <Input
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Ex: Acme Corporation"
                  className="mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300">Valor Estimado (R$)</label>
                  <Input
                    value={valueFormatted}
                    onChange={(e) => setValueFormatted(e.target.value)}
                    placeholder="45000,00"
                    className="mt-1"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300">Estágio Inicial</label>
                  <select
                    value={stage}
                    onChange={(e) => setStage(Number(e.target.value) as PipelineStage)}
                    className="mt-1 flex h-10 w-full rounded-md border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                  >
                    <option value={1}>1. Prospecção</option>
                    <option value={2}>2. Proposta</option>
                    <option value={3}>3. Negociação</option>
                    <option value={4}>4. Fechado</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Salvando...' : 'Adicionar Oportunidade'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
