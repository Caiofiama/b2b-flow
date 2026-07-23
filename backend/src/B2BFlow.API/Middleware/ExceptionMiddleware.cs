using System.Net;
using System.Text.Json;
using FluentValidation;

namespace B2BFlow.API.Middleware;

public class ExceptionMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionMiddleware> _logger;

    public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext httpContext)
    {
        try
        {
            await _next(httpContext);
        }
        catch (ValidationException valEx)
        {
            _logger.LogWarning("Erro de validação: {Message}", valEx.Message);
            httpContext.Response.ContentType = "application/json";
            httpContext.Response.StatusCode = (int)HttpStatusCode.BadRequest;

            var response = new { error = valEx.Message, errors = valEx.Errors.Select(e => e.ErrorMessage) };
            await httpContext.Response.WriteAsync(JsonSerializer.Serialize(response));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro não tratado na API: {Message}", ex.Message);
            httpContext.Response.ContentType = "application/json";
            httpContext.Response.StatusCode = (int)HttpStatusCode.InternalServerError;

            var response = new { error = "Ocorreu um erro interno no servidor.", detail = ex.Message };
            await httpContext.Response.WriteAsync(JsonSerializer.Serialize(response));
        }
    }
}
