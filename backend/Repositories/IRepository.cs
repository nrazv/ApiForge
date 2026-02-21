using System.Linq.Expressions;

namespace backend.Repository;

public interface IRepository<T> where T : class
{
    Task<T> AddAsync(T entity);
    Task AddRangeAsync(IEnumerable<T> entities);
    Task<T?> GetByIdAsync(Guid id);
    Task<IEnumerable<T>> GetAllAsync();
    Task<IEnumerable<T>> FindAsync(Expression<Func<T, bool>> predicate);
    void Update(T entity);
    Task<int> DeleteWhereAsync(Expression<Func<T, bool>> predicate);
    Task SaveChangesAsync();
}