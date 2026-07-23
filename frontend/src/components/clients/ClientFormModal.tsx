'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Client } from '@/types';
import { apiFetch } from '@/lib/api';
import { toast } from 'sonner';
import { X } from 'lucide-react';

const clientSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('E-mail inválido'),
  phone: z.string().min(8, 'Telefone inválido'),
  company: z.string().min(2, 'Empresa deve ter pelo menos 2 caracteres'),
  notes: z.string().optional(),
});

type ClientFormData = z.infer<typeof clientSchema>;

interface ClientFormModalProps {
  client?: Client | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function ClientFormModal({ client, isOpen, onClose, onSuccess }: ClientFormModalProps) {
  const isEditing = !!client;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      name: client?.name || '',
      email: client?.email || '',
      phone: client?.phone || '',
      company: client?.company || '',
      notes: client?.notes || '',
    },
  });

  if (!isOpen) return null;

  const onSubmit = async (data: ClientFormData) => {
    try {
      if (isEditing) {
        await apiFetch(`/clients/${client.id}`, {
          method: 'PUT',
          body: JSON.stringify(data),
        });
        toast.success('Cliente atualizado com sucesso!');
      } else {
        await apiFetch('/clients', {
          method: 'POST',
          body: JSON.stringify(data),
        });
        toast.success('Cliente cadastrado com sucesso!');
      }
      reset();
      onSuccess();
      onClose();
    } catch (error: unknown) {
      toast.error((error as Error).message || 'Erro ao salvar cliente');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-950 p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-lg font-bold text-white">
            {isEditing ? 'Editar Cliente' : 'Novo Cliente'}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div>
            <label className="text-xs font-semibold text-slate-300">Nome Completo</label>
            <Input {...register('name')} placeholder="Ex: Ana Silva" className="mt-1" />
            {errors.name && <span className="text-xs text-red-400">{errors.name.message}</span>}
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300">E-mail Corporativo</label>
            <Input {...register('email')} placeholder="ana@empresa.com" className="mt-1" />
            {errors.email && <span className="text-xs text-red-400">{errors.email.message}</span>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-300">Empresa</label>
              <Input {...register('company')} placeholder="Tech Corp" className="mt-1" />
              {errors.company && <span className="text-xs text-red-400">{errors.company.message}</span>}
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300">Telefone</label>
              <Input {...register('phone')} placeholder="(11) 99999-9999" className="mt-1" />
              {errors.phone && <span className="text-xs text-red-400">{errors.phone.message}</span>}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300">Observações</label>
            <textarea
              {...register('notes')}
              rows={3}
              placeholder="Notas de contexto..."
              className="mt-1 flex w-full rounded-md border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Salvando...' : 'Salvar Cliente'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
