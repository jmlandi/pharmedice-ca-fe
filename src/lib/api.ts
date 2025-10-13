import axios from 'axios';

// Configuração base da API
const api = axios.create({
  baseURL: 'http://localhost:8000/api/',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
});

// Interceptor para adicionar token JWT às requisições
api.interceptors.request.use(
  (config) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
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
export interface ApiResponse<T = any> {
  sucesso: boolean;
  mensagem: string;
  dados?: T;
  erros?: Record<string, string[]>;
}

export interface User {
  id: string;
  primeiro_nome: string;
  segundo_nome: string;
  email: string;
  tipo_usuario: 'administrador' | 'usuario';
  is_admin: boolean;
  email_verificado: boolean;
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