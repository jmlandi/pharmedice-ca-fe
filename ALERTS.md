# Sistema de Alertas Personalizado

Este projeto implementa um sistema de alertas personalizado que substitui os alertas padrão do navegador (`alert()`, `confirm()`) por componentes customizados que seguem o design system do projeto.

## Características

- ✅ **Design Consistente**: Alertas que seguem o design system da Pharmédice
- ✅ **Múltiplos Tipos**: Success, Error, Warning, Info
- ✅ **Auto-dismiss**: Alertas desaparecem automaticamente após 5 segundos (configurável)
- ✅ **Empilhamento**: Múltiplos alertas são empilhados verticalmente
- ✅ **Acessibilidade**: Suporte a teclado e foco
- ✅ **Animações Suaves**: Transições CSS suaves
- ✅ **Modal de Confirmação**: Substitui `window.confirm()` com modal customizado

## Uso Básico

### 1. Importar o Hook

```tsx
import { useAlert } from '@/components/AlertProvider';
// ou
import { useCustomAlert } from '@/lib/useCustomAlert';
```

### 2. Usar no Componente

```tsx
function MyComponent() {
  const { showSuccess, showError, showWarning, showInfo } = useAlert();
  
  const handleAction = () => {
    // Substituir: alert('Sucesso!')
    showSuccess('Operação realizada com sucesso!');
    
    // Substituir: alert('Erro!')
    showError('Erro ao processar solicitação.');
  };
}
```

### 3. Modal de Confirmação

```tsx
function MyComponent() {
  const { showConfirm } = useAlert();
  
  const handleDelete = () => {
    showConfirm(
      'Tem certeza que deseja excluir este item?',
      () => {
        // Ação confirmada
        console.log('Item excluído');
      },
      {
        title: 'Confirmar Exclusão',
        confirmText: 'Excluir',
        cancelText: 'Cancelar',
        type: 'error'
      }
    );
  };
}
```

## Migração de Alertas Existentes

### Antes (Alertas do Navegador)
```tsx
// ❌ Alerta padrão do navegador
alert('Erro ao fazer login. Verifique suas credenciais.');

// ❌ Confirmação padrão do navegador
if (confirm('Tem certeza?')) {
  deleteItem();
}
```

### Depois (Alertas Personalizados)
```tsx
// ✅ Alerta personalizado
showError('Erro ao fazer login. Verifique suas credenciais.');

// ✅ Confirmação personalizada
showConfirm('Tem certeza?', () => deleteItem());
```

## API de Alertas

### Tipos de Alerta

| Método | Descrição | Cor |
|--------|-----------|-----|
| `showSuccess(message, duration?)` | Alerta de sucesso | Verde |
| `showError(message, duration?)` | Alerta de erro | Vermelho |
| `showWarning(message, duration?)` | Alerta de aviso | Amarelo |
| `showInfo(message, duration?)` | Alerta informativo | Azul |

### Parâmetros

- `message: string` - Mensagem do alerta
- `duration?: number` - Duração em ms (padrão: 5000ms, 0 = não desaparece)

### Modal de Confirmação

```tsx
showConfirm(message, onConfirm, options?)
```

**Parâmetros:**
- `message: string` - Mensagem de confirmação
- `onConfirm: () => void` - Callback executado ao confirmar
- `options?`:
  - `title?: string` - Título do modal
  - `confirmText?: string` - Texto do botão confirmar (padrão: "Confirmar")
  - `cancelText?: string` - Texto do botão cancelar (padrão: "Cancelar")
  - `onCancel?: () => void` - Callback executado ao cancelar
  - `type?: 'info' | 'warning' | 'error'` - Tipo do modal (padrão: 'info')

## Personalização

### Cores e Estilos

Os alertas usam as cores definidas no `globals.css`:
- Azul Pharmédice: `var(--pharmedice-blue)` (#527BC6)
- Fonte: Montserrat
- Bordas arredondadas: `rounded-3xl`
- Sombras: `shadow-lg`

### Configuração de Duração

```tsx
// Alerta que desaparece em 3 segundos
showSuccess('Mensagem', 3000);

// Alerta que não desaparece automaticamente
showError('Mensagem importante', 0);
```

## Estrutura de Arquivos

```
src/
├── components/
│   ├── Alert.tsx              # Componente de alerta individual
│   ├── AlertProvider.tsx      # Provider de contexto
│   └── ConfirmModal.tsx       # Modal de confirmação
├── lib/
│   └── useCustomAlert.ts      # Hook utilitário
└── app/
    ├── layout.tsx             # Layout com AlertProvider
    └── alerts-demo/
        └── page.tsx           # Página de demonstração
```

## Demo

Acesse `/alerts-demo` para ver uma demonstração interativa de todos os tipos de alertas.

## Benefícios

1. **UX Consistente**: Design alinhado com a identidade visual
2. **Acessibilidade**: Melhor suporte a leitores de tela
3. **Responsivo**: Funciona bem em dispositivos móveis
4. **Não Intrusivo**: Não bloqueia a interface do usuário
5. **Customizável**: Fácil de personalizar cores e estilos