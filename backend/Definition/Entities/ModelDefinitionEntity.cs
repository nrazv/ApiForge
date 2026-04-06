using System.ComponentModel.DataAnnotations;
using backend.Projects.Entities;

namespace backend.Definition.Entities;

public class ModelDefinitionEntity
{
    [Key]
    public Guid Id { get; set; }
    public required string Name { get; set; }
    public List<FieldDefinitionEntity> Fields { get; set; } = new();

    public Guid? ProjectId { get; set; }
    public Project? Project { get; set; }
}
