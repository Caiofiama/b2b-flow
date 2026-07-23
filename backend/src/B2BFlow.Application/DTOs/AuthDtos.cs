using B2BFlow.Domain.Enums;

namespace B2BFlow.Application.DTOs;

public record UserDto(Guid Id, string Name, string Email, UserRole Role);

public record LoginRequest(string Email, string Password);

public record LoginResponse(UserDto User, string Token);
