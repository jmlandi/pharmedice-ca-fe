import api, { ApiResponse, LoginResponse, User } from './api';

// Interface para dados de login
export interface LoginData {
	email: string;
	senha: string;
}

// Interface para dados de registro
export interface RegisterData {
	primeiro_nome: string;
	segundo_nome: string;
	apelido: string;
	email: string;
	senha: string;
	senha_confirmation: string;
	confirmacao_senha: string;
	telefone: string;
	numero_documento: string;
	data_nascimento: string;
	aceite_comunicacoes_email: boolean;
	aceite_comunicacoes_sms: boolean;
	aceite_comunicacoes_whatsapp: boolean;
	aceite_termos_uso: boolean;
	aceite_politica_privacidade: boolean;
}

// Interface para alteração de senha
export interface ChangePasswordData {
	senha_atual: string;
	nova_senha: string;
	nova_senha_confirmation: string;
}

export class AuthService {
	// Login
	static async login(data: LoginData): Promise<LoginResponse> {
		const response = await api.post<ApiResponse<LoginResponse>>(
			'/auth/login',
			data
		);

		if (response.data.sucesso && response.data.dados) {
			// Salvar token e dados do usuário
			localStorage.setItem('token', response.data.dados.access_token);
			localStorage.setItem('user', JSON.stringify(response.data.dados.usuario));
			return response.data.dados;
		}

		throw new Error(response.data.mensagem || 'Erro no login');
	}

	// Registro de usuário normal
	static async registerUser(data: RegisterData): Promise<LoginResponse> {
		const response = await api.post<ApiResponse<LoginResponse>>(
			'/auth/registrar-usuario',
			data
		);

		if (response.data.sucesso && response.data.dados) {
			// Salvar token e dados do usuário
			localStorage.setItem('token', response.data.dados.access_token);
			localStorage.setItem('user', JSON.stringify(response.data.dados.usuario));
			return response.data.dados;
		}

		throw new Error(response.data.mensagem || 'Erro no registro');
	}

	// Registro de administrador
	static async registerAdmin(data: RegisterData): Promise<LoginResponse> {
		const response = await api.post<ApiResponse<LoginResponse>>(
			'/auth/registrar-admin',
			data
		);

		if (response.data.sucesso && response.data.dados) {
			// Salvar token e dados do usuário
			localStorage.setItem('token', response.data.dados.access_token);
			localStorage.setItem('user', JSON.stringify(response.data.dados.usuario));
			return response.data.dados;
		}

		throw new Error(response.data.mensagem || 'Erro no registro');
	}

	// Método legado - mantido para compatibilidade (usa registro de usuário)
	static async register(data: RegisterData): Promise<LoginResponse> {
		return this.registerUser(data);
	}

	// Processar callback do Google (salvar token dos query params)
	static handleGoogleCallback(token: string, usuario: string): void {
		if (typeof window === 'undefined') return;

		try {
			// Salvar token
			localStorage.setItem('token', token);

			// O usuario pode vir URL encoded, base64, ou JSON direto
			let userData;

			try {
				// Primeiro, fazer URL decode
				const decoded = decodeURIComponent(usuario);
				// Tentar parsear como JSON
				userData = JSON.parse(decoded);
			} catch {
				try {
					// Tentar base64
					const fromBase64 = atob(usuario);
					userData = JSON.parse(fromBase64);
				} catch {
					// Última tentativa: JSON direto
					userData = JSON.parse(usuario);
				}
			}

			localStorage.setItem('user', JSON.stringify(userData));
		} catch (error) {
			console.error('Erro ao processar callback do Google:', error);
			throw new Error('Erro ao processar autenticação do Google');
		}
	}

	// Logout
	static async logout(): Promise<void> {
		try {
			await api.post('/auth/logout');
		} catch (error) {
			// Continua mesmo se houver erro na API
			console.error('Erro no logout:', error);
		} finally {
			// Limpar dados locais sempre
			localStorage.removeItem('token');
			localStorage.removeItem('user');
		}
	}

	// Renovar token
	static async refreshToken(): Promise<LoginResponse> {
		const response =
			await api.post<ApiResponse<LoginResponse>>('/auth/refresh');

		if (response.data.sucesso && response.data.dados) {
			localStorage.setItem('token', response.data.dados.access_token);
			localStorage.setItem('user', JSON.stringify(response.data.dados.usuario));
			return response.data.dados;
		}

		throw new Error(response.data.mensagem || 'Erro ao renovar token');
	}

	// Obter dados do usuário atual
	static async me(): Promise<User> {
		const response = await api.get<ApiResponse<User>>('/auth/me');

		if (response.data.sucesso && response.data.dados) {
			localStorage.setItem('user', JSON.stringify(response.data.dados));
			return response.data.dados;
		}

		throw new Error(response.data.mensagem || 'Erro ao obter dados do usuário');
	}

	// Alterar senha
	static async changePassword(data: ChangePasswordData): Promise<void> {
		const response = await api.put<ApiResponse>(
			'/usuarios/alterar-senha',
			data
		);

		if (!response.data.sucesso) {
			throw new Error(response.data.mensagem || 'Erro ao alterar senha');
		}
	}

	// Verificar se usuário está logado
	static isLoggedIn(): boolean {
		if (typeof window === 'undefined') return false;
		return !!localStorage.getItem('token');
	}

	// Obter usuário do localStorage
	static getCurrentUser(): User | null {
		if (typeof window === 'undefined') return null;

		const userData = localStorage.getItem('user');
		if (userData) {
			try {
				return JSON.parse(userData);
			} catch (error) {
				console.error('Erro ao parsear dados do usuário:', error);
				localStorage.removeItem('user');
			}
		}
		return null;
	}

	// Verificar se usuário é admin
	static isAdmin(): boolean {
		const user = this.getCurrentUser();
		return user?.is_admin || false;
	}

	// Obter token
	static getToken(): string | null {
		if (typeof window === 'undefined') return null;
		return localStorage.getItem('token');
	}

	// Reenviar email de verificação
	static async resendEmailVerification(): Promise<void> {
		const response = await api.post<ApiResponse>('/auth/email/resend');

		if (!response.data.sucesso) {
			throw new Error(
				response.data.mensagem || 'Erro ao reenviar email de verificação'
			);
		}
	}
}
