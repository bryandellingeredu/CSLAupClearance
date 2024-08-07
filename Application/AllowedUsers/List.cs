using Application.Core;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.AllowedUsers
{
    public class List
    {
        public class Query : IRequest<Result<List<AllowedUser>>> { }

        public class Handler : IRequestHandler<Query, Result<List<AllowedUser>>>
        {
            private readonly DataContext _context;
            public Handler(DataContext context) => _context = context;
           
            public async Task<Result<List<AllowedUser>>> Handle(Query request, CancellationToken cancellationToken) =>
                Result<List<AllowedUser>>.Success(await _context.AllowedUsers.ToListAsync());
            
        }
    }
}
