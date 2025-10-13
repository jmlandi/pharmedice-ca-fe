'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import AuthLayout from '@/components/AuthLayout';
import SubmitButton from '@/components/SubmitButton';
import { useAlert } from '@/components/AlertProvider';
import { useLoading } from '@/components/LoadingProvider';
import { verificarEmail, reenviarVerificacaoEmail } from '@/lib/api';
import { isValidEmail } from '@/lib/utils';

type VerificationStatus =
	| 'loading'
	| 'success'
	| 'error'
	| 'invalid-link'
	| 'already-verified';

function AdminEmailVerificationContent() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const { showError, showSuccess } = useAlert();
	const { startLoading, stopLoading } = useLoading();

	const [status, setStatus] = useState<VerificationStatus>('loading');
	const [message, setMessage] = useState('');
	const [email, setEmail] = useState('');
	const [isResending, setIsResending] = useState(false);
	const [hasVerified, setHasVerified] = useState(false);

	const isValidAdminEmail = (email: string): boolean => {
		if (!isValidEmail(email)) return false;
		const domain = email.split('@')[1];
		return domain === 'pharmedice.com.br' || domain === 'marcoslandi.com';
	};

	// Captura os parâmetros da URL uma única vez
	const id = searchParams.get('id');
	const hash = searchParams.get('hash');
	const expires = searchParams.get('expires');
	const signature = searchParams.get('signature');

	useEffect(() => {
		const verificarEmailAutomaticamente = async () => {
			// Evita múltiplas execuções
			if (hasVerified) {
				console.log('Verificação administrativa já foi executada, pulando...');
				return;
			}

			console.log('Iniciando verificação administrativa com parâmetros:', {
				id,
				hash,
				expires,
				signature,
			});

			// Verifica se todos os parâmetros estão presentes
			if (!id || !hash || !expires || !signature) {
				setStatus('invalid-link');
				setMessage(
					'Link de verificação inválido. Parâmetros obrigatórios não encontrados.'
				);
				setHasVerified(true);
				return;
			}

			// Marca como verificado para evitar múltiplas chamadas
			setHasVerified(true);
			startLoading();

			try {
				const response = await verificarEmail({
					id,
					hash,
					expires,
					signature,
				});

				if (response.sucesso) {
					const userEmail = response.dados?.usuario?.email || '';

					// Verifica se é um e-mail de administrador válido
					if (userEmail && !isValidAdminEmail(userEmail)) {
						setStatus('error');
						setMessage(
							'Este link é válido apenas para administradores (@pharmedice.com.br ou @marcoslandi.com).'
						);
						showError('Acesso restrito a administradores.');
						return;
					}

					setStatus('success');
					setMessage(response.mensagem);
					setEmail(userEmail);
					showSuccess(response.mensagem);

					// Redireciona para o painel administrativo após 3 segundos
					setTimeout(() => {
						router.push('/admin/painel');
					}, 3000);
				} else {
					setStatus('error');
					setMessage(response.mensagem);
				}
			} catch (error: any) {
				console.error('Erro ao verificar email:', error);
				console.error('Response completa:', error.response);
				console.error('Status:', error.response?.status);
				console.error('Data:', error.response?.data);

				if (error.response?.status === 422) {
					const errorData = error.response.data;
					console.log('Erro 422 recebido:', errorData);

					if (errorData.codigo === 'LINK_INVALIDO') {
						setStatus('invalid-link');
						setMessage('Este link de verificação é inválido ou expirou.');
					} else if (errorData.codigo === 'JA_VERIFICADO') {
						setStatus('already-verified');
						setMessage('Este email já foi verificado anteriormente.');
					} else {
						setStatus('error');
						setMessage(errorData.mensagem || 'Erro ao verificar email.');
					}
				} else {
					console.log('Erro não-422:', error.response?.status, error.message);
					setStatus('error');
					setMessage('Erro ao verificar email. Tente novamente.');
				}
			} finally {
				stopLoading();
			}
		};

		verificarEmailAutomaticamente();
	}, []); // Removendo dependências para evitar re-execuções

	const handleResendEmail = async () => {
		if (!email) {
			showError('E-mail não identificado. Acesse a página de reenvio.');
			return;
		}

		if (!isValidAdminEmail(email)) {
			showError('Este e-mail não é válido para administradores.');
			return;
		}

		setIsResending(true);
		startLoading();

		try {
			const response = await reenviarVerificacaoEmail({ email });

			if (response.sucesso) {
				showSuccess('E-mail de verificação reenviado com sucesso!');
			} else {
				showError(response.mensagem || 'Erro ao reenviar e-mail.');
			}
		} catch (error: any) {
			console.error('Erro ao reenviar e-mail:', error);
			const errorMessage =
				error.response?.data?.mensagem ||
				'Erro ao reenviar e-mail. Tente novamente.';
			showError(errorMessage);
		} finally {
			setIsResending(false);
			stopLoading();
		}
	};

	// Estado de carregamento
	if (status === 'loading') {
		return (
			<div className="flex flex-col gap-6 w-[300px] md:w-[400px] text-center">
				<div className="flex flex-col gap-4">
					<div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
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
								d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
							/>
						</svg>
					</div>
					<h2 className="text-xl font-bold text-[#527BC6]">
						Verificando E-mail Administrativo...
					</h2>
					<p className="text-sm text-foreground">
						Aguarde enquanto verificamos suas credenciais de administrador.
					</p>
				</div>
			</div>
		);
	}

	// Estado de sucesso
	if (status === 'success') {
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
								d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
							/>
						</svg>
					</div>
					<h2 className="text-xl font-bold text-green-600">
						Verificação Administrativa Concluída!
					</h2>
					<p className="text-sm text-foreground">{message}</p>
					{email && (
						<p className="text-xs text-[#527BC6] font-semibold">
							🛡️ Admin: {email}
						</p>
					)}
					<p className="text-xs text-gray-500">
						Redirecionando para o painel administrativo...
					</p>
				</div>

				<Link
					href="/admin/painel"
					className="w-full h-12 flex items-center justify-center text-sm font-bold bg-[#527BC6] text-white rounded-3xl hover:bg-[#3b5aa1] transition-all duration-200"
				>
					Acessar Painel Administrativo
				</Link>
			</div>
		);
	}

	// Estado de e-mail já verificado
	if (status === 'already-verified') {
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
								d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
							/>
						</svg>
					</div>
					<h2 className="text-xl font-bold text-green-600">
						E-mail Administrativo Já Verificado
					</h2>
					<p className="text-sm text-foreground">{message}</p>
					<p className="text-xs text-gray-500">
						Suas credenciais administrativas já foram confirmadas. Você pode
						fazer login normalmente.
					</p>
				</div>

				<Link
					href="/admin/entrar"
					className="w-full h-12 flex items-center justify-center text-sm font-bold bg-[#527BC6] text-white rounded-3xl hover:bg-[#3b5aa1] transition-all duration-200"
				>
					Login Administrativo
				</Link>
			</div>
		);
	}

	// Estado de erro (link inválido ou expirado)
	return (
		<div className="flex flex-col gap-6 w-[300px] md:w-[400px] text-center">
			<div className="flex flex-col gap-4">
				<div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
					<svg
						className="w-10 h-10 text-red-600"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
						/>
					</svg>
				</div>
				<h2 className="text-xl font-bold text-red-600">
					Erro na Verificação Administrativa
				</h2>
				<p className="text-sm text-foreground">{message}</p>

				{status === 'invalid-link' && (
					<div className="bg-red-50 border border-red-200 p-4 rounded-lg">
						<p className="text-xs text-red-700">
							⚠️ Links de verificação administrativos expiram em 60 minutos por
							segurança máxima. Para administradores, recomendamos solicitar um
							novo link imediatamente.
						</p>
					</div>
				)}
			</div>

			<div className="flex flex-col gap-3">
				{email && status === 'invalid-link' && isValidAdminEmail(email) && (
					<SubmitButton
						isLoading={isResending}
						variant="secondary"
						onClick={handleResendEmail}
					>
						{isResending
							? 'Reenviando...'
							: 'Reenviar Verificação Administrativa'}
					</SubmitButton>
				)}

				<Link
					href="/admin/entrar"
					className="w-full h-12 flex items-center justify-center text-sm font-bold bg-[#527BC6] text-white rounded-3xl hover:bg-[#3b5aa1] transition-all duration-200"
				>
					Login Administrativo
				</Link>
			</div>
		</div>
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

export default function AdminEmailVerificationPage() {
	const navigationLinks = (
		<div className="flex flex-col gap-2 text-center">
			<p className="text-sm text-[#527BC6]">
				Problemas com verificação?{' '}
				<Link href="/admin/entrar" className="underline hover:opacity-70">
					Login administrativo
				</Link>
			</p>
			<p className="text-sm text-[#527BC6]">
				Não recebeu o e-mail?{' '}
				<Link
					href="/admin/esqueci-senha"
					className="underline hover:opacity-70"
				>
					Solicitar suporte
				</Link>
			</p>
		</div>
	);

	return (
		<AuthLayout title="Administração" navigationLinks={navigationLinks}>
			<Suspense fallback={<LoadingScreen />}>
				<AdminEmailVerificationContent />
			</Suspense>
		</AuthLayout>
	);
}
