'use client';

import { useState } from 'react';
import Link from 'next/link';
import AuthLayout from '@/components/AuthLayout';
import FormField from '@/components/FormField';
import SubmitButton from '@/components/SubmitButton';
import { useAlert } from '@/components/AlertProvider';
import { useLoading } from '@/components/LoadingProvider';
import { isValidEmail } from '@/lib/utils';
import { reenviarVerificacaoEmail } from '@/lib/api';

interface ResendVerificationFormData {
	email: string;
}

function ResendVerificationForm() {
	const { showError, showSuccess } = useAlert();
	const { startLoading, stopLoading } = useLoading();
	const [formData, setFormData] = useState<ResendVerificationFormData>({
		email: '',
	});
	const [isLoading, setIsLoading] = useState(false);
	const [errors, setErrors] = useState<Partial<ResendVerificationFormData>>({});
	const [isEmailSent, setIsEmailSent] = useState(false);

	const handleInputChange = (
		field: keyof ResendVerificationFormData,
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
		const newErrors: Partial<ResendVerificationFormData> = {};

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
			const response = await reenviarVerificacaoEmail({
				email: formData.email,
			});

			if (response.sucesso) {
				setIsEmailSent(true);
				showSuccess(response.mensagem);
			} else {
				showError(
					response.mensagem || 'Erro ao reenviar e-mail. Tente novamente.'
				);
			}
		} catch (error: any) {
			console.error('Erro ao reenviar e-mail de verificação:', error);
			const errorMessage =
				error.response?.data?.mensagem ||
				'Erro ao reenviar e-mail. Tente novamente.';
			showError(errorMessage);
		} finally {
			setIsLoading(false);
			stopLoading();
		}
	};

	const handleResendAgain = async () => {
		setIsLoading(true);
		startLoading();
		try {
			const response = await reenviarVerificacaoEmail({
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
					<div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
						<svg
							className="w-10 h-10 text-blue-600"
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
					<h2 className="text-xl font-bold text-[#4E7FC6]">
						E-mail de Verificação Enviado!
					</h2>
					<p className="text-sm text-foreground">
						Enviamos um novo link de verificação para:{' '}
						<span className="text-sm font-semibold text-[#4E7FC6]">
							{formData.email}
						</span>
					</p>
					<p className="text-xs text-foreground">
						Cheque sua caixa de entrada e também a pasta de spam. O link de
						verificação é válido por 1 hora. Clique no link para confirmar seu
						e-mail e acessar sua conta.
					</p>
				</div>

				<div className="flex flex-col gap-3">
					<SubmitButton
						type="button"
						variant="secondary"
						isLoading={isLoading}
						onClick={handleResendAgain}
					>
						{isLoading ? 'Reenviando...' : 'Reenviar Novamente'}
					</SubmitButton>

					<Link
						href="/cliente/entrar"
						className="w-full h-12 flex items-center justify-center text-sm font-bold bg-[#4E7FC6] text-white rounded-3xl hover:bg-[#26364D] hover:cursor-pointer transition-all duration-200"
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
			className="flex flex-col gap-4 w-[300px] md:w-full md:max-w-[420px] md:p-1"
		>
			<div className="flex flex-col gap-4 text-center mb-2">
				<h2 className="text-xl font-bold text-[#4E7FC6]">
					Reenviar Verificação de E-mail
				</h2>
				<p className="text-sm text-foreground">
					Não recebeu o e-mail de verificação? Digite seu e-mail abaixo e
					enviaremos um novo link.
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

			{/* Informações importantes */}
			<div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
				<h4 className="text-sm font-bold text-blue-600 mb-2">
					📧 Sobre a Verificação:
				</h4>
				<ul className="text-xs text-blue-700 space-y-1">
					<li>• O link de verificação expira em 60 minutos</li>
					<li>• Verifique também a pasta de spam</li>
					<li>• Você receberá o e-mail em alguns minutos</li>
					<li>• Após verificar, poderá acessar sua conta normalmente</li>
				</ul>
			</div>

			<SubmitButton isLoading={isLoading}>
				{isLoading ? 'Enviando...' : 'Reenviar E-mail de Verificação'}
			</SubmitButton>
		</form>
	);
}

export default function ClienteReenviarVerificacaoPage() {
	const navigationLinks = (
		<div className="flex flex-col gap-2 text-center">
			<p className="text-sm text-[#4E7FC6]">
				Já verificou seu e-mail?{' '}
				<Link href="/cliente/entrar" className="underline hover:opacity-70">
					Fazer login
				</Link>
			</p>
			<p className="text-sm text-[#4E7FC6]">
				Ainda não tem uma conta?{' '}
				<Link href="/cliente/cadastro" className="underline hover:opacity-70">
					Cadastre-se aqui
				</Link>
			</p>
		</div>
	);

	return (
		<AuthLayout title="Área do Cliente" navigationLinks={navigationLinks}>
			<ResendVerificationForm />
		</AuthLayout>
	);
}
