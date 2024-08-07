using Application.Core;
using MediatR;
using Persistence;

namespace Application.AllowedUsers
{
    public class Delete
    {
        public class Command : IRequest<Result<Unit>>
        {
            public Guid Id { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _context;

            public Handler(DataContext context) => _context = context;
            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var allowedUser = await _context.AllowedUsers.FindAsync(request.Id);

                if (allowedUser == null) return Result<Unit>.Failure("User not found");

                _context.AllowedUsers.Remove(allowedUser);

                var success = await _context.SaveChangesAsync(cancellationToken) > 0;

                if (!success) return Result<Unit>.Failure("Failed to delete the user");

                return Result<Unit>.Success(Unit.Value);
            }
        }
    }
}
