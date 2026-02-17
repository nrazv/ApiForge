using System.ComponentModel.DataAnnotations;

namespace backend.Definition.Entities;


public class FieldDefinitionEntity
{
    [Key]
    public Guid Id { get; set; }
    public Guid ModelId { get; set; }
    public required string Name { get; set; }
    public required string Type { get; set; }
    public ModelDefinitionEntity? Model { get; set; }
}
