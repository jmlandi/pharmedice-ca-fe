import axios from 'axios';
import config from './config';

// Configuração base da API
const api = axios.create({
	baseURL: `${config.apiUrl}/`,
	headers: {
		Accept: 'application/json',
		'Content-Type': 'application/json',
	},
});

// Interceptor para adicionar token JWT às requisições
api.interceptors.request.use(
	(config) => {
		const token =
			typeof window !== 'undefined' ? localStorage.getItem('token') : null;
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

// Interceptor para tratar respostas e erros
api.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error.response?.status === 401) {
			// Token expirado ou inválido
			if (typeof window !== 'undefined') {
				localStorage.removeItem('token');
				localStorage.removeItem('user');
				window.location.href = '/';
			}
		}
		return Promise.reject(error);
	}
);

export default api;

// Tipos para as resposta da API
export interface ApiResponse<T = unknown> {
	sucesso: boolean;
	mensagem: string;
	dados?: T;
	erros?: Record<string, string[]>;
}

export interface User {
	id: string;
	primeiro_nome: string;
	segundo_nome: string;
	apelido?: string;
	email: string;
	telefone?: string;
	numero_documento?: string;
	data_nascimento?: string;
	tipo_usuario: 'administrador' | 'usuario';
	is_admin: boolean;
	email_verificado: boolean;
	email_verified_at?: string;
	aceite_comunicacoes_email?: boolean;
	aceite_comunicacoes_sms?: boolean;
	aceite_comunicacoes_whatsapp?: boolean;
	ativo?: boolean;
	avatar?: string;
	google_id?: string;
	provider?: string;
	created_at?: string;
	updated_at?: string;
}

export interface Laudo {
	id: string;
	usuario_id: string;
	titulo: string;
	descricao: string;
	url_arquivo: string;
	ativo: boolean;
	created_at: string;
	updated_at: string;
	usuario?: User;
}

export interface LoginResponse {
	access_token: string;
	token_type: string;
	expires_in: number;
	usuario: User;
}

export interface PaginatedResponse<T> {
	current_page: number;
	data: T[];
	first_page_url: string;
	from: number;
	last_page: number;
	per_page: number;
	total: number;
}

// Interfaces para recuperação de senha
export interface SolicitarRecuperacaoSenhaRequest {
	email: string;
}

export interface RedefinirSenhaRequest {
	email: string;
	token: string;
	senha: string;
	confirmacao_senha: string;
}

export interface RedefinirSenhaResponse {
	email: string;
	nome: string;
}

// Funções para recuperação de senha
export const solicitarRecuperacaoSenha = async (
	data: SolicitarRecuperacaoSenhaRequest
): Promise<ApiResponse> => {
	const response = await api.post('auth/solicitar-recuperacao-senha', data);
	return response.data;
};

export const redefinirSenha = async (
	data: RedefinirSenhaRequest
): Promise<ApiResponse<RedefinirSenhaResponse>> => {
	const response = await api.post('auth/redefinir-senha', data);
	return response.data;
};

// Interfaces para verificação de e-mail
export interface VerificarEmailRequest {
	id: string;
	hash: string;
	expires: string;
	signature: string;
}

export interface ReenviarVerificacaoEmailRequest {
	email: string;
}

export interface VerificarEmailResponse {
	sucesso: boolean;
	mensagem: string;
	usuario: {
		email: string;
		email_verificado: boolean;
		verificado_em: string;
	};
}

// Funções para verificação de e-mail
export const verificarEmail = async (
	data: VerificarEmailRequest
): Promise<ApiResponse<VerificarEmailResponse>> => {
	const response = await api.post('auth/verificar-email', data);
	return response.data;
};

export const reenviarVerificacaoEmail = async (
	data: ReenviarVerificacaoEmailRequest
): Promise<ApiResponse> => {
	const response = await api.post(
		'auth/reenviar-verificacao-email-publico',
		data
	);
	return response.data;
};

export const reenviarVerificacaoEmailAutenticado =
	async (): Promise<ApiResponse> => {
		const response = await api.post('auth/reenviar-verificacao-email');
		return response.data;
	};
