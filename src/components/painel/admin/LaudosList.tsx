'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Laudo } from '@/lib/api';
import { useAlert } from '@/components/AlertProvider';
import { LaudosService } from '@/lib/laudos';
import SearchBar from '@/components/painel/SearchBar';
import Pagination from '@/components/painel/Pagination';
import AdminLaudoCard from './AdminLaudoCard';
import MassUploadModal from './MassUploadModal';

interface LaudosListProps {
	laudos: Laudo[];
	loading: boolean;
	currentPage: number;
	totalPages: number;
	onPageChange: (page: number) => void;
	onRefresh: () => void;
}

export default function LaudosList({
laudos,
loading,
currentPage,
totalPages,
onPageChange,
onRefresh,
}: LaudosListProps) {
	const { showError, showSuccess } = useAlert();
	const [searchTerm, setSearchTerm] = useState('');
	const [showMassUpload, setShowMassUpload] = useState(false);
	const [filteredLaudos, setFilteredLaudos] = useState<Laudo[]>(laudos);
	const [isSearching, setIsSearching] = useState(false);

	// Atualiza laudos filtrados quando a lista de laudos muda
	useEffect(() => {
		if (!searchTerm.trim()) {
			setFilteredLaudos(laudos);
		}
	}, [laudos, searchTerm]);

	const handleSearch = () => {
		if (!searchTerm.trim()) {
			setFilteredLaudos(laudos);
			setIsSearching(false);
			return;
		}

		setIsSearching(true);
		try {
			// Filtra localmente por título, descrição e nome do arquivo
			const termo = searchTerm.toLowerCase();
			const filtered = laudos.filter((laudo) => {
				const titulo = laudo.titulo.toLowerCase();
				const descricao = laudo.descricao.toLowerCase();
				const nomeArquivo = LaudosService.getFileName(laudo.url_arquivo).toLowerCase();
				
				return titulo.includes(termo) || 
					   descricao.includes(termo) || 
					   nomeArquivo.includes(termo);
			});
			setFilteredLaudos(filtered);
		} catch (error) {
			console.error('Erro ao buscar laudos:', error);
			showError('Erro ao buscar laudos. Tente novamente.');
			setFilteredLaudos(laudos);
		} finally {
			setIsSearching(false);
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
		} catch (error) {
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
			onRefresh();
		} catch (error) {
			console.error('Erro ao excluir laudo:', error);
			showError('Erro ao excluir laudo. Tente novamente.');
		}
	};

	return (
<>
			<div className="mb-6 flex justify-between items-center">
				<div>
					<h2 className="text-2xl font-bold text-gray-900 mb-2">
						Gerenciar Laudos
					</h2>
					<p className="text-gray-600">
						Visualize, baixe e gerencie todos os laudos do sistema
					</p>
				</div>
				<button
					onClick={() => setShowMassUpload(true)}
					className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
				>
					<svg
						className="w-5 h-5"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
						/>
					</svg>
					Upload em Massa
				</button>
			</div>

			<SearchBar
				value={searchTerm}
				onChange={setSearchTerm}
				onSearch={handleSearch}
				placeholder="Buscar por título, descrição ou nome do arquivo..."
			/>

			{loading || isSearching ? (
<div className="flex justify-center items-center py-12">
					<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
					<span className="ml-2 text-gray-600">
						{isSearching ? 'Buscando...' : 'Carregando...'}
					</span>
				</div>
			) : filteredLaudos.length === 0 ? (
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
						{filteredLaudos.map((laudo) => (
<AdminLaudoCard
								key={laudo.id}
								laudo={laudo}
								onDelete={handleDelete}
								onDownload={handleDownload}
							/>
						))}
					</div>

					{!searchTerm && (
						<Pagination
							currentPage={currentPage}
							totalPages={totalPages}
							onPageChange={onPageChange}
						/>
					)}
				</>
			)}

			<MassUploadModal
				isOpen={showMassUpload}
				onClose={() => setShowMassUpload(false)}
				onSuccess={() => {
					setShowMassUpload(false);
					onRefresh();
				}}
			/>
		</>
	);
}
