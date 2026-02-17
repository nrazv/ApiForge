using backend.Definition.Entities;

namespace backend.ModelRecord.Entities;


public class FieldValueEntity
{

    public Guid Id { get; set; }
    public Guid FieldId { get; set; }
    public Guid RecordId { get; set; }
    public required string Value { get; set; }
    public FieldDefinitionEntity? Field { get; set; }
    public ModelRecordEntity? Record { get; set; }

}
