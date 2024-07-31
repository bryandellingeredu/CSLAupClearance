using API.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using Persistence;
using System.Net;
using System.Text;
using Newtonsoft.Json;

namespace API.Extensions
{
    public static class IdentityServiceExtensions
    {
        public static IServiceCollection AddIdentityServices(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddIdentity<IdentityUser, IdentityRole>(opt =>
            {
                opt.User.AllowedUserNameCharacters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-._@+'";
            })
            .AddEntityFrameworkStores<DataContext>();

            var keyString = configuration["SecuritySettings:SymmetricSecurityKey"];
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(keyString));

            services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(opt =>
            {
                opt.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = key,
                    ValidateIssuer = false,
                    ValidateAudience = false
                };

                // Disable redirect on unauthorized access
                opt.Events = new JwtBearerEvents
                {
                    OnChallenge = context =>
                    {
                        context.HandleResponse();
                        context.Response.StatusCode = (int)HttpStatusCode.Unauthorized;
                        context.Response.ContentType = "application/json";
                        return context.Response.WriteAsync(Newtonsoft.Json.JsonConvert.SerializeObject(new
                        {
                            StatusCode = context.Response.StatusCode,
                            Message = "Unauthorized access"
                        }));
                    }
                };
            });

            services.AddAuthorization();

            services.AddScoped<TokenService>();

            return services;
        }
    }
}