'use client';

import { useState } from 'react';
import { useAlert } from '@/components/AlertProvider';
import { LaudosService } from '@/lib/laudos';

interface FileWithMetadata {
	file: File;
	titulo: string;
	descricao: string;
	uploading: boolean;
	uploaded: boolean;
	error?: string;
}

interface MassUploadModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSuccess: () => void;
}

export default function MassUploadModal({
	isOpen,
	onClose,
	onSuccess,
}: MassUploadModalProps) {
	const { showError, showSuccess } = useAlert();
	const [files, setFiles] = useState<FileWithMetadata[]>([]);
	const [uploading, setUploading] = useState(false);

	const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
		const selectedFiles = Array.from(e.target.files || []);
		const validFiles: FileWithMetadata[] = [];

		for (const file of selectedFiles) {
			const validation = LaudosService.validateFile(file);
			if (!validation.valid) {
				showError(`${file.name}: ${validation.error}`);
				continue;
			}

			validFiles.push({
				file,
				titulo: file.name.replace('.pdf', ''),
				descricao: '',
				uploading: false,
				uploaded: false,
			});
		}

		setFiles((prev) => [...prev, ...validFiles]);
		// Reset input
		e.target.value = '';
	};

	const handleMetadataChange = (
		index: number,
		field: 'titulo' | 'descricao',
		value: string
	) => {
		setFiles((prev) =>
			prev.map((f, i) => (i === index ? { ...f, [field]: value } : f))
		);
	};

	const handleRemoveFile = (index: number) => {
		setFiles((prev) => prev.filter((_, i) => i !== index));
	};

	const handleUpload = async () => {
		// Validar que todos os arquivos têm título e descrição
		const invalidFiles = files.filter(
			(f) => !f.titulo.trim() || !f.descricao.trim()
		);
		if (invalidFiles.length > 0) {
			showError('Todos os arquivos devem ter título e descrição');
			return;
		}

		if (files.length === 0) {
			showError('Selecione pelo menos um arquivo');
			return;
		}

		setUploading(true);
		let successCount = 0;
		let errorCount = 0;

		// Enviar arquivos um por um
		for (let i = 0; i < files.length; i++) {
			const fileData = files[i];

			// Marcar como enviando
			setFiles((prev) =>
				prev.map((f, idx) => (idx === i ? { ...f, uploading: true } : f))
			);

			try {
				await LaudosService.upload({
					titulo: fileData.titulo,
					descricao: fileData.descricao,
					arquivo: fileData.file,
				});

				// Marcar como enviado
				setFiles((prev) =>
					prev.map((f, idx) =>
						idx === i ? { ...f, uploading: false, uploaded: true } : f
					)
				);
				successCount++;
			} catch (error) {
				console.error(`Erro ao enviar ${fileData.file.name}:`, error);
				// Marcar erro
				setFiles((prev) =>
					prev.map((f, idx) =>
						idx === i
							? {
									...f,
									uploading: false,
									error: 'Erro ao enviar',
							  }
							: f
					)
				);
				errorCount++;
			}
		}

		setUploading(false);

		// Mostrar resultado
		if (successCount > 0) {
			showSuccess(`${successCount} laudo(s) enviado(s) com sucesso!`);
			onSuccess();
		}

		if (errorCount > 0) {
			showError(`${errorCount} laudo(s) falharam no envio.`);
		}

		// Se todos foram enviados com sucesso, fechar modal
		if (errorCount === 0) {
			handleClose();
		}
	};

	const handleClose = () => {
		if (!uploading) {
			setFiles([]);
			onClose();
		}
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
			<div className="bg-[#F5F2ED] rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
				{/* Header */}
				<div className="flex items-center justify-between p-6 border-b">
					<h2 className="text-2xl font-bold text-gray-900">
						Upload em Massa de Laudos
					</h2>
					<button
						onClick={handleClose}
						disabled={uploading}
						className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
					>
						<svg
							className="w-6 h-6"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M6 18L18 6M6 6l12 12"
							/>
						</svg>
					</button>
				</div>

				{/* Content */}
				<div className="flex-1 overflow-y-auto p-6">
					{/* File selector */}
					<div className="mb-6">
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Selecionar Arquivos PDF
						</label>
						<input
							type="file"
							accept="application/pdf"
							multiple
							onChange={handleFileSelect}
							disabled={uploading}
							className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4E7FC6] focus:border-transparent disabled:opacity-50"
						/>
						<p className="text-xs text-gray-500 mt-1">
							Selecione múltiplos arquivos PDF (máximo 10MB cada)
						</p>
					</div>

					{/* Files list */}
					{files.length > 0 ? (
						<div className="space-y-4">
							<h3 className="text-lg font-semibold text-gray-900">
								Arquivos Selecionados ({files.length})
							</h3>
							{files.map((fileData, index) => (
								<div
									key={index}
									className={`border rounded-lg p-4 ${
										fileData.uploaded
											? 'bg-green-50 border-green-200'
											: fileData.error
											? 'bg-red-50 border-red-200'
											: fileData.uploading
											? 'bg-blue-50 border-blue-200'
											: 'bg-[#F5F2ED] border-gray-200'
									}`}
								>
									<div className="flex items-start justify-between mb-3">
										<div className="flex-1">
											<p className="font-medium text-gray-900 mb-1">
												{fileData.file.name}
											</p>
											<p className="text-xs text-gray-500">
												{(fileData.file.size / 1024 / 1024).toFixed(2)} MB
											</p>
										</div>
										<div className="flex items-center gap-2">
											{fileData.uploading && (
												<div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#4E7FC6]"></div>
											)}
											{fileData.uploaded && (
												<svg
													className="w-5 h-5 text-green-600"
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
											)}
											{fileData.error && (
												<svg
													className="w-5 h-5 text-red-600"
													fill="none"
													stroke="currentColor"
													viewBox="0 0 24 24"
												>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth={2}
														d="M6 18L18 6M6 6l12 12"
													/>
												</svg>
											)}
											{!fileData.uploading && !fileData.uploaded && (
												<button
													onClick={() => handleRemoveFile(index)}
													className="text-red-600 hover:text-red-700"
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
															d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
														/>
													</svg>
												</button>
											)}
										</div>
									</div>

									{!fileData.uploaded && (
										<div className="space-y-3">
											<div>
												<label className="block text-xs font-medium text-gray-700 mb-1">
													Título *
												</label>
												<input
													type="text"
													value={fileData.titulo}
													onChange={(e) =>
														handleMetadataChange(index, 'titulo', e.target.value)
													}
													disabled={uploading}
													className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4E7FC6] focus:border-transparent disabled:opacity-50"
													placeholder="Título do laudo"
												/>
											</div>
											<div>
												<label className="block text-xs font-medium text-gray-700 mb-1">
													Descrição *
												</label>
												<textarea
													value={fileData.descricao}
													onChange={(e) =>
														handleMetadataChange(
															index,
															'descricao',
															e.target.value
														)
													}
													disabled={uploading}
													rows={2}
													className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4E7FC6] focus:border-transparent disabled:opacity-50"
													placeholder="Descrição do laudo"
												/>
											</div>
										</div>
									)}

									{fileData.error && (
										<p className="text-sm text-red-600 mt-2">{fileData.error}</p>
									)}
								</div>
							))}
						</div>
					) : (
						<div className="text-center py-12 text-gray-500">
							<svg
								className="w-16 h-16 mx-auto mb-4 text-gray-400"
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
							<p>Nenhum arquivo selecionado</p>
							<p className="text-sm mt-1">
								Clique no botão acima para selecionar arquivos
							</p>
						</div>
					)}
				</div>

				{/* Footer */}
				<div className="flex items-center justify-between p-6 border-t bg-[#E3D9CD]">
					<div className="text-sm text-gray-600">
						{files.length > 0 && (
							<>
								{files.filter((f) => f.uploaded).length} enviado(s) /{' '}
								{files.length} total
							</>
						)}
					</div>
					<div className="flex gap-3">
						<button
							onClick={handleClose}
							disabled={uploading}
							className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-[#E3D9CD] disabled:opacity-50"
						>
							Cancelar
						</button>
						<button
							onClick={handleUpload}
							disabled={uploading || files.length === 0}
							className="px-4 py-2 bg-[#4E7FC6] text-white rounded-lg hover:bg-[#26364D] disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{uploading ? 'Enviando...' : `Enviar ${files.length} Laudo(s)`}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
