# Fluxo de Recuperação de Senha - Frontend

## Visão Geral

Implementação completa do fluxo de recuperação de senha no frontend, seguindo as especificações do backend Laravel definidas em `recuperacao-de-senha.md`.

## Estrutura Implementada

### 📁 Páginas Criadas/Atualizadas

#### Cliente:

- **`/cliente/esqueci-senha`** - Solicitação de recuperação (atualizada)
- **`/cliente/redefinir-senha`** - Redefinição com token (nova)

#### Administrador:

- **`/admin/esqueci-senha`** - Solicitação de recuperação (atualizada)
- **`/admin/redefinir-senha`** - Redefinição com token (nova)

### 🔧 Funções de API (lib/api.ts)

```typescript
// Interfaces
interface SolicitarRecuperacaoSenhaRequest {
  email: string;
}

interface RedefinirSenhaRequest {
  email: string;
  token: string;
  senha: string;
  confirmacao_senha: string;
}

// Funções
solicitarRecuperacaoSenha(data): Promise<ApiResponse>
redefinirSenha(data): Promise<ApiResponse<RedefinirSenhaResponse>>
```

### 🛡️ Validação de Senha (lib/utils.ts)

```typescript
validatePasswordStrength(password: string): {
  isValid: boolean;
  errors: string[];
}
```

**Requisitos implementados:**

- ✅ Mínimo de 8 caracteres
- ✅ Máximo de 50 caracteres
- ✅ Pelo menos 1 letra maiúscula (A-Z)
- ✅ Pelo menos 1 letra minúscula (a-z)
- ✅ Pelo menos 1 número (0-9)
- ✅ Pelo menos 1 caractere especial (@$!%\*?&)

## 🚀 Fluxo Completo

### 1. Usuário Esqueceu a Senha

**Cliente:** Acessa `/cliente/esqueci-senha`
**Admin:** Acessa `/admin/esqueci-senha`

1. Digite o e-mail
2. Clica em "Enviar Link de Redefinição"
3. Sistema chama `solicitarRecuperacaoSenha()`
4. Mostra confirmação de envio
5. Opção de reenviar e-mail disponível

### 2. Recebimento do E-mail

O backend envia e-mail com link no formato:

```
http://localhost:3000/cliente/redefinir-senha?token=abc123...&email=usuario@exemplo.com
http://localhost:3000/admin/redefinir-senha?token=abc123...&email=admin@pharmedice.com.br
```

### 3. Redefinição da Senha

Usuário clica no link e é redirecionado para a página de redefinição:

1. **Validação Inicial:**
   - Verifica se `token` e `email` estão na URL
   - Para admin: valida domínio (@pharmedice.com.br ou @marcoslandi.com)
   - Se inválido, redireciona para esqueci-senha

2. **Formulário de Redefinição:**
   - Campo "Nova Senha" com validação em tempo real
   - Campo "Confirmar Nova Senha"
   - Lista de requisitos de segurança
   - Validação local antes do envio

3. **Submissão:**
   - Chama `redefinirSenha()` com token, email e senhas
   - Trata erros de validação (422)
   - Trata token expirado/inválido
   - Mostra tela de sucesso

4. **Sucesso:**
   - Confirmação visual
   - Botão para fazer login
   - Redirecionamento automático disponível

## 🎨 Experiência do Usuário

### Estados Visuais

- ⏳ **Loading states** durante requisições
- ✅ **Success states** com ícones e cores
- ❌ **Error states** com mensagens específicas
- 📱 **Responsive design** para mobile/desktop

### Mensagens do Sistema

- **Genérica de segurança:** "Se o email existir, você receberá um link"
- **Erro de token:** "Token inválido ou expirado"
- **Validação:** Mensagens específicas por campo
- **Sucesso:** "Senha redefinida com sucesso!"

### Diferenciação Admin/Cliente

- **Cores:** Mantém a identidade visual consistente
- **Validação:** Admin tem validação extra de domínio
- **Texto:** Linguagem específica para administradores
- **Segurança:** Destaque maior nos requisitos para admins

## 🔒 Segurança Implementada

### Frontend

1. **Validação de Entrada:**
   - Sanitização de e-mail
   - Validação de senha forte
   - Confirmação de senha obrigatória

2. **Proteção de Rota:**
   - Verificação de parâmetros obrigatórios
   - Redirecionamento em caso de link inválido
   - Validação de domínio para admin

3. **Tratamento de Erros:**
   - Não exposição de dados sensíveis
   - Mensagens de erro padronizadas
   - Log de erros para debug

### Integração com Backend

- ✅ Endpoints corretos (`/api/auth/solicitar-recuperacao-senha`, `/api/auth/redefinir-senha`)
- ✅ Headers adequados (Content-Type, Authorization quando necessário)
- ✅ Tratamento de códigos HTTP (200, 422, 404, 500)
- ✅ Parsing de erros de validação do Laravel

## 📱 Responsividade

- **Mobile First:** Design otimizado para dispositivos móveis
- **Breakpoints:** Adaptação para tablet e desktop
- **Touch-friendly:** Botões e campos com tamanho adequado
- **Navegação:** Links de navegação contextuais

## 🧪 Como Testar

### 1. Fluxo Cliente

```bash
# Acesse a página
http://localhost:3000/cliente/esqueci-senha

# Digite um e-mail válido
# Verifique o e-mail recebido
# Clique no link do e-mail
# Defina nova senha
# Faça login
```

### 2. Fluxo Admin

```bash
# Acesse a página
http://localhost:3000/admin/esqueci-senha

# Digite um e-mail de admin (@pharmedice.com.br)
# Siga o mesmo processo
```

### 3. Cenários de Erro

- Link expirado (60 minutos)
- Token inválido
- E-mail não encontrado
- Senha fraca
- Senhas não coincidem
- Admin com e-mail de domínio inválido

## 📚 Dependências

### Bibliotecas utilizadas:

- **Next.js 15** - Framework React
- **React 19** - Interface do usuário
- **Axios** - Cliente HTTP
- **TypeScript** - Tipagem estática

### Componentes internos:

- `AuthLayout` - Layout padrão de autenticação
- `FormField` - Campo de formulário padronizado
- `SubmitButton` - Botão com estado de loading
- `AlertProvider` - Sistema de notificações
- `LoadingProvider` - Estado global de loading

## 🚀 Deploy e Configuração

### Variáveis de Ambiente

```env
# No backend (.env)
FRONTEND_URL=http://localhost:3000
# ou em produção: https://cliente.pharmedice.com.br
```

### URLs de Produção Sugeridas

```
Cliente: https://cliente.pharmedice.com.br/cliente/redefinir-senha
Admin: https://admin.pharmedice.com.br/admin/redefinir-senha
```

## ✅ Checklist de Implementação

- [x] Funções de API criadas
- [x] Validação de senha forte implementada
- [x] Páginas esqueci-senha atualizadas
- [x] Página redefinir-senha cliente criada
- [x] Página redefinir-senha admin criada
- [x] Tratamento de erros completo
- [x] Estados de loading/sucesso
- [x] Design responsivo
- [x] Validação de domínio admin
- [x] Ícone de cadeado padronizado (/icons/lock.svg)
- [x] Espaçamento consistente com tela de login
- [x] Interface otimizada e polida
- [x] Documentação completa

## 🔮 Próximos Passos

1. **Testes Automatizados:**
   - Unit tests para validações
   - Integration tests para fluxo completo
   - E2E tests com Cypress/Playwright

2. **Melhorias de UX:**
   - Timer visual para expiração do token
   - Progress indicator no formulário
   - Sugestões de senha forte

3. **Segurança Adicional:**
   - Rate limiting no frontend
   - Captcha em caso de muitas tentativas
   - Histórico de redefinições

4. **Analytics:**
   - Tracking de eventos de recuperação
   - Métricas de sucesso/falha
   - Análise de abandono no fluxo
