import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	/* config options here */
	
	// Explicit environment variable exposure for Amplify
	env: {
		NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
	},
	
	// Amplify-specific optimizations
	output: 'standalone',
	
	// Ensure proper static file handling
	trailingSlash: false,
};

export default nextConfig;
