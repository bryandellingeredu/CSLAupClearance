using Application.Repository;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Text;
using System.Threading;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace API.Controllers
{
    public class ExportToExcelController : BaseApiController
    {
        private readonly IEventService _eventService;
        private readonly IEventUserService _eventUserService;

        public ExportToExcelController(IEventService eventService, IEventUserService eventUserService)
        {
            _eventService = eventService;
            _eventUserService = eventUserService; 
        }

        [AllowAnonymous]
        [HttpPost]
        public async Task<IActionResult> CsvAsync([FromBody] EventUserIdsDTO eventUserIdsDTO)
        {
            using var cts = new CancellationTokenSource();
            var cancellationToken = cts.Token;
            List<EventUser>  eventUsers = await _eventUserService.GetEventUsersAsync(cancellationToken);
            List<Event> events = await _eventService.GetEventsAsync(cancellationToken);
            var builder = new StringBuilder();
            builder.AppendLine("Cleared, Last Name, First Name, Middle Initial, Event, Event Date, G2 Cleared By, G2 Cleared Date, Networks, Event Coordinators ");
            foreach (int Id in eventUserIdsDTO.EventUserIds)
            {
             EventUser eventUser = eventUsers.First(x =>x.ID == Id);
                Event evt = events.First(x => x.ID == eventUser.EventId);
                string cleared = eventUser.Cleared ? "TRUE" : "FALSE";
                string eventDate = string.Empty;
                if (evt.StartDate != null && evt.EndDate != null)
                {
                    eventDate = $"{evt.StartDate:MM/dd/yyyy} - {evt.EndDate:MM/dd/yyyy}";
                }
                string eventCoordinators = string.Empty;    
                if(evt.Coordinators.Any()) {
                    var coordEmails = evt.Coordinators.Select(x => x.Email).ToList();
                    eventCoordinators = string.Join(";", coordEmails);
                }
                string networks = string.Empty; 
                if (evt.Networks.Any())
                {
                    var networkNames = evt.Networks.Select(x => x.Name).ToList(); 
                    networks = string.Join(";", networkNames);
                }

                string clearedBy = string.Empty;
                if (eventUser.Cleared)
                {
                    clearedBy = eventUser.ClearedBy;
                }

                string clearedAt = string.Empty;    
                if (eventUser.ClearedAt != null && eventUser.Cleared)
                {       
                    clearedAt = $"{eventUser.ClearedAt:MM/dd/yyyy}";
                }    
                builder.AppendLine($"\"{cleared}\",\"{eventUser.LastName}\",\"{eventUser.FirstName}\",\"{eventUser.MiddleInitial}\",\"{evt.Name}\",\"{eventDate}\",\"{clearedBy}\",\"{clearedAt}\",\"{networks}\",\"{eventCoordinators}\"");
            
            }
            return File(Encoding.UTF8.GetBytes(builder.ToString()), "text/csv", "eventusers.csv");
        }
    }

    public class EventUserIdsDTO
    {
        public List<int> EventUserIds { get; set; }
    }
}
