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

interface LoginFormData {
	email: string;
	password: string;
}

function LoginForm() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const { showError, showSuccess } = useAlert();
	const { startLoading, stopLoading } = useLoading();
	const { login, isLoggedIn, isAdmin } = useAuth();
	const [formData, setFormData] = useState<LoginFormData>({
		email: '',
		password: '',
	});
	const [isLoading, setIsLoading] = useState(false);
	const [errors, setErrors] = useState<Partial<LoginFormData>>({});

	// Verificar se há erro do Google OAuth no callback
	useEffect(() => {
		const error = searchParams.get('error');
		if (error) {
			showError(decodeURIComponent(error));
			// Limpar URL
			window.history.replaceState({}, '', window.location.pathname);
		}
	}, [searchParams, showError]);

	// Redirecionar se já estiver logado
	useEffect(() => {
		if (isLoggedIn) {
			const redirectTo = isAdmin ? '/admin/painel' : '/cliente/painel';
			router.push(redirectTo);
		}
	}, [isLoggedIn, isAdmin, router]);

	const handleInputChange = (field: keyof LoginFormData, value: string) => {
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
		startLoading();

		try {
			await login({
				email: formData.email,
				senha: formData.password,
			});

			showSuccess('Login realizado com sucesso!');
			// O redirecionamento será gerenciado pelo ProtectedRoute
			// Se o email não estiver verificado, será mostrada a tela de verificação
			router.push('/cliente/painel');
		} catch (error: any) {
			console.error('Erro ao fazer login:', error);
			const message =
				error?.response?.data?.message ||
				error?.message ||
				'Erro ao fazer login. Verifique suas credenciais.';
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
					href="/cliente/esqueci-senha"
					className="text-xs text-gray-500 hover:text-gray-700 transition-opacity duration-200"
				>
					Esqueci minha senha
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
						<span className="px-2 bg-white text-gray-500">Ou</span>
					</div>
				</div>

				{/* Google login button */}
				<GoogleLoginButton />
			</div>
		</form>
	);
}

export default function LoginPage() {
	const navigationLinks = (
		<div className="space-y-2 w-full text-center">
			<p className="text-sm text-gray-500">
				Não tem uma conta?{' '}
				<Link href="/cliente/cadastro" className="underline hover:opacity-70">
					Cadastre-se!
				</Link>
			</p>
			<p className="text-xs text-gray-400">
				<Link href="/admin/entrar" className="hover:text-gray-600 transition-colors">
					Acesso administrativo
				</Link>
			</p>
		</div>
	);

	return (
		<AuthLayout 
			title="Área do Cliente" 
			navigationLinks={navigationLinks}
			backLink="https://pharmedice.com.br"
			backLabel="Retornar para o site"
		>
			<Suspense fallback={<div className="text-center py-8">Carregando...</div>}>
				<LoginForm />
			</Suspense>
		</AuthLayout>
	);
}
