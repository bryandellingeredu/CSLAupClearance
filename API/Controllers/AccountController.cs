using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using System.Text.Json;
using System.IdentityModel.Tokens.Jwt;
using System.Data;
using API.Services;
using System.Security.Claims;
using Application.Repository;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]


    public class AccountController : ControllerBase
    {
        private readonly UserManager<IdentityUser> _userManager;
        private readonly TokenService _tokenService;
        private readonly IAllowedUserService _allowedUserService;

        public AccountController(
            UserManager<IdentityUser> userManager, TokenService tokenService, IAllowedUserService allowedUserService)
            {
               _userManager = userManager;
               _tokenService = tokenService;
               _allowedUserService = allowedUserService;
        }

              

                [AllowAnonymous]
                 [HttpPost("login")]
                  public async Task<ActionResult<UserDTO>> Login(GraphTokenDTO graphToken){
                    var h = new JwtSecurityTokenHandler();
                    var tokenS = h.ReadToken(graphToken.Token) as JwtSecurityToken;
                    string email = tokenS.Claims.FirstOrDefault(claim => claim.Type == "upn")?.Value;
                    string displayName = tokenS.Claims.FirstOrDefault(claim => claim.Type == "name")?.Value;
                    IdentityUser user = await _userManager.FindByEmailAsync(email);
                    if (user == null)
                    {
                        user = new IdentityUser
                        {
                            UserName = email,
                            Email = email,
                        };
                    var result = await _userManager.CreateAsync(user);
                    if (!result.Succeeded)
                    {
                        return BadRequest("User creation failed");
                    }
                   }
                    List<string> roles = new List<string>();
                    if (await _allowedUserService.IsVerifiedUser(email)) roles.Add("verified");
                    if (await _allowedUserService.IsAdmin(email)) roles.Add("admin");

            UserDTO userDTO = new UserDTO
                   {
                    Mail = user.Email,
                    UserName = user.UserName,
                    Token =  _tokenService.CreateToken(user, displayName),
                    DisplayName = displayName,
                    Roles = roles.ToArray()
                   };
                 return Ok(userDTO);
        }
        
    }
        public class UserDTO
    {
        public string Mail { get; set; }
        public string UserName { get; set; }
        public string Token { get; set; }
        public string DisplayName { get; set; }
        public string[] Roles { get; set; }
    }

    public class GraphUser
    {
        public string Mail { get; set; }
        public string DisplayName { get; set; }
        public string Id { get; set; }
    }

        public class GraphTokenDTO
    {
        public string Token { get; set; }
    }
}