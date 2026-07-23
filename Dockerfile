FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy csproj files and restore
COPY ["backend/src/B2BFlow.Domain/B2BFlow.Domain.csproj", "backend/src/B2BFlow.Domain/"]
COPY ["backend/src/B2BFlow.Application/B2BFlow.Application.csproj", "backend/src/B2BFlow.Application/"]
COPY ["backend/src/B2BFlow.Infrastructure/B2BFlow.Infrastructure.csproj", "backend/src/B2BFlow.Infrastructure/"]
COPY ["backend/src/B2BFlow.API/B2BFlow.API.csproj", "backend/src/B2BFlow.API/"]

RUN dotnet restore "backend/src/B2BFlow.API/B2BFlow.API.csproj"

# Copy full source and build
COPY backend/src/ backend/src/
WORKDIR "/src/backend/src/B2BFlow.API"
RUN dotnet publish "B2BFlow.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Runtime image
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=build /app/publish .
ENV PORT=8080
EXPOSE 8080
ENTRYPOINT ["dotnet", "B2BFlow.API.dll"]
