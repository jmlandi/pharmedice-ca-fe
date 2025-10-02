'use client';

import { useState } from 'react';
import Link from 'next/link';
import AuthLayout from '@/components/AuthLayout';
import FormField from '@/components/FormField';
import SubmitButton from '@/components/SubmitButton';
import { useAlert } from '@/components/AlertProvider';
import { useLoading } from '@/components/LoadingProvider';
import { isValidEmail, isValidName } from '@/lib/utils';

interface AdminSignupFormData {
	first_name: string;
	last_name: string;
	nickname: string;
	email: string;
	password: string;
	confirmPassword: string;
}

function AdminSignupForm() {
	const { showSuccess, showError } = useAlert();
	const { startLoading, stopLoading } = useLoading();
	const [formData, setFormData] = useState<AdminSignupFormData>({
		first_name: '',
		last_name: '',
		nickname: '',
		email: '',
		password: '',
		confirmPassword: '',
	});
	const [isLoading, setIsLoading] = useState(false);
	const [errors, setErrors] = useState<Partial<AdminSignupFormData>>({});

	const handleInputChange = (field: keyof AdminSignupFormData, value: string) => {
		setFormData((prev) => ({
			...prev,
			[field]: value,
		}));

		// Clear error when user starts typing
		if (errors[field]) {
			setErrors((prev) => ({
				...prev,
				[field]: undefined,
			}));
		}
	};

	const isValidAdminEmail = (email: string): boolean => {
		if (!isValidEmail(email)) return false;
		const domain = email.split('@')[1];
		return domain === 'pharmedice.com.br' || domain === 'marcoslandi.com';
	};

	const validateForm = (): boolean => {
		const newErrors: Partial<AdminSignupFormData> = {};

		if (!formData.first_name.trim()) {
			newErrors.first_name = 'Campo obrigatório';
		} else if (!isValidName(formData.first_name)) {
			newErrors.first_name = 'Nome deve conter apenas letras e espaços';
		}

		if (!formData.last_name.trim()) {
			newErrors.last_name = 'Campo obrigatório';
		} else if (!isValidName(formData.last_name)) {
			newErrors.last_name = 'Sobrenome deve conter apenas letras e espaços';
		}

		if (!formData.nickname.trim()) {
			newErrors.nickname = 'Campo obrigatório';
		} else if (formData.nickname.length < 2) {
			newErrors.nickname = 'Apelido deve ter pelo menos 2 caracteres';
		}

		if (!formData.email.trim()) {
			newErrors.email = 'Campo obrigatório';
		} else if (!isValidAdminEmail(formData.email)) {
			newErrors.email = 'E-mail deve ser @pharmedice.com.br ou @marcoslandi.com';
		}

		if (!formData.password.trim()) {
			newErrors.password = 'Campo obrigatório';
		} else if (formData.password.length < 8) {
			newErrors.password = 'A senha deve ter pelo menos 8 caracteres';
		}

		if (!formData.confirmPassword.trim()) {
			newErrors.confirmPassword = 'Campo obrigatório';
		} else if (formData.password !== formData.confirmPassword) {
			newErrors.confirmPassword = 'As senhas não coincidem';
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!validateForm()) {
			return;
		}

		setIsLoading(true);
		startLoading();

		try {
			// TODO: Implementar chamada da API para cadastro de admin
			console.log('Admin signup data:', {
				first_name: formData.first_name,
				last_name: formData.last_name,
				nickname: formData.nickname,
				email: formData.email,
				password: formData.password,
			});
			
			// Simulação de delay da API
			await new Promise(resolve => setTimeout(resolve, 1500));
			
			showSuccess('Conta administrativa criada com sucesso! Verifique seu e-mail.');
			
			// TODO: Redirecionar para página de verificação ou login
		} catch (error) {
			console.error('Erro no cadastro do admin:', error);
			showError('Erro interno do servidor. Tente novamente mais tarde.');
		} finally {
			setIsLoading(false);
			stopLoading();
		}
	};

	return (
		<div className="w-full max-w-md mx-auto">
			<div className="text-center mb-8">
				<div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
					<svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
					</svg>
				</div>
				<h1 className="text-2xl font-bold text-gray-900 mb-2">
					Criar Conta Administrativa
				</h1>
				<p className="text-gray-600">
					Registre-se para acessar o painel administrativo
				</p>
			</div>

			<form onSubmit={handleSubmit} className="space-y-4">
				<div className="grid grid-cols-2 gap-4">
					<FormField
						label="Primeiro Nome"
						icon="/icons/account.svg"
						iconAlt="Nome"
						type="text"
						value={formData.first_name}
						onChange={(value) => handleInputChange('first_name', value)}
						error={errors.first_name}
						placeholder="João"
					/>

					<FormField
						label="Segundo Nome"
						icon="/icons/account.svg"
						iconAlt="Sobrenome"
						type="text"
						value={formData.last_name}
						onChange={(value) => handleInputChange('last_name', value)}
						error={errors.last_name}
						placeholder="Silva"
					/>
				</div>

				<FormField
					label="Apelido"
					icon="/icons/account.svg"
					iconAlt="Apelido"
					type="text"
					value={formData.nickname}
					onChange={(value) => handleInputChange('nickname', value)}
					error={errors.nickname}
					placeholder="Como prefere ser chamado"
				/>

				<FormField
					label="E-mail Corporativo"
					icon="/icons/account.svg"
					iconAlt="Email"
					type="email"
					value={formData.email}
					onChange={(value) => handleInputChange('email', value)}
					error={errors.email}
					placeholder="seu.email@pharmedice.com.br"
				/>

				<FormField
					label="Senha"
					icon="/icons/lock.svg"
					iconAlt="Senha"
					type="password"
					value={formData.password}
					onChange={(value) => handleInputChange('password', value)}
					error={errors.password}
					placeholder="Mínimo 8 caracteres"
				/>

				<FormField
					label="Confirmar Senha"
					icon="/icons/lock.svg"
					iconAlt="Confirmar Senha"
					type="password"
					value={formData.confirmPassword}
					onChange={(value) => handleInputChange('confirmPassword', value)}
					error={errors.confirmPassword}
					placeholder="Digite a senha novamente"
				/>

				<div className="pt-2">
					<SubmitButton
						isLoading={isLoading}
						className="w-full"
					>
						{isLoading ? 'Criando conta...' : 'Criar Conta Administrativa'}
					</SubmitButton>
				</div>

				<div className="text-center">
					<span className="text-gray-600">Já tem uma conta administrativa? </span>
					<Link
						href="/admin/entrar"
						className="text-blue-600 hover:text-blue-500 font-medium transition-colors"
					>
						Fazer login
					</Link>
				</div>


			</form>

			<div className="mt-6 p-4 bg-blue-50 rounded-lg">
				<p className="text-sm text-blue-700">
					<strong>Nota:</strong> Apenas colaboradores com e-mail corporativo 
					(@pharmedice.com.br ou @marcoslandi.com) podem criar contas administrativas.
				</p>
			</div>
		</div>
	);
}

export default function AdminSignup() {
	return (
		<AuthLayout title="Cadastro Administrativo">
			<AdminSignupForm />
		</AuthLayout>
	);
}