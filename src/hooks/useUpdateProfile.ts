import { useState } from 'react';
import { AuthService, UpdateProfileData } from '@/lib/auth';
import { User } from '@/lib/api';

interface UseUpdateProfileReturn {
	updateProfile: (data: UpdateProfileData) => Promise<User>;
	loading: boolean;
	error: string | null;
	validationErrors: Record<string, string[]> | null;
}

export function useUpdateProfile(): UseUpdateProfileReturn {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [validationErrors, setValidationErrors] = useState<Record<string, string[]> | null>(null);

	const updateProfile = async (data: UpdateProfileData): Promise<User> => {
		setLoading(true);
		setError(null);
		setValidationErrors(null);

		try {
			const updatedUser = await AuthService.updateProfile(data);
			return updatedUser;
		} catch (err) {
			console.error('Erro ao atualizar perfil:', err);
			
			// Tratamento de erros mais específico baseado na resposta da API
			if (err instanceof Error) {
				if (err.message.includes('422') || err.message.includes('validation')) {
					setError('Dados inválidos. Verifique as informações e tente novamente.');
				} else if (err.message.includes('401')) {
					setError('Sessão expirada. Faça login novamente.');
				} else if (err.message.includes('403')) {
					setError('Você não tem permissão para realizar esta ação.');
				} else if (err.message.includes('500')) {
					setError('Erro interno do servidor. Tente novamente mais tarde.');
				} else {
					setError(err.message);
				}
			} else {
				setError('Erro desconhecido ao atualizar perfil.');
			}
			
			throw err;
		} finally {
			setLoading(false);
		}
	};

	return { 
		updateProfile, 
		loading, 
		error, 
		validationErrors 
	};
}