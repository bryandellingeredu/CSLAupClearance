using Application.AllowedUsers;
using Application.Core;
using Application.Repository;
using Domain;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace API.Controllers
{
    public class AllowedUsersController : BaseApiController
    {
        private readonly IAllowedUserService _allowedUserService;

        public AllowedUsersController(IAllowedUserService allowedUserService)
        {
            _allowedUserService = allowedUserService;
        }

        [HttpGet]
        public async Task<ActionResult> GetAllowedUsers()
        {
            var email = User.FindFirstValue(ClaimTypes.Email);
            if (!await _allowedUserService.IsAdmin(email))
            {
                return Unauthorized();
            }

            return HandleResult(await Mediator.Send(new List.Query()));
        }

        [HttpPost]
        public async Task<IActionResult> CreateUpdateRegistration([FromBody] AllowedUser allowedUser)
        {
            var email = User.FindFirstValue(ClaimTypes.Email);
            if (!await _allowedUserService.IsAdmin(email))
            {
                return Unauthorized();
            }

           return HandleResult(await Mediator.Send(
                 new Update.Command { AllowedUser = allowedUser, Email = User.FindFirstValue(ClaimTypes.Email) }));
        }
           

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAllowedUser(Guid id)
        {
            var email = User.FindFirstValue(ClaimTypes.Email);
            if (!await _allowedUserService.IsAdmin(email))
            {
                return Unauthorized();
            }
            return HandleResult(await Mediator.Send(new Delete.Command { Id = id }));
        }
      

    }
}