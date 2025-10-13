# Recuperação de Senha

## Visão Geral

Sistema completo de recuperação de senha que permite aos usuários redefinirem suas senhas através de um link enviado por e-mail.

## Fluxo de Recuperação

### 1. Solicitar Recuperação de Senha

**Endpoint:** `POST /api/auth/solicitar-recuperacao-senha`

**Body:**

```json
{
	"email": "usuario@exemplo.com"
}
```

**Resposta de Sucesso (200):**

```json
{
	"sucesso": true,
	"mensagem": "Se o email existir em nosso sistema, você receberá um link de recuperação de senha."
}
```

**Notas:**

- Por questões de segurança, a API sempre retorna a mesma mensagem, independente do email existir ou não
- Se o email existir e o usuário estiver ativo, um e-mail será enviado
- O token de recuperação expira em 60 minutos (configurável)
- Tokens antigos do mesmo email são automaticamente removidos ao gerar um novo

### 2. Redefinir Senha

Após receber o e-mail, o usuário clica no link que o redireciona para o frontend com os parâmetros `token` e `email`. O frontend então chama este endpoint:

**Endpoint:** `POST /api/auth/redefinir-senha`

**Body:**

```json
{
	"email": "usuario@exemplo.com",
	"token": "abc123...",
	"senha": "NovaSenha@123",
	"confirmacao_senha": "NovaSenha@123"
}
```

**Resposta de Sucesso (200):**

```json
{
	"sucesso": true,
	"mensagem": "Senha redefinida com sucesso! Você já pode fazer login com sua nova senha.",
	"dados": {
		"email": "usuario@exemplo.com",
		"nome": "João"
	}
}
```

**Erros Possíveis:**

- **422 - Dados Inválidos:**
  - Senhas não coincidem
  - Senha não atende aos requisitos
  - Token inválido ou expirado

- **404 - Usuário Não Encontrado:**
  - Email não existe no sistema

- **500 - Erro Interno:**
  - Falha ao enviar e-mail

## Requisitos de Senha

A nova senha deve atender aos seguintes critérios:

- ✅ Mínimo de 8 caracteres
- ✅ Máximo de 50 caracteres
- ✅ Pelo menos 1 letra minúscula (a-z)
- ✅ Pelo menos 1 letra maiúscula (A-Z)
- ✅ Pelo menos 1 número (0-9)
- ✅ Pelo menos 1 caractere especial (@$!%\*?&)

**Exemplos válidos:**

- `Senha@123`
- `MinhaSenha!456`
- `Segura$789`

## Configuração

### Variáveis de Ambiente (.env)

Adicione ao seu arquivo `.env`:

```env
# URL do frontend (onde o usuário será redirecionado)
FRONTEND_URL=http://localhost:3000

# Configuração de e-mail (já existente)
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=seu-email@gmail.com
MAIL_PASSWORD=sua-senha-de-app
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=seu-email@gmail.com
MAIL_FROM_NAME="${APP_NAME}"
```

### Executar Migration

Execute a migration para criar a tabela de tokens:

```bash
php artisan migrate
```

Isso criará a tabela `password_reset_tokens` com a estrutura:

- `email` (string, primary key)
- `token` (string, hashed)
- `created_at` (timestamp)

## E-mail de Recuperação

O e-mail enviado possui:

- 🎨 Design moderno e responsivo
- 🔐 Ícone de segurança
- ⏱️ Informação sobre expiração do link (60 minutos)
- ⚠️ Aviso de segurança
- 🔗 Botão principal + link alternativo
- 📧 Informações da empresa

**Template:** `resources/views/emails/password-reset.blade.php`

## Frontend - Página de Redefinição

O frontend deve criar uma página em `/redefinir-senha` que:

1. Captura os parâmetros `token` e `email` da URL
2. Apresenta um formulário com:
   - Campo de nova senha
   - Campo de confirmação de senha
   - Botão de submit
3. Ao submeter, chama o endpoint `POST /api/auth/redefinir-senha`
4. Redireciona para login após sucesso

**Exemplo de URL:**

```
http://localhost:3000/redefinir-senha?token=abc123...&email=usuario@exemplo.com
```

## Segurança

### Medidas Implementadas:

1. **Token Hasheado:** O token é armazenado com hash no banco de dados
2. **Expiração:** Tokens expiram em 60 minutos
3. **Uso Único:** Token é deletado após uso bem-sucedido
4. **Rate Limiting:** Considere adicionar rate limiting no endpoint de solicitação
5. **Mensagem Genérica:** Não revela se o email existe ou não
6. **Senha Forte:** Validação rigorosa de requisitos de senha
7. **Log de Auditoria:** Todas as ações são registradas

### Recomendações Adicionais:

1. **Rate Limiting:** Adicione throttle nas rotas públicas:

```php
Route::post('solicitar-recuperacao-senha', [AuthController::class, 'solicitarRecuperacaoSenha'])
    ->middleware('throttle:3,60'); // 3 tentativas por hora
```

2. **Invalidar Sessões:** Ao redefinir a senha, considere invalidar todos os tokens JWT ativos do usuário

3. **Notificação:** Considere enviar um e-mail de confirmação após a senha ser alterada

## Testando

### 1. Solicitar Recuperação

```bash
curl -X POST http://localhost:8000/api/auth/solicitar-recuperacao-senha \
  -H "Content-Type: application/json" \
  -d '{"email":"usuario@exemplo.com"}'
```

### 2. Verificar E-mail

Verifique sua caixa de entrada e copie o token da URL

### 3. Redefinir Senha

```bash
curl -X POST http://localhost:8000/api/auth/redefinir-senha \
  -H "Content-Type: application/json" \
  -d '{
    "email":"usuario@exemplo.com",
    "token":"TOKEN_COPIADO_DO_EMAIL",
    "senha":"NovaSenha@123",
    "confirmacao_senha":"NovaSenha@123"
  }'
```

### 4. Fazer Login

```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email":"usuario@exemplo.com",
    "senha":"NovaSenha@123"
  }'
```

## Troubleshooting

### E-mail não está sendo enviado

1. Verifique as configurações de e-mail no `.env`
2. Verifique os logs em `storage/logs/laravel.log`
3. Teste o envio de e-mail com: `php artisan tinker` e execute:

```php
Mail::raw('Teste', function($msg) {
    $msg->to('seu-email@exemplo.com')->subject('Teste');
});
```

### Token inválido ou expirado

1. Verifique se o token não expirou (60 minutos)
2. Certifique-se de que está usando o token completo da URL
3. Não tente usar o mesmo token duas vezes

### Senha não atende aos requisitos

Certifique-se de que a senha contenha:

- Pelo menos 8 caracteres
- Letra maiúscula, minúscula, número e caractere especial

## Arquivos Criados/Modificados

### Novos Arquivos:

- `app/Mail/PasswordResetMail.php` - Mailable do e-mail
- `resources/views/emails/password-reset.blade.php` - Template do e-mail
- `database/migrations/2025_10_13_000000_create_password_reset_tokens_table.php` - Migration

### Arquivos Modificados:

- `app/Services/AuthService.php` - Adicionados métodos de recuperação
- `app/Http/Controllers/AuthController.php` - Adicionados endpoints
- `routes/api.php` - Adicionadas rotas públicas
- `config/app.php` - Adicionada configuração `frontend_url`

## Próximos Passos

1. ✅ Execute a migration: `php artisan migrate`
2. ✅ Configure o `FRONTEND_URL` no `.env`
3. ✅ Teste o fluxo completo
4. ⚠️ Implemente rate limiting
5. ⚠️ Crie a página de redefinição no frontend
6. ⚠️ Adicione testes automatizados
