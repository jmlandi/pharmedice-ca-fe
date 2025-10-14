# Autenticação com Google OAuth

## Visão Geral

A autenticação com Google OAuth está integrada ao backend Laravel e permite que usuários (clientes e administradores) façam login/cadastro usando suas contas Google.

## Fluxo de Autenticação

1. **Usuário clica em "Continuar com Google"** nas páginas de login (`/cliente/entrar` ou `/admin/entrar`)
2. **Redirecionamento para o backend**: `${API_URL}/auth/google`
3. **Backend redireciona para o Google** para autenticação
4. **Usuário autoriza no Google**
5. **Google redireciona de volta para o backend**
6. **Backend processa e redireciona para o frontend**: 
   - Sucesso: `/cliente/painel?token=xxx&user=xxx` ou `/admin/painel?token=xxx&user=xxx`
   - Erro: `/cliente/entrar?error=xxx` ou `/admin/entrar?error=xxx`
7. **Frontend processa o callback**:
   - Extrai token e dados do usuário dos query params
   - Decodifica os dados (URL-encoded)
   - Salva no localStorage
   - Limpa a URL
   - Recarrega a página para atualizar o contexto de autenticação

## Componentes Implementados

### 1. `src/hooks/useGoogleAuth.ts`
Hook que gerencia o início do processo de OAuth (redirecionamento para o backend).

```typescript
const { handleGoogleLogin, isLoading, error } = useGoogleAuth();
```

### 2. `src/components/GoogleLoginButton.tsx`
Componente visual do botão "Continuar com Google" com loading states.

### 3. GoogleCallbackHandler
Componente interno nos arquivos de painel que:
- Detecta query params de callback do OAuth
- Processa token e dados do usuário
- Gerencia erros
- Envolve o `ProtectedRoute` para garantir processamento antes da verificação de autenticação

## Arquivos Modificados

### Backend Integration
- `src/lib/auth.ts`: Método `handleGoogleCallback(token, usuario)` para salvar token
- `src/lib/api.ts`: Interface `User` estendida com campos `avatar`, `google_id`, `provider`

### Páginas de Login
- `src/app/cliente/entrar/page.tsx`: Adicionado GoogleLoginButton e tratamento de erros
- `src/app/admin/entrar/page.tsx`: Adicionado GoogleLoginButton e tratamento de erros

### Páginas de Painel (Dashboard)
- `src/app/cliente/painel/page.tsx`: Envolvido com GoogleCallbackHandler e Suspense
- `src/app/admin/painel/page.tsx`: Envolvido com GoogleCallbackHandler e Suspense

## Estrutura do Callback

### Query Parameters (Sucesso)
```
?token=eyJ0eXAiOiJKV1QiLCJhbG...
&user=%7B%22id%22%3A1%2C%22primeiro_nome%22%3A%22Jo...
&expires_in=3600
```

### Query Parameters (Erro)
```
?error=Erro%20ao%20autenticar%20com%20Google
```

## Dados do Usuário

O objeto `user` retornado contém:
```typescript
{
  id: number;
  primeiro_nome: string;
  segundo_nome: string;
  email: string;
  tipo_usuario: 'cliente' | 'admin';
  is_admin: boolean;
  email_verificado: boolean;
  avatar?: string;
  google_id?: string;
  provider?: string;
}
```

## Armazenamento Local

Após sucesso no OAuth:
- **localStorage.token**: JWT token de autenticação
- **localStorage.user**: Objeto JSON com dados do usuário

## Tratamento de Erros

- Erros na autenticação Google são redirecionados com query param `?error=`
- Erros no processamento do callback exibem alerta e redirecionam para login
- Erros de CORS devem ser configurados no backend

## Considerações de Deploy

### Desenvolvimento
- Backend deve permitir CORS de `http://localhost:3000`

### Produção
- Backend deve permitir CORS de `https://cliente.pharmedice.com.br`
- Google OAuth Client ID deve ter URLs autorizadas configuradas

## Segurança

- Token JWT armazenado no localStorage (considerar httpOnly cookies em produção)
- CORS configurado adequadamente no backend
- Validação de token em todas as requisições autenticadas via `api.ts`

## Próximos Passos Sugeridos

1. ✅ Implementação básica concluída
2. ⚠️ Configurar CORS no backend para ambiente de desenvolvimento
3. 🔄 Considerar migração de localStorage para httpOnly cookies
4. 🔄 Implementar refresh token mechanism
5. 🔄 Adicionar testes unitários e E2E
