using Application.Core;
using MediatR;
using Microsoft.Extensions.Configuration;
using Microsoft.Data.SqlClient;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace Application.EventUsers
{
    public class Update
    {
        public class Command : IRequest<Result<Unit>>
        {
            public int Id { get; set; }
            public bool Clearance { get; set; }
            public string Email { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly IConfiguration _config;
            public Handler(IConfiguration config)
            {
                _config = config;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var connectionString = _config.GetConnectionString("CSLDConnectionString");

                try
                {
                    using (var connection = new SqlConnection(connectionString))
                    {
                        await connection.OpenAsync(cancellationToken);

                        var query = @"
                            UPDATE [CSLNet].[dbo].[CSLEventAUP_Users]
                            SET [AccountCleared] = @Clearance, 
                                [AccountClearedBy] = @Email, 
                                [AccountClearedDate] = @AccountClearedDate
                            WHERE ID = @Id";

                        using (var command = new SqlCommand(query, connection))
                        {
                            command.Parameters.AddWithValue("@Clearance", request.Clearance);
                            command.Parameters.AddWithValue("@Email", request.Clearance ? (object)request.Email : DBNull.Value);
                            command.Parameters.AddWithValue("@AccountClearedDate", request.Clearance ? (object)DateTime.Now : DBNull.Value);
                            command.Parameters.AddWithValue("@Id", request.Id);

                            var result = await command.ExecuteNonQueryAsync(cancellationToken);

                            if (result > 0)
                            {
                                return Result<Unit>.Success(Unit.Value);
                            }
                            else
                            {
                                return Result<Unit>.Failure("No rows affected.");
                            }
                        }
                    }
                }
                catch (Exception ex)
                {
                    return Result<Unit>.Failure($"An error occurred: {ex.Message}");
                }
            }
        }
    }
}
