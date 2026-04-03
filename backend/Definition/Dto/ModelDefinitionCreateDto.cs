namespace backend.Definition.Dto;

public record ModelDefinitionCreateDto(string Name, List<FieldDefinitionCreateDto> Fields);