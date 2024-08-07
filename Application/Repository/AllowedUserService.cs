using Microsoft.EntityFrameworkCore;
using Persistence;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Repository
{
    public class AllowedUserService : IAllowedUserService
    {
        private readonly DataContext _context;

        public AllowedUserService(DataContext context) => _context = context;

        public async Task<bool> IsAdmin(string email) =>
            await _context.AllowedUsers
                .Where(x => x.Email.ToLower() == email.ToLower())
                .Where(x => x.IsAdmin)
                .AnyAsync();  
        
        public async Task<bool> IsVerifiedUser(string email) =>
          await _context.AllowedUsers
                .Where(x => x.Email.ToLower() == email.ToLower())
                .AnyAsync();
    }
}
