using backend.ApiResponse.OperationResults;
using backend.ApplicationUser.Entities;
using backend.Data;
using backend.Projects.Dtos;
using backend.Projects.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace backend.Projects.Services;

internal class ProjectService : IProjectService
{
    private readonly ApplicationDBContext _dbContext;
    private readonly UserManager<AppUser> _userManager;

    public ProjectService(ApplicationDBContext dbContext, UserManager<AppUser> userManager)
    {
        _dbContext = dbContext;
        _userManager = userManager;
    }

    public async Task<OperationResult<IEnumerable<ProjectDto>>> GetMyProjectsAsync(string userId)
    {
        var projects = await _dbContext.Projects
            .Where(p => p.Members.Any(m => m.UserId == userId))
            .Select(p => new ProjectDto(
                p.Id,
                p.Name,
                p.OwnerId,
                p.Owner != null ? p.Owner.UserName ?? string.Empty : string.Empty,
                p.CreatedAt
            ))
            .ToListAsync();

        return OperationResult<IEnumerable<ProjectDto>>.Success(projects);
    }

    public async Task<OperationResult<ProjectDto>> CreateProjectAsync(string userId, CreateProjectDto dto)
    {
        var owner = await _userManager.FindByIdAsync(userId);
        var project = new Project
        {
            Id = Guid.NewGuid(),
            Name = dto.Name,
            OwnerId = userId,
            CreatedAt = DateTime.UtcNow
        };

        project.Members.Add(new ProjectMember
        {
            ProjectId = project.Id,
            UserId = userId,
            Role = ProjectRole.Owner,
            AddedAt = DateTime.UtcNow
        });

        _dbContext.Projects.Add(project);
        await _dbContext.SaveChangesAsync();

        return OperationResult<ProjectDto>.Success(new ProjectDto(
            project.Id,
            project.Name,
            project.OwnerId,
            owner?.UserName ?? string.Empty,
            project.CreatedAt
        ));
    }

    public async Task<OperationResult<ProjectDto>> UpdateProjectAsync(string userId, Guid projectId, UpdateProjectDto dto)
    {
        var project = await _dbContext.Projects
            .Include(p => p.Members)
            .FirstOrDefaultAsync(p => p.Id == projectId);

        if (project is null)
        {
            return Failure<ProjectDto>("Project not found", StatusCodes.Status404NotFound);
        }

        if (!IsOwner(project, userId))
        {
            return Failure<ProjectDto>("Forbidden", StatusCodes.Status403Forbidden);
        }

        project.Name = dto.Name;
        await _dbContext.SaveChangesAsync();

        var owner = await _userManager.FindByIdAsync(project.OwnerId);
        return OperationResult<ProjectDto>.Success(new ProjectDto(
            project.Id,
            project.Name,
            project.OwnerId,
            owner?.UserName ?? string.Empty,
            project.CreatedAt
        ));
    }

    public async Task<OperationResult<bool>> DeleteProjectAsync(string userId, Guid projectId)
    {
        var project = await _dbContext.Projects
            .Include(p => p.Members)
            .FirstOrDefaultAsync(p => p.Id == projectId);

        if (project is null)
        {
            return Failure<bool>("Project not found", StatusCodes.Status404NotFound);
        }

        if (!IsOwner(project, userId))
        {
            return Failure<bool>("Forbidden", StatusCodes.Status403Forbidden);
        }

        _dbContext.Projects.Remove(project);
        await _dbContext.SaveChangesAsync();

        return OperationResult<bool>.Success(true);
    }

    public async Task<OperationResult<IEnumerable<ProjectMemberDto>>> GetMembersAsync(string userId, Guid projectId)
    {
        var project = await _dbContext.Projects
            .Include(p => p.Members)
            .ThenInclude(m => m.User)
            .FirstOrDefaultAsync(p => p.Id == projectId);

        if (project is null)
        {
            return Failure<IEnumerable<ProjectMemberDto>>("Project not found", StatusCodes.Status404NotFound);
        }

        if (!IsMember(project, userId))
        {
            return Failure<IEnumerable<ProjectMemberDto>>("Forbidden", StatusCodes.Status403Forbidden);
        }

        var members = project.Members
            .Where(m => m.User is not null)
            .Select(m => new ProjectMemberDto(
                m.UserId,
                m.UserId,
                m.User!.UserName ?? string.Empty,
                m.User!.Email ?? string.Empty
            ))
            .ToList();

        return OperationResult<IEnumerable<ProjectMemberDto>>.Success(members);
    }

    public async Task<OperationResult<ProjectMemberDto>> AddMemberAsync(string userId, Guid projectId, AddProjectMemberDto dto)
    {
        var project = await _dbContext.Projects
            .Include(p => p.Members)
            .FirstOrDefaultAsync(p => p.Id == projectId);

        if (project is null)
        {
            return Failure<ProjectMemberDto>("Project not found", StatusCodes.Status404NotFound);
        }

        if (!IsOwner(project, userId))
        {
            return Failure<ProjectMemberDto>("Forbidden", StatusCodes.Status403Forbidden);
        }

        var memberUser = await _userManager.FindByEmailAsync(dto.Email);
        if (memberUser is null)
        {
            return Failure<ProjectMemberDto>("User not found", StatusCodes.Status404NotFound);
        }

        if (project.Members.Any(m => m.UserId == memberUser.Id))
        {
            return Failure<ProjectMemberDto>("User already a member", StatusCodes.Status409Conflict);
        }

        var member = new ProjectMember
        {
            ProjectId = project.Id,
            UserId = memberUser.Id,
            Role = ProjectRole.Member,
            AddedAt = DateTime.UtcNow
        };

        project.Members.Add(member);
        await _dbContext.SaveChangesAsync();

        var response = new ProjectMemberDto(
            memberUser.Id,
            memberUser.Id,
            memberUser.UserName ?? string.Empty,
            memberUser.Email ?? string.Empty
        );

        return OperationResult<ProjectMemberDto>.Success(response);
    }

    public async Task<OperationResult<bool>> RemoveMemberAsync(string userId, Guid projectId, string memberId)
    {
        var project = await _dbContext.Projects
            .Include(p => p.Members)
            .FirstOrDefaultAsync(p => p.Id == projectId);

        if (project is null)
        {
            return Failure<bool>("Project not found", StatusCodes.Status404NotFound);
        }

        if (!IsOwner(project, userId))
        {
            return Failure<bool>("Forbidden", StatusCodes.Status403Forbidden);
        }

        if (project.OwnerId == memberId)
        {
            return Failure<bool>("Owner cannot be removed", StatusCodes.Status400BadRequest);
        }

        var member = project.Members.FirstOrDefault(m => m.UserId == memberId);
        if (member is null)
        {
            return Failure<bool>("Member not found", StatusCodes.Status404NotFound);
        }

        _dbContext.ProjectMembers.Remove(member);
        await _dbContext.SaveChangesAsync();

        return OperationResult<bool>.Success(true);
    }

    private static OperationResult<T> Failure<T>(string message, int status)
    {
        return OperationResult<T>.Failure(new OperationError(message, status));
    }

    private static bool IsOwner(Project project, string userId)
    {
        return project.OwnerId == userId || project.Members.Any(m => m.UserId == userId && m.Role == ProjectRole.Owner);
    }

    private static bool IsMember(Project project, string userId)
    {
        return project.Members.Any(m => m.UserId == userId);
    }
}
