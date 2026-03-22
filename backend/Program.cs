

using backend.Definition.Repository;
using backend.Definition.Service;
using backend.ModelRecord.Repository;
using backend.ModelRecord.Service;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddControllers();

//-------------- App Configs -------------------
builder.Services.ConfigureConnectionStringForEnv(builder.Configuration, builder.Environment);


// Register Services
builder.Services.AddScoped<IModelDefinitionService, ModelDefinitionService>();
builder.Services.AddScoped<IModelRecordService, ModelRecordService>();

// Register Repositories
builder.Services.AddScoped<IDefinitionRepository, DefinitionRepository>();
builder.Services.AddScoped<IModelRecordRepository, ModelRecordRepository>();

builder.Services.AddSwaggerGen();

var app = builder.Build();
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "Location Ratings API v1"));
}

app.ApplyMigrationsOnRun();

app.UseHttpsRedirection();
app.UseDefaultFiles();
app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.MapFallbackToFile("index.html");
app.Run();