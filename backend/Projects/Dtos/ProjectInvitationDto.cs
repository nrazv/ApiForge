using backend.Projects.Entities;

namespace backend.Projects.Dtos;

public record ProjectInvitationDto(
    Guid Id,
    Guid ProjectId,
    string ProjectName,
    string Email,
    string InvitedByUsername,
    ProjectInvitationStatus Status,
    DateTime CreatedAt
);
