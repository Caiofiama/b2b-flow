using B2BFlow.Domain.Enums;

namespace B2BFlow.Application.DTOs;

public record ClientDto(
    Guid Id,
    string Name,
    string Email,
    string Phone,
    string Company,
    string? Notes,
    Guid CreatedByUserId,
    DateTime CreatedAt,
    int TotalOpportunities = 0,
    long TotalValueInCents = 0
);

public record OpportunityDto(
    Guid Id,
    string Title,
    long ValueInCents,
    PipelineStage Stage,
    Guid ClientId,
    string? ClientName,
    Guid AssignedToUserId,
    string? AssignedToUserName,
    DateTime CreatedAt
);
