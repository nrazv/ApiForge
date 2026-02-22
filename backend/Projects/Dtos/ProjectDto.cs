namespace backend.Projects.Dtos;

public record ProjectDto(
    Guid Id,
    string Name,
    string OwnerId,
    DateTime CreatedAt
);
