using backend.ApiResponse.OperationResults;
using backend.Definition.Dto;
using backend.Definition.Entities;
using backend.Service;

namespace backend.Definition.Service;

public interface IModelDefinitionService : APIService<ModelDefinitionCreateDto, ModelDefinitionResponseDto>
{
    Task<OperationResult<IEnumerable<ModelDefinitionResponseDto>>> ListByProjectAsync(Guid projectId);
    Task<OperationResult<bool>> DeleteDefinitionAsync(Guid projectId, Guid definitionId);
    Task<OperationResult<bool>> DeleteFieldAsync(Guid projectId, Guid definitionId, Guid fieldId);
    Task<OperationResult<FieldDefinitionResponseDto>> AddFieldAsync(Guid projectId, Guid definitionId, FieldDefinitionCreateDto dto);
    public Task<ModelDefinitionEntity?> FindByNameAsync(string name);
    Task<OperationResult<ModelDefinitionResponseDto>> CreateAsync(Guid projectId, ModelDefinitionCreateDto dto);
}