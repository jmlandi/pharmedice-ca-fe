'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import AuthLayout from '@/components/AuthLayout';
import FormField from '@/components/FormField';
import SubmitButton from '@/components/SubmitButton';
import { useAlert } from '@/components/AlertProvider';
import { useLoading } from '@/components/LoadingProvider';
import { validatePasswordStrength } from '@/lib/utils';
import { redefinirSenha } from '@/lib/api';

interface ResetPasswordFormData {
	senha: string;
	confirmacao_senha: string;
}

function ResetPasswordForm() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const { showError, showSuccess } = useAlert();
	const { startLoading, stopLoading } = useLoading();

	const [formData, setFormData] = useState<ResetPasswordFormData>({
		senha: '',
		confirmacao_senha: '',
	});
	const [isLoading, setIsLoading] = useState(false);
	const [errors, setErrors] = useState<Partial<ResetPasswordFormData>>({});
	const [token, setToken] = useState<string>('');
	const [email, setEmail] = useState<string>('');
	const [isSuccess, setIsSuccess] = useState(false);

	useEffect(() => {
		// Captura os parâmetros da URL
		const tokenParam = searchParams.get('token');
		const emailParam = searchParams.get('email');

		if (!tokenParam || !emailParam) {
			showError(
				'Link inválido. Solicite um novo link de recuperação de senha.'
			);
			router.push('/cliente/esqueci-senha');
			return;
		}

		setToken(tokenParam);
		setEmail(emailParam);
	}, [searchParams, router, showError]);

	const handleInputChange = (
		field: keyof ResetPasswordFormData,
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
		const newErrors: Partial<ResetPasswordFormData> = {};

		// Validação da senha
		if (!formData.senha.trim()) {
			newErrors.senha = 'Campo obrigatório';
		} else {
			const passwordValidation = validatePasswordStrength(formData.senha);
			if (!passwordValidation.isValid) {
				newErrors.senha = passwordValidation.errors.join(', ');
			}
		}

		// Validação da confirmação de senha
		if (!formData.confirmacao_senha.trim()) {
			newErrors.confirmacao_senha = 'Campo obrigatório';
		} else if (formData.senha !== formData.confirmacao_senha) {
			newErrors.confirmacao_senha = 'Senhas não coincidem';
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
			const response = await redefinirSenha({
				email,
				token,
				senha: formData.senha,
				confirmacao_senha: formData.confirmacao_senha,
			});

			if (response.sucesso) {
				setIsSuccess(true);
				showSuccess(response.mensagem);
			} else {
				showError(
					response.mensagem || 'Erro ao redefinir senha. Tente novamente.'
				);
			}
		} catch (error: any) {
			console.error('Erro ao redefinir senha:', error);

			if (error.response?.status === 422) {
				// Erros de validação
				const validationErrors = error.response.data.erros;
				if (validationErrors) {
					const newErrors: Partial<ResetPasswordFormData> = {};
					if (validationErrors.senha) {
						newErrors.senha = validationErrors.senha.join(', ');
					}
					if (validationErrors.confirmacao_senha) {
						newErrors.confirmacao_senha =
							validationErrors.confirmacao_senha.join(', ');
					}
					if (validationErrors.token) {
						showError(
							'Token inválido ou expirado. Solicite um novo link de recuperação.'
						);
					}
					setErrors(newErrors);
				}
			} else if (error.response?.status === 404) {
				showError(
					'Usuário não encontrado. Verifique o e-mail e tente novamente.'
				);
			} else {
				const errorMessage =
					error.response?.data?.mensagem ||
					'Erro ao redefinir senha. Tente novamente.';
				showError(errorMessage);
			}
		} finally {
			setIsLoading(false);
			stopLoading();
		}
	};

	// Página de sucesso
	if (isSuccess) {
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
					<h2 className="text-xl font-bold text-[#4E7FC6]">
						Senha Redefinida!
					</h2>
					<p className="text-sm text-foreground">
						Sua senha foi redefinida com sucesso! Agora você pode fazer login
						com sua nova senha.
					</p>
				</div>

				<Link
					href="/cliente/entrar"
					className="w-full h-12 flex items-center justify-center text-sm font-bold bg-[#4E7FC6] text-white rounded-3xl hover:bg-[#26364D] hover:cursor-pointer transition-all duration-200"
				>
					Fazer Login
				</Link>
			</div>
		);
	}

	// Formulário de redefinição
	return (
		<form
			onSubmit={handleSubmit}
			className="flex flex-col gap-4 w-[300px] md:w-full md:max-w-[420px] md:p-1"
		>
			<div className="flex flex-col gap-4 text-center mb-2">
				<h2 className="text-xl font-bold text-[#4E7FC6]">Redefinir Senha</h2>
				<p className="text-sm text-foreground">
					Digite sua nova senha abaixo. Certifique-se de que seja segura e
					cumpra todos os requisitos.
				</p>
				{email && (
					<p className="text-xs text-[#4E7FC6] font-semibold">
						E-mail: {email}
					</p>
				)}
			</div>

			<FormField
				label="Nova Senha"
				icon="/icons/lock.svg"
				iconAlt="Ícone de cadeado"
				type="password"
				placeholder="Digite sua nova senha"
				value={formData.senha}
				error={errors.senha}
				onChange={(value) => handleInputChange('senha', value)}
			/>

			<FormField
				label="Confirmar Nova Senha"
				icon="/icons/lock.svg"
				iconAlt="Ícone de cadeado"
				type="password"
				placeholder="Confirme sua nova senha"
				value={formData.confirmacao_senha}
				error={errors.confirmacao_senha}
				onChange={(value) => handleInputChange('confirmacao_senha', value)}
			/>

			{/* Requisitos de Senha */}
			<div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
				<h4 className="text-sm font-bold text-blue-600 mb-2">
					🔒 Requisitos de Segurança:
				</h4>
				<ul className="text-xs text-blue-700 space-y-1">
					<li>• Mínimo de 8 caracteres</li>
					<li>• Máximo de 50 caracteres</li>
					<li>• Pelo menos 1 letra maiúscula (A-Z)</li>
					<li>• Pelo menos 1 letra minúscula (a-z)</li>
					<li>• Pelo menos 1 número (0-9)</li>
					<li>• Pelo menos 1 caractere especial (@$!%*?&)</li>
				</ul>
			</div>

			<SubmitButton isLoading={isLoading}>
				{isLoading ? 'Redefinindo...' : 'Redefinir Senha'}
			</SubmitButton>
		</form>
	);
}

// Loading component for Suspense fallback
function LoadingScreen() {
	return (
		<div className="flex flex-col gap-6 w-[300px] md:w-[400px] text-center">
			<div className="flex flex-col gap-4">
				<div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
					<div className="w-10 h-10 bg-gray-300 rounded"></div>
				</div>
				<div className="h-6 bg-gray-200 rounded animate-pulse"></div>
				<div className="h-4 bg-gray-200 rounded animate-pulse"></div>
			</div>
		</div>
	);
}

export default function ResetPasswordPage() {
	const navigationLinks = (
		<div className="flex flex-col gap-2 text-center">
			<p className="text-sm text-[#4E7FC6]">
				Lembrou sua senha?{' '}
				<Link href="/cliente/entrar" className="underline hover:opacity-70">
					Voltar ao login
				</Link>
			</p>
			<p className="text-sm text-[#4E7FC6]">
				Problemas de acesso?{' '}
				<Link
					href="/cliente/esqueci-senha"
					className="underline hover:opacity-70"
				>
					Solicitar novo link
				</Link>
			</p>
		</div>
	);

	return (
		<AuthLayout title="Área do Cliente" navigationLinks={navigationLinks}>
			<Suspense fallback={<LoadingScreen />}>
				<ResetPasswordForm />
			</Suspense>
		</AuthLayout>
	);
}
