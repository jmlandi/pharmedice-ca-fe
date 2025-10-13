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

interface ForgotPasswordFormData {
	email: string;
}

function ForgotPasswordForm() {
	const { showError, showSuccess } = useAlert();
	const { startLoading, stopLoading } = useLoading();
	const [formData, setFormData] = useState<ForgotPasswordFormData>({
		email: '',
	});
	const [isLoading, setIsLoading] = useState(false);
	const [errors, setErrors] = useState<Partial<ForgotPasswordFormData>>({});
	const [isEmailSent, setIsEmailSent] = useState(false);

	const handleInputChange = (
		field: keyof ForgotPasswordFormData,
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
		const newErrors: Partial<ForgotPasswordFormData> = {};

		if (!formData.email.trim()) {
			newErrors.email = 'Campo obrigatório';
		} else if (!isValidEmail(formData.email)) {
			newErrors.email = 'E-mail inválido';
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
			<div className="flex flex-col gap-6 w-[300px] md:w-[400px] text-center">
				<div className="flex flex-col gap-4">
					<div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
						<svg
							className="w-10 h-10 text-green-600"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M5 13l4 4L19 7"
							/>
						</svg>
					</div>
					<h2 className="text-xl font-bold text-[#527BC6]">E-mail Enviado!</h2>
					<p className="text-sm text-foreground">
						Enviamos um link para redefinir sua senha para:{' '}
						<span className="text-sm font-semibold text-[#527BC6]">
							{formData.email}
						</span>
					</p>
					<p className="text-xs text-foreground">
						Cheque sua caixa de entrada e também a pasta de spam. O link para
						redefinir sua senha é válido por 1 hora. Caso não receba o e-mail,
						confirme se o endereço está correto e tente reenviar.
					</p>
				</div>

				<div className="flex flex-col gap-3">
					<SubmitButton
						type="button"
						variant="secondary"
						isLoading={isLoading}
						onClick={handleResendEmail}
					>
						{isLoading ? 'Reenviando...' : 'Reenviar E-mail'}
					</SubmitButton>

					<Link
						href="/cliente/login"
						className="w-full h-12 flex items-center justify-center text-sm font-bold bg-[#527BC6] text-white rounded-3xl hover:bg-[#3b5aa1] hover:cursor-pointer transition-all duration-200"
					>
						Voltar ao Login
					</Link>
				</div>
			</div>
		);
	}

	return (
		<form
			onSubmit={handleSubmit}
			className="flex flex-col gap-6 w-[300px] md:w-full md:max-w-[420px] md:p-1"
		>
			<div className="flex flex-col gap-4 text-center">
				<h2 className="text-xl font-bold text-[#527BC6]">
					Esqueceu sua senha?
				</h2>
				<p className="text-sm text-foreground">
					Não se preocupe! Digite seu e-mail abaixo e enviaremos um link para
					você redefinir sua senha.
				</p>
			</div>

			<FormField
				label="E-mail"
				icon="/icons/account.svg"
				iconAlt="Ícone de usuário"
				type="email"
				placeholder="Digite seu e-mail cadastrado"
				value={formData.email}
				error={errors.email}
				onChange={(value) => handleInputChange('email', value)}
			/>

			<SubmitButton isLoading={isLoading}>
				{isLoading ? 'Enviando...' : 'Enviar Link de Redefinição'}
			</SubmitButton>
		</form>
	);
}

export default function ForgotPasswordPage() {
	const navigationLinks = (
		<div className="flex flex-col gap-2 text-center">
			<p className="text-sm text-[#527BC6]">
				Lembrou sua senha?{' '}
				<Link href="/cliente/entrar" className="underline hover:opacity-70">
					Voltar ao login
				</Link>
			</p>
			<p className="text-sm text-[#527BC6]">
				Ainda não tem uma conta?{' '}
				<Link href="/cliente/cadastro" className="underline hover:opacity-70">
					Cadastre-se aqui
				</Link>
			</p>
		</div>
	);

	return (
		<AuthLayout title="Área do Cliente" navigationLinks={navigationLinks}>
			<ForgotPasswordForm />
		</AuthLayout>
	);
}
