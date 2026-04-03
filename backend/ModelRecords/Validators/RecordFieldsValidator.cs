using backend.Definition.Entities;
using backend.ModelRecord.Dto;

namespace backend.ModelRecord.Validators;

public static class RecordFieldsValidators
{

    public static bool IsFieldValid(string value, string type)
    {
        return type.ToLower() switch
        {
            "string" => true,
            "int" => int.TryParse(value, out _),
            "double" => double.TryParse(value, out _),
            "bool" => bool.TryParse(value, out _),
            "guid" => Guid.TryParse(value, out _),
            _ => false
        };
    }

    public static (bool isValid, string? missingField) HasAllFields(ModelDefinitionEntity entity, CreateRecordFieldsDto dto)
    {
        foreach (var modelField in entity.Fields)
        {
            var requiredField = dto.RecordFields.FirstOrDefault(f => f.Name == modelField.Name);

            if (requiredField is null)
            {
                return (false, modelField.Name);
            }

            var valueString = requiredField.Value;
        }
        return (true, null);
    }

}