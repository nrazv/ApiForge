using backend.Data;
using backend.ModelRecord.Entities;
using backend.Repository;

namespace backend.ModelRecord.Repository;

public class ModelRecordRepository : Repository<ModelRecordEntity>, IModelRecordRepository
{
    private readonly ApplicationDBContext _dbContext;

    public ModelRecordRepository(ApplicationDBContext dbContext) : base(dbContext)
    {
        _dbContext = dbContext;
    }
}