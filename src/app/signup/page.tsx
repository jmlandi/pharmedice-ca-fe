'use client';

import { useState } from 'react';
import Link from 'next/link';
import AuthLayout from '@/components/AuthLayout';
import FormField from '@/components/FormField';
import SubmitButton from '@/components/SubmitButton';
import { useAlert } from '@/components/AlertProvider';
import {
	formatDocument,
	formatPhone,
	isValidEmail,
	isValidCPF,
	isValidCNPJ,
	isValidPhone,
	isValidName,
	cleanString,
} from '@/lib/utils';

interface SignupFormData {
	first_name: string;
	last_name: string;
	nickname: string;
	phone_number: string;
	email: string;
	password: string;
	confirmPassword: string;
	document_number: string;
}

function SignupForm() {
	const { showSuccess, showError } = useAlert();
	const [formData, setFormData] = useState<SignupFormData>({
		first_name: '',
		last_name: '',
		nickname: '',
		phone_number: '',
		email: '',
		password: '',
		confirmPassword: '',
		document_number: '',
	});
	const [isLoading, setIsLoading] = useState(false);
	const [errors, setErrors] = useState<Partial<SignupFormData>>({});

	const handleInputChange = (field: keyof SignupFormData, value: string) => {
		let formattedValue = value;

		if (field === 'document_number') {
			formattedValue = formatDocument(value);
		} else if (field === 'phone_number') {
			formattedValue = formatPhone(value);
		}

		setFormData((prev) => {
			const updatedData = {
				...prev,
				[field]: formattedValue,
			};

			// Auto-fill nickname with first word of first_name
			if (field === 'first_name' && formattedValue.trim()) {
				const firstWord = formattedValue.trim().split(' ')[0];
				updatedData.nickname = firstWord;
			}

			return updatedData;
		});

		// Clear error when user starts typing
		if (errors[field]) {
			setErrors((prev) => ({
				...prev,
				[field]: undefined,
			}));
		}

		// Clear nickname error when first_name changes and auto-fills nickname
		if (field === 'first_name' && value.trim() && errors.nickname) {
			setErrors((prev) => ({
				...prev,
				nickname: undefined,
			}));
		}
	};

	const validateForm = (): boolean => {
		const newErrors: Partial<SignupFormData> = {};

		if (!formData.first_name.trim()) newErrors.first_name = 'Campo obrigatório';
		else if (!isValidName(formData.first_name))
			newErrors.first_name = 'Nome inválido';

		if (!formData.last_name.trim()) newErrors.last_name = 'Campo obrigatório';
		else if (!isValidName(formData.last_name))
			newErrors.last_name = 'Nome inválido';

		if (!formData.nickname.trim()) newErrors.nickname = 'Campo obrigatório';
		if (!formData.phone_number.trim())
			newErrors.phone_number = 'Campo obrigatório';
		else if (!isValidPhone(formData.phone_number))
			newErrors.phone_number = 'Telefone inválido';

		if (!formData.email.trim()) newErrors.email = 'Campo obrigatório';
		else if (!isValidEmail(formData.email)) newErrors.email = 'E-mail inválido';

		if (!formData.password.trim()) newErrors.password = 'Campo obrigatório';
		else if (formData.password.length < 6)
			newErrors.password = 'Senha deve ter pelo menos 6 caracteres';

		if (!formData.confirmPassword.trim())
			newErrors.confirmPassword = 'Campo obrigatório';
		else if (formData.password !== formData.confirmPassword)
			newErrors.confirmPassword = 'Senhas não conferem';

		if (!formData.document_number.trim())
			newErrors.document_number = 'Campo obrigatório';
		else {
			const cleanDoc = cleanString(formData.document_number);
			if (
				!isValidCPF(formData.document_number) &&
				!isValidCNPJ(formData.document_number)
			) {
				newErrors.document_number =
					'CPF deve ter 11 dígitos ou CNPJ deve ter 14 dígitos';
			}
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!validateForm()) return;

		setIsLoading(true);

		try {
			// Here you would integrate with your Laravel API
			const cleanedData = {
				...formData,
				phone_number: cleanString(formData.phone_number),
				document_number: cleanString(formData.document_number),
			};
			console.log('Form data to send:', cleanedData);

			// Simulate API call
			await new Promise((resolve) => setTimeout(resolve, 2000));

			showSuccess('Conta criada com sucesso!');
		} catch (error) {
			console.error('Erro ao criar conta:', error);
			showError('Erro ao criar conta. Tente novamente.');
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<form
			onSubmit={handleSubmit}
			className="flex flex-col gap-4 w-[300px] md:w-full md:max-w-[420px] md:p-1 max-h-[70vh] overflow-y-auto"
		>
			{/* <div className="flex flex-col gap-2 mb-2">
				<p className="w-full text-center font-extralight text-white bg-[#527BC6] rounded-lg p-2">
					Crie sua conta informando os dados abaixo!
				</p>
			</div> */}

			<FormField
				label="Primeiro Nome"
				icon="/icons/account.svg"
				iconAlt="Ícone de usuário"
				type="text"
				placeholder="Digite seu primeiro nome"
				value={formData.first_name}
				error={errors.first_name}
				onChange={(value) => handleInputChange('first_name', value)}
			/>

			<FormField
				label="Segundo Nome"
				icon="/icons/account.svg"
				iconAlt="Ícone de usuário"
				type="text"
				placeholder="Digite seu segundo nome"
				value={formData.last_name}
				error={errors.last_name}
				onChange={(value) => handleInputChange('last_name', value)}
			/>

			<FormField
				label="Como gostaria de ser chamado"
				icon="/icons/account.svg"
				iconAlt="Ícone de usuário"
				type="text"
				placeholder="Como prefere ser chamado?"
				value={formData.nickname}
				error={errors.nickname}
				onChange={(value) => handleInputChange('nickname', value)}
			/>

			<FormField
				label="Número Celular"
				icon="/icons/account.svg"
				iconAlt="Ícone de telefone"
				type="tel"
				placeholder="(11) 99999-9999"
				value={formData.phone_number}
				error={errors.phone_number}
				maxLength={15}
				onChange={(value) => handleInputChange('phone_number', value)}
			/>

			<FormField
				label="CPF ou CNPJ"
				icon="/icons/account.svg"
				iconAlt="Ícone de documento"
				type="text"
				placeholder="000.000.000-00 ou 00.000.000/0000-00"
				value={formData.document_number}
				error={errors.document_number}
				maxLength={18}
				onChange={(value) => handleInputChange('document_number', value)}
			/>

			<FormField
				label="E-mail"
				icon="/icons/account.svg"
				iconAlt="Ícone de e-mail"
				type="email"
				placeholder="Digite seu e-mail"
				value={formData.email}
				error={errors.email}
				onChange={(value) => handleInputChange('email', value)}
			/>

			<FormField
				label="Senha"
				icon="/icons/lock.svg"
				iconAlt="Ícone de cadeado"
				type="password"
				placeholder="Digite sua senha"
				value={formData.password}
				error={errors.password}
				onChange={(value) => handleInputChange('password', value)}
			/>

			<FormField
				label="Confirmação de Senha"
				icon="/icons/lock.svg"
				iconAlt="Ícone de cadeado"
				type="password"
				placeholder="Confirme sua senha"
				value={formData.confirmPassword}
				error={errors.confirmPassword}
				onChange={(value) => handleInputChange('confirmPassword', value)}
			/>

			<SubmitButton isLoading={isLoading}>
				{isLoading ? 'Criando conta...' : 'Criar Conta'}
			</SubmitButton>
		</form>
	);
}

export default function SignupPage() {
	const navigationLinks = (
		<p className="text-sm text-[#527BC6] w-full text-center">
			Já tem uma conta?{' '}
			<Link href="/login" className="underline hover:opacity-70">
				Faça login!
			</Link>
		</p>
	);

	return (
		<AuthLayout title="Criar Conta" navigationLinks={navigationLinks}>
			<SignupForm />
		</AuthLayout>
	);
}
