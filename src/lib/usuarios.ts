import api, { ApiResponse, User, PaginatedResponse } from './api';

export interface ListUsersParams {
	page?: number;
	per_page?: number;
	tipo_usuario?: 'administrador' | 'usuario';
	email?: string;
	nome?: string;
}

export interface UpdateUserData {
	primeiro_nome?: string;
	segundo_nome?: string;
	apelido?: string;
	email?: string;
	senha?: string;
	telefone?: string;
	numero_documento?: string;
	data_nascimento?: string;
	tipo_usuario?: 'administrador' | 'usuario';
	aceite_comunicacoes_email?: boolean;
	aceite_comunicacoes_sms?: boolean;
	aceite_comunicacoes_whatsapp?: boolean;
}

export class UsuariosService {
	/**
	 * Lista usuários com filtros e paginação
	 */
	static async list(params: ListUsersParams = {}): Promise<PaginatedResponse<User>> {
		const queryParams = new URLSearchParams();
		
		if (params.page) queryParams.append('page', params.page.toString());
		if (params.per_page) queryParams.append('per_page', params.per_page.toString());
		if (params.tipo_usuario) queryParams.append('tipo_usuario', params.tipo_usuario);
		if (params.email) queryParams.append('email', params.email);
		if (params.nome) queryParams.append('nome', params.nome);

		const response = await api.get<ApiResponse<PaginatedResponse<User>>>(
			`usuarios?${queryParams.toString()}`
		);
		
		if (!response.data.sucesso || !response.data.dados) {
			throw new Error(response.data.mensagem || 'Erro ao listar usuários');
		}

		return response.data.dados;
	}

	/**
	 * Busca um usuário específico por ID
	 */
	static async getById(id: string): Promise<User> {
		const response = await api.get<ApiResponse<User>>(`usuarios/${id}`);
		
		if (!response.data.sucesso || !response.data.dados) {
			throw new Error(response.data.mensagem || 'Usuário não encontrado');
		}

		return response.data.dados;
	}

	/**
	 * Atualiza dados de um usuário
	 */
	static async update(id: string, data: UpdateUserData): Promise<User> {
		const response = await api.put<ApiResponse<User>>(`usuarios/${id}`, data);
		
		if (!response.data.sucesso || !response.data.dados) {
			throw new Error(response.data.mensagem || 'Erro ao atualizar usuário');
		}

		return response.data.dados;
	}

	/**
	 * Remove um usuário (soft delete)
	 */
	static async delete(id: string): Promise<void> {
		const response = await api.delete<ApiResponse>(`usuarios/${id}`);
		
		if (!response.data.sucesso) {
			throw new Error(response.data.mensagem || 'Erro ao remover usuário');
		}
	}
}
