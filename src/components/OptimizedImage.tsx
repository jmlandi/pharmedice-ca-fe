'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useLoading } from './LoadingProvider';

interface OptimizedImageProps {
	src: string;
	alt: string;
	width: number;
	height: number;
	className?: string;
	priority?: boolean;
	fill?: boolean;
	sizes?: string;
	placeholder?: 'blur' | 'empty';
	blurDataURL?: string;
	fallbackSrc?: string; // Imagem de fallback para exibir enquanto carrega
}

// Skeleton loader component
function ImageSkeleton({
	className,
	width,
	height,
}: {
	className?: string;
	width?: number;
	height?: number;
}) {
	return (
		<div
			className={`animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] ${className}`}
			style={{ width, height }}
		>
			<div className="w-full h-full bg-[#CCCCCC] rounded-lg flex items-center justify-center">
				<svg
					className="w-8 h-8 text-gray-400"
					fill="currentColor"
					viewBox="0 0 20 20"
				>
					<path
						fillRule="evenodd"
						d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
						clipRule="evenodd"
					/>
				</svg>
			</div>
		</div>
	);
}

export default function OptimizedImage({
	src,
	alt,
	width,
	height,
	className = '',
	priority = false,
	fill = false,
	sizes,
	placeholder = 'empty',
	blurDataURL,
	fallbackSrc,
}: OptimizedImageProps) {
	const [isLoading, setIsLoading] = useState(true);
	const [hasError, setHasError] = useState(false);
	const { startLoading, stopLoading } = useLoading();

	const handleLoadStart = () => {
		setIsLoading(true);
		startLoading();
	};

	const handleLoadComplete = () => {
		setIsLoading(false);
		stopLoading();
	};

	const handleError = () => {
		setIsLoading(false);
		setHasError(true);
		stopLoading();
	};

	if (hasError) {
		return (
			<div
				className={`bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center ${className}`}
				style={{ width, height }}
			>
				<div className="text-center text-gray-500">
					<svg
						className="w-8 h-8 mx-auto mb-2"
						fill="currentColor"
						viewBox="0 0 20 20"
					>
						<path
							fillRule="evenodd"
							d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
							clipRule="evenodd"
						/>
					</svg>
					<p className="text-xs">Falha ao carregar</p>
				</div>
			</div>
		);
	}

	return (
		<div className="relative">
			{/* Fallback image - shows immediately if provided */}
			{isLoading && fallbackSrc && (
				<Image
					src={fallbackSrc}
					alt={alt}
					width={fill ? undefined : width}
					height={fill ? undefined : height}
					fill={fill}
					sizes={sizes}
					priority={true}
					className={`absolute inset-0 z-20 ${className}`}
				/>
			)}
			
			{/* Skeleton loader - only shows if no fallback image */}
			{isLoading && !fallbackSrc && (
				<ImageSkeleton
					className={`absolute inset-0 z-10 ${className}`}
					width={width}
					height={height}
				/>
			)}
			
			{/* Main image */}
			<Image
				src={src}
				alt={alt}
				width={fill ? undefined : width}
				height={fill ? undefined : height}
				fill={fill}
				sizes={sizes}
				priority={priority}
				placeholder={placeholder}
				blurDataURL={blurDataURL}
				className={`transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'} ${className}`}
				onLoadStart={handleLoadStart}
				onLoad={handleLoadComplete}
				onError={handleError}
			/>
		</div>
	);
}
