# B2B Flow — Plataforma SaaS de Gestão de Clientes e Inteligência Comercial

O B2B Flow é uma aplicação SaaS B2B desenvolvida para demonstrar práticas de engenharia de software modernas, Clean Architecture e inteligência artificial aplicada ao processo comercial.

O projeto combina um front-end moderno construído em Next.js 14 com um back-end robusto em .NET 8 Web API, focado em manutenibilidade, testabilidade e experiência do usuário.

- **Acesse a Aplicação em Produção (Vercel):** [https://b2b-flow-ilqhdju27-caiofiamas-projects.vercel.app](https://b2b-flow-ilqhdju27-caiofiamas-projects.vercel.app)
- **API Back-End (Render):** [https://b2b-flow-dei6.onrender.com](https://b2b-flow-dei6.onrender.com)

---

## Visão Geral da Arquitetura

O sistema foi estruturado seguindo os princípios de Clean Architecture e separação de responsabilidades.

### Decisões de Engenharia

- Clean Architecture e SOLID: No back-end, o projeto é dividido em quatro camadas distintas (Domain, Application, Infrastructure e API), garantindo que as regras de negócio permaneçam isoladas de detalhes de infraestrutura.
- CQRS com MediatR: A lógica de aplicação utiliza o padrão CQRS para separar comandos de escrita de consultas de leitura. Validadores (FluentValidation) e logs são executados automaticamente através de pipeline behaviors.
- Autenticação e Segurança RBAC: Autenticação via JWT com suporte a Cookies e Headers HTTP, garantindo segurança contra ataques XSS. O sistema possui controle de acesso por perfil (Admin, Manager e Operator).
- Consistência Financeira: Valores monetários são armazenados em centavos (ValueInCents como inteiro de 64 bits) no banco de dados, evitando inconsistências de arredondamento de ponto flutuante em somatórios e relatórios.
- Front-End Híbrido com Next.js 14: Uso do App Router com Server Components para busca de dados e SEO, e Client Components onde a interatividade é necessária.
- Funil de Vendas Kanban: Quadro de negociações drag-and-drop construído com a biblioteca @dnd-kit, oferecendo atualizações otimistas na interface.
- Filtro Interativo por Mês: Clique dinâmico em qualquer ponto do gráfico de vendas recalculando instantaneamente todos os KPIs e a lista de negócios.
- Inteligência Artificial Assistida: Integração com APIs de modelos de linguagem para geração automática de rascunhos de e-mails de follow-up e resumos do histórico de relacionamento com clientes.

---

## Tecnologias Utilizadas

### Back-End (.NET 8 Web API)
- Linguagem: C# 12 / .NET 8.0 SDK
- Arquitetura: Clean Architecture (Domain, Application, Infrastructure, API)
- Padrões: CQRS com MediatR, Repository Pattern, Unit of Work e Result Pattern
- Validação: FluentValidation integrado ao MediatR
- Banco de Dados: PostgreSQL com Entity Framework Core 8 (com fallback em memória para desenvolvimento local)
- Autenticação: JWT Bearer via HTTP-Only Cookies / Headers e autorização baseada em funções

### Front-End (Next.js 14)
- Framework: Next.js 14 com TypeScript em modo estrito
- Estilização: TailwindCSS e Shadcn/UI
- Gerenciamento de Estado: Zustand para estado local da interface e TanStack Query (React Query v5) para estado de servidor
- Formulários: React Hook Form com validação via Zod
- Drag-and-Drop: @dnd-kit (core, sortable e utilities)
- Gráficos: Recharts
- Notificações: Sonner

---

## Funcionalidades do Sistema

1. Autenticação e Autorização
   - Tela de login com suporte a armazenamento seguro de sessão.
   - Permissões específicas por papel de usuário (Admin, Manager, Operator).

2. Dashboard Principal
   - Indicadores-chave de desempenho (Total de Clientes, Negócios Fechados, Faturamento Previsto e Faturamento Realizado).
   - Gráfico de fluxo de vendas interativo por clique no mês.
   - Lista das últimas negociações cadastradas.

3. Gestão de Clientes
   - Tabela de clientes com busca em tempo real e paginação.
   - Formulário de cadastro e edição de clientes com validação.
   - Painel lateral de detalhes do cliente com atalho para o assistente de IA.

4. Funil de Vendas (Kanban)
   - Quatro estágios comerciais: Prospecção, Proposta, Negociação e Fechado.
   - Arraste e solte de cartões para atualização rápida de estágios.
   - Métricas de quantidade e somatório de valores por coluna.
   - Modal para inclusão de novas oportunidades no funil.

5. Assistente Comercial com IA
   - Geração de sugestões de e-mails de follow-up com base nas informações do cliente.
   - Retorno estruturado em formato legível com assunto, mensagem, tom de comunicação e horário sugerido para envio.

---

## Como Executar o Projeto Localmente

### Pré-requisitos
- Node.js (versão 18.17 ou superior)
- .NET SDK (versão 8.0 ou superior)

### Passo 1: Clonar o Repositório
```bash
git clone https://github.com/Caiofiama/b2b-flow.git
cd b2b-flow
```

### Passo 2: Iniciar o Back-End (.NET 8 Web API)
```bash
cd backend/src/B2BFlow.API
dotnet run --urls http://localhost:5000
```
O Swagger estará disponível em `http://localhost:5000/swagger`.

### Passo 3: Iniciar o Front-End (Next.js 14)
Em outro terminal:
```bash
cd frontend
npm install
npm run dev
```
A aplicação estará acessível em `http://localhost:3000`.

---

## Credenciais para Testes

Para facilitar a avaliação da aplicação em ambiente local ou em produção, utilize as credenciais padrão de desenvolvimento:

- E-mail: admin@b2bflow.com
- Senha: Admin123!

---

## Deploy e Infraestrutura

- Front-End (Vercel): [https://b2b-flow-ilqhdju27-caiofiamas-projects.vercel.app](https://b2b-flow-ilqhdju27-caiofiamas-projects.vercel.app)
- Back-End (Render): [https://b2b-flow-dei6.onrender.com](https://b2b-flow-dei6.onrender.com)
- Banco de Dados: PostgreSQL hospedado no Render.
