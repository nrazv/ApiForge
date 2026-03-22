using System.ComponentModel.DataAnnotations;

namespace backend.ApplicationUser.Dtos;

public record ChangePasswordDto(
    [Required]
    string CurrentPassword,

    [Required, StringLength(100, MinimumLength = 6)]
    string NewPassword
);
