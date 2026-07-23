using System.Security.Claims;
using B2BFlow.Application.Opportunities;
using B2BFlow.Domain.Enums;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace B2BFlow.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class OpportunitiesController : ControllerBase
{
    private readonly IMediator _mediator;

    public OpportunitiesController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet("pipeline")]
    public async Task<IActionResult> GetPipeline()
    {
        var result = await _mediator.Send(new GetOpportunitiesByStageQuery());
        return result.IsSuccess ? Ok(result.Value) : StatusCode(result.StatusCode, new { error = result.Error });
    }

    [HttpPost]
    public async Task<IActionResult> CreateOpportunity([FromBody] CreateOpportunityRequest request)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? User.FindFirst("sub")?.Value;
        Guid.TryParse(userIdClaim, out var userId);

        var command = new CreateOpportunityCommand(request.Title, request.ValueInCents, request.Stage, request.ClientId, userId);
        var result = await _mediator.Send(command);

        return result.IsSuccess ? Ok(result.Value) : StatusCode(result.StatusCode, new { error = result.Error });
    }

    [HttpPatch("{id:guid}/stage")]
    public async Task<IActionResult> UpdateStage(Guid id, [FromBody] UpdateStageRequest request)
    {
        var result = await _mediator.Send(new UpdateOpportunityStageCommand(id, request.Stage));
        return result.IsSuccess ? Ok(new { message = "Estágio atualizado com sucesso" }) : StatusCode(result.StatusCode, new { error = result.Error });
    }

    [HttpDelete("{id:guid}")]
    [Authorize(Roles = "Admin,Manager")]
    public async Task<IActionResult> DeleteOpportunity(Guid id)
    {
        var result = await _mediator.Send(new DeleteOpportunityCommand(id));
        return result.IsSuccess ? NoContent() : StatusCode(result.StatusCode, new { error = result.Error });
    }
}

public record CreateOpportunityRequest(string Title, long ValueInCents, PipelineStage Stage, Guid ClientId);
public record UpdateStageRequest(PipelineStage Stage);
