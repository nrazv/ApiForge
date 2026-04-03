using backend.ApplicationUser.Entities;

namespace backend.Projects.Entities;

public class ProjectInvitation
{
    public Guid Id { get; set; }
    public Guid ProjectId { get; set; }
    public Project? Project { get; set; }
    public string Email { get; set; } = string.Empty;
    public string? InvitedUserId { get; set; }
    public AppUser? InvitedUser { get; set; }
    public string InvitedByUserId { get; set; } = string.Empty;
    public AppUser? InvitedByUser { get; set; }
    public ProjectInvitationStatus Status { get; set; } = ProjectInvitationStatus.Pending;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? RespondedAt { get; set; }
}
