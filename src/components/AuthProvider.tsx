'use client';

import React, {
	createContext,
	useContext,
	useEffect,
	useState,
	ReactNode,
} from 'react';
import { AuthService, LoginData, RegisterData } from '../lib/auth';
import { User } from '../lib/api';

interface AuthContextType {
	user: User | null;
	isLoading: boolean;
	isLoggedIn: boolean;
	isAdmin: boolean;
	isEmailVerified: boolean;
	login: (data: LoginData) => Promise<void>;
	register: (data: RegisterData) => Promise<void>;
	registerUser: (data: RegisterData) => Promise<void>;
	registerAdmin: (data: RegisterData) => Promise<void>;
	logout: () => Promise<void>;
	refreshUser: () => Promise<void>;
	updateUser: (updatedUser: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
	children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
	const [user, setUser] = useState<User | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	// Carregar dados do usuário ao inicializar
	useEffect(() => {
		const initAuth = async () => {
			try {
				if (AuthService.isLoggedIn()) {
					const userData = AuthService.getCurrentUser();
					if (userData) {
						setUser(userData);
						// Opcionalmente, validar token fazendo uma requisição ao /me
						try {
							const freshUserData = await AuthService.me();
							setUser(freshUserData);
						} catch (error) {
							// Se o token estiver inválido, fazer logout
							console.error('Token inválido:', error);
							await AuthService.logout();
							setUser(null);
						}
					}
				}
			} catch (error) {
				console.error('Erro ao inicializar autenticação:', error);
			} finally {
				setIsLoading(false);
			}
		};

		initAuth();
	}, []);

	const login = async (data: LoginData) => {
		setIsLoading(true);
		try {
			const response = await AuthService.login(data);
			setUser(response.usuario);

			// Se o email não foi verificado, não redirecionar automaticamente
			// O ProtectedRoute irá gerenciar isso
		} catch (error) {
			setUser(null);
			throw error;
		} finally {
			setIsLoading(false);
		}
	};

	const register = async (data: RegisterData) => {
		setIsLoading(true);
		try {
			const response = await AuthService.register(data);
			setUser(response.usuario);
		} catch (error) {
			setUser(null);
			throw error;
		} finally {
			setIsLoading(false);
		}
	};

	const registerUser = async (data: RegisterData) => {
		setIsLoading(true);
		try {
			const response = await AuthService.registerUser(data);
			setUser(response.usuario);
		} catch (error) {
			setUser(null);
			throw error;
		} finally {
			setIsLoading(false);
		}
	};

	const registerAdmin = async (data: RegisterData) => {
		setIsLoading(true);
		try {
			const response = await AuthService.registerAdmin(data);
			setUser(response.usuario);
		} catch (error) {
			setUser(null);
			throw error;
		} finally {
			setIsLoading(false);
		}
	};

	const logout = async () => {
		setIsLoading(true);
		try {
			await AuthService.logout();
		} catch (error) {
			console.error('Erro no logout:', error);
		} finally {
			setUser(null);
			setIsLoading(false);
		}
	};

	const refreshUser = async () => {
		try {
			const userData = await AuthService.me();
			setUser(userData);
		} catch (error) {
			console.error('Erro ao atualizar dados do usuário:', error);
			setUser(null);
		}
	};

	const updateUser = (updatedUser: User) => {
		setUser(updatedUser);
	};

	const contextValue: AuthContextType = {
		user,
		isLoading,
		isLoggedIn: !!user,
		isAdmin: user?.is_admin || false,
		isEmailVerified: user?.email_verificado || false,
		login,
		register,
		registerUser,
		registerAdmin,
		logout,
		refreshUser,
		updateUser,
	};

	return (
		<AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
	);
}

export function useAuth(): AuthContextType {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error('useAuth deve ser usado dentro de um AuthProvider');
	}
	return context;
}
