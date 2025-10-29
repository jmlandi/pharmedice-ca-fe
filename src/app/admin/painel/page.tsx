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
import type { User } from '@/lib/api';
import UploadForm from '@/components/painel/admin/UploadForm';
import LaudosList from '@/components/painel/admin/LaudosList';
import AccountInfo from '@/components/painel/admin/AccountInfo';
import UsersList from '@/components/painel/admin/UsersList';
import UserViewModal from '@/components/painel/admin/UserViewModal';
import UserEditModal from '@/components/painel/admin/UserEditModal';

const NAVIGATION_TABS: NavigationTab[] = [
	{ id: 'laudos', label: 'Laudos' },
	{ id: 'usuarios', label: 'Usuários' },
	{ id: 'conta', label: 'Minha Conta' },
];

function AdminPainelContent() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const { user, isLoggedIn, isAdmin, logout } = useAuth();
	const { showError, showSuccess } = useAlert();
	const [laudos, setLaudos] = useState<Laudo[]>([]);
	const [loading, setLoading] = useState(true);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [activeTab, setActiveTab] = useState('laudos');
	const [viewingUser, setViewingUser] = useState<User | null>(null);
	const [editingUser, setEditingUser] = useState<User | null>(null);

	useEffect(() => {
		const token = searchParams.get('token');
		const usuario = searchParams.get('usuario') || searchParams.get('user');
		const error = searchParams.get('error');

		if (error) {
			showError(decodeURIComponent(error));
			router.replace('/admin/entrar');
			return;
		}

		if (token && usuario) {
			try {
				AuthService.handleGoogleCallback(token, usuario);
				showSuccess('Login com Google realizado com sucesso!');
				window.history.replaceState({}, '', window.location.pathname);
				window.location.reload();
			} catch (err) {
				console.error('Erro ao processar callback:', err);
				showError('Erro ao processar autenticação do Google');
				router.replace('/admin/entrar');
			}
		}
	}, [searchParams, router, showError, showSuccess]);

	useEffect(() => {
		if (!isAdmin) {
			router.push('/cliente/painel');
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
		if (isAdmin && activeTab === 'laudos') {
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

	if (!isLoggedIn || !isAdmin) {
		return null;
	}

	return (
<PageTransition>
			<div className="min-h-screen bg-[#252220]">
				<PainelHeader
					title="Painel Administrativo"
					userName={user?.primeiro_nome || ''}
					isAdmin={true}
					onLogout={handleLogout}
				/>

				<PainelNavigation
					tabs={NAVIGATION_TABS}
					activeTab={activeTab}
					onTabChange={setActiveTab}
				/>

				<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
					{activeTab === 'laudos' && (
						<div className="grid lg:grid-cols-3 gap-8">
							<div className="lg:col-span-1">
								<UploadForm onUploadSuccess={loadLaudos} />
							</div>

							<div className="lg:col-span-2">
								<LaudosList
									laudos={laudos}
									loading={loading}
									currentPage={currentPage}
									totalPages={totalPages}
									onPageChange={handlePageChange}
									onRefresh={loadLaudos}
								/>
							</div>
						</div>
					)}

					{activeTab === 'usuarios' && (
						<div>
							<UsersList
								onViewUser={(user) => setViewingUser(user)}
								onEditUser={(user) => setEditingUser(user)}
							/>
						</div>
					)}

					{activeTab === 'conta' && (
						<div className="max-w-2xl mx-auto">
							<AccountInfo />
						</div>
					)}
				</main>

				{viewingUser && (
					<UserViewModal
						user={viewingUser}
						onClose={() => setViewingUser(null)}
						onEdit={() => {
							setEditingUser(viewingUser);
							setViewingUser(null);
						}}
					/>
				)}

				{editingUser && (
					<UserEditModal
						user={editingUser}
						onClose={() => setEditingUser(null)}
						onSuccess={() => {
							setEditingUser(null);
							// Força recarregamento da lista se estiver na aba de usuários
							if (activeTab === 'usuarios') {
								window.location.reload();
							}
						}}
					/>
				)}
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
			router.replace('/admin/entrar');
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
				router.replace('/admin/entrar');
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

export default function AdminPainel() {
	return (
<Suspense fallback={<div className="flex items-center justify-center min-h-screen">Carregando...</div>}>
			<GoogleCallbackHandler>
				<ProtectedRoute requireEmailVerification={true}>
					<AdminPainelContent />
				</ProtectedRoute>
			</GoogleCallbackHandler>
		</Suspense>
	);
}
