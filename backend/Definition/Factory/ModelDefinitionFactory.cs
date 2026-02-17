using backend.Definition.Dto;
using backend.Definition.Entities;

namespace backend.Definition.Factory;

internal static class DefinitionFactory
{
    public static ModelDefinitionEntity FromModelDefinitionCreateDto(ModelDefinitionCreateDto dto)
    {
        Guid modelId = Guid.NewGuid();
        List<FieldDefinitionEntity> NewFields = new();
        foreach (var field in dto.Fields)
        {
            NewFields.Add(new FieldDefinitionEntity()
            {
                Id = Guid.NewGuid(),
                ModelId = modelId,
                Name = field.Name,
                Type = field.Type
            });
        }

        return new()
        {
            Id = modelId,
            Name = dto.Name,
            Fields = NewFields
        };

    }

    public static ModelDefinitionResponseDto FromModelDefinitionEntity(ModelDefinitionEntity model)
    {
        List<FieldDefinitionResponseDto> fields = new();
        foreach (var field in model.Fields)
        {
            fields.Add(new(Name: field.Name, Type: field.Type));
        }

        return new(Id: model.Id, Name: model.Name, Fields: fields);
    }

}