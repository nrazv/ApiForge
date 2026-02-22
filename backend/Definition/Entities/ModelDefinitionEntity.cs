using System.ComponentModel.DataAnnotations;

namespace backend.Definition.Entities;

public class ModelDefinitionEntity
{
    [Key]
    public Guid Id { get; set; }
    public required string Name { get; set; }
    public List<FieldDefinitionEntity> Fields { get; set; } = new();
}
