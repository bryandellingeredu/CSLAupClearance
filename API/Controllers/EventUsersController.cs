using Application.EventUsers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;
using System.Security.Claims;
using Application.Repository;

namespace API.Controllers
{
    public class EventUsersController : BaseApiController
    {
        private readonly IAllowedUserService _allowedUserService;

        public EventUsersController(IAllowedUserService allowedUserService)
        {
            _allowedUserService = allowedUserService;
        }

        [HttpGet]
        public async Task<ActionResult> GetEventUsers()  {

            var email = User.FindFirstValue(ClaimTypes.Email);
            if (!await _allowedUserService.IsVerifiedUser(email))
            {
                return Unauthorized();
            }
            return HandleResult(await Mediator.Send(new List.Query()));
            }

        [HttpPut("{id}")]
        public async Task<IActionResult> PublishRegistration(int id, UpdateDTO updateDTO)
        {
            var email = User.FindFirstValue(ClaimTypes.Email);
            if (!await _allowedUserService.IsVerifiedUser(email))
            {
                return Unauthorized();
            }
            return HandleResult(await Mediator.Send(new Application.EventUsers.Update.Command { Id = id, Clearance = updateDTO.Cleared, Email = email }));
        }
    }

    public class UpdateDTO
    {
        public bool Cleared { get; set; }
    }
}
