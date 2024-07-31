using Application.Events;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class EventsController : BaseApiController
    {
        [HttpGet]
        public async Task<ActionResult> GetEvents() => HandleResult(await Mediator.Send(new List.Query()));
    }
}
