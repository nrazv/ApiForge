using System.ComponentModel.DataAnnotations;

namespace backend.Projects.Dtos;

public record UpdateProjectDto(
    [Required, StringLength(100, MinimumLength = 2)]
    string Name
);
