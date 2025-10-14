'use client';

import { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import OptimizedImage from '@/components/OptimizedImage';
import PageTransition from '@/components/PageTransition';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/components/AuthProvider';
import { useAlert } from '@/components/AlertProvider';
import { AuthService } from '@/lib/auth';
import { LaudosService } from '@/lib/laudos';
import { Laudo } from '@/lib/api';

interface UploadFormProps {
	onUploadSuccess: () => void;
}

function UploadForm({ onUploadSuccess }: UploadFormProps) {
	const { showError, showSuccess } = useAlert();
	const [isUploading, setIsUploading] = useState(false);
	const [formData, setFormData] = useState({
		titulo: '',
		descricao: '',
		arquivo: null as File | null,
	});

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			const validation = LaudosService.validateFile(file);
			if (!validation.valid) {
				showError(validation.error || 'Arquivo inválido');
				e.target.value = '';
				return;
			}
			setFormData((prev) => ({ ...prev, arquivo: file }));
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (
			!formData.titulo.trim() ||
			!formData.descricao.trim() ||
			!formData.arquivo
		) {
			showError('Todos os campos são obrigatórios');
			return;
		}

		try {
			setIsUploading(true);
			await LaudosService.upload({
				titulo: formData.titulo,
				descricao: formData.descricao,
				arquivo: formData.arquivo,
			});

			showSuccess('Laudo enviado com sucesso!');
			setFormData({ titulo: '', descricao: '', arquivo: null });
			onUploadSuccess();

			// Reset file input
			const fileInput = document.getElementById('arquivo') as HTMLInputElement;
			if (fileInput) fileInput.value = '';
		} catch (error: any) {
			console.error('Erro no upload:', error);
			showError(error?.response?.data?.message || 'Erro ao enviar laudo');
		} finally {
			setIsUploading(false);
		}
	};

	return (
		<div className="bg-white rounded-lg shadow-md p-6">
			<h3 className="text-lg font-semibold text-gray-900 mb-6">
				Novo Laudo Técnico
			</h3>

			<form onSubmit={handleSubmit} className="space-y-4">
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">
						Título
					</label>
					<input
						type="text"
						value={formData.titulo}
						onChange={(e) =>
							setFormData((prev) => ({ ...prev, titulo: e.target.value }))
						}
						className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
						placeholder="Título do laudo"
					/>
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">
						Descrição
					</label>
					<textarea
						value={formData.descricao}
						onChange={(e) =>
							setFormData((prev) => ({ ...prev, descricao: e.target.value }))
						}
						rows={3}
						className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
						placeholder="Descrição do laudo"
					/>
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">
						Arquivo PDF
					</label>
					<input
						id="arquivo"
						type="file"
						accept="application/pdf"
						onChange={handleFileChange}
						className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
					/>
					<p className="text-xs text-gray-500 mt-1">
						Apenas arquivos PDF (máximo 10MB)
					</p>
				</div>

				<button
					type="submit"
					disabled={isUploading}
					className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
				>
					{isUploading ? 'Enviando...' : 'Enviar Laudo'}
				</button>
			</form>
		</div>
	);
}

interface AdminLaudoCardProps {
	laudo: Laudo;
	onDelete: (id: string) => void;
	onDownload: (id: string) => void;
}

function AdminLaudoCard({ laudo, onDelete, onDownload }: AdminLaudoCardProps) {
	return (
		<div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
			<div className="flex items-start justify-between mb-4">
				<div className="flex-1">
					<h3 className="text-lg font-semibold text-gray-900 mb-2">
						{laudo.titulo}
					</h3>
					<p className="text-gray-600 text-sm mb-3">{laudo.descricao}</p>
					<p className="text-xs text-gray-500">
						Criado em: {LaudosService.formatDate(laudo.created_at)}
					</p>
					{laudo.usuario && (
						<p className="text-xs text-gray-500">
							Por: {laudo.usuario.primeiro_nome} {laudo.usuario.segundo_nome}
						</p>
					)}
				</div>
				<div className="ml-4">
					<Image
						src="/icons/document.svg"
						alt="Laudo"
						width={24}
						height={24}
						className="text-blue-600"
					/>
				</div>
			</div>

			<div className="flex gap-2">
				<button
					onClick={() => onDownload(laudo.id)}
					className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
				>
					<Image
						src="/icons/download.svg"
						alt="Download"
						width={14}
						height={14}
					/>
					Download
				</button>
				<button
					onClick={() => onDelete(laudo.id)}
					className="flex items-center gap-2 px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
				>
					<Image src="/icons/delete.svg" alt="Excluir" width={14} height={14} />
					Excluir
				</button>
			</div>
		</div>
	);
}

function AdminPainelContent() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const { user, isLoggedIn, isAdmin, logout } = useAuth();
	const { showError, showSuccess } = useAlert();
	const [laudos, setLaudos] = useState<Laudo[]>([]);
	const [loading, setLoading] = useState(true);
	const [searchTerm, setSearchTerm] = useState('');
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);

	// Processar callback do Google OAuth
	useEffect(() => {
		const token = searchParams.get('token');
		const usuario = searchParams.get('usuario') || searchParams.get('user'); // Backend pode enviar 'user' ou 'usuario'
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
				// Limpar URL
				window.history.replaceState({}, '', window.location.pathname);
				// Recarregar página para atualizar contexto de autenticação
				window.location.reload();
			} catch (err) {
				console.error('Erro ao processar callback:', err);
				showError('Erro ao processar autenticação do Google');
				router.replace('/admin/entrar');
			}
		}
	}, [searchParams, router, showError, showSuccess]);

	// Verificar se não é admin e redirecionar
	useEffect(() => {
		if (!isAdmin) {
			router.push('/cliente/painel');
			return;
		}
	}, [isAdmin, router]);

	// Carregar laudos
	useEffect(() => {
		if (isAdmin) {
			loadLaudos();
		}
	}, [isAdmin, currentPage]);

	const loadLaudos = async () => {
		try {
			setLoading(true);
			const response = await LaudosService.list(currentPage);
			setLaudos(response.data);
			setTotalPages(response.last_page);
		} catch (error: any) {
			console.error('Erro ao carregar laudos:', error);
			showError('Erro ao carregar laudos. Tente novamente.');
		} finally {
			setLoading(false);
		}
	};

	const handleSearch = async () => {
		if (!searchTerm.trim()) {
			loadLaudos();
			return;
		}

		try {
			const response = await LaudosService.search(searchTerm);
			setLaudos(response.data);
			setTotalPages(response.last_page);
		} catch (error: any) {
			console.error('Erro ao buscar laudos:', error);
			showError('Erro ao buscar laudos. Tente novamente.');
		}
	};

	const handleDownload = async (laudoId: string) => {
		try {
			const blob = await LaudosService.download(laudoId);
			const url = window.URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.style.display = 'none';
			a.href = url;
			a.download = `laudo_${laudoId}.pdf`;
			document.body.appendChild(a);
			a.click();
			window.URL.revokeObjectURL(url);
			document.body.removeChild(a);
			showSuccess('Download iniciado!');
		} catch (error: any) {
			console.error('Erro ao fazer download:', error);
			showError('Erro ao fazer download do laudo. Tente novamente.');
		}
	};

	const handleDelete = async (laudoId: string) => {
		if (!confirm('Tem certeza que deseja excluir este laudo?')) {
			return;
		}

		try {
			await LaudosService.delete(laudoId);
			showSuccess('Laudo excluído com sucesso!');
			loadLaudos(); // Recarregar lista
		} catch (error: any) {
			console.error('Erro ao excluir laudo:', error);
			showError('Erro ao excluir laudo. Tente novamente.');
		}
	};

	const handleLogout = async () => {
		try {
			await logout();
			showSuccess('Logout realizado com sucesso!');
			router.push('/');
		} catch (error) {
			console.error('Erro no logout:', error);
		}
	};

	if (!isLoggedIn || !isAdmin) {
		return null; // Será redirecionado
	}

	return (
		<PageTransition>
			<div className="min-h-screen bg-gray-50">
				{/* Header */}
				<header className="bg-white shadow-sm border-b">
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
						<div className="flex justify-between items-center h-16">
							<div className="flex items-center gap-4">
								<OptimizedImage
									src="/icons/pharmedice-logo.svg"
									alt="Logo da Pharmédice"
									width={72}
									height={24}
									className="max-h-8"
								/>
								<h1 className="text-xl font-semibold text-gray-900">
									Painel Administrativo
								</h1>
							</div>

							<div className="flex items-center gap-4">
								<span className="text-sm text-gray-600">
									Olá, {user?.primeiro_nome}! (Admin)
								</span>
								<button
									onClick={handleLogout}
									className="text-sm text-red-600 hover:text-red-700 transition-colors"
								>
									Sair
								</button>
							</div>
						</div>
					</div>
				</header>

				{/* Main Content */}
				<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
					<div className="grid lg:grid-cols-3 gap-8">
						{/* Upload Form */}
						<div className="lg:col-span-1">
							<UploadForm onUploadSuccess={loadLaudos} />
						</div>

						{/* Laudos List */}
						<div className="lg:col-span-2">
							<div className="mb-6">
								<h2 className="text-2xl font-bold text-gray-900 mb-2">
									Gerenciar Laudos
								</h2>
								<p className="text-gray-600">
									Visualize, baixe e gerencie todos os laudos do sistema
								</p>
							</div>

							{/* Search */}
							<div className="flex gap-2 mb-6">
								<div className="flex-1 relative">
									<input
										type="text"
										placeholder="Buscar laudos..."
										value={searchTerm}
										onChange={(e) => setSearchTerm(e.target.value)}
										onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
										className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
									/>
									<Image
										src="/icons/search.svg"
										alt="Buscar"
										width={20}
										height={20}
										className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
									/>
								</div>
								<button
									onClick={handleSearch}
									className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
								>
									Buscar
								</button>
							</div>

							{loading ? (
								<div className="flex justify-center items-center py-12">
									<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
									<span className="ml-2 text-gray-600">Carregando...</span>
								</div>
							) : laudos.length === 0 ? (
								<div className="text-center py-12">
									<Image
										src="/icons/document.svg"
										alt="Nenhum laudo"
										width={64}
										height={64}
										className="mx-auto mb-4 opacity-50"
									/>
									<h3 className="text-lg font-medium text-gray-900 mb-2">
										{searchTerm
											? 'Nenhum laudo encontrado'
											: 'Nenhum laudo cadastrado'}
									</h3>
									<p className="text-gray-600">
										{searchTerm
											? 'Tente buscar com outros termos.'
											: 'Comece enviando um novo laudo usando o formulário ao lado.'}
									</p>
								</div>
							) : (
								<>
									<div className="space-y-4">
										{laudos.map((laudo) => (
											<AdminLaudoCard
												key={laudo.id}
												laudo={laudo}
												onDelete={handleDelete}
												onDownload={handleDownload}
											/>
										))}
									</div>

									{/* Paginação */}
									{totalPages > 1 && (
										<div className="flex justify-center items-center gap-2 mt-8">
											<button
												onClick={() =>
													setCurrentPage((prev) => Math.max(1, prev - 1))
												}
												disabled={currentPage === 1}
												className="px-3 py-1 rounded border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
											>
												Anterior
											</button>

											<span className="px-4 py-1">
												Página {currentPage} de {totalPages}
											</span>

											<button
												onClick={() =>
													setCurrentPage((prev) =>
														Math.min(totalPages, prev + 1)
													)
												}
												disabled={currentPage === totalPages}
												className="px-3 py-1 rounded border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
											>
												Próxima
											</button>
										</div>
									)}
								</>
							)}
						</div>
					</div>
				</main>
			</div>
		</PageTransition>
	);
}

// Componente wrapper para processar callback do Google antes do ProtectedRoute
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
				
				// Limpar URL e recarregar
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
