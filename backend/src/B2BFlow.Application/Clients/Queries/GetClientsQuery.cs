using B2BFlow.Application.Common;
using B2BFlow.Application.DTOs;
using B2BFlow.Domain.Entities;
using B2BFlow.Domain.Interfaces;
using MediatR;

namespace B2BFlow.Application.Clients.Queries;

public record GetClientsQuery(int Page = 1, int PageSize = 10, string? Search = null) : IRequest<Result<PagedResult<ClientDto>>>;

public class GetClientsQueryHandler : IRequestHandler<GetClientsQuery, Result<PagedResult<ClientDto>>>
{
    private readonly IRepository<Client> _clientRepository;
    private readonly IRepository<Opportunity> _opportunityRepository;

    public GetClientsQueryHandler(IRepository<Client> clientRepository, IRepository<Opportunity> opportunityRepository)
    {
        _clientRepository = clientRepository;
        _opportunityRepository = opportunityRepository;
    }

    public async Task<Result<PagedResult<ClientDto>>> Handle(GetClientsQuery request, CancellationToken ct)
    {
        var allClients = (await _clientRepository.GetAllAsync(ct)).ToList();
        var allOpportunities = (await _opportunityRepository.GetAllAsync(ct)).ToList();

        if (!allClients.Any())
        {
            var seedClients = new List<ClientDto>
            {
                new(Guid.NewGuid(), "Ana Souza", "ana@techsolutions.com", "(11) 98765-4321", "TechSolutions Ltda", "Cliente enterprise em fase de renovação anual.", Guid.NewGuid(), DateTime.UtcNow.AddDays(-30), 3, 15000000),
                new(Guid.NewGuid(), "Carlos Mendes", "carlos@inovacaodigital.io", "(21) 99887-1122", "Inovação Digital", "Interesse em automação comercial e relatórios com IA.", Guid.NewGuid(), DateTime.UtcNow.AddDays(-20), 2, 4500000),
                new(Guid.NewGuid(), "Mariana Lima", "mariana@globallogistics.com", "(31) 97654-3210", "Global Logistics", "Proposta enviada para consultoria de análise de dados.", Guid.NewGuid(), DateTime.UtcNow.AddDays(-15), 1, 28000000),
                new(Guid.NewGuid(), "Roberto Alves", "roberto@grupovarejo.com.br", "(41) 98112-4455", "Grupo Varejo Mais", "Contrato fechado para migração cloud.", Guid.NewGuid(), DateTime.UtcNow.AddDays(-10), 4, 12000000),
                new(Guid.NewGuid(), "Fernanda Rocha", "fernanda@nexustelecom.com", "(51) 99123-8899", "Nexus Telecom", "Lead qualificado interessado no módulo comercial.", Guid.NewGuid(), DateTime.UtcNow.AddDays(-5), 2, 8500000)
            };

            if (!string.IsNullOrWhiteSpace(request.Search))
            {
                var term = request.Search.Trim().ToLower();
                seedClients = seedClients.Where(c => 
                    c.Name.ToLower().Contains(term) ||
                    c.Email.ToLower().Contains(term) ||
                    c.Company.ToLower().Contains(term) ||
                    c.Phone.Contains(term)
                ).ToList();
            }

            var seedPaged = new PagedResult<ClientDto>(seedClients, request.Page, request.PageSize, seedClients.Count);
            return Result<PagedResult<ClientDto>>.Success(seedPaged);
        }

        IEnumerable<Client> filteredClients = allClients;

        if (!string.IsNullOrWhiteSpace(request.Search))
        {
            var term = request.Search.Trim().ToLower();
            filteredClients = filteredClients.Where(c => 
                c.Name.ToLower().Contains(term) ||
                c.Email.ToLower().Contains(term) ||
                c.Company.ToLower().Contains(term) ||
                c.Phone.Contains(term)
            );
        }

        var totalCount = filteredClients.Count();
        var pagedItems = filteredClients
            .OrderByDescending(c => c.CreatedAt)
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .Select(c =>
            {
                var clientOpps = allOpportunities.Where(o => o.ClientId == c.Id).ToList();
                return new ClientDto(
                    c.Id,
                    c.Name,
                    c.Email,
                    c.Phone,
                    c.Company,
                    c.Notes,
                    c.CreatedByUserId,
                    c.CreatedAt,
                    clientOpps.Count,
                    clientOpps.Sum(o => o.ValueInCents)
                );
            });

        var pagedResult = new PagedResult<ClientDto>(pagedItems, request.Page, request.PageSize, totalCount);
        return Result<PagedResult<ClientDto>>.Success(pagedResult);
    }
}
