using B2BFlow.Application.Auth.Commands;
using B2BFlow.Application.DTOs;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace B2BFlow.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IMediator _mediator;

    public AuthController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        var result = await _mediator.Send(new LoginCommand(request.Email, request.Password));

        if (!result.IsSuccess || result.Value == null)
        {
            return StatusCode(result.StatusCode, new { error = result.Error });
        }

        // Set HTTP-Only Cookie with JWT token
        var cookieOptions = new CookieOptions
        {
            HttpOnly = true,
            Secure = true, // Required for SameSite=None in HTTPS/Vercel
            SameSite = SameSiteMode.None,
            Expires = DateTime.UtcNow.AddHours(8),
            Path = "/"
        };

        Response.Cookies.Append("access_token", result.Value.Token, cookieOptions);

        return Ok(new { user = result.Value.User, message = "Login realizado com sucesso" });
    }

    [HttpPost("logout")]
    public IActionResult Logout()
    {
        Response.Cookies.Delete("access_token", new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.None,
            Path = "/"
        });

        return Ok(new { message = "Logout realizado com sucesso" });
    }

    [HttpGet("me")]
    [Authorize]
    public IActionResult Me()
    {
        var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value ?? User.FindFirst("sub")?.Value;
        var email = User.FindFirst(System.Security.Claims.ClaimTypes.Email)?.Value;
        var name = User.FindFirst(System.Security.Claims.ClaimTypes.Name)?.Value;
        var role = User.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value;

        return Ok(new { id = userId, email, name, role });
    }
}
