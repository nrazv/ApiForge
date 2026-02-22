using backend.Services;
using backend.ApplicationUser.Dto;
using backend.ApiResponse.OperationResults;
using backend.ApplicationUser.Models;
using backend.ApplicationUser.Dtos;
namespace backend.ApplicationUser.Services;

public interface IUserService : IService<AppUserDto>
{
    Task<OperationResult<AppUserDto>> CreateAsync(UserCreateDto dto);
    Task<OperationResult<AuthenticatedUser>> LoginAsync(UserLoginDto dto);

    Task<OperationResult<AppUserDto>> UpdateAsync(UserUpdateDto entity, string email);
    Task<OperationResult<PublicUserProfileDto>> GetPublicProfileAsync(string id);
}