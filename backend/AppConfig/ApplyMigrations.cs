using backend.Data;
using Microsoft.EntityFrameworkCore;
public static class ApplyMigrations
{
    public static void ApplyMigrationsOnRun(this IApplicationBuilder app)
    {
        using var scope = app.ApplicationServices.CreateScope();
        var env = scope.ServiceProvider.GetRequiredService<IHostEnvironment>();


        var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDBContext>();
        var pendingMigrations = dbContext.Database.GetPendingMigrations();
        if (pendingMigrations.Any())
        {

            dbContext.Database.Migrate();
        }
    }
}