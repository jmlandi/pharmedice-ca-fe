'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import AuthLayout from '@/components/AuthLayout';
import SubmitButton from '@/components/SubmitButton';
import { useAlert } from '@/components/AlertProvider';
import { useLoading } from '@/components/LoadingProvider';
import { verificarEmail, reenviarVerificacaoEmail } from '@/lib/api';

type VerificationStatus =
	| 'loading'
	| 'success'
	| 'error'
	| 'invalid-link'
	| 'already-verified';

function EmailVerificationContent() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const { showError, showSuccess } = useAlert();
	const { startLoading, stopLoading } = useLoading();

	const [status, setStatus] = useState<VerificationStatus>('loading');
	const [message, setMessage] = useState('');
	const [email, setEmail] = useState('');
	const [isResending, setIsResending] = useState(false);
	const [hasVerified, setHasVerified] = useState(false);

	// Captura os parâmetros da URL uma única vez
	const id = searchParams.get('id');
	const hash = searchParams.get('hash');
	const expires = searchParams.get('expires');
	const signature = searchParams.get('signature');

	useEffect(() => {
		const verificarEmailAutomaticamente = async () => {
			// Evita múltiplas execuções
			if (hasVerified) {
				console.log('Verificação já foi executada, pulando...');
				return;
			}

			console.log('Iniciando verificação de email com parâmetros:', {
				id,
				hash,
				expires,
				signature,
			});

			// Verifica se todos os parâmetros estão presentes
			if (!id || !hash || !expires || !signature) {
				console.log('Parâmetros faltando:', {
					id: !!id,
					hash: !!hash,
					expires: !!expires,
					signature: !!signature,
				});
				setStatus('invalid-link');
				setMessage(
					'Link de verificação inválido. Parâmetros obrigatórios não encontrados.'
				);
				setHasVerified(true);
				return;
			}

			// Verificar se o link expirou (adicional check no frontend)
			const currentTime = Math.floor(Date.now() / 1000);
			const expiresTime = parseInt(expires);
			console.log('Verificação de tempo:', {
				currentTime,
				expiresTime,
				expired: currentTime > expiresTime,
			});

			if (currentTime > expiresTime) {
				console.log('Link expirado no frontend');
				setStatus('invalid-link');
				setMessage('Este link de verificação expirou. Solicite um novo link.');
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
					setStatus('success');
					setMessage(response.mensagem);
					setEmail(response.dados?.usuario?.email || '');
					showSuccess(response.mensagem);

					// Redireciona para o painel do cliente após 3 segundos
					setTimeout(() => {
						router.push('/cliente/painel');
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
								d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
							/>
						</svg>
					</div>
					<h2 className="text-xl font-bold text-[#4E7FC6]">
						Verificando E-mail...
					</h2>
					<p className="text-sm text-foreground">
						Aguarde enquanto verificamos seu e-mail automaticamente.
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
								d="M5 13l4 4L19 7"
							/>
						</svg>
					</div>
					<h2 className="text-xl font-bold text-green-600">
						E-mail Verificado!
					</h2>
					<p className="text-sm text-foreground">{message}</p>
					{email && (
						<p className="text-xs text-[#4E7FC6] font-semibold">✅ {email}</p>
					)}
					<p className="text-xs text-gray-500">
						Redirecionando para seu painel em alguns segundos...
					</p>
				</div>

				<Link
					href="/cliente/painel"
					className="w-full h-12 flex items-center justify-center text-sm font-bold bg-[#4E7FC6] text-white rounded-3xl hover:bg-[#26364D] transition-all duration-200"
				>
					Ir para Meu Painel
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
								d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
					</div>
					<h2 className="text-xl font-bold text-green-600">
						E-mail Já Verificado
					</h2>
					<p className="text-sm text-foreground">{message}</p>
					<p className="text-xs text-gray-500">
						Seu e-mail já foi confirmado anteriormente. Você pode fazer login
						normalmente.
					</p>
				</div>

				<Link
					href="/cliente/entrar"
					className="w-full h-12 flex items-center justify-center text-sm font-bold bg-[#4E7FC6] text-white rounded-3xl hover:bg-[#26364D] transition-all duration-200"
				>
					Fazer Login
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
				<h2 className="text-xl font-bold text-red-600">Erro na Verificação</h2>
				<p className="text-sm text-foreground">{message}</p>

				{status === 'invalid-link' && (
					<div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
						<p className="text-xs text-yellow-700">
							⏰ Links de verificação expiram em 60 minutos por segurança.
							Solicite um novo link se necessário.
						</p>
					</div>
				)}
			</div>

			<div className="flex flex-col gap-3">
				{email && status === 'invalid-link' && (
					<SubmitButton
						isLoading={isResending}
						variant="secondary"
						onClick={handleResendEmail}
					>
						{isResending ? 'Reenviando...' : 'Reenviar E-mail de Verificação'}
					</SubmitButton>
				)}

				<Link
					href="/cliente/entrar"
					className="w-full h-12 flex items-center justify-center text-sm font-bold bg-[#4E7FC6] text-white rounded-3xl hover:bg-[#26364D] transition-all duration-200"
				>
					Voltar ao Login
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

export default function ClienteVerificarEmailPage() {
	const navigationLinks = (
		<div className="flex flex-col gap-2 text-center">
			<p className="text-sm text-[#4E7FC6]">
				Problemas com verificação?{' '}
				<Link href="/cliente/entrar" className="underline hover:opacity-70">
					Ir para login
				</Link>
			</p>
			<p className="text-sm text-[#4E7FC6]">
				Não recebeu o e-mail?{' '}
				<Link
					href="/cliente/reenviar-verificacao"
					className="underline hover:opacity-70"
				>
					Reenviar verificação
				</Link>
			</p>
		</div>
	);

	return (
		<AuthLayout title="Área do Cliente" navigationLinks={navigationLinks}>
			<Suspense fallback={<LoadingScreen />}>
				<EmailVerificationContent />
			</Suspense>
		</AuthLayout>
	);
}
