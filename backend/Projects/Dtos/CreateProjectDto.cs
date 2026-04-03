using System.ComponentModel.DataAnnotations;

namespace backend.Projects.Dtos;

public record CreateProjectDto(
    [Required, StringLength(100, MinimumLength = 2)]
    string Name
);
