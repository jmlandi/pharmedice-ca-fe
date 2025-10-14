import { useState } from 'react';

export const useGoogleAuth = () => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const API_URL =
		process.env.NEXT_PUBLIC_API_URL ||
		'https://api-pharmedice.marcoslandi.com/api';

	const loginWithGoogle = () => {
		try {
			setLoading(true);
			setError(null);

			// Redirecionar diretamente para o endpoint do Google OAuth
			// A API_URL já inclui /api, então só adicionar /auth/google
			window.location.href = `${API_URL}/auth/google`;
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Erro desconhecido');
			setLoading(false);
		}
	};

	return { loginWithGoogle, loading, error };
};
