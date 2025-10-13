/**
 * Utility functions for form validation and data formatting
 */

// Email validation
export const isValidEmail = (email: string): boolean => {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email);
};

// CPF validation (basic format check)
export const isValidCPF = (cpf: string): boolean => {
	const cleanCPF = cpf.replace(/\D/g, '');
	return cleanCPF.length === 11;
};

// CNPJ validation (basic format check)
export const isValidCNPJ = (cnpj: string): boolean => {
	const cleanCNPJ = cnpj.replace(/\D/g, '');
	return cleanCNPJ.length === 14;
};

// Phone validation (Brazilian format - celular e fixo)
export const isValidPhone = (phone: string): boolean => {
	const cleanPhone = phone.replace(/\D/g, '');
	return cleanPhone.length === 10 || cleanPhone.length === 11; // (XX) XXXX-XXXX ou (XX) 9XXXX-XXXX
};

// CPF formatting
export const formatCPF = (value: string): string => {
	return value
		.replace(/\D/g, '')
		.replace(/(\d{3})(\d)/, '$1.$2')
		.replace(/(\d{3})(\d)/, '$1.$2')
		.replace(/(\d{3})(\d{1,2})/, '$1-$2')
		.replace(/(-\d{2})\d+?$/, '$1');
};

// CNPJ formatting
export const formatCNPJ = (value: string): string => {
	return value
		.replace(/\D/g, '')
		.replace(/(\d{2})(\d)/, '$1.$2')
		.replace(/(\d{3})(\d)/, '$1.$2')
		.replace(/(\d{3})(\d)/, '$1/$2')
		.replace(/(\d{4})(\d{1,2})/, '$1-$2')
		.replace(/(-\d{2})\d+?$/, '$1');
};

// Document formatting (CPF or CNPJ based on length)
export const formatDocument = (value: string): string => {
	const cleanValue = value.replace(/\D/g, '');
	if (cleanValue.length <= 11) {
		return formatCPF(value);
	} else {
		return formatCNPJ(value);
	}
};

// Phone formatting (Brazilian format - celular e fixo)
export const formatPhone = (value: string): string => {
	const clean = value.replace(/\D/g, '');
	
	if (clean.length <= 2) {
		return clean;
	} else if (clean.length <= 6) {
		return clean.replace(/(\d{2})(\d+)/, '($1) $2');
	} else if (clean.length <= 10) {
		// Format as (XX) XXXX-XXXX (telefone fixo)
		return clean.replace(/(\d{2})(\d{4})(\d+)/, '($1) $2-$3');
	} else {
		// Format as (XX) XXXXX-XXXX (celular)
		return clean.replace(/(\d{2})(\d{5})(\d+)/, '($1) $2-$3');
	}
};

// Password strength validation
export const validatePasswordStrength = (
	password: string
): {
	isValid: boolean;
	errors: string[];
} => {
	const errors: string[] = [];

	if (password.length < 8) {
		errors.push('Senha deve ter pelo menos 8 caracteres');
	}

	if (!/[A-Z]/.test(password)) {
		errors.push('Senha deve conter pelo menos uma letra maiúscula');
	}

	if (!/[a-z]/.test(password)) {
		errors.push('Senha deve conter pelo menos uma letra minúscula');
	}

	if (!/\d/.test(password)) {
		errors.push('Senha deve conter pelo menos um número');
	}

	return {
		isValid: errors.length === 0,
		errors,
	};
};

// Clean string for API submission (remove formatting)
export const cleanString = (value: string): string => {
	return value.replace(/\D/g, '');
};

// Name validation (only letters and spaces)
export const isValidName = (name: string): boolean => {
	const nameRegex = /^[a-zA-ZÀ-ÿ\s]+$/;
	return nameRegex.test(name.trim()) && name.trim().length >= 2;
};
