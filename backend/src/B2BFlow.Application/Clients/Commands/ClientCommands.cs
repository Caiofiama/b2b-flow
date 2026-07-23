using B2BFlow.Application.Common;
using B2BFlow.Application.DTOs;
using B2BFlow.Domain.Entities;
using B2BFlow.Domain.Interfaces;
using FluentValidation;
using MediatR;

namespace B2BFlow.Application.Clients.Commands;

public record CreateClientCommand(string Name, string Email, string Phone, string Company, string? Notes, Guid CreatedByUserId) : IRequest<Result<ClientDto>>;

public class CreateClientCommandValidator : AbstractValidator<CreateClientCommand>
{
    public CreateClientCommandValidator()
    {
        RuleFor(x => x.Name).NotEmpty().WithMessage("Nome é obrigatório");
        RuleFor(x => x.Email).NotEmpty().EmailAddress().WithMessage("E-mail inválido");
        RuleFor(x => x.Company).NotEmpty().WithMessage("Empresa é obrigatória");
    }
}

public class CreateClientCommandHandler : IRequestHandler<CreateClientCommand, Result<ClientDto>>
{
    private readonly IRepository<Client> _clientRepository;
    private readonly IUnitOfWork _unitOfWork;

    public CreateClientCommandHandler(IRepository<Client> clientRepository, IUnitOfWork unitOfWork)
    {
        _clientRepository = clientRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<Result<ClientDto>> Handle(CreateClientCommand request, CancellationToken ct)
    {
        var client = new Client
        {
            Id = Guid.NewGuid(),
            Name = request.Name,
            Email = request.Email,
            Phone = request.Phone,
            Company = request.Company,
            Notes = request.Notes,
            CreatedByUserId = request.CreatedByUserId,
            CreatedAt = DateTime.UtcNow
        };

        await _clientRepository.AddAsync(client, ct);
        await _unitOfWork.SaveChangesAsync(ct);

        var dto = new ClientDto(client.Id, client.Name, client.Email, client.Phone, client.Company, client.Notes, client.CreatedByUserId, client.CreatedAt, 0, 0);
        return Result<ClientDto>.Success(dto);
    }
}

public record UpdateClientCommand(Guid Id, string Name, string Email, string Phone, string Company, string? Notes) : IRequest<Result<ClientDto>>;

public class UpdateClientCommandHandler : IRequestHandler<UpdateClientCommand, Result<ClientDto>>
{
    private readonly IRepository<Client> _clientRepository;
    private readonly IUnitOfWork _unitOfWork;

    public UpdateClientCommandHandler(IRepository<Client> clientRepository, IUnitOfWork unitOfWork)
    {
        _clientRepository = clientRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<Result<ClientDto>> Handle(UpdateClientCommand request, CancellationToken ct)
    {
        var client = await _clientRepository.GetByIdAsync(request.Id, ct);
        if (client == null) return Result<ClientDto>.NotFound("Cliente não encontrado");

        client.Name = request.Name;
        client.Email = request.Email;
        client.Phone = request.Phone;
        client.Company = request.Company;
        client.Notes = request.Notes;
        client.UpdatedAt = DateTime.UtcNow;

        _clientRepository.Update(client);
        await _unitOfWork.SaveChangesAsync(ct);

        var dto = new ClientDto(client.Id, client.Name, client.Email, client.Phone, client.Company, client.Notes, client.CreatedByUserId, client.CreatedAt);
        return Result<ClientDto>.Success(dto);
    }
}

public record DeleteClientCommand(Guid Id) : IRequest<Result<bool>>;

public class DeleteClientCommandHandler : IRequestHandler<DeleteClientCommand, Result<bool>>
{
    private readonly IRepository<Client> _clientRepository;
    private readonly IUnitOfWork _unitOfWork;

    public DeleteClientCommandHandler(IRepository<Client> clientRepository, IUnitOfWork unitOfWork)
    {
        _clientRepository = clientRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<Result<bool>> Handle(DeleteClientCommand request, CancellationToken ct)
    {
        var client = await _clientRepository.GetByIdAsync(request.Id, ct);
        if (client == null) return Result<bool>.NotFound("Cliente não encontrado");

        _clientRepository.Delete(client);
        await _unitOfWork.SaveChangesAsync(ct);

        return Result<bool>.Success(true);
    }
}
