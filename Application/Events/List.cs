using Application.Core;
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
            private readonly IConfiguration _config;
            public Handler(IConfiguration config)
            {
                _config = config;
            }

            public async Task<Result<List<Event>>> Handle(Query request, CancellationToken cancellationToken)
            {
                var events = new List<Event>();
                var coordinators = new List<Coordinator>();
                var networks = new List<Network>();

                var connectionString = _config.GetConnectionString("CSLDConnectionString");

                using (var connection = new SqlConnection(connectionString))
                {
                    await connection.OpenAsync(cancellationToken);

                    // Fetch Coordinators
                    var coordinatorQuery = @"
                        SELECT 
                            j.[EventId],
                            e.[emailText],
                            e.[FirstName],
                            e.[LastName]
                        FROM [CSLNet].[dbo].[CSLEventAUP_Edit] e
                        JOIN [CSLNet].[dbo].[CSLEventAUP_EventEditJunction] j ON e.ID = j.EditId
                        WHERE e.Admin = 0";

                    using (var coordinatorCommand = new SqlCommand(coordinatorQuery, connection))
                    using (var reader = await coordinatorCommand.ExecuteReaderAsync(cancellationToken))
                    {
                        while (await reader.ReadAsync(cancellationToken))
                        {
                            var coordinator = new Coordinator
                            {
                                EventId = reader.GetInt32(reader.GetOrdinal("EventId")),
                                Email = reader.IsDBNull(reader.GetOrdinal("emailText")) ? null : reader.GetString(reader.GetOrdinal("emailText")),
                                FirstName = reader.IsDBNull(reader.GetOrdinal("FirstName")) ? null : reader.GetString(reader.GetOrdinal("FirstName")),
                                LastName = reader.IsDBNull(reader.GetOrdinal("LastName")) ? null : reader.GetString(reader.GetOrdinal("LastName")),
                            };
                            coordinators.Add(coordinator);
                        }
                    }

                    // Fetch Networks
                    var networkQuery = @"
                        SELECT 
                            j.[EventId],
                            n.[Name],
                            n.[Description]
                        FROM [CSLNet].[dbo].[CSLEventAUP_Networks] n
                        JOIN [CSLNet].[dbo].[CSLEventAUP_EventNetworkJunction] j ON n.ID = j.NetworkId";

                    using (var networkCommand = new SqlCommand(networkQuery, connection))
                    using (var reader = await networkCommand.ExecuteReaderAsync(cancellationToken))
                    {
                        while (await reader.ReadAsync(cancellationToken))
                        {
                            var network = new Network
                            {
                                EventId = reader.GetInt32(reader.GetOrdinal("EventId")),
                                Name = reader.IsDBNull(reader.GetOrdinal("Name")) ? null : reader.GetString(reader.GetOrdinal("Name")),
                                Description = reader.IsDBNull(reader.GetOrdinal("Description")) ? null : reader.GetString(reader.GetOrdinal("Description")),
                            };
                            networks.Add(network);
                        }
                    }

                    // Fetch Events
                    var eventQuery = @"
                        SELECT [ID],
                               [Name],
                               [StartDate],
                               [EndDate]
                        FROM [CSLNet].[dbo].[CSLEventAUP_Events]
                        WHERE [LogicalDeleteIn] = 0
                          AND [Active] = 1";

                    using (var eventCommand = new SqlCommand(eventQuery, connection))
                    using (var reader = await eventCommand.ExecuteReaderAsync(cancellationToken))
                    {
                        while (await reader.ReadAsync(cancellationToken))
                        {
                            var evt = new Event
                            {
                                ID = reader.GetInt32(reader.GetOrdinal("ID")),
                                Name = reader.IsDBNull(reader.GetOrdinal("Name")) ? null : reader.GetString(reader.GetOrdinal("Name")),
                                StartDate = reader.IsDBNull(reader.GetOrdinal("StartDate")) ? (DateTime?)null : reader.GetDateTime(reader.GetOrdinal("StartDate")),
                                EndDate = reader.IsDBNull(reader.GetOrdinal("EndDate")) ? (DateTime?)null : reader.GetDateTime(reader.GetOrdinal("EndDate")),
                                Networks = networks.Where(x => x.EventId == reader.GetInt32(reader.GetOrdinal("ID"))).ToList(),
                                Coordinators = coordinators.Where(x => x.EventId == reader.GetInt32(reader.GetOrdinal("ID"))).ToList()
                            };
                            events.Add(evt);
                        }
                    }
                }

                return Result<List<Event>>.Success(events);
            }
        }
    }
}
