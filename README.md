# B2B Flow

Plataforma demonstrativa de gestão comercial B2B, com frontend em Next.js 14 e API em .NET 8. O código inclui autenticação, clientes, oportunidades, dashboard e respostas simuladas para alguns recursos. **Os números e registros demonstrativos não representam dados reais de negócio.**

- Aplicação (domínio de produção): [b2b-flow-bay.vercel.app](https://b2b-flow-bay.vercel.app)
- API: [b2b-flow-dei6.onrender.com](https://b2b-flow-dei6.onrender.com) — a raiz `/` não é uma rota; use `/swagger` ou `/api/...`.
- [Índice completo da documentação](docs/README.md)

## Comece Por Aqui

| Se você quer... | Leia |
| --- | --- |
| Executar localmente | [Guia de desenvolvimento](docs/development/README.md) |
| Entender a arquitetura e os dados | [Arquitetura](docs/architecture/README.md) |
| Integrar com a API | [Contrato da API](docs/api/README.md) |
| Entender login e riscos atuais | [Autenticação e segurança](docs/security/README.md) |
| Publicar ou investigar indisponibilidade | [Deploy e operação](docs/deployment/README.md) |
| Entender telas e estados demonstrativos | [Frontend e UX](docs/frontend-ux/README.md) |

## Estado Atual

Este repositório é um protótipo funcional, **não uma plataforma pronta para operação sensível**. Há dados de demonstração no frontend e na API, fallback de sessão no dashboard, token em `localStorage`/cookie legível por JavaScript e uma credencial administrativa de demonstração no código. Não use dados reais de clientes nem apresente os KPIs como métricas verificadas. Consulte [limitações e prioridades](docs/security/README.md#limitações-e-prioridades).

As URLs acima são pontos de acesso conhecidos, não uma garantia de disponibilidade futura. A configuração real de Vercel, Render, variáveis de ambiente e banco deve ser conferida nos respectivos painéis antes de um deploy.
