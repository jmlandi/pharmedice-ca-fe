'use client';

import { useState, useEffect } from 'react';
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
	onRefresh, // eslint-disable-line @typescript-eslint/no-unused-vars
}: ClienteLaudosListProps) {
	const { showError, showSuccess } = useAlert();
	const [searchTerm, setSearchTerm] = useState('');
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

	return (
		<div>
			<div className="mb-8">
				<h2 className="text-2xl font-bold text-gray-100 mb-2">
					Laudos Técnicos
				</h2>
				<p className="text-gray-300">
					Visualize e faça download dos laudos técnicos disponíveis.
				</p>
			</div>

			<SearchBar
				value={searchTerm}
				onChange={setSearchTerm}
				onSearch={handleSearch}
				placeholder="Buscar por título, descrição ou nome do arquivo..."
			/>

			{loading || isSearching ? (
				<div className="flex justify-center items-center py-12">
					<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#6B9FE8]"></div>
					<span className="ml-2 text-gray-300">
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
					<h3 className="text-lg font-medium text-gray-100 mb-2">
						{searchTerm
							? 'Nenhum laudo encontrado'
							: 'Nenhum laudo disponível'}
					</h3>
					<p className="text-gray-300">
						{searchTerm
							? 'Tente buscar com outros termos.'
							: 'Seus laudos aparecerão aqui quando estiverem disponíveis.'}
					</p>
				</div>
			) : (
				<>
					<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
						{filteredLaudos.map((laudo) => (
							<ClienteLaudoCard
								key={laudo.id}
								laudo={laudo}
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
		</div>
	);
}
