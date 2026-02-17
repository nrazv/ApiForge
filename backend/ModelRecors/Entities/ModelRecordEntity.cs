using backend.Definition.Entities;

namespace backend.ModelRecord.Entities;


public class ModelRecordEntity
{
    public required Guid Id { get; set; }
    public required Guid ModelId { get; set; }
    public ModelDefinitionEntity? Model { get; set; }
    public List<FieldValueEntity> Values { get; set; } = new();
}
