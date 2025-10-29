'use client';

import { useState } from 'react';
import Link from 'next/link';
import AuthLayout from '@/components/AuthLayout';
import FormField from '@/components/FormField';
import SubmitButton from '@/components/SubmitButton';
import { useAlert } from '@/components/AlertProvider';
import { useLoading } from '@/components/LoadingProvider';
import { isValidEmail } from '@/lib/utils';
import { solicitarRecuperacaoSenha } from '@/lib/api';

interface AdminForgotPasswordFormData {
	email: string;
}

function AdminForgotPasswordForm() {
	const { showError, showSuccess } = useAlert();
	const { startLoading, stopLoading } = useLoading();
	const [formData, setFormData] = useState<AdminForgotPasswordFormData>({
		email: '',
	});
	const [isLoading, setIsLoading] = useState(false);
	const [errors, setErrors] = useState<Partial<AdminForgotPasswordFormData>>(
		{}
	);
	const [isEmailSent, setIsEmailSent] = useState(false);

	const handleInputChange = (
		field: keyof AdminForgotPasswordFormData,
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

	const isValidAdminEmail = (email: string): boolean => {
		if (!isValidEmail(email)) return false;
		const domain = email.split('@')[1];
		return domain === 'pharmedice.com.br' || domain === 'marcoslandi.com';
	};

	const validateForm = (): boolean => {
		const newErrors: Partial<AdminForgotPasswordFormData> = {};

		if (!formData.email.trim()) {
			newErrors.email = 'Campo obrigatório';
		} else if (!isValidAdminEmail(formData.email)) {
			newErrors.email =
				'E-mail deve ser @pharmedice.com.br ou @marcoslandi.com';
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
			// Chama a API de recuperação de senha
			const response = await solicitarRecuperacaoSenha({
				email: formData.email,
			});

			if (response.sucesso) {
				setIsEmailSent(true);
				showSuccess(response.mensagem);
			} else {
				showError(
					response.mensagem || 'Erro ao enviar e-mail. Tente novamente.'
				);
			}
		} catch (error: any) {
			console.error('Erro ao enviar e-mail de recuperação:', error);
			const errorMessage =
				error.response?.data?.mensagem ||
				'Erro ao enviar e-mail. Tente novamente.';
			showError(errorMessage);
		} finally {
			setIsLoading(false);
			stopLoading();
		}
	};

	const handleResendEmail = async () => {
		setIsLoading(true);
		startLoading();

		try {
			// Reenvia o e-mail de recuperação
			const response = await solicitarRecuperacaoSenha({
				email: formData.email,
			});

			if (response.sucesso) {
				showSuccess('E-mail reenviado com sucesso!');
			} else {
				showError(
					response.mensagem || 'Erro ao reenviar e-mail. Tente novamente.'
				);
			}
		} catch (error: any) {
			console.error('Erro ao reenviar e-mail:', error);
			const errorMessage =
				error.response?.data?.mensagem ||
				'Erro ao reenviar e-mail. Tente novamente.';
			showError(errorMessage);
		} finally {
			setIsLoading(false);
			stopLoading();
		}
	};

	if (isEmailSent) {
		return (
			<div className="w-full max-w-md mx-auto text-center">
				<div className="inline-flex items-center justify-center w-16 h-16 bg-[#26364D] rounded-full mb-6">
					<svg
						className="w-8 h-8 text-[#F5F2ED]"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
						/>
					</svg>
				</div>

				<h1 className="text-2xl font-bold text-gray-900 mb-4">
					E-mail Enviado!
				</h1>

				<p className="text-gray-600 mb-6">
					Enviamos um link de recuperação para <strong>{formData.email}</strong>
					. Verifique sua caixa de entrada e a pasta de spam.
				</p>

				<div className="space-y-4">
					<SubmitButton
						isLoading={isLoading}
						onClick={handleResendEmail}
						variant="secondary"
						className="w-full"
					>
						{isLoading ? 'Reenviando...' : 'Reenviar E-mail'}
					</SubmitButton>

					<div className="flex flex-col gap-2">
						<Link
							href="/admin/entrar"
							className="text-blue-600 hover:text-blue-500 font-medium transition-colors"
						>
							Voltar ao Login
						</Link>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="w-full max-w-md mx-auto">
			<div className="text-center mb-8">
				<div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
					<svg
						className="w-8 h-8 text-orange-600"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
						/>
					</svg>
				</div>
				<h1 className="text-2xl font-bold text-gray-900 mb-2">
					Recuperar Senha Administrativa
				</h1>
				<p className="text-gray-600">
					Digite seu e-mail corporativo para receber o link de recuperação
				</p>
			</div>

			<form onSubmit={handleSubmit} className="space-y-6">
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

				<SubmitButton isLoading={isLoading} className="w-full">
					{isLoading ? 'Enviando...' : 'Enviar Link de Recuperação'}
				</SubmitButton>

				<div className="text-center space-y-2">
					<Link
						href="/admin/entrar"
						className="text-blue-600 hover:text-blue-500 font-medium transition-colors block"
					>
						← Voltar ao Login
					</Link>
					<Link
						href="/admin/cadastro"
						className="text-sm text-gray-600 hover:text-gray-500 transition-colors block"
					>
						Não tem conta? Registrar-se
					</Link>
				</div>
			</form>

			<div className="mt-6 p-4 bg-blue-50 rounded-lg">
				<p className="text-sm text-blue-700">
					<strong>Nota:</strong> A recuperação de senha está disponível apenas
					para contas administrativas (@pharmedice.com.br ou @marcoslandi.com).
				</p>
			</div>
		</div>
	);
}

export default function AdminForgotPassword() {
	const navigationLinks = (
		<div className="space-y-2 w-full text-center">
			<p className="text-sm text-[#B8ADA0]">
				Lembrou sua senha?{' '}
				<Link href="/admin/entrar" className="underline hover:opacity-70">
					Entrar
				</Link>
			</p>
		</div>
	);

	return (
		<AuthLayout
			title="Recuperar Senha Administrativa"
			navigationLinks={navigationLinks}
			backLink="/admin/entrar"
			backLabel="Voltar para o login"
		>
			<AdminForgotPasswordForm />
		</AuthLayout>
	);
}
