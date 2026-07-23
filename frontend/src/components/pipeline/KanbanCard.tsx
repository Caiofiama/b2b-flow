'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Opportunity } from '@/types';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Building2, Calendar, GripVertical } from 'lucide-react';

interface KanbanCardProps {
  opportunity: Opportunity;
}

export function KanbanCard({ opportunity }: KanbanCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: opportunity.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="group relative flex flex-col gap-2 rounded-xl border border-slate-800 bg-slate-900/90 p-4 shadow-lg hover:border-slate-700 transition-all cursor-grab active:cursor-grabbing backdrop-blur-md"
    >
      <div className="flex items-start justify-between gap-2">
        <h4 className="font-semibold text-sm text-slate-100 line-clamp-1 group-hover:text-blue-400 transition-colors">
          {opportunity.title}
        </h4>
        <div {...attributes} {...listeners} className="text-slate-600 hover:text-slate-400">
          <GripVertical className="h-4 w-4" />
        </div>
      </div>

      <div className="flex items-center gap-1.5 text-xs text-slate-400">
        <Building2 className="h-3.5 w-3.5 text-slate-500" />
        <span className="truncate">{opportunity.clientName || 'Cliente'}</span>
      </div>

      <div className="mt-2 flex items-center justify-between border-t border-slate-800/80 pt-3">
        <span className="text-sm font-bold text-emerald-400">
          {formatCurrency(opportunity.valueInCents)}
        </span>
        <span className="flex items-center gap-1 text-[11px] text-slate-500">
          <Calendar className="h-3 w-3" />
          {formatDate(opportunity.createdAt)}
        </span>
      </div>
    </div>
  );
}
