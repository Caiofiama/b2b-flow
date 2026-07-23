using System.Security.Claims;
using B2BFlow.Application.Clients.Commands;
using B2BFlow.Application.Clients.Queries;
using B2BFlow.Application.DTOs;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace B2BFlow.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ClientsController : ControllerBase
{
    private readonly IMediator _mediator;

    public ClientsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<IActionResult> GetClients([FromQuery] int page = 1, [FromQuery] int pageSize = 10, [FromQuery] string? search = null)
    {
        var result = await _mediator.Send(new GetClientsQuery(page, pageSize, search));
        return result.IsSuccess ? Ok(result.Value) : StatusCode(result.StatusCode, new { error = result.Error });
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetClientById(Guid id)
    {
        var result = await _mediator.Send(new GetClientByIdQuery(id));
        return result.IsSuccess ? Ok(result.Value) : StatusCode(result.StatusCode, new { error = result.Error });
    }

    [HttpPost]
    public async Task<IActionResult> CreateClient([FromBody] CreateClientRequest request)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? User.FindFirst("sub")?.Value;
        Guid.TryParse(userIdClaim, out var userId);

        var command = new CreateClientCommand(request.Name, request.Email, request.Phone, request.Company, request.Notes, userId);
        var result = await _mediator.Send(command);

        return result.IsSuccess ? CreatedAtAction(nameof(GetClientById), new { id = result.Value!.Id }, result.Value) : StatusCode(result.StatusCode, new { error = result.Error });
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> UpdateClient(Guid id, [FromBody] UpdateClientRequest request)
    {
        var command = new UpdateClientCommand(id, request.Name, request.Email, request.Phone, request.Company, request.Notes);
        var result = await _mediator.Send(command);

        return result.IsSuccess ? Ok(result.Value) : StatusCode(result.StatusCode, new { error = result.Error });
    }

    [HttpDelete("{id:guid}")]
    [Authorize(Roles = "Admin,Manager")]
    public async Task<IActionResult> DeleteClient(Guid id)
    {
        var result = await _mediator.Send(new DeleteClientCommand(id));
        return result.IsSuccess ? NoContent() : StatusCode(result.StatusCode, new { error = result.Error });
    }
}

public record CreateClientRequest(string Name, string Email, string Phone, string Company, string? Notes);
public record UpdateClientRequest(string Name, string Email, string Phone, string Company, string? Notes);
