'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';
import { Client, PagedResponse } from '@/types';
import { ClientTable } from '@/components/clients/ClientTable';
import { ClientDrawer } from '@/components/clients/ClientDrawer';
import { ClientFormModal } from '@/components/clients/ClientFormModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, ChevronLeft, ChevronRight, Users } from 'lucide-react';

export default function ClientsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, isLoading, refetch } = useQuery<PagedResponse<Client>>({
    queryKey: ['clients', page, search],
    queryFn: () => apiFetch<PagedResponse<Client>>(`/clients?page=${page}&pageSize=10&search=${encodeURIComponent(search)}`),
  });

  const handleCreateNew = () => {
    setEditingClient(null);
    setIsModalOpen(true);
  };

  const handleEdit = (client: Client) => {
    setEditingClient(client);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Users className="h-6 w-6 text-blue-400" />
            <span>Gestão de Clientes</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Cadastre, edite e gerencie o histórico de relacionamento de cada cliente.
          </p>
        </div>

        <Button onClick={handleCreateNew} className="gap-2">
          <Plus className="h-4 w-4" />
          <span>Novo Cliente</span>
        </Button>
      </div>

      {/* Search & Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
          <Input
            placeholder="Buscar por nome, e-mail ou empresa..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="pl-9 bg-slate-900/80 border-slate-800"
          />
        </div>
      </div>

      {/* Table Content */}
      {isLoading ? (
        <div className="h-64 flex items-center justify-center rounded-2xl border border-slate-800 bg-slate-900/40">
          <div className="text-xs text-slate-400 animate-pulse">Carregando clientes...</div>
        </div>
      ) : (
        <>
          <ClientTable
            clients={data?.items || []}
            onSelectClient={setSelectedClient}
            onEditClient={handleEdit}
            onRefresh={refetch}
          />

          {/* Pagination Controls */}
          {data && data.totalPages > 1 && (
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-400">
                Página <strong className="text-slate-200">{data.page}</strong> de{' '}
                <strong className="text-slate-200">{data.totalPages}</strong> ({data.totalCount} clientes)
              </span>

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span>Anterior</span>
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={page >= data.totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  <span>Próxima</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Detail Drawer with AI email suggestion */}
      <ClientDrawer client={selectedClient} onClose={() => setSelectedClient(null)} />

      {/* CRUD Form Modal */}
      <ClientFormModal
        isOpen={isModalOpen}
        client={editingClient}
        onClose={() => setIsModalOpen(false)}
        onSuccess={refetch}
      />
    </div>
  );
}
