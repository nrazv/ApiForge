using backend.ApplicationUser.Entities;

namespace backend.Projects.Entities;

public class ProjectMember
{
    public Guid ProjectId { get; set; }
    public Project? Project { get; set; }
    public string UserId { get; set; } = string.Empty;
    public AppUser? User { get; set; }
    public ProjectRole Role { get; set; }
    public DateTime AddedAt { get; set; } = DateTime.UtcNow;
}
