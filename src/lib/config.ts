// Environment configuration helper
export const config = {
	apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
} as const;

// Debug environment variables (only in development)
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
	console.log('🔧 Environment Debug:');
	console.log('NODE_ENV:', process.env.NODE_ENV);
	console.log('NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL);
	console.log('Final API URL:', config.apiUrl);
}

// Validate required environment variables
if (!process.env.NEXT_PUBLIC_API_URL) {
	const isProduction = process.env.NODE_ENV === 'production';
	const message = `⚠️ NEXT_PUBLIC_API_URL not set${isProduction ? ' in production' : ''}, using default localhost:8000`;
	
	if (isProduction) {
		console.error(message);
	} else {
		console.warn(message);
	}
}

// Additional validation for production
if (process.env.NODE_ENV === 'production' && config.apiUrl.includes('localhost')) {
	console.error('🚨 Production build is using localhost API URL! Check your environment variables.');
}

export default config;