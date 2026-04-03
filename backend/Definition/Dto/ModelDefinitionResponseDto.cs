namespace backend.Definition.Dto;

public record ModelDefinitionResponseDto(Guid Id, Guid? ProjectId, string Name, List<FieldDefinitionResponseDto> Fields);