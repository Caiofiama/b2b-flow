using System.Diagnostics;
using MediatR;
using Microsoft.Extensions.Logging;

namespace B2BFlow.Application.Common.Behaviors;

public class LoggingBehavior<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse>
    where TRequest : IRequest<TResponse>
{
    private readonly ILogger<LoggingBehavior<TRequest, TResponse>> _logger;

    public LoggingBehavior(ILogger<LoggingBehavior<TRequest, TResponse>> logger)
    {
        _logger = logger;
    }

    public async Task<TResponse> Handle(TRequest request, RequestHandlerDelegate<TResponse> next, CancellationToken cancellationToken)
    {
        var requestName = typeof(TRequest).Name;
        _logger.LogInformation("Executando MediatR Request: {Name}", requestName);

        var timer = Stopwatch.StartNew();
        var response = await next();
        timer.Stop();

        if (timer.ElapsedMilliseconds > 500)
        {
            _logger.LogWarning("Request Lenta: {Name} ({ElapsedMilliseconds} ms)", requestName, timer.ElapsedMilliseconds);
        }

        _logger.LogInformation("Concluído MediatR Request: {Name}", requestName);
        return response;
    }
}
