﻿using API.BackGroundJobs;
using API.Services;
using Application.EventUsers;
using Application.Repository;
using Microsoft.EntityFrameworkCore;
using Persistence;

public static class ApplicationServiceExtensions
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration config)
    {
        services.AddEndpointsApiExplorer();
        services.AddSwaggerGen();

        services.AddDbContext<DataContext>(opt =>
        {
            opt.UseSqlServer(config.GetConnectionString("DefaultConnection"));
        });

        services.AddCors(opt => {
            opt.AddPolicy("CorsPolicy", policy =>
            {
                policy.AllowAnyHeader().AllowAnyMethod().WithOrigins("http://localhost:3000");
            });
        });

        services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(typeof(List.Handler).Assembly));

        services.AddScoped<IEventUserService, EventUserService>();
        services.AddScoped<IEventService, EventService>();
        services.AddScoped<IAllowedUserService, AllowedUserService>();
        services.AddScoped<BackGroundJobs, BackGroundJobs>();

        return services;
    }
}