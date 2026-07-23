namespace B2BFlow.Application.DTOs;

public record KpiSummaryDto(
    int TotalClients,
    int ClosedDealsCount,
    long ExpectedRevenueInCents,
    long ClosedRevenueInCents
);

public record MonthlySalesDto(
    string Month,
    long RevenueInCents,
    int DealsCount
);

public record DashboardDataDto(
    KpiSummaryDto Kpis,
    IEnumerable<MonthlySalesDto> SalesHistory,
    IEnumerable<OpportunityDto> RecentOpportunities
);
