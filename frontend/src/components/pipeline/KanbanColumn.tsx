'use client';

import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Opportunity, PipelineStage, PipelineStageNames, PipelineStageColors } from '@/types';
import { KanbanCard } from './KanbanCard';
import { formatCurrency } from '@/lib/utils';

interface KanbanColumnProps {
  stage: PipelineStage;
  opportunities: Opportunity[];
}

export function KanbanColumn({ stage, opportunities }: KanbanColumnProps) {
  const { setNodeRef } = useDroppable({
    id: `column-${stage}`,
  });

  const totalValue = opportunities.reduce((acc, curr) => acc + curr.valueInCents, 0);

  return (
    <div
      ref={setNodeRef}
      className="flex flex-col w-80 shrink-0 rounded-2xl border border-slate-800/80 bg-slate-950/60 p-4 backdrop-blur-xl min-h-[500px]"
    >
      {/* Column Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span
            className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${PipelineStageColors[stage]}`}
          >
            {PipelineStageNames[stage]}
          </span>
          <span className="text-xs font-semibold text-slate-500 bg-slate-900 px-2 py-0.5 rounded-md border border-slate-800">
            {opportunities.length}
          </span>
        </div>
      </div>

      <div className="py-2 text-xs font-semibold text-slate-400">
        Total: <span className="text-slate-200">{formatCurrency(totalValue)}</span>
      </div>

      {/* Droppable cards container */}
      <SortableContext
        items={opportunities.map((o) => o.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex-1 space-y-3 pt-2 overflow-y-auto min-h-[400px]">
          {opportunities.map((opp) => (
            <KanbanCard key={opp.id} opportunity={opp} />
          ))}

          {opportunities.length === 0 && (
            <div className="h-32 flex items-center justify-center rounded-xl border border-dashed border-slate-800 text-xs text-slate-600">
              Nenhuma oportunidade
            </div>
          )}
        </div>
      </SortableContext>
    </div>
  );
}
