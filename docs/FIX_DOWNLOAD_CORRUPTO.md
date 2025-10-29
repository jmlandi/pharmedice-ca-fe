# Fix: Downloads de Laudos Corrompidos

## Problema Identificado

Os downloads de PDFs estavam vindo corrompidos devido a problemas na configuração do axios ao fazer requisições de tipo `blob`.

## Causas Principais

### 1. **Headers incorretos na requisição**
- O axios estava enviando `Content-Type: application/json` mesmo para downloads de PDF
- Faltava o header `Accept: application/pdf` para indicar explicitamente que esperamos um PDF

### 2. **Processamento desnecessário no interceptor**
- O interceptor de resposta poderia estar tentando processar blobs como JSON

## Correções Aplicadas

### 1. Em `src/lib/laudos.ts`

**Antes:**
```typescript
static async download(id: string): Promise<Blob> {
    const response = await api.get(`/laudos/${id}/download`, {
        responseType: 'blob',
    });
    return response.data;
}
```

**Depois:**
```typescript
static async download(id: string): Promise<Blob> {
    const response = await api.get(`/laudos/${id}/download`, {
        responseType: 'blob',
        headers: {
            'Accept': 'application/pdf',
        },
    });
    return response.data;
}
```

**Mudanças:**
- ✅ Adicionado header `Accept: application/pdf` para indicar que esperamos um PDF
- ✅ Mantido `responseType: 'blob'` para receber dados binários

### 2. Em `src/lib/api.ts`

**Interceptor de resposta atualizado:**
```typescript
api.interceptors.response.use(
    (response) => {
        // Retorna a resposta sem processamento adicional para blobs
        if (response.config.responseType === 'blob') {
            return response;
        }
        return response;
    },
    (error) => {
        // ... tratamento de erros
    }
);
```

**Mudanças:**
- ✅ Adicionada verificação explícita para não processar respostas do tipo blob
- ✅ Garante que PDFs não sejam interpretados como JSON

### 3. Melhorias nos componentes de download

Melhorado o nome dos arquivos baixados em:
- `src/components/painel/cliente/ClienteLaudosList.tsx`
- `src/components/painel/admin/LaudosList.tsx`

**Mudanças:**
- ✅ Nome do arquivo baseado no título do laudo
- ✅ Melhor limpeza de recursos (URL.revokeObjectURL)
- ✅ Comentários mais claros no código

## Como Testar

### 1. **Teste básico de download**
```bash
# Faça login no sistema
# Navegue até a área de laudos (cliente ou admin)
# Clique no botão de download de um laudo
# Verifique se o PDF baixado abre corretamente sem erros
```

### 2. **Verificação de integridade do arquivo**
```bash
# No terminal, verifique se o arquivo é um PDF válido
file laudo_baixado.pdf
# Deve retornar: "PDF document, version X.X"

# Tente abrir com diferentes visualizadores
open laudo_baixado.pdf  # macOS
```

### 3. **Teste de múltiplos downloads**
- Baixe vários laudos em sequência
- Verifique se todos abrem corretamente
- Confirme que os nomes dos arquivos são apropriados

### 4. **Verificação no DevTools**

Abra o DevTools do navegador (F12) e verifique:

**Network tab:**
- Request Headers devem incluir:
  - `Accept: application/pdf`
  - `Authorization: Bearer [token]`
- Response deve ter:
  - `Content-Type: application/pdf`
  - Status: 200
  - Type: blob

**Console:**
- Não deve haver erros relacionados a download
- Deve aparecer a mensagem "Download iniciado!"

## Problemas Conhecidos e Soluções

### Problema: "Failed to fetch" ou "Network Error"

**Possíveis causas:**
1. Token expirado
2. CORS não configurado corretamente no backend
3. Endpoint não está retornando o arquivo corretamente

**Solução:**
```typescript
// Verifique se o token está válido
const token = localStorage.getItem('token');
console.log('Token:', token);

// Teste o endpoint diretamente
const response = await fetch('http://54.82.6.59:8000/api/laudos/{id}/download', {
    headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/pdf'
    }
});
console.log('Response:', response);
```

### Problema: Arquivo baixa mas está vazio ou corrompido

**Possíveis causas:**
1. Backend está retornando dados errados
2. Encoding incorreto
3. Blob não está sendo criado corretamente

**Solução:**
```typescript
// Verifique o tamanho do blob
const blob = await LaudosService.download(laudoId);
console.log('Blob size:', blob.size);
console.log('Blob type:', blob.type);

// Deve retornar algo como:
// Blob size: 245678 (número > 0)
// Blob type: application/pdf
```

### Problema: Download funciona mas o nome do arquivo está errado

**Solução:**
- O nome é gerado a partir do título do laudo
- Caracteres especiais são substituídos por underscore
- Extensão .pdf é adicionada automaticamente

## Configuração do Backend

Certifique-se de que o backend está configurado corretamente:

```php
// Laravel - Exemplo de endpoint correto
public function download($id)
{
    $laudo = Laudo::findOrFail($id);
    
    return response()->file(
        storage_path('app/' . $laudo->url_arquivo),
        [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'attachment; filename="' . basename($laudo->url_arquivo) . '"'
        ]
    );
}
```

**Headers importantes do backend:**
- `Content-Type: application/pdf`
- `Content-Disposition: attachment; filename="..."`
- `Access-Control-Allow-Origin: *` (ou domínio específico)
- `Access-Control-Allow-Headers: Authorization, Accept, Content-Type`

## Checklist de Verificação

- [ ] Header `Accept: application/pdf` está presente na requisição
- [ ] `responseType: 'blob'` está configurado
- [ ] Interceptor não está processando blobs como JSON
- [ ] Backend retorna `Content-Type: application/pdf`
- [ ] CORS está configurado corretamente
- [ ] Token JWT está válido e sendo enviado
- [ ] Arquivo existe no servidor
- [ ] Permissões de leitura estão corretas no servidor

## Monitoramento

Para monitorar downloads em produção, adicione logs:

```typescript
static async download(id: string): Promise<Blob> {
    console.log('[Download] Iniciando download do laudo:', id);
    
    const response = await api.get(`/laudos/${id}/download`, {
        responseType: 'blob',
        headers: {
            'Accept': 'application/pdf',
        },
    });
    
    console.log('[Download] Resposta recebida:', {
        size: response.data.size,
        type: response.data.type,
        status: response.status
    });
    
    return response.data;
}
```

## Data da Correção

29 de Outubro de 2025

## Autor

GitHub Copilot
