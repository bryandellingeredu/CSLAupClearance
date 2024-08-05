using Application.Core;
using Application.Repository;
using Domain;
using MediatR;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;


namespace Application.Events
{
    public class List
    {
        public class Query : IRequest<Result<List<Event>>> { }

        public class Handler : IRequestHandler<Query, Result<List<Event>>>
        {
            private readonly IEventService _eventService;

            public Handler(IEventService eventService)
            {
                _eventService = eventService;
            }

            public async Task<Result<List<Event>>> Handle(Query request, CancellationToken cancellationToken)
            {
                var events = await _eventService.GetEventsAsync(cancellationToken);
                return Result<List<Event>>.Success(events);
            }
        }
    }
}
