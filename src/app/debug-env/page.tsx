'use client';

import { useEffect, useState } from 'react';
import config from '@/lib/config';

export default function EnvDebugPage() {
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return <div>Loading...</div>;
	}

	return (
		<div className="min-h-screen bg-gray-50 p-8">
			<div className="max-w-4xl mx-auto">
				<h1 className="text-3xl font-bold text-gray-900 mb-8">
					Environment Variables Debug
				</h1>
				
				<div className="bg-white rounded-lg shadow p-6 mb-6">
					<h2 className="text-xl font-semibold mb-4">Configuration</h2>
					<div className="space-y-2 font-mono text-sm">
						<div>
							<span className="font-semibold">API URL:</span>{' '}
							<span className="bg-green-100 px-2 py-1 rounded text-green-800">
								{config.apiUrl}
							</span>
						</div>
						<div>
							<span className="font-semibold">Status:</span>{' '}
							<span className="bg-green-100 px-2 py-1 rounded text-green-800">
								HARDCODED - Stable
							</span>
						</div>
						<div>
							<span className="font-semibold">NODE_ENV:</span>{' '}
							<span className="bg-gray-100 px-2 py-1 rounded">
								{process.env.NODE_ENV}
							</span>
						</div>
					</div>
				</div>

				<div className="bg-white rounded-lg shadow p-6 mb-6">
					<h2 className="text-xl font-semibold mb-4">Environment Variables</h2>
					<div className="space-y-2 font-mono text-sm">
						<div>
							<span className="font-semibold">NEXT_PUBLIC_API_URL:</span>{' '}
							<span className="bg-gray-100 px-2 py-1 rounded">
								{process.env.NEXT_PUBLIC_API_URL || 'NOT SET'}
							</span>
						</div>
					</div>
				</div>

				<div className="bg-white rounded-lg shadow p-6">
					<h2 className="text-xl font-semibold mb-4">Status</h2>
					<div className="space-y-2">
						<div className="flex items-center text-green-600">
							<svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
								<path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
							</svg>
							API URL is hardcoded and stable
						</div>
						
						<div className="flex items-center text-blue-600">
							<svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
								<path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
							</svg>
							No environment variable dependencies
						</div>
					</div>
				</div>

				<div className="mt-8 text-sm text-gray-600">
					<p>
						<strong>Note:</strong> This page helps debug environment variable loading issues.
						Remove this page from production builds.
					</p>
				</div>
			</div>
		</div>
	);
}