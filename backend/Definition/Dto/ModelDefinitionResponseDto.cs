namespace backend.Definition.Dto;

public record ModelDefinitionResponseDto(Guid Id, string Name, List<FieldDefinitionResponseDto> Fields);