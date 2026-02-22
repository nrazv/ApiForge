using backend.ApplicationUser.Services;
using backend.Projects.Services;
using Microsoft.AspNetCore.Identity;

using backend.Definition.Repository;
using backend.Definition.Service;

var builder = WebApplication.CreateBuilder(args);

//-------------- App Configs -------------------
builder.Services.ConfigureConnectionStringForEnv(builder.Configuration, builder.Environment);


// Register Services
builder.Services.AddScoped<IDefinitionService, DefinitionService>();

// Register Repositories
builder.Services.AddScoped<IDefinitionRepository, DefinitionRepository>();
builder.Services.AddSwaggerGen();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddControllers();
builder.Services.AddAuthorization();
builder.Services.AddAuthentication();

// Configure Identity and JWT Authentication
builder.Services.AddIdentityAndJwt(builder.Configuration);

// Add services 
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IProjectService, ProjectService>();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "Location Ratings API v1"));
}

// Seed Roles
using (var scope = app.Services.CreateScope())
{
    var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
    string[] roles = ["User"];
    foreach (var role in roles)
    {
        if (!await roleManager.RoleExistsAsync(role))
            await roleManager.CreateAsync(new IdentityRole(role));
    }
}

app.ApplyMigrationsOnRun();

app.UseHttpsRedirection();
app.UseDefaultFiles();
app.UseStaticFiles();
app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.MapFallbackToFile("index.html");
app.Run();