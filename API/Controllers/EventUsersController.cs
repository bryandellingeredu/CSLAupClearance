using Application.EventUsers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class EventUsersController : BaseApiController
    {
        [HttpGet]
        public async Task<ActionResult> GetEventUsers() => HandleResult(await Mediator.Send(new List.Query()));
    }
}
