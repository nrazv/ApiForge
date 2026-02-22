using backend.ApplicationUser.Entities;
using backend.Definition.Entities;
using backend.EntitiesConfig;
using backend.ModelRecord.Entities;
using backend.Projects.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace backend.Data;

public class ApplicationDBContext : IdentityDbContext<AppUser>
{
    public ApplicationDBContext(DbContextOptions<ApplicationDBContext> options) : base(options)
    {
    }

    public DbSet<Project> Projects => Set<Project>();
    public DbSet<ProjectMember> ProjectMembers => Set<ProjectMember>();
    public DbSet<ModelDefinitionEntity> Models => Set<ModelDefinitionEntity>();
    public DbSet<FieldDefinitionEntity> Fields => Set<FieldDefinitionEntity>();
    public DbSet<ModelRecordEntity> Records => Set<ModelRecordEntity>();
    public DbSet<FieldValueEntity> FieldValues => Set<FieldValueEntity>();

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.ApplyConfiguration(new ModelDefinitionEntityConfig());

        builder.Entity<ProjectMember>()
            .HasKey(pm => new { pm.ProjectId, pm.UserId });

        builder.Entity<ProjectMember>()
            .HasOne(pm => pm.Project)
            .WithMany(p => p.Members)
            .HasForeignKey(pm => pm.ProjectId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Entity<ProjectMember>()
            .HasOne(pm => pm.User)
            .WithMany()
            .HasForeignKey(pm => pm.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Entity<Project>()
            .HasOne(p => p.Owner)
            .WithMany()
            .HasForeignKey(p => p.OwnerId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.Entity<ModelDefinitionEntity>()
            .HasMany(m => m.Fields)
            .WithOne(f => f.Model)
            .HasForeignKey(f => f.ModelId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Entity<ModelRecordEntity>()
            .HasMany(r => r.Values)
            .WithOne(v => v.Record)
            .HasForeignKey(v => v.RecordId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Entity<FieldValueEntity>()
            .HasOne(v => v.Field)
            .WithMany()
            .HasForeignKey(v => v.FieldId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}