using backend.ApiResponse.OperationResults;

namespace backend.Service;


public interface APIService<TInput, TOutput>
{
    public Task<OperationResult<TOutput?>> CreateAsync(TInput obj);
    public Task<OperationResult<TOutput>> GetByNameAsync(string name);

}
