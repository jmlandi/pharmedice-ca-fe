'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import AuthLayout from '@/components/AuthLayout';
import FormField from '@/components/FormField';
import SubmitButton from '@/components/SubmitButton';
import { useAlert } from '@/components/AlertProvider';
import { useLoading } from '@/components/LoadingProvider';
import { isValidEmail } from '@/lib/utils';

interface AdminLoginFormData {
	email: string;
	password: string;
}

function AdminLoginForm() {
	const { showError } = useAlert();
	const { startLoading, stopLoading } = useLoading();
	const [formData, setFormData] = useState<AdminLoginFormData>({
		email: '',
		password: '',
	});
	const [isLoading, setIsLoading] = useState(false);
	const [errors, setErrors] = useState<Partial<AdminLoginFormData>>({});

	const handleInputChange = (field: keyof AdminLoginFormData, value: string) => {
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

	const validateForm = (): boolean => {
		const newErrors: Partial<AdminLoginFormData> = {};

		if (!formData.email.trim()) {
			newErrors.email = 'Campo obrigatório';
		} else if (!isValidEmail(formData.email)) {
			newErrors.email = 'E-mail inválido';
		}

		if (!formData.password.trim()) {
			newErrors.password = 'Campo obrigatório';
		} else if (formData.password.length < 6) {
			newErrors.password = 'A senha deve ter pelo menos 6 caracteres';
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
			// TODO: Implementar chamada da API para login de admin
			console.log('Admin login data:', formData);
			
			// Simulação de delay da API
			await new Promise(resolve => setTimeout(resolve, 1000));
			
			// TODO: Redirecionar para dashboard do admin após sucesso
			showError('Login de admin ainda não implementado no backend');
		} catch (error) {
			console.error('Erro no login do admin:', error);
			showError('Erro interno do servidor. Tente novamente mais tarde.');
		} finally {
			setIsLoading(false);
			stopLoading();
		}
	};

	return (
		<div className="w-full max-w-md mx-auto">
			<div className="text-center mb-8">
				<div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
					<Image
						src="/icons/lock.svg"
						alt="Admin Login"
						width={32}
						height={32}
						className="text-blue-600"
					/>
				</div>
				<h1 className="text-2xl font-bold text-gray-900 mb-2">
					Área Administrativa
				</h1>
				<p className="text-gray-600">
					Acesse o painel administrativo da Pharmedice
				</p>
			</div>

			<form onSubmit={handleSubmit} className="space-y-6">
				<FormField
					label="E-mail"
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
					placeholder="Digite sua senha"
				/>

				<div className="flex items-center justify-between">
					<Link
						href="/admin/esqueci-senha"
						className="text-sm text-blue-600 hover:text-blue-500 transition-colors"
					>
						Esqueceu sua senha?
					</Link>
				</div>

				<SubmitButton
					isLoading={isLoading}
					className="w-full"
				>
					{isLoading ? 'Entrando...' : 'Entrar no Painel'}
				</SubmitButton>

				<div className="text-center">
					<span className="text-gray-600">Não tem uma conta administrativa? </span>
					<Link
						href="/admin/cadastro"
						className="text-blue-600 hover:text-blue-500 font-medium transition-colors"
					>
						Registrar-se
					</Link>
				</div>


			</form>
		</div>
	);
}

export default function AdminLogin() {
	return (
		<AuthLayout title="Login Administrativo">
			<AdminLoginForm />
		</AuthLayout>
	);
}