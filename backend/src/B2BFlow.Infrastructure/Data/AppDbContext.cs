using B2BFlow.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace B2BFlow.Infrastructure.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<User> Users => Set<User>();
    public DbSet<Client> Clients => Set<Client>();
    public DbSet<Opportunity> Opportunities => Set<Opportunity>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<User>(builder =>
        {
            builder.HasKey(u => u.Id);
            builder.Property(u => u.Name).IsRequired().HasMaxLength(150);
            builder.Property(u => u.Email).IsRequired().HasMaxLength(150);
            builder.HasIndex(u => u.Email).IsUnique();
        });

        modelBuilder.Entity<Client>(builder =>
        {
            builder.HasKey(c => c.Id);
            builder.Property(c => c.Name).IsRequired().HasMaxLength(150);
            builder.Property(c => c.Email).IsRequired().HasMaxLength(150);
            builder.Property(c => c.Company).IsRequired().HasMaxLength(150);

            builder.HasOne(c => c.CreatedByUser)
                .WithMany(u => u.Clients)
                .HasForeignKey(c => c.CreatedByUserId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<Opportunity>(builder =>
        {
            builder.HasKey(o => o.Id);
            builder.Property(o => o.Title).IsRequired().HasMaxLength(200);
            builder.Property(o => o.ValueInCents).IsRequired();

            builder.HasOne(o => o.Client)
                .WithMany(c => c.Opportunities)
                .HasForeignKey(o => o.ClientId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(o => o.AssignedToUser)
                .WithMany(u => u.Opportunities)
                .HasForeignKey(o => o.AssignedToUserId)
                .OnDelete(DeleteBehavior.Restrict);
        });
    }
}
