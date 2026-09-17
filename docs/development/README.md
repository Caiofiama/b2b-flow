# Desenvolvimento Local

## Pré-Requisitos

- .NET SDK 8
- Node.js compatível com Next.js 14 e npm
- PostgreSQL, caso queira persistência local. Sem conexão configurada, os repositórios usam armazenamento em memória do processo.

## API

Na raiz do repositório:

```powershell
dotnet restore backend/B2BFlow.sln
dotnet run --project backend/src/B2BFlow.API --urls http://localhost:5000
```

Swagger: `http://localhost:5000/swagger`. A raiz `http://localhost:5000/` retorna 404 por não haver rota `/`.

Para usar PostgreSQL, configure `ConnectionStrings__DefaultConnection` no ambiente. Use [`backend/.env.example`](../../backend/.env.example) apenas como referência de nomes: `dotnet run` não carrega esse arquivo automaticamente. Não copie a chave JWT de exemplo para um ambiente exposto.

## Frontend

No diretório `frontend`, crie `.env.local` a partir de [`.env.local.example`](../../frontend/.env.local.example) e ajuste `NEXT_PUBLIC_API_URL` para `http://localhost:5000/api`. Depois:

```powershell
cd frontend
npm install
npm run dev
```

Abra `http://localhost:3000`. Sem `NEXT_PUBLIC_API_URL`, o cliente usa `http://localhost:5000/api` por padrão. O backend aceita origens `localhost` e `127.0.0.1` pela política CORS atual.

## Verificações Locais

```powershell
dotnet build backend/B2BFlow.sln --configuration Release
cd frontend
npm run lint
npm run build
```

Não há uma suíte automatizada de testes versionada neste repositório. Um build bem-sucedido não valida login, persistência ou proteção de rotas; consulte a [revisão de segurança](../security/README.md) e execute testes manuais antes de publicar.
