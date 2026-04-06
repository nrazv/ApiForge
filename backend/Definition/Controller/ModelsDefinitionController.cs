
using backend.Definition.Dto;
using backend.Definition.Service;
using Microsoft.AspNetCore.Mvc;

namespace backend.Definition.Controller;


[ApiController]
[Route("api/defined/models")]
public class ModelsDefinitionController : ControllerBase
{
    private readonly IModelDefinitionService service;

    public ModelsDefinitionController(IModelDefinitionService definitionService)
    {
        service = definitionService;
    }

    [HttpGet("{modelName}")]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ModelDefinitionResponseDto), StatusCodes.Status200OK)]
    public async Task<ActionResult<ModelDefinitionResponseDto>> GetByName(string modelName)
    {
        var result = await service.GetByNameAsync(modelName);
        if (result.IsSuccess && result.Data is ModelDefinitionResponseDto)
        {
            return CreatedAtAction(nameof(GetByName), result.Data);
        }
        else
        {
            return NotFound();
        }
    }

}