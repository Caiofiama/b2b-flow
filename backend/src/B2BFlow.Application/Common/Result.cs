namespace B2BFlow.Application.Common;

public class Result<T>
{
    public bool IsSuccess { get; }
    public T? Value { get; }
    public string? Error { get; }
    public int StatusCode { get; }

    private Result(T value)
    {
        IsSuccess = true;
        Value = value;
        Error = null;
        StatusCode = 200;
    }

    private Result(string error, int statusCode)
    {
        IsSuccess = false;
        Value = default;
        Error = error;
        StatusCode = statusCode;
    }

    public static Result<T> Success(T value) => new(value);
    public static Result<T> Failure(string error, int statusCode = 400) => new(error, statusCode);
    public static Result<T> NotFound(string error = "Recurso não encontrado") => new(error, 404);
    public static Result<T> Unauthorized(string error = "Acesso não autorizado") => new(error, 401);
}

public class PagedResult<T>
{
    public IEnumerable<T> Items { get; set; } = new List<T>();
    public int Page { get; set; }
    public int PageSize { get; set; }
    public int TotalCount { get; set; }
    public int TotalPages => (int)Math.Ceiling((double)TotalCount / PageSize);

    public PagedResult(IEnumerable<T> items, int page, int pageSize, int totalCount)
    {
        Items = items;
        Page = page;
        PageSize = pageSize;
        TotalCount = totalCount;
    }
}
