using backend.ApiResponse.OperationResults;
using backend.Definition.Dto;
using backend.Definition.Factory;
using backend.Definition.Repository;

namespace backend.Definition.Service;

public class DefinitionService : IDefinitionService
{
    private readonly IDefinitionRepository repository;

    public DefinitionService(IDefinitionRepository definitionRepository)
    {
        repository = definitionRepository;
    }
    public async Task<OperationResult<ModelDefinitionResponseDto>> CreateAsync(ModelDefinitionCreateDto dto)
    {
        var newModelDefinition = DefinitionFactory.FromModelDefinitionCreateDto(dto);
        var result = await repository.AddAsync(newModelDefinition);

        if (result is null)
        {
            return OperationResult<ModelDefinitionResponseDto>.Failure(new OperationError("Category creation failed", 400));
        }
        else
        {
            var response = DefinitionFactory.FromModelDefinitionEntity(result);
            return OperationResult<ModelDefinitionResponseDto>.Success(response);
        }
    }

    public async Task<OperationResult<ModelDefinitionResponseDto>> FindByNameAsync(string name)
    {
        var model = await repository.FindAsync(e => e.Name == name);

        if (model is null)
        {
            return OperationResult<ModelDefinitionResponseDto>.Failure(new OperationError("Model not found", 404));
        }
        else
        {
            var response = DefinitionFactory.FromModelDefinitionEntity(model);
            return OperationResult<ModelDefinitionResponseDto>.Success(response);
        }
    }
}