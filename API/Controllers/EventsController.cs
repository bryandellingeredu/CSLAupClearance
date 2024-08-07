using Application.Events;
using Application.Repository;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.Threading.Tasks;

namespace API.Controllers
{
    public class EventsController : BaseApiController
    {
        private readonly IAllowedUserService _allowedUserService;

        public EventsController(IAllowedUserService allowedUserService)
        {
            _allowedUserService = allowedUserService;
        }

        [HttpGet]
        public async Task<ActionResult> GetEvents()
        {
            var email = User.FindFirstValue(ClaimTypes.Email);
            if (!await _allowedUserService.IsVerifiedUser(email))
            {
                return Unauthorized();
            }
            return HandleResult(await Mediator.Send(new List.Query()));
        }
    }
}
