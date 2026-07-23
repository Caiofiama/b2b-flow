'use client';

import { useState } from 'react';
import { Client, AiSuggestedEmail } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { apiFetch } from '@/lib/api';
import { toast } from 'sonner';
import { Sparkles, Mail, Phone, Building2, Copy, Check, X } from 'lucide-react';

interface ClientDrawerProps {
  client: Client | null;
  onClose: () => void;
}

export function ClientDrawer({ client, onClose }: ClientDrawerProps) {
  const [loadingAi, setLoadingAi] = useState(false);
  const [suggestedEmail, setSuggestedEmail] = useState<AiSuggestedEmail | null>(null);
  const [copied, setCopied] = useState(false);

  if (!client) return null;

  const handleGenerateEmail = async () => {
    setLoadingAi(true);
    try {
      const data = await apiFetch<AiSuggestedEmail>('/ai/suggest-email', {
        method: 'POST',
        body: JSON.stringify({
          clientName: client.name,
          company: client.company,
          notes: client.notes,
          recentDealTitle: 'Projeto SaaS B2B CRM',
        }),
      });
      setSuggestedEmail(data);
      toast.success('Rascunho de e-mail gerado com sucesso!');
    } catch {
      toast.error('Erro ao gerar rascunho de e-mail com IA');
    } finally {
      setLoadingAi(false);
    }
  };

  const handleCopyEmail = () => {
    if (!suggestedEmail) return;
    const textToCopy = `Assunto: ${suggestedEmail.subject}\n\n${suggestedEmail.body}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    toast.success('Copiado para a área de transferência!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative flex h-full w-full max-w-lg flex-col border-l border-slate-800 bg-slate-950 p-6 shadow-2xl overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600/20 text-blue-400 font-bold text-lg border border-blue-500/30">
              {client.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{client.name}</h2>
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <Building2 className="h-3.5 w-3.5 text-slate-500" />
                <span>{client.company}</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-900 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Info Grid */}
        <div className="mt-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-3">
              <span className="text-[11px] text-slate-500 uppercase font-semibold">Contato</span>
              <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-200 truncate">
                <Mail className="h-3.5 w-3.5 text-slate-400" />
                <span>{client.email}</span>
              </div>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-3">
              <span className="text-[11px] text-slate-500 uppercase font-semibold">Telefone</span>
              <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-200">
                <Phone className="h-3.5 w-3.5 text-slate-400" />
                <span>{client.phone}</span>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4 space-y-1">
            <span className="text-[11px] text-slate-500 uppercase font-semibold">Observações</span>
            <p className="text-xs text-slate-300 leading-relaxed">
              {client.notes || 'Nenhuma observação cadastrada.'}
            </p>
          </div>

          {/* AI Follow-up Email Action */}
          <div className="pt-2">
            <Button
              onClick={handleGenerateEmail}
              disabled={loadingAi}
              className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-500/20 py-3 gap-2"
            >
              <Sparkles className={`h-4 w-4 ${loadingAi ? 'animate-spin' : ''}`} />
              <span>{loadingAi ? 'Sugerindo com IA...' : 'Sugerir E-mail de Follow-up'}</span>
            </Button>
          </div>

          {/* AI Result Card */}
          {suggestedEmail && (
            <Card className="border-indigo-500/30 bg-gradient-to-b from-indigo-950/30 to-slate-900/90 shadow-2xl animate-in slide-in-from-bottom-4 duration-300">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-indigo-400" />
                    <CardTitle className="text-sm font-semibold text-indigo-200">
                      Rascunho de E-mail Sugerido
                    </CardTitle>
                  </div>
                  <Badge variant="default">{suggestedEmail.tone}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 pt-2">
                <div>
                  <span className="text-[10px] uppercase font-semibold text-slate-500">Assunto</span>
                  <p className="text-xs font-semibold text-slate-200">{suggestedEmail.subject}</p>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-semibold text-slate-500">Corpo</span>
                  <div className="mt-1 rounded-lg bg-slate-950 p-3 text-xs text-slate-300 leading-relaxed whitespace-pre-line border border-slate-800">
                    {suggestedEmail.body}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-[11px] text-slate-400">
                    Sugerido: <strong className="text-slate-200">{suggestedEmail.suggestedSendingTime}</strong>
                  </span>
                  <Button size="sm" variant="outline" onClick={handleCopyEmail} className="gap-1.5 text-xs">
                    {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>{copied ? 'Copiado!' : 'Copiar Texto'}</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
