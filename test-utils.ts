/**
 * Simple test examples for utility functions
 * Run with: npx tsx test-utils.ts
 */

import {
	formatDocument,
	formatPhone,
	isValidEmail,
	isValidCPF,
	isValidCNPJ,
	isValidPhone,
	isValidName,
	cleanString,
} from './src/lib/utils';

console.log('Testing utility functions...\n');

// Test document formatting
console.log('Document formatting:');
console.log('CPF:', formatDocument('12345678901')); // Should format as CPF
console.log('CNPJ:', formatDocument('12345678000123')); // Should format as CNPJ

// Test phone formatting
console.log('\nPhone formatting:');
console.log('Phone:', formatPhone('11999887766')); // Should format as (11) 99988-7766

// Test email validation
console.log('\nEmail validation:');
console.log('Valid email:', isValidEmail('user@example.com')); // true
console.log('Invalid email:', isValidEmail('invalid-email')); // false

// Test document validation
console.log('\nDocument validation:');
console.log('Valid CPF length:', isValidCPF('123.456.789-01')); // true
console.log('Valid CNPJ length:', isValidCNPJ('12.345.678/0001-23')); // true

// Test phone validation
console.log('\nPhone validation:');
console.log('Valid phone:', isValidPhone('(11) 99988-7766')); // true
console.log('Invalid phone:', isValidPhone('123456')); // false

// Test name validation
console.log('\nName validation:');
console.log('Valid name:', isValidName('João')); // true
console.log('Invalid name:', isValidName('123')); // false

// Test string cleaning
console.log('\nString cleaning:');
console.log('Clean CPF:', cleanString('123.456.789-01')); // 12345678901
console.log('Clean phone:', cleanString('(11) 99988-7766')); // 11999887766

console.log('\nAll tests completed!');
