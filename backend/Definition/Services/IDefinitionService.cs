using backend.Definition.Dto;
using backend.Service;

namespace backend.Definition.Service;

public interface IDefinitionService : IService<ModelDefinitionCreateDto, ModelDefinitionResponseDto>
{
}