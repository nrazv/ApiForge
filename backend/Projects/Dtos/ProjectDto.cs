namespace backend.Projects.Dtos;

public record ProjectDto(
    Guid Id,
    string Name,
    string OwnerId,
    string OwnerUsername,
    DateTime CreatedAt
);
