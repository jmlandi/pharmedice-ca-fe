## Área do Cliente Pharmédice - Front-End

Este é o front-end da plataforma Pharmédice, contendo tanto a **Área do Cliente** quanto a **Área Administrativa**. Fornece uma interface completa para clientes acessarem informações de pedidos, documentos e notícias, além de um painel administrativo para gerenciamento da plataforma.

### Funcionalidades

- **Sistema de Autenticação Duplo**
  - **Área do Cliente**: Login, cadastro e recuperação de senha para clientes
  - **Área Administrativa**: Sistema separado para administradores com validação de domínio corporativo
  - Validação completa de formulários em ambas as áreas
  - Integração com Google OAuth (placeholder para clientes)

- **Sistema de Alertas Personalizados**
  - Alertas customizados que substituem os alertas padrão do navegador
  - Tipos: sucesso, erro, aviso e informativo
  - Modal de confirmação personalizado
  - Design consistente com a identidade visual do projeto

- **Área Administrativa Restrita**
  - Acesso limitado a domínios corporativos (@pharmedice.com.br, @marcoslandi.com)
  - Campos simplificados para cadastro de administradores
  - Dashboard com métricas e controles administrativos
  - Navegação completamente isolada da área do cliente

- **Validação de Formulários**
  - Validação em tempo real para todos os campos de entrada
  - Formatação e validação de documentos CPF/CNPJ (área do cliente)
  - Formatação de números de telefone brasileiros (área do cliente)
  - Validação de e-mail com verificação de domínio (área administrativa)
  - Requisitos de força de senha

- **Design Responsivo**
  - Abordagem mobile-first
  - Design consistente em todas as telas de autenticação
  - Interface completamente em português (PT-BR)
  - Rotas padronizadas em português

### Comandos Disponíveis

| Comando                | Descrição                                       |
| ---------------------- | ----------------------------------------------- |
| `npm run dev`          | Iniciar servidor de desenvolvimento (Turbopack) |
| `npm run build`        | Compilar a aplicação (Turbopack)                |
| `npm start`            | Iniciar o servidor de produção                  |
| `npm run lint`         | Executar ESLint para análise de código          |
| `npm run format`       | Formatar código com Prettier                    |
| `npm run format:check` | Verificar formatação do código com Prettier     |

### Rotas

#### **Área do Cliente**

- `/` - Redireciona para `/cliente/login`
- `/cliente/login` - Autenticação do cliente
- `/cliente/cadastro` - Cadastro de cliente
- `/cliente/esqueci-senha` - Recuperação de senha do cliente
- `/cliente/painel` - Dashboard do cliente (após autenticação)

#### **Área Administrativa**

- `/admin` - Página inicial da área administrativa
- `/admin/entrar` - Login de administradores
- `/admin/cadastro` - Cadastro de administradores (domínios restritos)
- `/admin/esqueci-senha` - Recuperação de senha administrativa
- `/admin/painel` - Dashboard administrativo

#### **Outras Rotas**

- `/alerts-demo` - Demonstração do sistema de alertas personalizados

### Configuração de Ambiente

Antes de executar a aplicação, configure as variáveis de ambiente:

1. **Crie o arquivo `.env.local`** na raiz do projeto:
```bash
cp .env.example .env.local
```

2. **Configure as variáveis necessárias**:
```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

#### Variáveis de Ambiente Disponíveis

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `NEXT_PUBLIC_API_URL` | URL base da API backend | `http://localhost:8000/api` |

> **Nota**: As variáveis com prefixo `NEXT_PUBLIC_` são expostas ao cliente (browser). Use apenas para dados não sensíveis.

### Stack Tecnológico

- [Next.js](https://nextjs.org/) 15 (App Router)
- [React](https://react.dev/) 19
- [Tailwind CSS](https://tailwindcss.com/) 4
- [TypeScript](https://www.typescriptlang.org/) 5

### Estrutura do Projeto

```
src/
├── app/                       # Páginas do Next.js App Router
│   ├── cliente/              # Área do Cliente
│   │   ├── login/            # Login do cliente
│   │   ├── cadastro/         # Cadastro do cliente
│   │   ├── esqueci-senha/    # Recuperação de senha do cliente
│   │   └── painel/           # Dashboard do cliente
│   ├── admin/                # Área Administrativa
│   │   ├── page.tsx          # Página inicial administrativa
│   │   ├── entrar/           # Login administrativo
│   │   ├── cadastro/         # Cadastro administrativo
│   │   ├── esqueci-senha/    # Recuperação de senha administrativa
│   │   └── painel/           # Dashboard administrativo
│   ├── alerts-demo/          # Demonstração de alertas
│   └── page.tsx              # Página inicial (redireciona para /cliente/login)
├── components/               # Componentes UI reutilizáveis
│   ├── AuthLayout.tsx        # Layout de autenticação
│   ├── FormField.tsx         # Componente de campo de formulário
│   ├── SubmitButton.tsx      # Componente de botão
│   ├── Alert.tsx             # Componente de alerta personalizado
│   ├── AlertProvider.tsx     # Provedor de contexto de alertas
│   └── ConfirmModal.tsx      # Modal de confirmação
└── lib/
    ├── utils.ts              # Funções utilitárias (validação, formatação)
    └── useCustomAlert.ts     # Hook personalizado para alertas
```

### Integração com API

A aplicação está preparada para integração com API Laravel. Atualize os endpoints da API em:

#### **Endpoints da Área do Cliente**

- `/app/cliente/login/page.tsx` - Endpoint de login do cliente
- `/app/cliente/cadastro/page.tsx` - Endpoint de cadastro do cliente
- `/app/cliente/esqueci-senha/page.tsx` - Endpoint de redefinição de senha do cliente

#### **Endpoints da Área Administrativa**

- `/app/admin/entrar/page.tsx` - Endpoint de login administrativo
- `/app/admin/cadastro/page.tsx` - Endpoint de cadastro administrativo
- `/app/admin/esqueci-senha/page.tsx` - Endpoint de redefinição de senha administrativa

> **Nota**: A validação de domínios corporativos deve ser implementada no backend para garantir que apenas e-mails @pharmedice.com.br e @marcoslandi.com possam criar contas administrativas.

### Sistema de Alertas

O projeto inclui um sistema completo de alertas personalizados que substitui os alertas padrão do navegador:

- **Tipos de Alerta**: Sucesso, Erro, Aviso, Informativo
- **Modal de Confirmação**: Substitui `window.confirm()` com design personalizado
- **Auto-dismiss**: Alertas desaparecem automaticamente (configurável)
- **Empilhamento**: Múltiplos alertas são empilhados verticalmente
- **Responsivo**: Funciona perfeitamente em dispositivos móveis

Para mais detalhes, consulte `ALERTS.md` ou acesse `/alerts-demo`.

### Campos de Cadastro

#### **Cadastro de Cliente**

- Primeiro Nome
- Segundo Nome
- Como gostaria de ser chamado (Apelido)
- Número Celular (formato brasileiro)
- E-mail
- Senha
- Confirmação de senha
- CPF ou CNPJ (com formatação automática)

#### **Cadastro de Administrador**

- Primeiro Nome
- Segundo Nome
- Apelido
- E-mail Corporativo (domínios restritos)
- Senha
- Confirmação de senha

### Segurança

- **Área do Cliente**: Aberta para qualquer e-mail válido
- **Área Administrativa**: Restrita aos domínios corporativos:
  - `@pharmedice.com.br`
  - `@marcoslandi.com`
- **Isolamento**: As duas áreas são completamente isoladas, sem navegação cruzada
- **Validação**: Validação de domínio tanto no frontend quanto no backend (recomendado)

---

Sinta-se à vontade para contribuir ou abrir issues!
