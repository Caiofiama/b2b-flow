# Frontend e UX

## Telas

| Rota | Comportamento atual |
| --- | --- |
| `/login` | Formulário de e-mail/senha; atualmente pré-preenchido com credencial demo |
| `/` | Dashboard com KPIs, histórico de vendas e filtro mensal |
| `/clients` | Busca, paginação, visualização e edição de clientes |
| `/pipeline` | Kanban de quatro estágios e formulário de oportunidade |
| `/settings` | Dados de sessão e textos estáticos de RBAC/infraestrutura |

As páginas são Client Components. O dashboard usa dados fictícios se a API não trouxer KPIs utilizáveis e substitui os KPIs/lista por um mapa mensal estático ao clicar no gráfico. O pipeline também mostra oportunidades de exemplo quando a resposta está vazia. No formulário de nova oportunidade, o cliente digitado não é resolvido para um `clientId` real: é enviado um GUID vazio, e o `catch` mostra mensagem de sucesso mesmo se a API falhar. Portanto, **uma confirmação visual não garante persistência**.

A página de configurações contém textos fixos sobre Railway/Neon e papéis; não é um painel de status conectado à infraestrutura. O fluxo de `/auth/me` no layout tem fallback Admin. Veja [Segurança](../security/README.md) para as consequências.

## Revisão de UX Antes de Entrega

- Identificar dados demo na própria interface e evitar KPIs que pareçam números reais.
- Validar estados de carregamento, vazio, erro, 401 e 403 sem sucesso falso.
- Testar navegação por teclado, foco em modais, rótulos de formulário e contraste.
- Testar layout em mobile e formatos de moeda/data em `pt-BR`.
- Registrar novas capturas apenas após conferir tela, nome do arquivo e versão da interface.
