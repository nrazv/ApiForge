using backend.ApiResponse.OperationResults;
using backend.Projects.Dtos;

namespace backend.Projects.Services;

public interface IProjectService
{
    Task<OperationResult<IEnumerable<ProjectDto>>> GetMyProjectsAsync(string userId);
    Task<OperationResult<ProjectDto>> CreateProjectAsync(string userId, CreateProjectDto dto);
    Task<OperationResult<ProjectDto>> UpdateProjectAsync(string userId, Guid projectId, UpdateProjectDto dto);
    Task<OperationResult<bool>> DeleteProjectAsync(string userId, Guid projectId);
    Task<OperationResult<IEnumerable<ProjectMemberDto>>> GetMembersAsync(string userId, Guid projectId);
    Task<OperationResult<ProjectMemberDto>> AddMemberAsync(string userId, Guid projectId, AddProjectMemberDto dto);
    Task<OperationResult<bool>> RemoveMemberAsync(string userId, Guid projectId, string memberId);
}
