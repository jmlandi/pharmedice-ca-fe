'use client';

import Image from 'next/image';
import { Laudo } from '@/lib/api';
import { LaudosService } from '@/lib/laudos';

interface ClienteLaudoCardProps {
	laudo: Laudo;
	onDownload: (id: string) => void;
}

export default function ClienteLaudoCard({
	laudo,
	onDownload,
}: ClienteLaudoCardProps) {
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
					className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
				>
					<Image
						src="/icons/download.svg"
						alt="Download"
						width={16}
						height={16}
					/>
					Download
				</button>
			</div>
		</div>
	);
}
