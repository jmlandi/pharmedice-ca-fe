'use client';

import { useState } from 'react';
import { useAlert } from '@/components/AlertProvider';
import { LaudosService } from '@/lib/laudos';

interface UploadFormProps {
	onUploadSuccess: () => void;
}

export default function UploadForm({ onUploadSuccess }: UploadFormProps) {
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
			setFormData(() => ({ titulo: file.name.replace('.pdf', ''), descricao: '', arquivo: file }));
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
