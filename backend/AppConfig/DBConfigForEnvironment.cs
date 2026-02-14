using backend.Data;
using DotNetEnv;
using Microsoft.EntityFrameworkCore;

public static class DBConfigForEnvironment
{
    public static IServiceCollection ConfigureConnectionStringForEnv(this IServiceCollection services,
        IConfiguration config,
        IWebHostEnvironment env)
    {
        var isRunningInDocker = config.GetValue<bool>("RUNNING_IN_DOCKER");
        if (env.IsDevelopment() && isRunningInDocker is false)
        {
            var envPath = Path.Combine(
                env.ContentRootPath,
                "..",
                ".env"
            );
            Env.Load(envPath);

            string db_name = Environment.GetEnvironmentVariable("DB_NAME") ?? "";
            string id = Environment.GetEnvironmentVariable("DB_ID") ?? "";
            string db_password = Environment.GetEnvironmentVariable("DB_PASSWORD") ?? "";
            string db_server = "localhost";



            var connectionString = $"Server={db_server},1433;Database={db_name};User Id={id};Password={db_password};TrustServerCertificate=true;Encrypt=False";
            services.AddDbContext<ApplicationDBContext>(options => options.UseSqlServer(connectionString));
            return services;
        }

        services.AddDbContext<ApplicationDBContext>(options => options.UseSqlServer(config.GetConnectionString("DefaultConnection")));
        return services;
    }
}