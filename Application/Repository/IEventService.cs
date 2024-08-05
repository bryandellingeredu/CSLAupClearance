using Domain;

namespace Application.Repository
{
    public interface IEventService
    {
        Task<List<Event>> GetEventsAsync(CancellationToken cancellationToken);
    }
}
