# Funcionalidade de Edição de Perfil do Usuário

Esta implementação permite que os usuários editem seus próprios dados pessoais através de uma interface amigável, baseada na API de Atualização de Perfil documentada.

## 🚀 Componentes Implementados

### 1. ProfileEditModal
Modal responsivo para edição do perfil do usuário com os campos permitidos pela API.

**Localização**: `/src/components/ProfileEditModal.tsx`

### 2. AccountInfo (Atualizado)
Componente de exibição de informações da conta com botão para abrir o modal de edição.

**Localização**: `/src/components/painel/admin/AccountInfo.tsx`

### 3. AuthService (Estendido)
Adicionada função `updateProfile` para comunicação com a API.

**Localização**: `/src/lib/auth.ts`

### 4. AuthProvider (Estendido)
Adicionada função `updateUser` para atualizar o estado global do usuário.

**Localização**: `/src/components/AuthProvider.tsx`

### 5. useUpdateProfile Hook
Hook personalizado para facilitar o uso da funcionalidade de atualização.

**Localização**: `/src/hooks/useUpdateProfile.ts`

## 📝 Campos Editáveis

Conforme a API, os usuários podem editar os seguintes campos:

- ✅ `primeiro_nome` - Nome (obrigatório se enviado)
- ✅ `segundo_nome` - Sobrenome (opcional)
- ✅ `apelido` - Nome de exibição (obrigatório se enviado)
- ✅ `email` - Email (obrigatório se enviado)
- ✅ `telefone` - Telefone (opcional)
- ✅ `numero_documento` - CPF/RG (opcional)
- ✅ `data_nascimento` - Data de nascimento (opcional)
- ✅ `aceite_comunicacoes_email` - Aceita emails (opcional)
- ✅ `aceite_comunicacoes_sms` - Aceita SMS (opcional)
- ✅ `aceite_comunicacoes_whatsapp` - Aceita WhatsApp (opcional)

## 🔒 Campos Protegidos

Estes campos **NÃO** podem ser editados pelo usuário:
- ❌ `tipo_usuario` - Tipo do usuário
- ❌ `ativo` - Status da conta
- ❌ `email_verified_at` - Verificação do email
- ❌ `google_id` - ID do Google OAuth
- ❌ `provider` - Provedor OAuth

## 💡 Como Usar

### No painel do cliente/admin
A funcionalidade está integrada automaticamente no painel através da aba "Minha Conta":

1. Acesse `/cliente/painel` ou `/admin/painel`
2. Clique na aba "Minha Conta"
3. Clique no botão "Editar Perfil"
4. Preencha os dados desejados
5. Clique em "Salvar Alterações"

### Usando o Hook personalizado
\`\`\`typescript
import { useUpdateProfile } from '@/hooks/useUpdateProfile';

function MyComponent() {
  const { updateProfile, loading, error } = useUpdateProfile();
  
  const handleUpdate = async () => {
    try {
      const updatedUser = await updateProfile({
        primeiro_nome: 'João',
        email: 'joao@exemplo.com',
        aceite_comunicacoes_email: false
      });
      
      console.log('Perfil atualizado:', updatedUser);
    } catch (error) {
      console.error('Erro:', error);
    }
  };
  
  return (
    <button onClick={handleUpdate} disabled={loading}>
      {loading ? 'Atualizando...' : 'Atualizar Perfil'}
    </button>
  );
}
\`\`\`

### Usando diretamente o AuthService
\`\`\`typescript
import { AuthService } from '@/lib/auth';

try {
  const updatedUser = await AuthService.updateProfile({
    primeiro_nome: 'Maria',
    telefone: '(11) 99999-9999'
  });
  
  console.log('Usuário atualizado:', updatedUser);
} catch (error) {
  console.error('Erro ao atualizar:', error);
}
\`\`\`

## ⚠️ Observações Importantes

### Verificação de Email
- Se o email for alterado, `email_verified_at` é resetado para `null`
- O usuário precisa verificar o novo email
- Use `AuthService.resendEmailVerification()` para reenviar a verificação

### Validações
- O frontend inclui validações básicas de formato
- A API retorna erros detalhados para campos inválidos
- Campos únicos (email, documento) são validados pelo backend

### Atualização do Estado
- O contexto de autenticação é automaticamente atualizado após sucesso
- O localStorage é atualizado com os novos dados do usuário
- Componentes que dependem dos dados do usuário são re-renderizados

## 🎨 Estilização

O modal e componentes seguem o design system existente do projeto:
- Cores principais: `#4E7FC6` (azul) e `#26364D` (azul escuro)
- Cor de fundo: `#E3D9CD` (bege claro)
- Feedbacks visuais para campos obrigatórios e erros
- Responsivo para desktop e mobile

## 🔄 Fluxo Completo

1. **Exibição**: Usuário visualiza seus dados na aba "Minha Conta"
2. **Edição**: Clica em "Editar Perfil" e o modal abre pré-preenchido
3. **Validação**: Frontend valida campos básicos em tempo real
4. **Envio**: Dados são enviados para `PUT /api/auth/perfil`
5. **Resposta**: API retorna usuário atualizado ou erros de validação
6. **Feedback**: Usuário recebe confirmação ou mensagens de erro
7. **Atualização**: Estado global e localStorage são atualizados
8. **Verificação**: Se email foi alterado, processo de verificação é iniciado

## 🛠️ Manutenção

Para adicionar novos campos editáveis:

1. Atualizar interface `UpdateProfileData` em `/src/lib/auth.ts`
2. Adicionar campo no formulário em `/src/components/ProfileEditModal.tsx`
3. Incluir validações necessárias
4. Atualizar exibição em `/src/components/painel/admin/AccountInfo.tsx`

---

✅ **Status**: Implementado e pronto para uso
📅 **Data**: Novembro 2025
🔗 **API**: Compatible com versão 1.1.0