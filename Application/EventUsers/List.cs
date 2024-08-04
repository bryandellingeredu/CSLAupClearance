using Application.Core;
using Domain;
using MediatR;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.EventUsers
{
    public class List
    {
        public class Query : IRequest<Result<List<EventUser>>> { }

        public class Handler : IRequestHandler<Query, Result<List<EventUser>>>
        {
            private readonly IConfiguration _config;
            public Handler(IConfiguration config)
            {
                _config = config;
            }
            public async Task<Result<List<EventUser>>> Handle(Query request, CancellationToken cancellationToken)
            {
                var eventUsers = new List<EventUser>();
                var connectionString = _config.GetConnectionString("CSLDConnectionString");

                using (var connection = new SqlConnection(connectionString))
                {
                    await connection.OpenAsync(cancellationToken);

                    var query = @"
                         SELECT c.[ID]
                        ,c.[FirstName]
                        ,c.[LastName]
                        ,c.[MiddleInitial]
                        ,c.[EventId] 
                        ,e.[Name]
                        ,c.[AccountCleared]
                        ,c.[AccountClearedBy]
                        ,c.[AccountClearedDate]
                        FROM [CSLNet].[dbo].[CSLEventAUP_Users] c
                        JOIN [CSLNet].[dbo].[CSLEventAUP_Events] e ON c.EventId = e.ID
                        WHERE e.Active = 1
                        AND e.LogicalDeleteIn = 0";

                    using (var command = new SqlCommand(query, connection))
                    {
                        using (var reader = await command.ExecuteReaderAsync(cancellationToken))
                        {
                            while (await reader.ReadAsync(cancellationToken))
                            {
                                var eventUser = new EventUser
                                {
                                    ID = reader.GetInt32(reader.GetOrdinal("ID")),
                                    EventId = reader.GetInt32(reader.GetOrdinal("EventId")),
                                    FirstName = reader.IsDBNull(reader.GetOrdinal("FirstName")) ? null : reader.GetString(reader.GetOrdinal("FirstName")),
                                    LastName = reader.IsDBNull(reader.GetOrdinal("LastName")) ? null : reader.GetString(reader.GetOrdinal("LastName")),
                                    MiddleInitial = reader.IsDBNull(reader.GetOrdinal("MiddleInitial")) ? null : reader.GetString(reader.GetOrdinal("MiddleInitial")),
                                    EventName = reader.IsDBNull(reader.GetOrdinal("Name")) ? null : reader.GetString(reader.GetOrdinal("Name")),
                                    ClearedBy = reader.IsDBNull(reader.GetOrdinal("AccountClearedBy")) ? null : reader.GetString(reader.GetOrdinal("AccountClearedBy")),
                                    ClearedAt = reader.IsDBNull(reader.GetOrdinal("AccountClearedDate")) ? (DateTime?)null : reader.GetDateTime(reader.GetOrdinal("AccountClearedDate")),
                                    Cleared = !reader.IsDBNull(reader.GetOrdinal("AccountCleared")) && reader.GetBoolean(reader.GetOrdinal("AccountCleared"))
                                };
                                eventUsers.Add(eventUser);
                            }
                        }
                    }
                }
                return Result<List<EventUser>>.Success(eventUsers);
            }
        }
    }
}
