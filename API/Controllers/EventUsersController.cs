using Application.EventUsers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;
using System.Security.Claims;

namespace API.Controllers
{
    public class EventUsersController : BaseApiController
    {
        [AllowAnonymous]
        [HttpGet]
        public async Task<ActionResult> GetEventUsers() => HandleResult(await Mediator.Send(new List.Query()));

        [HttpPut("{id}")]
        public async Task<IActionResult> PublishRegistration(int id, UpdateDTO updateDTO) => HandleResult(await Mediator.Send(new Application.EventUsers.Update.Command { Id = id, Clearance = updateDTO.Cleared, Email = User.FindFirstValue(ClaimTypes.Email) }));
    }

    public class UpdateDTO
    {
        public bool Cleared { get; set; }
    }
}
