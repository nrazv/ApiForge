namespace backend.ApplicationUser.Dtos;

public record PublicUserProfileDto(
    string Id,
    string Username,
    DateTime CreatedAt
);
