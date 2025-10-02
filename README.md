## Área do Cliente Pharmédice - Front-End

Este é o front-end da área do cliente da Pharmédice. Fornece uma área para clientes acessarem informações de pedidos, documentos, atualizações e notícias.

### Funcionalidades

- **Sistema de Autenticação**
  - Login do usuário com e-mail e senha
  - Cadastro de usuário com validação completa de formulários
  - Recuperação de senha com link de redefinição por e-mail
  - Integração com Google OAuth (placeholder)

- **Sistema de Alertas Personalizados**
  - Alertas customizados que substituem os alertas padrão do navegador
  - Tipos: sucesso, erro, aviso e informativo
  - Modal de confirmação personalizado
  - Design consistente com a identidade visual do projeto

- **Validação de Formulários**
  - Validação em tempo real para todos os campos de entrada
  - Formatação e validação de documentos CPF/CNPJ
  - Formatação de números de telefone brasileiros
  - Validação de e-mail
  - Requisitos de força de senha

- **Design Responsivo**
  - Abordagem mobile-first
  - Design consistente em todas as telas de autenticação
  - Interface em português (PT-BR)

### Comandos Disponíveis

| Comando         | Descrição                           |
|-----------------|-------------------------------------|
| `npm run dev`   | Iniciar servidor de desenvolvimento (Turbopack) |
| `npm run build` | Compilar a aplicação (Turbopack)    |
| `npm start`     | Iniciar o servidor de produção      |
| `npm run lint`  | Executar ESLint para análise de código |
| `npm run format`| Formatar código com Prettier        |
| `npm run format:check` | Verificar formatação do código com Prettier |

### Rotas

- `/` - Redireciona para página de login
- `/login` - Autenticação do usuário
- `/signup` - Cadastro de usuário
- `/forgot-password` - Recuperação de senha
- `/dashboard` - Painel do usuário (após autenticação)
- `/alerts-demo` - Demonstração do sistema de alertas personalizados

### Stack Tecnológico

- [Next.js](https://nextjs.org/) 15 (App Router)
- [React](https://react.dev/) 19
- [Tailwind CSS](https://tailwindcss.com/) 4
- [TypeScript](https://www.typescriptlang.org/) 5

### Estrutura do Projeto

```
src/
├── app/                    # Páginas do Next.js App Router
│   ├── login/             # Página de login
│   ├── signup/            # Página de cadastro
│   ├── forgot-password/   # Recuperação de senha
│   ├── dashboard/         # Painel protegido
│   └── alerts-demo/       # Demonstração de alertas
├── components/            # Componentes UI reutilizáveis
│   ├── AuthLayout.tsx     # Layout de autenticação
│   ├── FormField.tsx      # Componente de campo de formulário
│   ├── SubmitButton.tsx   # Componente de botão
│   ├── Alert.tsx          # Componente de alerta personalizado
│   ├── AlertProvider.tsx  # Provedor de contexto de alertas
│   └── ConfirmModal.tsx   # Modal de confirmação
└── lib/
    ├── utils.ts           # Funções utilitárias (validação, formatação)
    └── useCustomAlert.ts  # Hook personalizado para alertas
```

### Integração com API

A aplicação está preparada para integração com API Laravel. Atualize os endpoints da API em:
- `/app/login/page.tsx` - Endpoint de login
- `/app/signup/page.tsx` - Endpoint de cadastro
- `/app/forgot-password/page.tsx` - Endpoint de redefinição de senha

### Sistema de Alertas

O projeto inclui um sistema completo de alertas personalizados que substitui os alertas padrão do navegador:

- **Tipos de Alerta**: Sucesso, Erro, Aviso, Informativo
- **Modal de Confirmação**: Substitui `window.confirm()` com design personalizado
- **Auto-dismiss**: Alertas desaparecem automaticamente (configurável)
- **Empilhamento**: Múltiplos alertas são empilhados verticalmente
- **Responsivo**: Funciona perfeitamente em dispositivos móveis

Para mais detalhes, consulte `ALERTS.md` ou acesse `/alerts-demo`.

### Campos de Cadastro do Usuário

- Primeiro Nome
- Segundo Nome
- Como gostaria de ser chamado (Apelido)
- Número Celular (formato brasileiro)
- E-mail
- Senha
- Confirmação de senha
- CPF ou CNPJ (com formatação automática)

---
Sinta-se à vontade para contribuir ou abrir issues!