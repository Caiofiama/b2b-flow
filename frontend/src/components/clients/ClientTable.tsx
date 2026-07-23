'use client';

import { useState } from 'react';
import { Client } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Eye, Edit, Trash2, Building2, Mail, Phone } from 'lucide-react';
import { apiFetch } from '@/lib/api';
import { toast } from 'sonner';

interface ClientTableProps {
  clients: Client[];
  onSelectClient: (client: Client) => void;
  onEditClient: (client: Client) => void;
  onRefresh: () => void;
}

export function ClientTable({ clients, onSelectClient, onEditClient, onRefresh }: ClientTableProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este cliente?')) return;
    setDeletingId(id);
    try {
      await apiFetch(`/clients/${id}`, { method: 'DELETE' });
      toast.success('Cliente excluído com sucesso');
      onRefresh();
    } catch (error: unknown) {
      toast.error((error as Error).message || 'Erro ao excluir cliente');
    } finally {
      setDeletingId(null);
    }
  };

  if (clients.length === 0) {
    return (
      <div className="flex h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-800 bg-slate-900/30 text-center">
        <Building2 className="h-10 w-10 text-slate-600 mb-2" />
        <p className="text-sm font-semibold text-slate-300">Nenhum cliente encontrado</p>
        <p className="text-xs text-slate-500 mt-1">Cadastre seu primeiro cliente para começar.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-md shadow-xl">
      <table className="w-full text-left text-sm text-slate-200">
        <thead className="border-b border-slate-800 bg-slate-950/80 text-xs uppercase text-slate-400">
          <tr>
            <th className="px-6 py-4">Cliente / Empresa</th>
            <th className="px-6 py-4">Contatos</th>
            <th className="px-6 py-4">Oportunidades</th>
            <th className="px-6 py-4">Valor Total</th>
            <th className="px-6 py-4">Data Cadastro</th>
            <th className="px-6 py-4 text-right">Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/80">
          {clients.map((client) => (
            <tr
              key={client.id}
              className="hover:bg-slate-800/40 transition-colors group cursor-pointer"
              onClick={() => onSelectClient(client)}
            >
              <td className="px-6 py-4 font-medium text-white">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600/20 text-blue-400 font-bold text-sm border border-blue-500/30">
                    {client.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-slate-100 group-hover:text-blue-400 transition-colors">
                      {client.name}
                    </div>
                    <div className="text-xs text-slate-400">{client.company}</div>
                  </div>
                </div>
              </td>

              <td className="px-6 py-4 text-xs">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <Mail className="h-3.5 w-3.5 text-slate-500" />
                    <span>{client.email}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <Phone className="h-3.5 w-3.5 text-slate-500" />
                    <span>{client.phone}</span>
                  </div>
                </div>
              </td>

              <td className="px-6 py-4">
                <Badge variant={client.totalOpportunities > 0 ? 'default' : 'secondary'}>
                  {client.totalOpportunities} {client.totalOpportunities === 1 ? 'negócio' : 'negócios'}
                </Badge>
              </td>

              <td className="px-6 py-4 font-semibold text-emerald-400">
                {formatCurrency(client.totalValueInCents)}
              </td>

              <td className="px-6 py-4 text-xs text-slate-400">
                {formatDate(client.createdAt)}
              </td>

              <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-end gap-1">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => onSelectClient(client)}
                    title="Ver detalhes e IA"
                  >
                    <Eye className="h-4 w-4 text-blue-400" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => onEditClient(client)}
                    title="Editar"
                  >
                    <Edit className="h-4 w-4 text-slate-400 hover:text-white" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleDelete(client.id)}
                    disabled={deletingId === client.id}
                    title="Excluir"
                  >
                    <Trash2 className="h-4 w-4 text-red-400 hover:text-red-300" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
