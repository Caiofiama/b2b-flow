using B2BFlow.Application.Common;
using B2BFlow.Application.DTOs;
using B2BFlow.Domain.Entities;
using B2BFlow.Domain.Enums;
using B2BFlow.Domain.Interfaces;
using FluentValidation;
using MediatR;

namespace B2BFlow.Application.Opportunities;

public record GetOpportunitiesByStageQuery() : IRequest<Result<Dictionary<PipelineStage, List<OpportunityDto>>>>;

public class GetOpportunitiesByStageQueryHandler : IRequestHandler<GetOpportunitiesByStageQuery, Result<Dictionary<PipelineStage, List<OpportunityDto>>>>
{
    private readonly IRepository<Opportunity> _opportunityRepository;
    private readonly IRepository<Client> _clientRepository;
    private readonly IRepository<User> _userRepository;

    public GetOpportunitiesByStageQueryHandler(
        IRepository<Opportunity> opportunityRepository,
        IRepository<Client> clientRepository,
        IRepository<User> userRepository)
    {
        _opportunityRepository = opportunityRepository;
        _clientRepository = clientRepository;
        _userRepository = userRepository;
    }

    public async Task<Result<Dictionary<PipelineStage, List<OpportunityDto>>>> Handle(GetOpportunitiesByStageQuery request, CancellationToken ct)
    {
        var opps = (await _opportunityRepository.GetAllAsync(ct)).ToList();
        var clients = (await _clientRepository.GetAllAsync(ct)).ToDictionary(c => c.Id, c => c.Name);
        var users = (await _userRepository.GetAllAsync(ct)).ToDictionary(u => u.Id, u => u.Name);

        // If repository has no entries yet, return seed opportunities across all 4 pipeline stages
        if (!opps.Any())
        {
            var seedData = new Dictionary<PipelineStage, List<OpportunityDto>>
            {
                [PipelineStage.Prospecting] = new()
                {
                    new(Guid.NewGuid(), "Módulo de Automação B2B", 8500000, PipelineStage.Prospecting, Guid.NewGuid(), "Nexus Telecom", Guid.NewGuid(), "Fernanda Rocha", DateTime.UtcNow.AddDays(-2)),
                    new(Guid.NewGuid(), "Expansão de Licenças SaaS", 5200000, PipelineStage.Prospecting, Guid.NewGuid(), "CyberSec Brasil", Guid.NewGuid(), "Eduardo Silva", DateTime.UtcNow.AddDays(-1))
                },
                [PipelineStage.Proposal] = new()
                {
                    new(Guid.NewGuid(), "Consultoria de IA & Analytics", 28000000, PipelineStage.Proposal, Guid.NewGuid(), "Global Logistics", Guid.NewGuid(), "Mariana Lima", DateTime.UtcNow.AddDays(-4)),
                    new(Guid.NewGuid(), "Integração ERP Customizada", 19500000, PipelineStage.Proposal, Guid.NewGuid(), "Fintech Prime", Guid.NewGuid(), "Felipe Costa", DateTime.UtcNow.AddDays(-3))
                },
                [PipelineStage.Negotiation] = new()
                {
                    new(Guid.NewGuid(), "Plataforma CRM Enterprise", 15000000, PipelineStage.Negotiation, Guid.NewGuid(), "TechSolutions Ltda", Guid.NewGuid(), "Carlos Mendes", DateTime.UtcNow.AddDays(-6)),
                    new(Guid.NewGuid(), "Suporte 24/7 SLA Avançado", 6800000, PipelineStage.Negotiation, Guid.NewGuid(), "Banco Alfa B2B", Guid.NewGuid(), "Juliana Paes", DateTime.UtcNow.AddDays(-5))
                },
                [PipelineStage.Closed] = new()
                {
                    new(Guid.NewGuid(), "Licenciamento Anual SaaS", 4500000, PipelineStage.Closed, Guid.NewGuid(), "Inovação Digital", Guid.NewGuid(), "Ana Souza", DateTime.UtcNow.AddDays(-8)),
                    new(Guid.NewGuid(), "Migração de Infraestrutura AWS", 12000000, PipelineStage.Closed, Guid.NewGuid(), "Grupo Varejo Mais", Guid.NewGuid(), "Roberto Alves", DateTime.UtcNow.AddDays(-12))
                }
            };

            return Result<Dictionary<PipelineStage, List<OpportunityDto>>>.Success(seedData);
        }

        var result = new Dictionary<PipelineStage, List<OpportunityDto>>
        {
            [PipelineStage.Prospecting] = new(),
            [PipelineStage.Proposal] = new(),
            [PipelineStage.Negotiation] = new(),
            [PipelineStage.Closed] = new()
        };

        foreach (var o in opps)
        {
            var dto = new OpportunityDto(
                o.Id,
                o.Title,
                o.ValueInCents,
                o.Stage,
                o.ClientId,
                clients.GetValueOrDefault(o.ClientId, "Cliente"),
                o.AssignedToUserId,
                users.GetValueOrDefault(o.AssignedToUserId, "Usuário"),
                o.CreatedAt
            );

            if (result.ContainsKey(o.Stage))
            {
                result[o.Stage].Add(dto);
            }
        }

        return Result<Dictionary<PipelineStage, List<OpportunityDto>>>.Success(result);
    }
}

public record CreateOpportunityCommand(string Title, long ValueInCents, PipelineStage Stage, Guid ClientId, Guid AssignedToUserId) : IRequest<Result<OpportunityDto>>;

public class CreateOpportunityCommandHandler : IRequestHandler<CreateOpportunityCommand, Result<OpportunityDto>>
{
    private readonly IRepository<Opportunity> _opportunityRepository;
    private readonly IRepository<Client> _clientRepository;
    private readonly IUnitOfWork _unitOfWork;

    public CreateOpportunityCommandHandler(IRepository<Opportunity> opportunityRepository, IRepository<Client> clientRepository, IUnitOfWork unitOfWork)
    {
        _opportunityRepository = opportunityRepository;
        _clientRepository = clientRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<Result<OpportunityDto>> Handle(CreateOpportunityCommand request, CancellationToken ct)
    {
        var client = await _clientRepository.GetByIdAsync(request.ClientId, ct);

        var opp = new Opportunity
        {
            Id = Guid.NewGuid(),
            Title = request.Title,
            ValueInCents = request.ValueInCents,
            Stage = request.Stage,
            ClientId = request.ClientId,
            AssignedToUserId = request.AssignedToUserId,
            CreatedAt = DateTime.UtcNow
        };

        await _opportunityRepository.AddAsync(opp, ct);
        await _unitOfWork.SaveChangesAsync(ct);

        var dto = new OpportunityDto(
            opp.Id, opp.Title, opp.ValueInCents, opp.Stage, opp.ClientId, client?.Name ?? "Cliente", opp.AssignedToUserId, null, opp.CreatedAt
        );
        return Result<OpportunityDto>.Success(dto);
    }
}

public record UpdateOpportunityStageCommand(Guid Id, PipelineStage NewStage) : IRequest<Result<bool>>;

public class UpdateOpportunityStageCommandHandler : IRequestHandler<UpdateOpportunityStageCommand, Result<bool>>
{
    private readonly IRepository<Opportunity> _opportunityRepository;
    private readonly IUnitOfWork _unitOfWork;

    public UpdateOpportunityStageCommandHandler(IRepository<Opportunity> opportunityRepository, IUnitOfWork unitOfWork)
    {
        _opportunityRepository = opportunityRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<Result<bool>> Handle(UpdateOpportunityStageCommand request, CancellationToken ct)
    {
        var opp = await _opportunityRepository.GetByIdAsync(request.Id, ct);
        if (opp == null) return Result<bool>.NotFound("Oportunidade não encontrada");

        opp.Stage = request.NewStage;
        opp.UpdatedAt = DateTime.UtcNow;

        _opportunityRepository.Update(opp);
        await _unitOfWork.SaveChangesAsync(ct);

        return Result<bool>.Success(true);
    }
}

public record DeleteOpportunityCommand(Guid Id) : IRequest<Result<bool>>;

public class DeleteOpportunityCommandHandler : IRequestHandler<DeleteOpportunityCommand, Result<bool>>
{
    private readonly IRepository<Opportunity> _opportunityRepository;
    private readonly IUnitOfWork _unitOfWork;

    public DeleteOpportunityCommandHandler(IRepository<Opportunity> opportunityRepository, IUnitOfWork unitOfWork)
    {
        _opportunityRepository = opportunityRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<Result<bool>> Handle(DeleteOpportunityCommand request, CancellationToken ct)
    {
        var opp = await _opportunityRepository.GetByIdAsync(request.Id, ct);
        if (opp == null) return Result<bool>.NotFound("Oportunidade não encontrada");

        _opportunityRepository.Delete(opp);
        await _unitOfWork.SaveChangesAsync(ct);

        return Result<bool>.Success(true);
    }
}
