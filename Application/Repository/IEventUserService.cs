using Domain;

namespace Application.Repository
{
    public interface IEventUserService
    {
        Task<List<EventUser>> GetEventUsersAsync(CancellationToken cancellationToken);
    }
}
