# Documentação do B2B Flow

Ponto único de entrada para a documentação. Os arquivos descrevem o **código versionado**, não certificam que produção esteja atualizada ou que o sistema cumpra metas de escala, segurança ou conformidade.

## Navegação

| Área | Conteúdo |
| --- | --- |
| [Desenvolvimento](development/README.md) | Pré-requisitos, execução local e verificações |
| [Arquitetura](architecture/README.md) | Componentes, dados, persistência e fluxos |
| [API](api/README.md) | Rotas HTTP, autenticação e contratos principais |
| [Segurança](security/README.md) | Estado real da autenticação, riscos e prioridades |
| [Deploy e operação](deployment/README.md) | Vercel, Render, variáveis e diagnóstico de login |
| [Frontend e UX](frontend-ux/README.md) | Telas, dados de demonstração e capturas |

## Como Manter

1. Atualize a página temática e o README de entrada quando mudar um fluxo, contrato ou endereço público.
2. Diferencie comportamento implementado, comportamento demonstrativo e trabalho pendente. Não transforme metas em capacidades comprovadas.
3. Valide links relativos, comandos e exemplos contra o código antes do merge.
4. Não registre segredos, credenciais reais, tokens, dados de clientes ou capturas com informação sensível.
