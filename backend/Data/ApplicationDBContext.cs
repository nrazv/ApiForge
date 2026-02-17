using backend.Definition.Entities;
using backend.EntitiesConfig;
using backend.ModelRecord.Entities;
using Microsoft.EntityFrameworkCore;

namespace backend.Data;

public class ApplicationDBContext : DbContext
{
    public DbSet<ModelDefinitionEntity> Models => Set<ModelDefinitionEntity>();
    public DbSet<FieldDefinitionEntity> Fields => Set<FieldDefinitionEntity>();

    public ApplicationDBContext(DbContextOptions<ApplicationDBContext> options) : base(options)
    {
    }
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfiguration(new ModelDefinitionEntityConfig());
        modelBuilder.Entity<ModelDefinitionEntity>()
            .HasMany(m => m.Fields)
            .WithOne(f => f.Model)
            .HasForeignKey(f => f.ModelId)
            .OnDelete(DeleteBehavior.Cascade);


        modelBuilder.Entity<ModelRecordEntity>()
                    .HasMany(r => r.Values)
                    .WithOne(v => v.Record)
                    .HasForeignKey(v => v.RecordId)
                    .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<FieldValueEntity>()
            .HasOne(v => v.Field)
            .WithMany()
            .HasForeignKey(v => v.FieldId)
            .OnDelete(DeleteBehavior.Restrict);

    }
}