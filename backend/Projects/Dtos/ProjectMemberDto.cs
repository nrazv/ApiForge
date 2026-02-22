namespace backend.Projects.Dtos;

public record ProjectMemberDto(
    string Id,
    string UserId,
    string Username,
    string Email
);
