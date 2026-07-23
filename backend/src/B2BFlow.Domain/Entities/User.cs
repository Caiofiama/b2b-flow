using B2BFlow.Domain.Enums;

namespace B2BFlow.Domain.Entities;

public class User : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public UserRole Role { get; set; } = UserRole.Operator;

    public ICollection<Client> Clients { get; set; } = new List<Client>();
    public ICollection<Opportunity> Opportunities { get; set; } = new List<Opportunity>();
}
