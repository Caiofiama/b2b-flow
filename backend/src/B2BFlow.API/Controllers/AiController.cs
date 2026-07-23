using B2BFlow.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace B2BFlow.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class AiController : ControllerBase
{
    private readonly IAiService _aiService;

    public AiController(IAiService aiService)
    {
        _aiService = aiService;
    }

    [HttpPost("suggest-email")]
    public async Task<IActionResult> SuggestFollowUpEmail([FromBody] SuggestEmailRequest request)
    {
        var resultJson = await _aiService.GenerateFollowUpEmailAsync(
            request.ClientName,
            request.Company,
            request.Notes,
            request.RecentDealTitle
        );

        return Content(resultJson, "application/json");
    }

    [HttpPost("client-summary")]
    public async Task<IActionResult> SummarizeClient([FromBody] SummarizeClientRequest request)
    {
        var resultJson = await _aiService.SummarizeClientHistoryAsync(
            request.ClientName,
            request.HistoryNotes ?? new List<string>()
        );

        return Content(resultJson, "application/json");
    }
}

public record SuggestEmailRequest(string ClientName, string Company, string? Notes, string? RecentDealTitle);
public record SummarizeClientRequest(string ClientName, List<string>? HistoryNotes);
