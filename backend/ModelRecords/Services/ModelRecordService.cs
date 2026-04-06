using static backend.ModelRecord.Factory.ModelRecordFactory;
using static backend.ModelRecord.Factory.RecordFieldFactory;
using backend.ApiResponse.OperationResults;
using backend.Definition.Service;
using backend.ModelRecord.Dto;
using backend.ModelRecord.Repository;
using backend.ModelRecord.Validators;


namespace backend.ModelRecord.Service;



public class ModelRecordService : IModelRecordService
{
    private readonly IModelDefinitionService modelDefinitionService;
    private readonly IModelRecordRepository repository;

    public ModelRecordService(IModelRecordRepository recordRepository, IModelDefinitionService dataDefinitionService)
    {
        repository = recordRepository;
        modelDefinitionService = dataDefinitionService;
    }

    public Task<OperationResult<ModelRecordResponseDto?>> CreateAsync(CreateRecordFieldsDto dto)
    {
        throw new NotImplementedException();
    }

    public async Task<OperationResult<ModelRecordResponseDto>> CreateAsync(CreateRecordFieldsDto dto, string modelName)
    {
        var modelDefinitionEntity = await modelDefinitionService.FindByNameAsync(modelName);
        if (modelDefinitionEntity is null)
        {
            return OperationResult<ModelRecordResponseDto>.Failure(new OperationError("Model not found", 404));
        }

        var (isValid, fieldName) = RecordFieldsValidators.HasAllFields(modelDefinitionEntity, dto);

        if (isValid is false)
        {
            return OperationResult<ModelRecordResponseDto>.Failure(new OperationError($"The field {fieldName} is missing", 404));
        }

        var newModelRecord = CreateNewRecord(modelDefinitionEntity.Id);
        var fieldValueEntitiesList = CreateFieldValuesForModelDefinition(dto, modelDefinitionEntity, newModelRecord.Id);
        newModelRecord.Values = fieldValueEntitiesList;
        await repository.AddAsync(newModelRecord);

        return OperationResult<ModelRecordResponseDto>.Success(new ModelRecordResponseDto(newModelRecord.Id));
    }

    public async Task<List<Dictionary<string, object>>> GetAllRecordsByName(string modelName)
    {
        var responseData = new List<Dictionary<string, object>>();

#pragma warning disable CS8602 // Dereference of a possibly null reference.
        var response = await repository.FindAllAsync(record => record.Model.Name == modelName);

        foreach (var record in response)
        {
            var recordValues = new Dictionary<string, object>();

            foreach (var fieldValue in record.Values)
            {
                var fieldName = fieldValue.Name;
                var value = fieldValue.Value;

                recordValues.Add(key: fieldName, value: value);
            }
            responseData.Add(recordValues);
        }


        return responseData;
    }

    public Task<OperationResult<ModelRecordResponseDto>> GetByNameAsync(string name)
    {
        throw new NotImplementedException();
    }
}