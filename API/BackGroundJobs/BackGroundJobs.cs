using Application.Repository;
using Domain;
using Hangfire;
using Microsoft.EntityFrameworkCore;
using Persistence;
using Microsoft.Graph;
using Microsoft.Graph.Models;
using Azure.Identity;

namespace API.BackGroundJobs
{
    public class BackGroundJobs
    {
        private readonly DataContext _context;
        private readonly IConfiguration _config;
        private readonly IEventService _eventService;
        private readonly IEventUserService _eventUserService;
        private static GraphServiceClient _appClient;
        private static ClientSecretCredential _clientSecretCredential;


        public BackGroundJobs(DataContext context, IConfiguration config, IEventService eventService, IEventUserService eventUserService)
        {
            _context = context;
            _config = config;
            _eventService = eventService;
            _eventUserService = eventUserService;
        }

        [AutomaticRetry(Attempts = 0)]
        public void EmailNotificationJob()
        {
            EmailNotificationJobAsync().GetAwaiter().GetResult();
        }

        public async Task EmailNotificationJobAsync()
        {
            using var cts = new CancellationTokenSource();
            var cancellationToken = cts.Token;

            List<EventUser> eventUsers = await _eventUserService.GetEventUsersAsync(cancellationToken);
            List<Domain.Event> events = await _eventService.GetEventsAsync(cancellationToken);

            var unclearedEventUsers = eventUsers.Where(x => !x.Cleared).ToList();

            string body = $"These users have not yet been cleared by the G2 for upcoming CSL Events";

            foreach (var user in unclearedEventUsers.OrderBy(x => x.EventName).ThenBy(x => x.LastName))
            {
                var evt = events.First(x => x.ID == user.EventId);
                body = body + $"<p>{user.LastName}, {user.FirstName} for {user.EventName} {evt.StartDate?.ToString("MM/dd/yyyy")}</p>";
            }



            body = body + "<p></p><p></p><p></p> To clear these users go to <a href='https://apps.armywarcollege.edu/aupclearance'> The G2 Clearance App </a> ";

            Settings s = new Settings();
            var _settings = s.LoadSettings(_config);

            _ = _settings ?? throw new System.NullReferenceException("Settings cannot be null");

            if (_clientSecretCredential == null)
            {
                _clientSecretCredential = new ClientSecretCredential(
                  _settings.TenantId, _settings.ClientId, _settings.ClientSecret);
            }

            if (_appClient == null)
            {
                _appClient = new GraphServiceClient(_clientSecretCredential,
                  new[] {
            "https://graph.microsoft.com/.default"
                  });
            }

            var recipients = await _context.AllowedUsers.Select(user => new Recipient
            {
                EmailAddress = new EmailAddress { Address = user.Email }
            }).ToListAsync();

            var message = new Message
            {
                Subject = "Pending G2 Clearance List",
                Body = new ItemBody
                {
                    ContentType = BodyType.Html,
                    Content = body
                },
                ToRecipients = recipients,
            };

            Microsoft.Graph.Users.Item.SendMail.SendMailPostRequestBody mailbody = new()
            {
                Message = message,
                SaveToSentItems = false
            };

            try
            {
                await _appClient.Users[_settings.ServiceAccount]
                .SendMail
                .PostAsync(mailbody);
            }
            catch (Exception ex)
            {
                throw;
            }

        }


    }
}

