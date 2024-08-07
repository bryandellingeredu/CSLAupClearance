using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Repository
{
    public interface IAllowedUserService
    {
        Task<bool> IsVerifiedUser(string email);
        Task<bool> IsAdmin(string email);
    }
}
