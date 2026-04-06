using backend.ApiResponse.OperationResults;
using backend.Data;
using backend.Definition.Dto;
using backend.Definition.Entities;
using backend.Definition.Factory;
using backend.Definition.Repository;
using backend.Projects.Services;
using Microsoft.EntityFrameworkCore;

namespace backend.Definition.Service;

public class ModelDefinitionService : IModelDefinitionService
{
    private readonly IProjectService _projectService;
    private readonly IDefinitionRepository _repository;
    private readonly ApplicationDBContext _dbContext;


    public ModelDefinitionService(IDefinitionRepository definitionRepository, ApplicationDBContext applicationDbContext, IProjectService projectService)
    {
        _projectService = projectService;
        _repository = definitionRepository;
        _dbContext = applicationDbContext;
    }

    public async Task<OperationResult<ModelDefinitionResponseDto>> GetByNameAsync(string name)
    {
        var model = await _repository.FindAsync(e => e.Name == name);

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

    public async Task<ModelDefinitionEntity?> GetModelByNameAsync(string name)
    {
        return await _repository.FindAsync(e => e.Name == name);
    }
    public async Task<OperationResult<IEnumerable<ModelDefinitionResponseDto>>> ListByProjectAsync(Guid projectId)
    {
        var models = await _repository.FindAllAsync(e => e.ProjectId == projectId);
        var response = models.Select(DefinitionFactory.FromModelDefinitionEntity).ToList();
        return OperationResult<IEnumerable<ModelDefinitionResponseDto>>.Success(response);
    }

    public async Task<OperationResult<bool>> DeleteDefinitionAsync(Guid projectId, Guid definitionId)
    {
        try
        {
            var deleted = await _repository.DeleteWhereAsync(e => e.Id == definitionId && e.ProjectId == projectId);
            if (deleted == 0)
            {
                return OperationResult<bool>.Failure(new OperationError("Model not found", 404));
            }

            return OperationResult<bool>.Success(true);
        }
        catch (DbUpdateException)
        {
            return OperationResult<bool>.Failure(new OperationError("Model delete failed", 409));
        }
    }

    public async Task<OperationResult<bool>> DeleteFieldAsync(Guid projectId, Guid definitionId, Guid fieldId)
    {
        var model = await _repository.FindAsync(e => e.Id == definitionId && e.ProjectId == projectId);
        if (model is null)
        {
            return OperationResult<bool>.Failure(new OperationError("Model not found", 404));
        }

        try
        {
            var deleted = await _dbContext.Fields
                .Where(field => field.Id == fieldId && field.ModelId == definitionId)
                .ExecuteDeleteAsync();

            if (deleted == 0)
            {
                return OperationResult<bool>.Failure(new OperationError("Field not found", 404));
            }

            return OperationResult<bool>.Success(true);
        }
        catch (DbUpdateException)
        {
            return OperationResult<bool>.Failure(new OperationError("Field delete failed", 409));
        }
    }

    public async Task<OperationResult<FieldDefinitionResponseDto>> AddFieldAsync(
        Guid projectId,
        Guid definitionId,
        FieldDefinitionCreateDto dto
    )
    {
        var model = await _repository.FindAsync(e => e.Id == definitionId && e.ProjectId == projectId);
        if (model is null)
        {
            return OperationResult<FieldDefinitionResponseDto>.Failure(new OperationError("Model not found", 404));
        }

        var field = new FieldDefinitionEntity
        {
            Id = Guid.NewGuid(),
            ModelId = definitionId,
            Name = dto.Name,
            Type = dto.Type
        };

        try
        {
            await _dbContext.Fields.AddAsync(field);
            await _dbContext.SaveChangesAsync();
        }
        catch (DbUpdateException)
        {
            return OperationResult<FieldDefinitionResponseDto>.Failure(new OperationError("Field create failed", 409));
        }

        return OperationResult<FieldDefinitionResponseDto>.Success(
            new FieldDefinitionResponseDto(field.Id, field.Name, field.Type)
        );
    }

    public async Task<ModelDefinitionEntity?> FindByNameAsync(string name)
    {
        return await _repository.FindAsync(e => e.Name == name);
    }

    public async Task<OperationResult<ModelDefinitionResponseDto>> CreateAsync(Guid projectId, ModelDefinitionCreateDto dto)
    {
        var newModelDefinition = DefinitionFactory.FromModelDefinitionCreateDto(projectId, dto);
        var result = await _repository.AddAsync(newModelDefinition);

        if (result is null)
        {
            return OperationResult<ModelDefinitionResponseDto>.Failure(new OperationError($"Failed to create a new api", 400));
        }

        var response = DefinitionFactory.FromModelDefinitionEntity(result);
        return OperationResult<ModelDefinitionResponseDto>.Success(response);
    }

    public Task<OperationResult<ModelDefinitionResponseDto?>> CreateAsync(ModelDefinitionCreateDto obj)
    {
        throw new NotImplementedException();
    }
}