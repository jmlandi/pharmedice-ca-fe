'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import AuthLayout from '@/components/AuthLayout';
import FormField from '@/components/FormField';
import SubmitButton from '@/components/SubmitButton';
import { isValidEmail } from '@/lib/utils';

interface LoginFormData {
	email: string;
	password: string;
}

function LoginForm() {
	const [formData, setFormData] = useState<LoginFormData>({
		email: '',
		password: '',
	});
	const [isLoading, setIsLoading] = useState(false);
	const [errors, setErrors] = useState<Partial<LoginFormData>>({});

	const handleInputChange = (field: keyof LoginFormData, value: string) => {
		setFormData(prev => ({
			...prev,
			[field]: value
		}));

		// Clear error when user starts typing
		if (errors[field]) {
			setErrors(prev => ({
				...prev,
				[field]: undefined
			}));
		}
	};

	const validateForm = (): boolean => {
		const newErrors: Partial<LoginFormData> = {};

		if (!formData.email.trim()) {
			newErrors.email = 'Campo obrigatório';
		} else if (!isValidEmail(formData.email)) {
			newErrors.email = 'E-mail inválido';
		}

		if (!formData.password.trim()) {
			newErrors.password = 'Campo obrigatório';
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
			console.log('Login attempt:', formData.email);
			// const response = await fetch('/api/login', {
			//   method: 'POST',
			//   headers: { 'Content-Type': 'application/json' },
			//   body: JSON.stringify(formData)
			// });
			
			// Simulate API call
			await new Promise(resolve => setTimeout(resolve, 1500));
			
			// On success, redirect to dashboard
			window.location.href = '/dashboard';
		} catch (error) {
			console.error('Erro ao fazer login:', error);
			alert('Erro ao fazer login. Verifique suas credenciais.');
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="flex flex-col gap-4 w-[300px] md:w-full md:max-w-[420px] md:p-1">
			<FormField
				label="E-mail"
				icon="/icons/account.svg"
				iconAlt="Ícone de usuário"
				type="email"
				placeholder="Digite o e-mail da sua conta"
				value={formData.email}
				error={errors.email}
				onChange={(value) => handleInputChange('email', value)}
			/>

			<FormField
				label="Senha"
				icon="/icons/lock.svg"
				iconAlt="Ícone de cadeado"
				type="password"
				placeholder="Digite a senha da sua conta"
				value={formData.password}
				error={errors.password}
				onChange={(value) => handleInputChange('password', value)}
			/>

			{/* Forgot password link */}
			<div className="flex justify-end">
				<Link 
					href="/forgot-password"
					className="text-xs text-[#527BC6] hover:opacity-70 transition-opacity duration-200"
				>
					Esqueceu sua senha?
				</Link>
			</div>

			{/* Login buttons */}
			<div className="flex flex-row items-center gap-2 justify-between">
				<SubmitButton isLoading={isLoading}>
					{isLoading ? 'Entrando...' : 'Iniciar Sessão'}
				</SubmitButton>
				{/* Google login button - await for MVP approval */}
        {/* <a href="#" className="w-full hover:opacity-60">
					<Image
						src="/icons/btn-google-light.svg"
						alt="Botão de login com Google"
						width={16}
						height={16}
						className="w-full h-auto"
					/>
				</a> */}
			</div>
		</form>
	);
}

export default function LoginPage() {
	const navigationLinks = (
		<p className="text-sm text-[#527BC6] w-full text-center">
			Não tem uma conta?{' '}
			<Link href="/signup" className="underline hover:opacity-70">
				Cadastre-se!
			</Link>
		</p>
	);

	return (
		<AuthLayout title="Área do Cliente" navigationLinks={navigationLinks}>
			<LoginForm />
		</AuthLayout>
	);
}