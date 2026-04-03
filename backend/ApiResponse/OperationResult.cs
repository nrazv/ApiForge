
namespace backend.ApiResponse.OperationResults;

public class OperationResult<T>
{
    public bool IsSuccess { get; }
    public T? Data { get; }
    public OperationError? Error { get; }

    private OperationResult(T data)
    {
        IsSuccess = true;
        Data = data;
    }

    private OperationResult(OperationError error)
    {
        IsSuccess = false;
        Error = error;
    }

    public static OperationResult<T> Success(T data) => new(data);
    public static OperationResult<T> Failure(OperationError error) => new(error);


}