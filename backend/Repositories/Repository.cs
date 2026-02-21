using System.Linq.Expressions;
using backend.Data;
using Microsoft.EntityFrameworkCore;

namespace backend.Repository;


public class Repository<T> : IRepository<T> where T : class
{
    private readonly ApplicationDBContext dbContext;

    internal DbSet<T> dbSet;

    public Repository(ApplicationDBContext dbContext)
    {
        this.dbContext = dbContext;
        this.dbSet = dbContext.Set<T>();
    }

    public async Task<T> AddAsync(T entity)
    {
        await dbSet.AddAsync(entity);
        await dbContext.SaveChangesAsync();
        return entity;
    }

    public async Task AddRangeAsync(IEnumerable<T> entities)
    {
        await dbSet.AddRangeAsync(entities);
        await dbContext.SaveChangesAsync();
    }

    public async Task<IEnumerable<T>> FindAsync(Expression<Func<T, bool>> predicate)
    {
        return await dbSet.Where(predicate).ToListAsync();
    }

    public async Task<IEnumerable<T>> GetAllAsync()
    {
        return await dbSet.ToListAsync();
    }

    public async Task<T?> GetByIdAsync(Guid id)
    {
        return await dbSet.FindAsync(id);
    }

    public async Task SaveChangesAsync()
    {
        await dbContext.SaveChangesAsync();
    }

    public void Update(T entity)
    {
        dbSet.Update(entity);
        dbContext.SaveChanges();
    }

    public async Task<int> DeleteWhereAsync(Expression<Func<T, bool>> predicate)
    {
        return await dbSet.Where(predicate).ExecuteDeleteAsync();
    }
}