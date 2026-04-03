using backend.ModelRecord.Entities;

namespace backend.ModelRecord.Factory;

public static class ModelRecordFactory
{

    public static ModelRecordEntity CreateNewRecord(Guid modelId)
    {
        return new ModelRecordEntity
        {
            Id = Guid.NewGuid(),
            ModelId = modelId
        };
    }

}