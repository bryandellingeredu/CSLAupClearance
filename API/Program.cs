using API.BackGroundJobs;
using API.Extensions;
using Hangfire;
using Hangfire.SqlServer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.DependencyInjection;
using System;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers(opt =>
{
    var policy = new AuthorizationPolicyBuilder().RequireAuthenticatedUser().Build();
    opt.Filters.Add(new AuthorizeFilter(policy));
});

builder.Services.AddApplicationServices(builder.Configuration);
builder.Services.AddIdentityServices(builder.Configuration);

builder.Services.AddHangfire(configuration => configuration
             .SetDataCompatibilityLevel(CompatibilityLevel.Version_170)
             .UseSimpleAssemblyNameTypeSerializer()
             .UseRecommendedSerializerSettings()
             .UseSqlServerStorage(builder.Configuration.GetConnectionString("DefaultConnection"), new SqlServerStorageOptions
             {
                 CommandBatchMaxTimeout = TimeSpan.FromMinutes(5),
                 SlidingInvisibilityTimeout = TimeSpan.FromMinutes(5),
                 QueuePollInterval = TimeSpan.Zero,
                 UseRecommendedIsolationLevel = true,
                 DisableGlobalLocks = true
             }));

builder.Services.AddHangfireServer();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("CorsPolicy");
//app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();

app.UseDefaultFiles();
app.UseStaticFiles();

app.UseHangfireDashboard("/hangfire", new DashboardOptions
{
    Authorization = new[] { new NoAuthorizationFilter() } // No authorization needed
});

app.MapControllers();
app.MapFallbackToController("Index", "Fallback");

using (var scope = app.Services.CreateScope())
{
    var serviceProvider = scope.ServiceProvider;
    var recurringJobManager = serviceProvider.GetRequiredService<IRecurringJobManager>();
    var backgroundJobs = serviceProvider.GetRequiredService<API.BackGroundJobs.BackGroundJobs>();

    recurringJobManager.AddOrUpdate(
        "EmailNotificationJob",
        () => backgroundJobs.EmailNotificationJob(),
        "0 18 * * 0"
    );
}


app.Run();

public class NoAuthorizationFilter : Hangfire.Dashboard.IDashboardAuthorizationFilter
{
    public bool Authorize(Hangfire.Dashboard.DashboardContext context) => true;
}