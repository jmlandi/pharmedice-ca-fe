'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Laudo } from '@/lib/api';
import { useAlert } from '@/components/AlertProvider';
import { LaudosService } from '@/lib/laudos';
import SearchBar from '@/components/painel/SearchBar';
import Pagination from '@/components/painel/Pagination';
import ClienteLaudoCard from './ClienteLaudoCard';

interface ClienteLaudosListProps {
	laudos: Laudo[];
	loading: boolean;
	currentPage: number;
	totalPages: number;
	onPageChange: (page: number) => void;
	onRefresh: () => void;
}

export default function ClienteLaudosList({
	laudos,
	loading,
	currentPage,
	totalPages,
	onPageChange,
	onRefresh,
}: ClienteLaudosListProps) {
	const { showError, showSuccess } = useAlert();
	const [searchTerm, setSearchTerm] = useState('');
	const [isSearching, setIsSearching] = useState(false);

	const handleSearch = async () => {
		if (!searchTerm.trim()) {
			onRefresh();
			return;
		}

		try {
			setIsSearching(true);
			await LaudosService.search(searchTerm);
			onRefresh();
		} catch (error) {
			console.error('Erro ao buscar laudos:', error);
			showError('Erro ao buscar laudos. Tente novamente.');
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

	return (
		<div>
			<div className="mb-8">
				<h2 className="text-2xl font-bold text-gray-900 mb-2">
					Laudos Técnicos
				</h2>
				<p className="text-gray-600">
					Visualize e faça download dos laudos técnicos disponíveis.
				</p>
			</div>

			<SearchBar
				value={searchTerm}
				onChange={setSearchTerm}
				onSearch={handleSearch}
				placeholder="Buscar laudos por título ou descrição..."
			/>

			{loading || isSearching ? (
				<div className="flex justify-center items-center py-12">
					<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
					<span className="ml-2 text-gray-600">
						{isSearching ? 'Buscando...' : 'Carregando...'}
					</span>
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
							: 'Nenhum laudo disponível'}
					</h3>
					<p className="text-gray-600">
						{searchTerm
							? 'Tente buscar com outros termos.'
							: 'Seus laudos aparecerão aqui quando estiverem disponíveis.'}
					</p>
				</div>
			) : (
				<>
					<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
						{laudos.map((laudo) => (
							<ClienteLaudoCard
								key={laudo.id}
								laudo={laudo}
								onDownload={handleDownload}
							/>
						))}
					</div>

					<Pagination
						currentPage={currentPage}
						totalPages={totalPages}
						onPageChange={onPageChange}
					/>
				</>
			)}
		</div>
	);
}
