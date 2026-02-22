using backend.ApplicationUser.Dto;
using backend.ApplicationUser.Entities;
using backend.ApplicationUser.Factory;
using backend.ApiResponse.OperationResults;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using backend.ApplicationUser.Models;
using backend.ApplicationUser.Dtos;

namespace backend.ApplicationUser.Services;

internal class UserService : IUserService
{
    private readonly UserManager<AppUser> userManager;
    private readonly IConfiguration _config;
    private readonly SignInManager<AppUser> _signInManager;
    private readonly ILogger<IUserService> _logger;

    public UserService(UserManager<AppUser> userManager, IConfiguration config, SignInManager<AppUser> signInManager, ILogger<IUserService> logger)
    {
        _config = config;
        _logger = logger;
        _signInManager = signInManager;
        this.userManager = userManager;
    }


    public async Task<OperationResult<AppUserDto>> CreateAsync(UserCreateDto dto)
    {
        var existingByEmail = await userManager.FindByEmailAsync(dto.Email);
        if (existingByEmail is AppUser)
        {
            return OperationResult<AppUserDto>.Failure(new OperationError(Message: "Email is already in use", Status: 400));
        }

        var existingByUsername = await userManager.FindByNameAsync(dto.Username);
        if (existingByUsername is AppUser)
        {
            return OperationResult<AppUserDto>.Failure(new OperationError(Message: "Username is already in use", Status: 400));
        }

        var newUser = AppUserFactory.CreateAppUserFromDto(dto);

        try
        {
            IdentityResult result = await userManager.CreateAsync(newUser, dto.Password);
            if (result.Succeeded is false)
            {
                string error = result.Errors.ToList().First().Description;
                return OperationResult<AppUserDto>.Failure(new OperationError(Message: error, Status: 400));
            }

            if (result.Succeeded)
            {
                await userManager.AddToRoleAsync(newUser, "User");
                return OperationResult<AppUserDto>.Success(MapToDto(newUser));
            }
        }
        catch (DbUpdateException)
        {
            return OperationResult<AppUserDto>.Failure(new OperationError(Message: "Registration failed", Status: 400));
        }

        return OperationResult<AppUserDto>.Failure(new OperationError(Message: "Registration failed", Status: 400));
    }

    public Task<OperationResult<AppUserDto>> CreateAsync(AppUserDto entity)
    {
        throw new NotImplementedException();
    }

    public Task<OperationResult<bool>> DeleteByIdAsync(Guid id)
    {
        throw new NotImplementedException();
    }

    public async Task<OperationResult<AppUserDto>> GetByIdAsync(string id)
    {
        var user = await userManager.FindByIdAsync(id);
        if (user is null)
        {
            return OperationResult<AppUserDto>.Failure(new OperationError(Message: "Unauthorized", Status: 401));
        }

        return OperationResult<AppUserDto>.Success(MapToDto(user));
    }

    public Task<OperationResult<AppUserDto>> GetByName(string name)
    {
        throw new NotImplementedException();
    }

    public async Task<OperationResult<AuthenticatedUser>> LoginAsync(UserLoginDto dto)
    {
        _logger.LogInformation("Login attempt for {Email}", dto.Email);
        var user = await userManager.FindByEmailAsync(dto.Email);

        if (user is null)
        {
            _logger.LogInformation("Login attempt failed for {Email} - User not found", dto.Email);
            return OperationResult<AuthenticatedUser>.Failure(new OperationError(Message: "Invalid email or password", Status: 401));
        }

        if (user.IsBlocked)
        {
            _logger.LogInformation("Login attempt blocked for {Email} - User is blocked", dto.Email);
            return OperationResult<AuthenticatedUser>.Failure(new OperationError(Message: "Account is blocked", Status: 403));
        }

        var result = await _signInManager.PasswordSignInAsync(dto.Email, dto.Password, isPersistent: false, lockoutOnFailure: true);
        if (result.Succeeded is false)
        {
            if (result.IsLockedOut)
            {
                _logger.LogInformation("Login attempt failed for {Email} - Account locked due to failed attempts", dto.Email);
                return OperationResult<AuthenticatedUser>.Failure(new OperationError("Account locked due to failed attempts", 423));
            }
            _logger.LogInformation("Login attempt failed for {Email} - Invalid email or password", dto.Email);
            return OperationResult<AuthenticatedUser>.Failure(new OperationError(Message: "Invalid email or password", Status: 401));
        }

        string token = await GenerateJwtToken(user);
        var authUser = new AuthenticatedUser(MapToDto(user), token);
        _logger.LogInformation("Login succeeded for {Email}", dto.Email);
        return OperationResult<AuthenticatedUser>.Success(authUser);
    }

    public Task<OperationResult<AppUserDto>> UpdateAsync(AppUserDto entity)
    {
        throw new NotImplementedException();
    }

    public async Task<OperationResult<AppUserDto>> UpdateAsync(UserUpdateDto entity, string email)
    {
        AppUser? user = await userManager.FindByEmailAsync(email);

        if (user is null)
        {
            return OperationResult<AppUserDto>.Failure(new OperationError(Message: "Operation failed", Status: 401));
        }

        if (!string.IsNullOrWhiteSpace(entity.Username) &&
            !string.Equals(user.UserName, entity.Username, StringComparison.OrdinalIgnoreCase))
        {
            var existingUser = await userManager.FindByNameAsync(entity.Username);
            if (existingUser is not null)
            {
                return OperationResult<AppUserDto>.Failure(new OperationError(Message: "Username is already in use", Status: 400));
            }
            user.UserName = entity.Username;
        }

        if (!string.IsNullOrWhiteSpace(entity.Email) &&
            !string.Equals(user.Email, entity.Email, StringComparison.OrdinalIgnoreCase))
        {
            var existingEmail = await userManager.FindByEmailAsync(entity.Email);
            if (existingEmail is not null)
            {
                return OperationResult<AppUserDto>.Failure(new OperationError(Message: "Email is already in use", Status: 400));
            }
            user.Email = entity.Email;
        }

        var result = await userManager.UpdateAsync(user);

        if (result.Succeeded)
        {
            return OperationResult<AppUserDto>.Success(MapToDto(user));
        }

        return OperationResult<AppUserDto>.Failure(new OperationError(Message: "Operation failed", Status: 401));
    }

    public async Task<OperationResult<PublicUserProfileDto>> GetPublicProfileAsync(string id)
    {
        var user = await userManager.FindByIdAsync(id);
        if (user is null)
        {
            return OperationResult<PublicUserProfileDto>.Failure(new OperationError(Message: "User not found", Status: 404));
        }

        var dto = new PublicUserProfileDto(
            user.Id,
            user.UserName ?? string.Empty,
            user.CreatedAt
        );

        return OperationResult<PublicUserProfileDto>.Success(dto);
    }

    private static AppUserDto MapToDto(AppUser user)
    {
        return new AppUserDto(
            user.Id,
            user.UserName ?? string.Empty,
            user.Email ?? string.Empty,
            user.MustChangePassword,
            user.IsBlocked,
            user.CreatedAt
        );
    }

    private async Task<string> GenerateJwtToken(AppUser user)
    {
        var jwtSection = _config.GetSection("Jwt");
        var key = jwtSection["Key"];
        var issuer = jwtSection["Issuer"];
        var audience = jwtSection["Audience"];
        var expiryMinutes = jwtSection.GetValue<int>("ExpiryMinutes", 60);

        if (key is null || user.Email is null)
        {
            throw new InvalidOperationException("JWT Key is not configured.");
        }

        var keyBytes = Encoding.UTF8.GetBytes(key);
        var securityKey = new SymmetricSecurityKey(keyBytes);
        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);



        var claims = new List<Claim>
        {
            new Claim(type: JwtRegisteredClaimNames.Sub, user.Id),
            new Claim(type: JwtRegisteredClaimNames.Email, user.Email),
            new Claim(type: ClaimTypes.NameIdentifier, user.Id)
        };


        var roles = await userManager.GetRolesAsync(user);
        claims.AddRange(roles.Select(r => new Claim(type: ClaimTypes.Role, r)));

        var token = new JwtSecurityToken(
            issuer: issuer,
            audience: audience,
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(expiryMinutes),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }



}