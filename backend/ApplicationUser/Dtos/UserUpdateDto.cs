using System.ComponentModel.DataAnnotations;

namespace backend.ApplicationUser.Dtos;

public record UserUpdateDto(
    [StringLength(50, MinimumLength = 2)]
    string? Username,

    [EmailAddress, StringLength(254)]
    string? Email
);