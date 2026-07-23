using B2BFlow.Domain.Enums;

namespace B2BFlow.Domain.Entities;

public class Opportunity : BaseEntity
{
    public string Title { get; set; } = string.Empty;
    
    /// <summary>
    /// Value stored strictly in cents (e.g., 150000 = R$ 1.500,00)
    /// </summary>
    public long ValueInCents { get; set; }
    
    public PipelineStage Stage { get; set; } = PipelineStage.Prospecting;

    public Guid ClientId { get; set; }
    public Client? Client { get; set; }

    public Guid AssignedToUserId { get; set; }
    public User? AssignedToUser { get; set; }
}
