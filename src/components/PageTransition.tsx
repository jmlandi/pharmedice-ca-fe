'use client';

import { useEffect, useState } from 'react';
import { useLoading } from './LoadingProvider';

interface PageTransitionProps {
	children: React.ReactNode;
	className?: string;
}

export default function PageTransition({
	children,
	className = '',
}: PageTransitionProps) {
	const { isLoading } = useLoading();
	const [shouldRender, setShouldRender] = useState(false);

	useEffect(() => {
		if (!isLoading) {
			// Small delay to ensure smooth transition
			const timer = setTimeout(() => setShouldRender(true), 100);
			return () => clearTimeout(timer);
		} else {
			setShouldRender(false);
		}
	}, [isLoading]);

	return (
		<div
			className={`transition-all duration-500 ease-in-out ${
				shouldRender && !isLoading
					? 'opacity-100 translate-y-0'
					: 'opacity-0 translate-y-4'
			} ${className}`}
		>
			{children}
		</div>
	);
}
