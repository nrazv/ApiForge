using backend.ApplicationUser.Entities;
using backend.Data;
using backend.Projects.Dtos;
using backend.Projects.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace backend.Projects.Controller;

[ApiController]
[Route("api/projects")]
[Authorize]
public class ProjectsController : ControllerBase
{
    private readonly ApplicationDBContext _dbContext;
    private readonly UserManager<AppUser> _userManager;

    public ProjectsController(ApplicationDBContext dbContext, UserManager<AppUser> userManager)
    {
        _dbContext = dbContext;
        _userManager = userManager;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ProjectDto>>> GetMyProjects()
    {
        var userId = GetUserId();
        if (userId is null)
        {
            return Unauthorized();
        }

        var projects = await _dbContext.Projects
            .Where(p => p.Members.Any(m => m.UserId == userId))
            .Select(p => new ProjectDto(p.Id, p.Name, p.OwnerId, p.CreatedAt))
            .ToListAsync();

        return Ok(projects);
    }

    [HttpPost]
    public async Task<ActionResult<ProjectDto>> CreateProject([FromBody] CreateProjectDto dto)
    {
        var userId = GetUserId();
        if (userId is null)
        {
            return Unauthorized();
        }

        if (!ModelState.IsValid)
        {
            return ValidationProblem(ModelState);
        }

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

        return CreatedAtAction(nameof(GetMyProjects), new ProjectDto(project.Id, project.Name, project.OwnerId, project.CreatedAt));
    }

    [HttpPatch("{projectId:guid}")]
    public async Task<ActionResult<ProjectDto>> UpdateProject(Guid projectId, [FromBody] UpdateProjectDto dto)
    {
        var userId = GetUserId();
        if (userId is null)
        {
            return Unauthorized();
        }

        if (!ModelState.IsValid)
        {
            return ValidationProblem(ModelState);
        }

        var project = await _dbContext.Projects
            .Include(p => p.Members)
            .FirstOrDefaultAsync(p => p.Id == projectId);

        if (project is null)
        {
            return NotFound();
        }

        if (!IsOwner(project, userId))
        {
            return Forbid();
        }

        project.Name = dto.Name;
        await _dbContext.SaveChangesAsync();

        return Ok(new ProjectDto(project.Id, project.Name, project.OwnerId, project.CreatedAt));
    }

    [HttpDelete("{projectId:guid}")]
    public async Task<IActionResult> DeleteProject(Guid projectId)
    {
        var userId = GetUserId();
        if (userId is null)
        {
            return Unauthorized();
        }

        var project = await _dbContext.Projects
            .Include(p => p.Members)
            .FirstOrDefaultAsync(p => p.Id == projectId);

        if (project is null)
        {
            return NotFound();
        }

        if (!IsOwner(project, userId))
        {
            return Forbid();
        }

        _dbContext.Projects.Remove(project);
        await _dbContext.SaveChangesAsync();

        return NoContent();
    }

    [HttpGet("{projectId:guid}/members")]
    public async Task<ActionResult<IEnumerable<ProjectMemberDto>>> GetMembers(Guid projectId)
    {
        var userId = GetUserId();
        if (userId is null)
        {
            return Unauthorized();
        }

        var project = await _dbContext.Projects
            .Include(p => p.Members)
            .ThenInclude(m => m.User)
            .FirstOrDefaultAsync(p => p.Id == projectId);

        if (project is null)
        {
            return NotFound();
        }

        if (!IsMember(project, userId))
        {
            return Forbid();
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

        return Ok(members);
    }

    [HttpPost("{projectId:guid}/members")]
    public async Task<ActionResult<ProjectMemberDto>> AddMember(Guid projectId, [FromBody] AddProjectMemberDto dto)
    {
        var userId = GetUserId();
        if (userId is null)
        {
            return Unauthorized();
        }

        if (!ModelState.IsValid)
        {
            return ValidationProblem(ModelState);
        }

        var project = await _dbContext.Projects
            .Include(p => p.Members)
            .FirstOrDefaultAsync(p => p.Id == projectId);

        if (project is null)
        {
            return NotFound();
        }

        if (!IsOwner(project, userId))
        {
            return Forbid();
        }

        var memberUser = await _userManager.FindByEmailAsync(dto.Email);
        if (memberUser is null)
        {
            return NotFound(new { Message = "User not found" });
        }

        if (project.Members.Any(m => m.UserId == memberUser.Id))
        {
            return Conflict(new { Message = "User already a member" });
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

        return Ok(response);
    }

    [HttpDelete("{projectId:guid}/members/{memberId}")]
    public async Task<IActionResult> RemoveMember(Guid projectId, string memberId)
    {
        var userId = GetUserId();
        if (userId is null)
        {
            return Unauthorized();
        }

        var project = await _dbContext.Projects
            .Include(p => p.Members)
            .FirstOrDefaultAsync(p => p.Id == projectId);

        if (project is null)
        {
            return NotFound();
        }

        if (!IsOwner(project, userId))
        {
            return Forbid();
        }

        if (project.OwnerId == memberId)
        {
            return BadRequest(new { Message = "Owner cannot be removed" });
        }

        var member = project.Members.FirstOrDefault(m => m.UserId == memberId);
        if (member is null)
        {
            return NotFound();
        }

        _dbContext.ProjectMembers.Remove(member);
        await _dbContext.SaveChangesAsync();

        return NoContent();
    }

    private string? GetUserId()
    {
        return User.FindFirstValue(ClaimTypes.NameIdentifier);
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
