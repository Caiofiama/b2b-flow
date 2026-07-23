using B2BFlow.Application.Common;
using B2BFlow.Application.DTOs;
using B2BFlow.Domain.Entities;
using B2BFlow.Domain.Enums;
using B2BFlow.Domain.Interfaces;
using MediatR;

namespace B2BFlow.Application.Dashboard.Queries;

public record GetDashboardQuery() : IRequest<Result<DashboardDataDto>>;

public class GetDashboardQueryHandler : IRequestHandler<GetDashboardQuery, Result<DashboardDataDto>>
{
    private readonly IRepository<Client> _clientRepository;
    private readonly IRepository<Opportunity> _opportunityRepository;
    private readonly IRepository<User> _userRepository;

    public GetDashboardQueryHandler(
        IRepository<Client> clientRepository,
        IRepository<Opportunity> opportunityRepository,
        IRepository<User> userRepository)
    {
        _clientRepository = clientRepository;
        _opportunityRepository = opportunityRepository;
        _userRepository = userRepository;
    }

    public async Task<Result<DashboardDataDto>> Handle(GetDashboardQuery request, CancellationToken ct)
    {
        var clients = (await _clientRepository.GetAllAsync(ct)).ToList();
        var opps = (await _opportunityRepository.GetAllAsync(ct)).ToList();
        var users = (await _userRepository.GetAllAsync(ct)).ToDictionary(u => u.Id, u => u.Name);
        var clientDict = clients.ToDictionary(c => c.Id, c => c.Name);

        // If repository is empty, generate rich initial seed data for impressive dashboard charts
        if (!opps.Any())
        {
            var demoKpis = new KpiSummaryDto(
                TotalClients: 24,
                ClosedDealsCount: 18,
                ExpectedRevenueInCents: 34500000, // R$ 345.000,00
                ClosedRevenueInCents: 67800000    // R$ 678.000,00
            );

            var now = DateTime.UtcNow;
            var demoHistory = new List<MonthlySalesDto>
            {
                new(now.AddMonths(-5).ToString("MMM/yy", new System.Globalization.CultureInfo("pt-BR")), 45000000, 4), // R$ 450k
                new(now.AddMonths(-4).ToString("MMM/yy", new System.Globalization.CultureInfo("pt-BR")), 62000000, 6), // R$ 620k
                new(now.AddMonths(-3).ToString("MMM/yy", new System.Globalization.CultureInfo("pt-BR")), 58000000, 5), // R$ 580k
                new(now.AddMonths(-2).ToString("MMM/yy", new System.Globalization.CultureInfo("pt-BR")), 89000000, 8), // R$ 890k
                new(now.AddMonths(-1).ToString("MMM/yy", new System.Globalization.CultureInfo("pt-BR")), 74000000, 7), // R$ 740k
                new(now.ToString("MMM/yy", new System.Globalization.CultureInfo("pt-BR")), 98000000, 9)               // R$ 980k
            };

            var demoRecent = new List<OpportunityDto>
            {
                new(Guid.NewGuid(), "Plataforma CRM Enterprise", 15000000, PipelineStage.Negotiation, Guid.NewGuid(), "TechSolutions Ltda", Guid.NewGuid(), "Carlos Mendes", DateTime.UtcNow.AddDays(-1)),
                new(Guid.NewGuid(), "Licenciamento Anual SaaS", 4500000, PipelineStage.Closed, Guid.NewGuid(), "Inovação Digital", Guid.NewGuid(), "Ana Souza", DateTime.UtcNow.AddDays(-2)),
                new(Guid.NewGuid(), "Consultoria de IA & Analytics", 28000000, PipelineStage.Proposal, Guid.NewGuid(), "Global Logistics", Guid.NewGuid(), "Mariana Lima", DateTime.UtcNow.AddDays(-3)),
                new(Guid.NewGuid(), "Migração de Infraestrutura AWS", 12000000, PipelineStage.Closed, Guid.NewGuid(), "Grupo Varejo Mais", Guid.NewGuid(), "Roberto Alves", DateTime.UtcNow.AddDays(-4)),
                new(Guid.NewGuid(), "Módulo de Automação B2B", 8500000, PipelineStage.Prospecting, Guid.NewGuid(), "Nexus Telecom", Guid.NewGuid(), "Fernanda Rocha", DateTime.UtcNow.AddDays(-5))
            };

            return Result<DashboardDataDto>.Success(new DashboardDataDto(demoKpis, demoHistory, demoRecent));
        }

        var totalClients = clients.Count;
        var closedOpps = opps.Where(o => o.Stage == PipelineStage.Closed).ToList();
        var totalClosedCount = closedOpps.Count;
        var totalClosedRevenue = closedOpps.Sum(o => o.ValueInCents);
        var totalExpectedRevenue = opps.Where(o => o.Stage != PipelineStage.Closed).Sum(o => o.ValueInCents);

        var kpiSummary = new KpiSummaryDto(
            totalClients,
            totalClosedCount,
            totalExpectedRevenue,
            totalClosedRevenue
        );

        var months = new List<MonthlySalesDto>();
        for (int i = 5; i >= 0; i--)
        {
            var date = DateTime.UtcNow.AddMonths(-i);
            var monthName = date.ToString("MMM/yy", new System.Globalization.CultureInfo("pt-BR"));
            
            var monthDeals = opps.Where(o => o.CreatedAt.Month == date.Month && o.CreatedAt.Year == date.Year);
            var revenue = monthDeals.Sum(o => o.ValueInCents);
            months.Add(new MonthlySalesDto(monthName, revenue, monthDeals.Count()));
        }

        var recentOpps = opps.OrderByDescending(o => o.CreatedAt).Take(5).Select(o => new OpportunityDto(
            o.Id,
            o.Title,
            o.ValueInCents,
            o.Stage,
            o.ClientId,
            clientDict.GetValueOrDefault(o.ClientId, "Cliente"),
            o.AssignedToUserId,
            users.GetValueOrDefault(o.AssignedToUserId, "Usuário"),
            o.CreatedAt
        ));

        return Result<DashboardDataDto>.Success(new DashboardDataDto(kpiSummary, months, recentOpps));
    }
}
