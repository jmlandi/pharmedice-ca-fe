import api, { ApiResponse, Laudo, PaginatedResponse } from './api';

// Interface para upload de laudo
export interface UploadLaudoData {
	arquivo: File;
	titulo: string;
	descricao: string;
}

// Interface para atualização de laudo
export interface UpdateLaudoData {
	titulo: string;
	descricao: string;
}

export class LaudosService {
	// Listar laudos (com paginação)
	static async list(page: number = 1): Promise<PaginatedResponse<Laudo>> {
		const response = await api.get<ApiResponse<PaginatedResponse<Laudo>>>(
			`/laudos?page=${page}`
		);

		if (response.data.sucesso && response.data.dados) {
			return response.data.dados;
		}

		throw new Error(response.data.mensagem || 'Erro ao listar laudos');
	}

	// Buscar laudos por termo
	static async search(termo: string): Promise<PaginatedResponse<Laudo>> {
		const response = await api.get<ApiResponse<PaginatedResponse<Laudo>>>(
			`/laudos/buscar?busca=${encodeURIComponent(termo)}`
		);

		if (response.data.sucesso && response.data.dados) {
			return response.data.dados;
		}

		throw new Error(response.data.mensagem || 'Erro ao buscar laudos');
	}

	// Obter laudo específico
	static async get(id: string): Promise<Laudo> {
		const response = await api.get<ApiResponse<Laudo>>(`/laudos/${id}`);

		if (response.data.sucesso && response.data.dados) {
			return response.data.dados;
		}

		throw new Error(response.data.mensagem || 'Erro ao obter laudo');
	}

	// Upload de laudo (apenas admin)
	static async upload(data: UploadLaudoData): Promise<Laudo> {
		const formData = new FormData();
		formData.append('arquivo', data.arquivo);
		formData.append('titulo', data.titulo);
		formData.append('descricao', data.descricao);

		const response = await api.post<ApiResponse<Laudo>>('/laudos', formData, {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		});

		if (response.data.sucesso && response.data.dados) {
			return response.data.dados;
		}

		throw new Error(response.data.mensagem || 'Erro ao fazer upload do laudo');
	}

	// Atualizar laudo (apenas admin)
	static async update(id: string, data: UpdateLaudoData): Promise<Laudo> {
		const response = await api.put<ApiResponse<Laudo>>(`/laudos/${id}`, data);

		if (response.data.sucesso && response.data.dados) {
			return response.data.dados;
		}

		throw new Error(response.data.mensagem || 'Erro ao atualizar laudo');
	}

	// Excluir laudo (apenas admin)
	static async delete(id: string): Promise<void> {
		const response = await api.delete<ApiResponse>(`/laudos/${id}`);

		if (!response.data.sucesso) {
			throw new Error(response.data.mensagem || 'Erro ao excluir laudo');
		}
	}

	// Download de laudo
	static async download(id: string): Promise<Blob> {
		const response = await api.get(`/laudos/${id}/download`, {
			responseType: 'blob',
		});

		return response.data;
	}

	// Obter URL de download (alternativo)
	static getDownloadUrl(id: string): string {
		const token = localStorage.getItem('token');
		return `http://localhost:8000/api/laudos/${id}/download?token=${token}`;
	}

	// Validar arquivo antes do upload
	static validateFile(file: File): { valid: boolean; error?: string } {
		// Verificar tipo
		if (file.type !== 'application/pdf') {
			return { valid: false, error: 'Apenas arquivos PDF são permitidos' };
		}

		// Verificar tamanho (10MB)
		const maxSize = 10 * 1024 * 1024;
		if (file.size > maxSize) {
			return { valid: false, error: 'Arquivo muito grande (máximo 10MB)' };
		}

		return { valid: true };
	}

	// Formatar data para exibição
	static formatDate(dateString: string): string {
		const date = new Date(dateString);
		return date.toLocaleDateString('pt-BR', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
		});
	}

	// Obter nome do arquivo a partir da URL
	static getFileName(url: string): string {
		return url.split('/').pop() || 'arquivo.pdf';
	}
}
