// Teste de Apelidos com Caracteres Especiais
console.log('🧪 Teste de Apelidos com Caracteres Especiais');
console.log('='.repeat(50));

// Simulando as validações dos formulários
const validateNickname = (nickname) => {
    const errors = [];
    
    if (!nickname.trim()) {
        errors.push('O apelido é obrigatório');
    } else if (nickname.length < 3) {
        errors.push('O apelido deve ter pelo menos 3 caracteres');
    } else if (nickname.length > 30) {
        errors.push('O apelido deve ter no máximo 30 caracteres');
    } else if (!/^[A-Za-zÀ-ÿ0-9\s]+$/.test(nickname)) {
        errors.push('O apelido deve conter apenas letras, números e espaços');
    }
    
    return {
        isValid: errors.length === 0,
        errors: errors
    };
};

const testCases = [
    'João',
    'José',
    'Maria José',
    'João123',
    'Ção',
    'Ação Especial',
    'André',
    'José da Silva',
    'João@email',
    'Test_user',
    'user-name',
    'João#123',
    'Àáâãäåæçèéêë',
    'João Ção 123'
];

console.log('\nResultados dos testes:');
console.log('-'.repeat(50));

testCases.forEach(nickname => {
    const result = validateNickname(nickname);
    const status = result.isValid ? '✅' : '❌';
    const errorMsg = result.errors.length > 0 ? ` - ${result.errors[0]}` : '';
    console.log(`${status} '${nickname}'${errorMsg}`);
});

console.log('\n📋 Resumo:');
const validCount = testCases.filter(name => validateNickname(name).isValid).length;
console.log(`✅ Válidos: ${validCount}/${testCases.length}`);
console.log(`❌ Inválidos: ${testCases.length - validCount}/${testCases.length}`);