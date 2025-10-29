'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import AuthLayout from '@/components/AuthLayout';
import FormField from '@/components/FormField';
import SubmitButton from '@/components/SubmitButton';
import GoogleLoginButton from '@/components/GoogleLoginButton';
import { useAlert } from '@/components/AlertProvider';
import { useLoading } from '@/components/LoadingProvider';
import { useAuth } from '@/components/AuthProvider';
import { isValidEmail } from '@/lib/utils';

interface AdminLoginFormData {
	email: string;
	password: string;
}

function AdminLoginForm() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const { showError, showSuccess } = useAlert();
	const { startLoading, stopLoading } = useLoading();
	const { login, isLoggedIn, isAdmin } = useAuth();
	const [formData, setFormData] = useState<AdminLoginFormData>({
		email: '',
		password: '',
	});
	const [isLoading, setIsLoading] = useState(false);
	const [errors, setErrors] = useState<Partial<AdminLoginFormData>>({});

	// Verificar se há erro do Google OAuth no callback
	useEffect(() => {
		const error = searchParams.get('error');
		if (error) {
			showError(decodeURIComponent(error));
			// Limpar URL
			window.history.replaceState({}, '', window.location.pathname);
		}
	}, [searchParams, showError]);

	// Redirecionar se já estiver logado como admin
	useEffect(() => {
		if (isLoggedIn && isAdmin) {
			router.push('/admin/painel');
		}
	}, [isLoggedIn, isAdmin, router]);

	const handleInputChange = (
		field: keyof AdminLoginFormData,
		value: string
	) => {
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
			await login({
				email: formData.email,
				senha: formData.password,
			});

			showSuccess('Login realizado com sucesso!');
			// O redirecionamento será gerenciado pelo ProtectedRoute
			// Se o email não estiver verificado, será mostrada a tela de verificação
			router.push('/admin/painel');
		} catch (error: any) {
			console.error('Erro no login do admin:', error);
			const message =
				error?.response?.data?.message ||
				error?.message ||
				'Erro interno do servidor. Tente novamente mais tarde.';
			showError(message);
		} finally {
			setIsLoading(false);
			stopLoading();
		}
	};

	return (
		<form
			onSubmit={handleSubmit}
			className="flex flex-col gap-4 w-[300px] md:w-full md:max-w-[420px] md:p-1"
		>
			<FormField
				label="E-mail"
				icon="/icons/account.svg"
				type="email"
				placeholder="seu.email@pharmedice.com.br"
				value={formData.email}
				error={errors.email}
				onChange={(value) => handleInputChange('email', value)}
			/>

			<FormField
				label="Senha"
				icon="/icons/lock.svg"
				type="password"
				placeholder="Digite a senha da sua conta"
				value={formData.password}
				error={errors.password}
				onChange={(value) => handleInputChange('password', value)}
			/>

			{/* Forgot password link */}
			<div className="flex justify-end">
				<Link
					href="/admin/esqueci-senha"
					className="text-xs text-[#B8ADA0] hover:text-[#A39789] transition-opacity duration-200"
				>
					Esqueceu sua senha?
				</Link>
			</div>

			{/* Login buttons */}
			<div className="flex flex-col gap-3">
				<SubmitButton isLoading={isLoading}>
					{isLoading ? 'Entrando...' : 'Iniciar Sessão'}
				</SubmitButton>

				{/* Divisor */}
				<div className="relative my-2">
					<div className="absolute inset-0 flex items-center">
						<div className="w-full border-t border-gray-300"></div>
					</div>
					<div className="relative flex justify-center text-sm">
						<span className="px-2 bg-[#F5F2ED] text-gray-500">Ou</span>
					</div>
				</div>

				{/* Google login button */}
				<GoogleLoginButton text="Entrar com Google" />
			</div>
		</form>
	);
}

export default function AdminLogin() {
	const navigationLinks = (
		<div className="space-y-2 w-full text-center">
			<p className="text-sm text-[#B8ADA0]">
				Não tem uma conta administrativa?{' '}
				<Link href="/admin/cadastro" className="underline hover:opacity-70">
					Registrar-se
				</Link>
			</p>
		</div>
	);

	return (
		<AuthLayout 
			title="Área Administrativa" 
			navigationLinks={navigationLinks}
			backLink="https://pharmedice.com.br"
			backLabel="Retornar para o site"
		>
			<Suspense fallback={<div className="text-center py-8">Carregando...</div>}>
				<AdminLoginForm />
			</Suspense>
		</AuthLayout>
	);
}
