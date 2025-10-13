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
							<span className="bg-gray-100 px-2 py-1 rounded">
								{config.apiUrl}
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
						{process.env.NEXT_PUBLIC_API_URL ? (
							<div className="flex items-center text-green-600">
								<svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
									<path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
								</svg>
								Environment variable is set correctly
							</div>
						) : (
							<div className="flex items-center text-red-600">
								<svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
									<path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
								</svg>
								Environment variable is NOT set
							</div>
						)}
						
						{config.apiUrl.includes('localhost') && process.env.NODE_ENV === 'production' && (
							<div className="flex items-center text-yellow-600">
								<svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
									<path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
								</svg>
								Warning: Using localhost in production
							</div>
						)}
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