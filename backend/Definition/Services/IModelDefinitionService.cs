using backend.Definition.Dto;
using backend.Definition.Entities;
using backend.Service;

namespace backend.Definition.Service;

public interface IModelDefinitionService : APIService<ModelDefinitionCreateDto, ModelDefinitionResponseDto>
{
    public Task<ModelDefinitionEntity?> GetModelByNameAsync(string name);
}