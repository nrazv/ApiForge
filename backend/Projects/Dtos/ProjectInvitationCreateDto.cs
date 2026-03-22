using System.ComponentModel.DataAnnotations;

namespace backend.Projects.Dtos;

public record ProjectInvitationCreateDto(
    [Required, EmailAddress]
    string Email
);
