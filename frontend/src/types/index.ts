export type UserRole = 'Admin' | 'Manager' | 'Operator';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export type PipelineStage = 1 | 2 | 3 | 4; // 1: Prospecting, 2: Proposal, 3: Negotiation, 4: Closed

export const PipelineStageNames: Record<PipelineStage, string> = {
  1: 'Prospecção',
  2: 'Proposta',
  3: 'Negociação',
  4: 'Fechado'
};

export const PipelineStageColors: Record<PipelineStage, string> = {
  1: 'border-blue-500/50 bg-blue-500/10 text-blue-400',
  2: 'border-purple-500/50 bg-purple-500/10 text-purple-400',
  3: 'border-amber-500/50 bg-amber-500/10 text-amber-400',
  4: 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400'
};

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  notes?: string;
  createdByUserId: string;
  createdAt: string;
  totalOpportunities: number;
  totalValueInCents: number;
}

export interface Opportunity {
  id: string;
  title: string;
  valueInCents: number;
  stage: PipelineStage;
  clientId: string;
  clientName?: string;
  assignedToUserId: string;
  assignedToUserName?: string;
  createdAt: string;
}

export interface PagedResponse<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export interface KpiSummary {
  totalClients: number;
  closedDealsCount: number;
  expectedRevenueInCents: number;
  closedRevenueInCents: number;
}

export interface MonthlySales {
  month: string;
  revenueInCents: number;
  dealsCount: number;
}

export interface DashboardData {
  kpis: KpiSummary;
  salesHistory: MonthlySales[];
  recentOpportunities: Opportunity[];
}

export interface AiSuggestedEmail {
  subject: string;
  body: string;
  callToAction: string;
  tone: string;
  suggestedSendingTime: string;
}
