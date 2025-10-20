'use client';

import Image from 'next/image';
import { Laudo } from '@/lib/api';
import { LaudosService } from '@/lib/laudos';

interface AdminLaudoCardProps {
	laudo: Laudo;
	onDelete: (id: string) => void;
	onDownload: (id: string) => void;
}

export default function AdminLaudoCard({
	laudo,
	onDelete,
	onDownload,
}: AdminLaudoCardProps) {
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
