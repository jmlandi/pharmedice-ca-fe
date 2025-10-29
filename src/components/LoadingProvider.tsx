'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

interface LoadingContextType {
	isLoading: boolean;
	startLoading: () => void;
	stopLoading: () => void;
	progress: number;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const useLoading = () => {
	const context = useContext(LoadingContext);
	if (!context) {
		throw new Error('useLoading must be used within a LoadingProvider');
	}
	return context;
};

// Top loading bar component (YouTube/Facebook style)
function TopLoadingBar({
	isLoading,
	progress,
}: {
	isLoading: boolean;
	progress: number;
}) {
	return (
		<div
			className={`fixed top-0 left-0 right-0 z-50 h-1 bg-transparent transition-opacity duration-300 ${isLoading ? 'opacity-100' : 'opacity-0'}`}
		>
			<div
				className="h-full bg-gradient-to-r from-[#4E7FC6] via-blue-400 to-[#4E7FC6] transition-all duration-300 ease-out shadow-lg relative overflow-hidden"
				style={{
					width: `${progress}%`,
					boxShadow: '0 0 10px rgba(78, 127, 198, 0.6)',
				}}
			>
				{/* Animated shine effect */}
				<div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 transform -skew-x-12 translate-x-[-100%] animate-[shine_1.5s_ease-in-out_infinite]" />
			</div>
		</div>
	);
}

export function LoadingProvider({ children }: { children: React.ReactNode }) {
	const [isLoading, setIsLoading] = useState(false);
	const [progress, setProgress] = useState(0);
	const pathname = usePathname();

	// Auto-start loading on route changes
	useEffect(() => {
		setIsLoading(true);
		setProgress(10);

		// Simulate loading progress
		const timer1 = setTimeout(() => setProgress(30), 100);
		const timer2 = setTimeout(() => setProgress(70), 500);
		const timer3 = setTimeout(() => {
			setProgress(100);
			setTimeout(() => {
				setIsLoading(false);
				setProgress(0);
			}, 200);
		}, 1000);

		return () => {
			clearTimeout(timer1);
			clearTimeout(timer2);
			clearTimeout(timer3);
		};
	}, [pathname]);

	const startLoading = () => {
		setIsLoading(true);
		setProgress(10);

		// Progressive loading animation
		const interval = setInterval(() => {
			setProgress((prev) => {
				if (prev >= 90) {
					clearInterval(interval);
					return 90;
				}
				return prev + Math.random() * 20;
			});
		}, 200);
	};

	const stopLoading = () => {
		setProgress(100);
		setTimeout(() => {
			setIsLoading(false);
			setProgress(0);
		}, 200);
	};

	return (
		<LoadingContext.Provider
			value={{ isLoading, startLoading, stopLoading, progress }}
		>
			<TopLoadingBar isLoading={isLoading} progress={progress} />
			{children}
		</LoadingContext.Provider>
	);
}
