# API HTTP

Base local: `http://localhost:5000/api`. Em produção, a base conhecida é `https://b2b-flow-dei6.onrender.com/api`. Swagger está em `/swagger` no host da API. Os DTOs e validações no código são a referência final para campos e regras.

## Autenticação

| Método | Rota | Acesso | Observação |
| --- | --- | --- | --- |
| POST | `/auth/login` | Público | Recebe `{ "email": "...", "password": "..." }`; retorna `user`, `token` e cookie `access_token` em caso de sucesso |
| POST | `/auth/logout` | Público | Solicita exclusão do cookie no domínio da API; não revoga JWT emitido |
| GET | `/auth/me` | Autenticado | Retorna identificador, e-mail, nome e papel dos claims |

As demais rotas usam `[Authorize]`. O token pode ser enviado no cabeçalho `Authorization: Bearer <token>` ou via cookie da API. Veja [riscos atuais](../security/README.md) antes de usar essa autenticação com dados reais.

## Recursos

| Método | Rota | Acesso | Finalidade |
| --- | --- | --- | --- |
| GET | `/dashboard` | Autenticado | KPIs, histórico mensal e oportunidades recentes; retorna dados demo quando não há oportunidades |
| GET | `/clients?page=1&pageSize=10&search=...` | Autenticado | Lista paginada; retorna clientes demo quando a lista persistida está vazia |
| GET | `/clients/{id}` | Autenticado | Detalhe de cliente |
| POST | `/clients` | Autenticado | Cria cliente |
| PUT | `/clients/{id}` | Autenticado | Atualiza cliente |
| DELETE | `/clients/{id}` | Admin/Manager | Exclui cliente |
| GET | `/opportunities/pipeline` | Autenticado | Oportunidades por estágio; retorna dados demo se vazio |
| POST | `/opportunities` | Autenticado | Cria oportunidade |
| PATCH | `/opportunities/{id}/stage` | Autenticado | Atualiza estágio |
| DELETE | `/opportunities/{id}` | Admin/Manager | Exclui oportunidade |
| POST | `/ai/suggest-email` | Autenticado | Gera resposta de template para e-mail |
| POST | `/ai/client-summary` | Autenticado | Gera resumo sintético baseado na contagem de notas |

Clientes usam `name`, `email`, `phone`, `company` e `notes` (opcional). Oportunidades usam `title`, `valueInCents` (inteiro), `stage` (`1` Prospecção, `2` Proposta, `3` Negociação, `4` Fechado) e `clientId` (GUID). Campos e códigos de erro devem ser conferidos no Swagger e nos controllers ao integrar.

## Limitações do Contrato Atual

- Não existe endpoint de registro, convite ou administração de contas.
- As políticas `AdminOnly` e `ManagerOrAbove` são declaradas, mas os controllers aplicam papéis apenas aos dois endpoints `DELETE` acima. Não assumir matriz RBAC completa.
- Algumas respostas de demonstração contêm GUIDs gerados para exibição, sem entidade correspondente persistida. Não usar esses IDs para mutações.
