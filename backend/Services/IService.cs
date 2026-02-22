using backend.ApiResponse.OperationResults;

namespace backend.Services;

public interface IService<T>
{
    Task<OperationResult<T>> CreateAsync(T entity);
    Task<OperationResult<T>> GetByIdAsync(string id);
    Task<OperationResult<T>> GetByName(string name);
    Task<OperationResult<T>> UpdateAsync(T entity);
    Task<OperationResult<bool>> DeleteByIdAsync(Guid id);
}