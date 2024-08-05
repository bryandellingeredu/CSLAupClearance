using Application.Core;
using Application.Repository;
using Domain;
using MediatR;


namespace Application.EventUsers
{
    public class List
    {
        public class Query : IRequest<Result<List<EventUser>>> { }

        public class Handler : IRequestHandler<Query, Result<List<EventUser>>>
        {
            private readonly IEventUserService _eventUserService;

            public Handler(IEventUserService eventUserService)
            {
                _eventUserService = eventUserService;
            }
            public async Task<Result<List<EventUser>>> Handle(Query request, CancellationToken cancellationToken)
            {
                var eventUsers = await _eventUserService.GetEventUsersAsync(cancellationToken);
                return Result<List<EventUser>>.Success(eventUsers);
            }
        }
    }
}
