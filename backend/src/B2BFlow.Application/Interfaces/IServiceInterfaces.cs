using B2BFlow.Domain.Entities;

namespace B2BFlow.Application.Interfaces;

public interface ITokenService
{
    string GenerateJwtToken(User user);
}

public interface IAiService
{
    Task<string> GenerateFollowUpEmailAsync(string clientName, string company, string? notes, string? recentDealTitle, CancellationToken ct = default);
    Task<string> SummarizeClientHistoryAsync(string clientName, IEnumerable<string> notesAndDeals, CancellationToken ct = default);
}
