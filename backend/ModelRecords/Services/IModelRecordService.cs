using backend.ApiResponse.OperationResults;
using backend.ModelRecord.Dto;
using backend.Service;

namespace backend.ModelRecord.Service;

public interface IModelRecordService : IService<CreateRecordFieldsDto, ModelRecordResponseDto>
{
    public Task<OperationResult<ModelRecordResponseDto>> CreateAsync(CreateRecordFieldsDto dto, string modelId);
    public Task<List<Dictionary<string, object>>> GetAllRecordsByName(string modelName);
}