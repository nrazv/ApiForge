using backend.Definition.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace backend.EntitiesConfig;

public class ModelDefinitionEntityConfig : IEntityTypeConfiguration<ModelDefinitionEntity>
{
    public void Configure(EntityTypeBuilder<ModelDefinitionEntity> builder)
    {
        builder.Navigation(e => e.Fields).AutoInclude();
    }
}