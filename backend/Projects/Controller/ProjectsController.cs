using backend.Projects.Dtos;
using backend.Projects.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace backend.Projects.Controller;

[ApiController]
[Route("api/projects")]
[Authorize]
public class ProjectsController : ControllerBase
{
    private readonly IProjectService _projectService;

    public ProjectsController(IProjectService projectService)
    {
        _projectService = projectService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ProjectDto>>> GetMyProjects()
    {
        var userId = GetUserId();
        if (userId is null)
        {
            return Unauthorized();
        }

        var response = await _projectService.GetMyProjectsAsync(userId);
        if (!response.IsSuccess)
        {
            return StatusCode(response.Error?.Status ?? StatusCodes.Status400BadRequest, response.Error);
        }

        return Ok(response.Data);
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

        var response = await _projectService.CreateProjectAsync(userId, dto);
        if (!response.IsSuccess)
        {
            return StatusCode(response.Error?.Status ?? StatusCodes.Status400BadRequest, response.Error);
        }

        return CreatedAtAction(nameof(GetMyProjects), response.Data);
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

        var response = await _projectService.UpdateProjectAsync(userId, projectId, dto);
        if (!response.IsSuccess)
        {
            return StatusCode(response.Error?.Status ?? StatusCodes.Status400BadRequest, response.Error);
        }

        return Ok(response.Data);
    }

    [HttpDelete("{projectId:guid}")]
    public async Task<IActionResult> DeleteProject(Guid projectId)
    {
        var userId = GetUserId();
        if (userId is null)
        {
            return Unauthorized();
        }

        var response = await _projectService.DeleteProjectAsync(userId, projectId);
        if (!response.IsSuccess)
        {
            return StatusCode(response.Error?.Status ?? StatusCodes.Status400BadRequest, response.Error);
        }

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

        var response = await _projectService.GetMembersAsync(userId, projectId);
        if (!response.IsSuccess)
        {
            return StatusCode(response.Error?.Status ?? StatusCodes.Status400BadRequest, response.Error);
        }

        return Ok(response.Data);
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

        var response = await _projectService.AddMemberAsync(userId, projectId, dto);
        if (!response.IsSuccess)
        {
            return StatusCode(response.Error?.Status ?? StatusCodes.Status400BadRequest, response.Error);
        }

        return Ok(response.Data);
    }

    [HttpDelete("{projectId:guid}/members/{memberId}")]
    public async Task<IActionResult> RemoveMember(Guid projectId, string memberId)
    {
        var userId = GetUserId();
        if (userId is null)
        {
            return Unauthorized();
        }

        var response = await _projectService.RemoveMemberAsync(userId, projectId, memberId);
        if (!response.IsSuccess)
        {
            return StatusCode(response.Error?.Status ?? StatusCodes.Status400BadRequest, response.Error);
        }

        return NoContent();
    }

    private string? GetUserId()
    {
        return User.FindFirstValue(ClaimTypes.NameIdentifier);
    }


}
