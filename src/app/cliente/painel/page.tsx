'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import PageTransition from '@/components/PageTransition';
import ProtectedRoute from '@/components/ProtectedRoute';
import PainelHeader from '@/components/painel/PainelHeader';
import PainelNavigation, { NavigationTab } from '@/components/painel/PainelNavigation';
import { useAuth } from '@/components/AuthProvider';
import { useAlert } from '@/components/AlertProvider';
import { AuthService } from '@/lib/auth';
import { LaudosService } from '@/lib/laudos';
import { Laudo } from '@/lib/api';
import ClienteLaudosList from '@/components/painel/cliente/ClienteLaudosList';
import AccountInfo from '@/components/painel/admin/AccountInfo';

const NAVIGATION_TABS: NavigationTab[] = [
	{ id: 'laudos', label: 'Laudos' },
	{ id: 'conta', label: 'Minha Conta' },
];

function ClientePainelContent() {
	const router = useRouter();
	const { user, isLoggedIn, isAdmin, logout } = useAuth();
	const { showError, showSuccess } = useAlert();
	const [laudos, setLaudos] = useState<Laudo[]>([]);
	const [loading, setLoading] = useState(true);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [activeTab, setActiveTab] = useState('laudos');

	useEffect(() => {
		if (isAdmin) {
			router.push('/admin/painel');
			return;
		}
	}, [isAdmin, router]);

	const loadLaudos = async () => {
		try {
			setLoading(true);
			const response = await LaudosService.list(currentPage);
			setLaudos(response.data);
			setTotalPages(response.last_page);
		} catch (error) {
			console.error('Erro ao carregar laudos:', error);
			showError('Erro ao carregar laudos. Tente novamente.');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (!isAdmin && activeTab === 'laudos') {
			loadLaudos();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isAdmin, currentPage, activeTab]);

	const handleLogout = async () => {
		try {
			await logout();
			showSuccess('Logout realizado com sucesso!');
			router.push('/');
		} catch (error) {
			console.error('Erro no logout:', error);
		}
	};

	const handlePageChange = (page: number) => {
		setCurrentPage(page);
	};

	if (!isLoggedIn || isAdmin) {
		return null;
	}

	return (
<PageTransition>
			<div className="min-h-screen bg-[#252220]">
				<PainelHeader
					title="Área do Cliente"
					userName={user?.primeiro_nome || ''}
					isAdmin={false}
					onLogout={handleLogout}
				/>

				<PainelNavigation
					tabs={NAVIGATION_TABS}
					activeTab={activeTab}
					onTabChange={setActiveTab}
				/>

				<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
					{activeTab === 'laudos' && (
						<ClienteLaudosList
							laudos={laudos}
							loading={loading}
							currentPage={currentPage}
							totalPages={totalPages}
							onPageChange={handlePageChange}
							onRefresh={loadLaudos}
						/>
					)}

					{activeTab === 'conta' && (
						<div className="max-w-2xl mx-auto">
							<AccountInfo />
						</div>
					)}
				</main>
			</div>
		</PageTransition>
	);
}

function GoogleCallbackHandler({ children }: { children: React.ReactNode }) {
	const searchParams = useSearchParams();
	const router = useRouter();
	const { showError, showSuccess } = useAlert();
	const [processing, setProcessing] = useState(false);

	useEffect(() => {
		const token = searchParams.get('token');
		const usuario = searchParams.get('usuario') || searchParams.get('user');
		const error = searchParams.get('error');

		if (error) {
			showError(decodeURIComponent(error));
			router.replace('/cliente/entrar');
			return;
		}

		if (token && usuario && !processing) {
			setProcessing(true);
			try {
				AuthService.handleGoogleCallback(token, usuario);
				showSuccess('Login com Google realizado com sucesso!');
				window.history.replaceState({}, '', window.location.pathname);
				setTimeout(() => window.location.reload(), 100);
			} catch (err) {
				console.error('Erro ao processar autenticação Google:', err);
				showError('Erro ao processar autenticação');
				router.replace('/cliente/entrar');
			}
		}
	}, [searchParams, router, showError, showSuccess, processing]);

	if (processing) {
		return (
<div className="flex items-center justify-center min-h-screen">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
					<p>Processando login...</p>
				</div>
			</div>
		);
	}

	return <>{children}</>;
}

export default function ClientePainel() {
	return (
<Suspense fallback={<div className="flex items-center justify-center min-h-screen">Carregando...</div>}>
			<GoogleCallbackHandler>
				<ProtectedRoute requireEmailVerification={true}>
					<ClientePainelContent />
				</ProtectedRoute>
			</GoogleCallbackHandler>
		</Suspense>
	);
}
