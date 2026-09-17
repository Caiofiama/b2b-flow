# Deploy e Operação

## Endereços Conhecidos

- Frontend de produção: [https://b2b-flow-bay.vercel.app](https://b2b-flow-bay.vercel.app)
- API no Render: [https://b2b-flow-dei6.onrender.com/swagger](https://b2b-flow-dei6.onrender.com/swagger)

O endereço longo `b2b-flow-ilqhdju27-caiofiamas-projects.vercel.app` é um URL de deployment que já redirecionou visitantes externos para o SSO da Vercel. Não o use como endereço público. Confirme o domínio marcado **Production** no painel do projeto antes de atualizar links externos.

## Configuração

O `Dockerfile` da raiz compila e publica `backend/src/B2BFlow.API` em .NET 8 para Render. Há também um `backend/Dockerfile`; verifique qual arquivo e contexto o serviço realmente usa. O código do frontend está em `frontend`; confirme o Root Directory configurado no projeto da Vercel.

| Componente | Variável | Uso |
| --- | --- | --- |
| Frontend | `NEXT_PUBLIC_API_URL` | URL completa da API terminada em `/api`; embutida no build do Next.js |
| Backend | `ConnectionStrings__DefaultConnection` | PostgreSQL; se ausente/indisponível o repositório cai para memória |
| Backend | `Jwt__Key`, `Jwt__Issuer`, `Jwt__Audience` | Assinatura e validação de JWT; não usar valores de exemplo |
| Backend | `OpenAI__ApiKey` | Lida pelo serviço, mas a resposta de IA continua simulada |

`Cors__FrontendUrl` consta em `backend/.env.example`, mas a política CORS implementada não usa essa variável. Ajustar o arquivo de exemplo e a implementação juntos quando a política for endurecida. Não registrar valores reais de ambiente na documentação.

## Diagnóstico de Login Externo

1. Abra o domínio de produção em uma janela anônima. Se cair no login da **Vercel**, examine `Project → Settings → Deployment Protection` e confirme se o link compartilhado não é um deployment URL.
2. Se a página do B2B abrir, confira `NEXT_PUBLIC_API_URL` no build da Vercel. Valor ausente faz o navegador chamar `localhost:5000`, que aponta para a máquina do visitante.
3. No Render, confira serviço **Live**, branch/commit e logs. Compare o comportamento da API publicada com o commit implantado; não deduza versão apenas pelo branch configurado.
4. Confirme preflight CORS para o domínio real e verifique `POST /api/auth/login` e `GET /api/auth/me` sem divulgar senha, cookie ou token em logs/prints.
5. Se um e-mail próprio receber 401, lembre que não existe fluxo de criação de contas. Se o dashboard aparecer mesmo com `/auth/me` falhando, isso é o fallback inseguro descrito em [Segurança](../security/README.md), não sucesso do login.

Na camada gratuita do Render, o serviço pode adormecer por inatividade, causando uma primeira resposta lenta. Um `404` na raiz da API é esperado. Essas condições não comprovam falha de autenticação.

## Checklist Antes de Publicar

- Revisar diff e secrets com calma; não publicar credenciais de demonstração para dados reais.
- Executar build backend/frontend e testes de fluxo autenticado e não autenticado.
- Confirmar variáveis, banco, commit efetivamente implantado e domínio Production.
- Validar logout, expiração, renovação/recuperação de sessão e resposta a falha da API.
- Preparar rollback do deploy e monitorar logs sem tokens ou dados pessoais.
