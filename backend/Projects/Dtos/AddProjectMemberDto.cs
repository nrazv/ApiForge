using System.ComponentModel.DataAnnotations;

namespace backend.Projects.Dtos;

public record AddProjectMemberDto(
    [Required, EmailAddress]
    string Email
);
