using System.Collections.Concurrent;
using System.Linq.Expressions;
using B2BFlow.Domain.Entities;
using B2BFlow.Domain.Interfaces;
using B2BFlow.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace B2BFlow.Infrastructure.Repositories;

public class Repository<T> : IRepository<T> where T : BaseEntity
{
    private readonly AppDbContext? _dbContext;
    private static readonly ConcurrentDictionary<Guid, T> InMemoryStore = new();

    public Repository(AppDbContext? dbContext = null)
    {
        _dbContext = dbContext;
    }

    public async Task<T?> GetByIdAsync(Guid id, CancellationToken ct = default)
    {
        if (_dbContext != null && _dbContext.Database.CanConnect())
        {
            return await _dbContext.Set<T>().FindAsync(new object[] { id }, ct);
        }

        InMemoryStore.TryGetValue(id, out var entity);
        return entity;
    }

    public async Task<IEnumerable<T>> GetAllAsync(CancellationToken ct = default)
    {
        if (_dbContext != null && _dbContext.Database.CanConnect())
        {
            return await _dbContext.Set<T>().AsNoTracking().ToListAsync(ct);
        }

        return InMemoryStore.Values.ToList();
    }

    public async Task<IEnumerable<T>> FindAsync(Expression<Func<T, bool>> predicate, CancellationToken ct = default)
    {
        if (_dbContext != null && _dbContext.Database.CanConnect())
        {
            return await _dbContext.Set<T>().AsNoTracking().Where(predicate).ToListAsync(ct);
        }

        return InMemoryStore.Values.AsQueryable().Where(predicate).ToList();
    }

    public async Task AddAsync(T entity, CancellationToken ct = default)
    {
        if (_dbContext != null && _dbContext.Database.CanConnect())
        {
            await _dbContext.Set<T>().AddAsync(entity, ct);
        }
        else
        {
            InMemoryStore[entity.Id] = entity;
        }
    }

    public void Update(T entity)
    {
        if (_dbContext != null && _dbContext.Database.CanConnect())
        {
            _dbContext.Set<T>().Update(entity);
        }
        else
        {
            InMemoryStore[entity.Id] = entity;
        }
    }

    public void Delete(T entity)
    {
        if (_dbContext != null && _dbContext.Database.CanConnect())
        {
            _dbContext.Set<T>().Remove(entity);
        }
        else
        {
            InMemoryStore.TryRemove(entity.Id, out _);
        }
    }
}

public class UnitOfWork : IUnitOfWork
{
    private readonly AppDbContext? _dbContext;

    public UnitOfWork(AppDbContext? dbContext = null)
    {
        _dbContext = dbContext;
    }

    public async Task<int> SaveChangesAsync(CancellationToken ct = default)
    {
        if (_dbContext != null && _dbContext.Database.CanConnect())
        {
            return await _dbContext.SaveChangesAsync(ct);
        }

        return 1;
    }
}
