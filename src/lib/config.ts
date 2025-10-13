// Environment configuration helper
export const config = {
	apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
} as const;

// Validate required environment variables
if (!process.env.NEXT_PUBLIC_API_URL) {
	console.warn('⚠️ NEXT_PUBLIC_API_URL not set, using default localhost:8000');
}

export default config;