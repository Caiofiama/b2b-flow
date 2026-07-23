using B2BFlow.Application.Common;
using B2BFlow.Application.DTOs;
using B2BFlow.Domain.Entities;
using B2BFlow.Domain.Interfaces;
using MediatR;

namespace B2BFlow.Application.Clients.Queries;

public record GetClientByIdQuery(Guid Id) : IRequest<Result<ClientDto>>;

public class GetClientByIdQueryHandler : IRequestHandler<GetClientByIdQuery, Result<ClientDto>>
{
    private readonly IRepository<Client> _clientRepository;
    private readonly IRepository<Opportunity> _opportunityRepository;

    public GetClientByIdQueryHandler(IRepository<Client> clientRepository, IRepository<Opportunity> opportunityRepository)
    {
        _clientRepository = clientRepository;
        _opportunityRepository = opportunityRepository;
    }

    public async Task<Result<ClientDto>> Handle(GetClientByIdQuery request, CancellationToken ct)
    {
        var client = await _clientRepository.GetByIdAsync(request.Id, ct);
        if (client == null) return Result<ClientDto>.NotFound("Cliente não encontrado");

        var opps = await _opportunityRepository.FindAsync(o => o.ClientId == client.Id, ct);

        var dto = new ClientDto(
            client.Id,
            client.Name,
            client.Email,
            client.Phone,
            client.Company,
            client.Notes,
            client.CreatedByUserId,
            client.CreatedAt,
            opps.Count(),
            opps.Sum(o => o.ValueInCents)
        );

        return Result<ClientDto>.Success(dto);
    }
}
