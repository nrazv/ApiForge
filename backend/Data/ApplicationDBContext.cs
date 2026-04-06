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
    public DbSet<Project> Projects => Set<Project>();
    public DbSet<ProjectMember> ProjectMembers => Set<ProjectMember>();
    public DbSet<ProjectInvitation> ProjectInvitations => Set<ProjectInvitation>();
    public DbSet<ModelDefinitionEntity> Models => Set<ModelDefinitionEntity>();
    public DbSet<FieldDefinitionEntity> Fields => Set<FieldDefinitionEntity>();
    public DbSet<ModelRecordEntity> Records => Set<ModelRecordEntity>();
    public DbSet<FieldValueEntity> FieldValues => Set<FieldValueEntity>();


    public ApplicationDBContext(DbContextOptions<ApplicationDBContext> options) : base(options)
    {
    }


    protected override void OnModelCreating(ModelBuilder builder)
    {


        base.OnModelCreating(builder);
        builder.Entity<ModelDefinitionEntity>();
        builder.ApplyConfiguration(new ModelDefinitionEntityConfig());
        builder.ApplyConfiguration(new ModelRecordEntityConfiguration());

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

        builder.Entity<ProjectInvitation>()
            .HasOne(pi => pi.Project)
            .WithMany(p => p.Invitations)
            .HasForeignKey(pi => pi.ProjectId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Entity<ProjectInvitation>()
            .HasOne(pi => pi.InvitedUser)
            .WithMany()
            .HasForeignKey(pi => pi.InvitedUserId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.Entity<ProjectInvitation>()
            .HasOne(pi => pi.InvitedByUser)
            .WithMany()
            .HasForeignKey(pi => pi.InvitedByUserId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.Entity<Project>()
            .HasOne(p => p.Owner)
            .WithMany()
            .HasForeignKey(p => p.OwnerId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.Entity<Project>()
            .HasMany(p => p.ProjectApis)
            .WithOne(api => api.Project)
            .HasForeignKey(api => api.ProjectId)
            .OnDelete(DeleteBehavior.Restrict);

        // builder.Entity<ModelDefinitionEntity>()
        //     .HasMany(m => m.Fields)
        //     .WithOne(f => f.Model)
        //     .HasForeignKey(f => f.ModelId)
        //     .OnDelete(DeleteBehavior.Cascade);

        // builder.Entity<ModelDefinitionEntity>()
        //     .HasOne(m => m.Project)
        //     .WithMany()
        //     .HasForeignKey(m => m.ProjectId)
        //     .OnDelete(DeleteBehavior.Cascade);

        // builder.Entity<ModelRecordEntity>()
        //     .HasMany(r => r.Values)
        //     .WithOne(v => v.Record)
        //     .HasForeignKey(v => v.RecordId)
        //     .OnDelete(DeleteBehavior.Cascade);

        // builder.Entity<FieldValueEntity>()
        //     .HasOne(v => v.Field)
        //     .WithMany()
        //     .HasForeignKey(v => v.FieldId)
        //     .OnDelete(DeleteBehavior.Restrict);
    }
}