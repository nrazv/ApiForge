using backend.ApiResponse.OperationResults;

namespace backend.Service;

public interface IService<TInput, TOutput>
{
    public Task<OperationResult<TOutput>> CreateAsync(TInput obj);
    public Task<OperationResult<TOutput>> FindByNameAsync(string name);
}