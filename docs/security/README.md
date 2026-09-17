# Autenticação e Segurança

## Comportamento Implementado

`POST /api/auth/login` consulta usuários pelo e-mail e verifica senha com BCrypt. Se não existir o usuário de demonstração e a credencial embutida for usada, o handler cria um objeto `User` em memória **sem gravá-lo**. Não há cadastro público nem convite. O backend emite JWT com validade de oito horas; a API o grava em cookie `HttpOnly`, `Secure`, `SameSite=None` e também o devolve no corpo da resposta.

O frontend grava o token recebido em `localStorage` e em outro cookie legível por JavaScript. Esse armazenamento contradiz a afirmação anterior de “sessão segura apenas em cookie HTTP-only” e aumenta a exposição a XSS. O middleware do Next.js não aplica bloqueio de acesso. O layout do dashboard, quando `/auth/me` falha, configura um usuário Admin fictício e mantém a interface visível. Isso não substitui autorização da API, mas mascara falhas e pode induzir o usuário a acreditar que está autenticado.

## Limitações e Prioridades

| Prioridade | Achado | Consequência / ação necessária |
| --- | --- | --- |
| Crítica | Credencial de demonstração fixa e exibida na tela de login | Remover antes de receber dados reais; provisionar contas por processo seguro |
| Crítica | Fallback Admin no layout e dados demonstrativos sem distinção visual suficiente | Falhar fechado no frontend e identificar dados demo claramente |
| Alta | JWT no corpo, `localStorage` e cookie acessível por JS | Definir uma única estratégia de sessão e revisar XSS/CSRF |
| Alta | Chave JWT padrão embutida no backend e no arquivo de exemplo | Exigir segredo forte via ambiente, rotacionar chaves expostas |
| Alta | CORS aceita qualquer host terminado em `vercel.app` | Restringir às origens do projeto, inclusive domínios customizados |
| Alta | Fallback silencioso do PostgreSQL para memória | Falhar explicitamente em produção quando a persistência não estiver disponível |
| Média | Logout não revoga JWT; o `localStorage` não é limpo no fluxo atual | Invalidar sessão de forma coerente no cliente e no servidor |
| Média | Sem suíte automatizada de autenticação/autorização | Cobrir 401/403, expiração, logout, CORS e fluxos de usuário |

Estas são constatações da leitura do código, não resultado de pentest, auditoria ou validação legal. Não há evidência no repositório de conformidade com GDPR, LGPD, PCI-DSS, AML/KYC/KYB, disponibilidade de 99,999% ou escala global.

## Regra Para Publicação

Não trate o dashboard como área privada confiável enquanto o fallback Admin existir. Não insira informações reais de clientes nesta versão. Antes de habilitar novas contas ou convidar terceiros, implementar autenticação real, autorização por papel testada e provisionamento seguro; revisar manualmente as mudanças com calma.
