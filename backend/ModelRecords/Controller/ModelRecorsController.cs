using backend.ModelRecord.Dto;
using backend.ModelRecord.Service;
using Microsoft.AspNetCore.Mvc;

namespace backend.ModelRecord.Controller;


[ApiController]
[Route("api/{modelName}")]
public class ModelRecordsController : ControllerBase
{
    private readonly IModelRecordService service;
    public ModelRecordsController(IModelRecordService modelRecordService)
    {
        service = modelRecordService;
    }

    [HttpPost]
    public async Task<IActionResult> CreateRecord(string modelName, [FromBody] CreateRecordFieldsDto dto)
    {
        var result = await service.CreateAsync(dto, modelName);
        if (result.IsSuccess)
        {
            return CreatedAtAction(nameof(CreateRecord), result.Data);
        }

        else
        {
            return BadRequest(result.Error);
        }
    }

    [HttpGet]
    public async Task<IActionResult> GetRecords(string modelName)
    {
        var response = await service.GetAllRecordsByName(modelName);
        return Ok(response);
    }
}