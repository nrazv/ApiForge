using backend.Definition.Entities;
using backend.ModelRecord.Dto;
using backend.ModelRecord.Entities;


namespace backend.ModelRecord.Factory;

public static class RecordFieldFactory
{
    public static List<FieldValueEntity> CreateFieldValuesForModelDefinition(CreateRecordFieldsDto dto, ModelDefinitionEntity modelDefinition, Guid recordId)
    {
        var list = new List<FieldValueEntity>();

        foreach (var fieldDefinition in modelDefinition.Fields)
        {
            RecordFieldDto fieldRecordDto = dto.RecordFields.First(field => field.Name == fieldDefinition.Name);
            var newFieldValue = CreateFieldValue(value: fieldRecordDto.Value, name: fieldRecordDto.Name, fieldId: fieldDefinition.Id, recordId: recordId);
            list.Add(newFieldValue);
        }

        return list;
    }

    public static FieldValueEntity CreateFieldValue(string value, string name, Guid fieldId, Guid recordId)
    {
        return new FieldValueEntity
        {
            Id = Guid.NewGuid(),
            FieldId = fieldId,
            RecordId = recordId,
            Value = value,
            Name = name
        };
    }
}