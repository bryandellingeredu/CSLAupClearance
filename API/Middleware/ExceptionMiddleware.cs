using Application;
using Application.Core;
using Azure.Identity;
using Microsoft.Graph;
using Microsoft.Graph.Models;
using System.Net;
using System.Text;
using System.Text.Json;

namespace API.Middleware
{
    public class ExceptionMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionMiddleware> _logger;
        private readonly IHostEnvironment _env;
        private readonly IConfiguration _config;

        private static GraphServiceClient _appClient;
        private static ClientSecretCredential _clientSecretCredential;

        public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger, IHostEnvironment env, IConfiguration config)
        {
            _next = next;
            _logger = logger;
            _env = env;
            _config = config;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                context.Request.EnableBuffering();

                await _next(context);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ex.Message);
                context.Response.ContentType = "application/json";
                context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;

                try
                {
                    var settings = new Settings().LoadSettings(_config) ?? throw new NullReferenceException("Settings cannot be null");

                    if (_clientSecretCredential == null)
                    {
                        _clientSecretCredential = new ClientSecretCredential(settings.TenantId, settings.ClientId, settings.ClientSecret);
                    }

                    if (_appClient == null)
                    {
                        _appClient = new GraphServiceClient(_clientSecretCredential, new[] { "https://graph.microsoft.com/.default" });
                    }

                    var headers = string.Join("\n", context.Request.Headers.Select(h => $"{h.Key}: {h.Value}"));
                    var requestBody = await ReadRequestBodyAsync(context);

                    var body = new StringBuilder()
                        .AppendLine($"User: {context.User.Identity?.Name ?? "Anonymous"}")
                        .AppendLine($"Time: {DateTime.Now}")
                        .AppendLine($"Error Message: {ex.Message}")
                        .AppendLine($"Stack Trace: {ex.StackTrace}")
                        .AppendLine($"Request Method: {context.Request.Method}")
                        .AppendLine($"Request URL: {context.Request.Path}{context.Request.QueryString}")
                        .AppendLine($"Request Headers: {headers}")
                        .AppendLine($"Request Body: {requestBody}")
                        .ToString();

                    if (ex.InnerException != null)
                    {
                        body += $"\nInner Exception Message: {ex.InnerException.Message}\nInner Exception Stack Trace:\n{ex.InnerException.StackTrace}";
                    }

                    var recipients = new List<Recipient>
                    {
                        new Recipient
                        {
                            EmailAddress = new EmailAddress { Address = "bryan.d.dellinger.civ@army.mil" }
                        }
                    };

                    var message = new Microsoft.Graph.Models.Message
                    {
                        Subject = "Error occured in AUP G2 Clearance",
                        Body = new ItemBody
                        {
                            ContentType = BodyType.Html,
                            Content = body
                        },
                        ToRecipients = recipients
                    };

                    var mailBody = new Microsoft.Graph.Users.Item.SendMail.SendMailPostRequestBody
                    {
                        Message = message,
                        SaveToSentItems = false
                    };

                    await _appClient.Users[settings.ServiceAccount].SendMail.PostAsync(mailBody);
                }
                catch (Exception emailEx)
                {
                    _logger.LogError(emailEx, "Failed to send error email.");
                }

                var response = _env.IsDevelopment()
                    ? new AppException(context.Response.StatusCode, ex.Message, ex.StackTrace?.ToString())
                    : new AppException(context.Response.StatusCode, "Internal Server Error");

                var options = new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };
                var json = JsonSerializer.Serialize(response, options);

                await context.Response.WriteAsync(json);
            }
        }

        private async Task<string> ReadRequestBodyAsync(HttpContext context)
        {
            context.Request.Body.Position = 0;

            if (context.Request.ContentLength == null || context.Request.ContentLength == 0)
            {
                return string.Empty;
            }

            using (var reader = new StreamReader(context.Request.Body, Encoding.UTF8, false, 4096, true))
            {
                var body = await reader.ReadToEndAsync();
                context.Request.Body.Position = 0;
                return body;
            }
        }
    }
}
