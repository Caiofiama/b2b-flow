'use client';

import { useState } from 'react';
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
} from '@dnd-kit/core';
import { Opportunity, PipelineStage } from '@/types';
import { KanbanColumn } from './KanbanColumn';
import { KanbanCard } from './KanbanCard';
import { apiFetch } from '@/lib/api';
import { toast } from 'sonner';

interface KanbanBoardProps {
  initialPipeline: Record<PipelineStage, Opportunity[]>;
}

export function KanbanBoard({ initialPipeline }: KanbanBoardProps) {
  const [pipeline, setPipeline] = useState<Record<PipelineStage, Opportunity[]>>(initialPipeline);
  const [activeOpportunity, setActiveOpportunity] = useState<Opportunity | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const oppId = event.active.id as string;
    for (const stageStr of [1, 2, 3, 4] as PipelineStage[]) {
      const found = pipeline[stageStr]?.find((o) => o.id === oppId);
      if (found) {
        setActiveOpportunity(found);
        break;
      }
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveOpportunity(null);

    if (!over) return;

    const activeId = active.id as string;
    let targetStage: PipelineStage | null = null;

    // Check if dropped directly on a column
    if (typeof over.id === 'string' && over.id.startsWith('column-')) {
      targetStage = parseInt(over.id.replace('column-', ''), 10) as PipelineStage;
    } else {
      // Dropped on another card -> find target card's stage
      for (const stageStr of [1, 2, 3, 4] as PipelineStage[]) {
        if (pipeline[stageStr]?.some((o) => o.id === over.id)) {
          targetStage = stageStr;
          break;
        }
      }
    }

    if (!targetStage) return;

    // Find current stage of active card
    let currentStage: PipelineStage | null = null;
    let oppToMove: Opportunity | null = null;

    for (const stageStr of [1, 2, 3, 4] as PipelineStage[]) {
      const found = pipeline[stageStr]?.find((o) => o.id === activeId);
      if (found) {
        currentStage = stageStr;
        oppToMove = found;
        break;
      }
    }

    if (!currentStage || !oppToMove || currentStage === targetStage) return;

    // Optimistic UI update
    const updatedOpp = { ...oppToMove, stage: targetStage };

    setPipeline((prev) => {
      const sourceList = prev[currentStage!].filter((o) => o.id !== activeId);
      const destList = [...(prev[targetStage!] || []), updatedOpp];
      return {
        ...prev,
        [currentStage!]: sourceList,
        [targetStage!]: destList,
      };
    });

    try {
      await apiFetch(`/opportunities/${activeId}/stage`, {
        method: 'PATCH',
        body: JSON.stringify({ stage: targetStage }),
      });
      toast.success('Estágio da oportunidade atualizado!');
    } catch {
      toast.error('Erro ao atualizar estágio da oportunidade');
      // Rollback on failure
      setPipeline(initialPipeline);
    }
  };

  const stages: PipelineStage[] = [1, 2, 3, 4];

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-6 overflow-x-auto pb-6 pt-2">
        {stages.map((stage) => (
          <KanbanColumn
            key={stage}
            stage={stage}
            opportunities={pipeline[stage] || []}
          />
        ))}
      </div>

      <DragOverlay>
        {activeOpportunity ? <KanbanCard opportunity={activeOpportunity} /> : null}
      </DragOverlay>
    </DndContext>
  );
}
