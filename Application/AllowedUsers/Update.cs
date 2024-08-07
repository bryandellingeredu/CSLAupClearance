using Application.Core;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;


namespace Application.AllowedUsers
{
    public class Update
    {
        public class Command : IRequest<Result<Unit>>
        {
            public AllowedUser AllowedUser { get; set; }
            public string Email { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _context;

            public Handler(DataContext context) => _context = context;

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var existingAllowedUser = await _context.AllowedUsers.FirstOrDefaultAsync(x => x.Id == request.AllowedUser.Id);
                if (existingAllowedUser != null ) {
                    existingAllowedUser.Email = request.AllowedUser.Email;
                    existingAllowedUser.IsAdmin = request.AllowedUser.IsAdmin;
                }
                else
                {
                
                    _context.AllowedUsers.Add(new AllowedUser
                    {
                        Id = request.AllowedUser.Id,
                        Email = request.AllowedUser.Email,
                        IsAdmin = request.AllowedUser.IsAdmin
                    });
                }
                var result = await _context.SaveChangesAsync() > 0;
                if (!result) return Result<Unit>.Failure("Failed to update");
                return Result<Unit>.Success(Unit.Value);
            }
        }
    }
}
