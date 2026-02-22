using backend.ApplicationUser.Entities;

namespace backend.Projects.Entities;

public class Project
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string OwnerId { get; set; } = string.Empty;
    public AppUser? Owner { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public ICollection<ProjectMember> Members { get; set; } = new List<ProjectMember>();
}
