// API Configuration - Uses environment variable with localhost fallback
export const config = {
	apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
} as const;

export default config;