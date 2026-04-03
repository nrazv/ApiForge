using backend.Data;
using backend.Definition.Entities;
using backend.Repository;

namespace backend.Definition.Repository;

public class DefinitionRepository : Repository<ModelDefinitionEntity>, IDefinitionRepository
{
    private readonly ApplicationDBContext _dbContext;
    public DefinitionRepository(ApplicationDBContext dbContext) : base(dbContext)
    {
        _dbContext = dbContext;
    }
}