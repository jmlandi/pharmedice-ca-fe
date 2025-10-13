import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	/* config options here */
	
	// Remove output: 'standalone' - not needed for Amplify hosting
	// Amplify handles the deployment automatically
	
	// Ensure proper static file handling
	trailingSlash: false,
	
	// Environment variables are automatically available in Amplify
	// No need to explicitly expose them in next.config.ts
};

export default nextConfig;
