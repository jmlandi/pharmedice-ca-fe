'use client';

import { useEffect } from 'react';

interface AlertProps {
	message: string;
	type: 'success' | 'error' | 'warning' | 'info';
	isVisible: boolean;
	onClose: () => void;
	duration?: number; // Auto close duration in ms (default: 5000)
}

export default function Alert({
	message,
	type,
	isVisible,
	onClose,
	duration = 5000,
}: AlertProps) {
	useEffect(() => {
		if (isVisible && duration > 0) {
			const timer = setTimeout(() => {
				onClose();
			}, duration);
			return () => clearTimeout(timer);
		}
	}, [isVisible, duration, onClose]);

	if (!isVisible) return null;

	const getAlertStyles = () => {
		switch (type) {
			case 'success':
				return 'bg-green-50 border-green-200 text-green-800';
			case 'error':
				return 'bg-red-50 border-red-200 text-red-800';
			case 'warning':
				return 'bg-yellow-50 border-yellow-200 text-yellow-800';
			case 'info':
				return 'bg-blue-50 border-blue-200 text-blue-800';
			default:
				return 'bg-[#2d2823] border-gray-700 text-gray-800';
		}
	};

	const getIconColor = () => {
		switch (type) {
			case 'success':
				return 'text-green-600';
			case 'error':
				return 'text-red-600';
			case 'warning':
				return 'text-yellow-600';
			case 'info':
				return 'text-blue-600';
			default:
				return 'text-gray-300';
		}
	};

	const getIcon = () => {
		switch (type) {
			case 'success':
				return (
					<svg
						className={`w-5 h-5 ${getIconColor()}`}
						fill="currentColor"
						viewBox="0 0 20 20"
					>
						<path
							fillRule="evenodd"
							d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
							clipRule="evenodd"
						/>
					</svg>
				);
			case 'error':
				return (
					<svg
						className={`w-5 h-5 ${getIconColor()}`}
						fill="currentColor"
						viewBox="0 0 20 20"
					>
						<path
							fillRule="evenodd"
							d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
							clipRule="evenodd"
						/>
					</svg>
				);
			case 'warning':
				return (
					<svg
						className={`w-5 h-5 ${getIconColor()}`}
						fill="currentColor"
						viewBox="0 0 20 20"
					>
						<path
							fillRule="evenodd"
							d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
							clipRule="evenodd"
						/>
					</svg>
				);
			case 'info':
				return (
					<svg
						className={`w-5 h-5 ${getIconColor()}`}
						fill="currentColor"
						viewBox="0 0 20 20"
					>
						<path
							fillRule="evenodd"
							d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
							clipRule="evenodd"
						/>
					</svg>
				);
			default:
				return null;
		}
	};

	return (
		<div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md px-4">
			<div
				className={`
        ${getAlertStyles()}
        border-2 rounded-3xl shadow-lg p-4 
        transform transition-all duration-300 ease-in-out
        ${isVisible ? 'translate-y-0 opacity-100 scale-100' : '-translate-y-full opacity-0 scale-95'}
      `}
			>
				<div className="flex items-center gap-3">
					<div className="flex-shrink-0">{getIcon()}</div>
					<div className="flex-1">
						<p className="text-sm font-medium leading-5">{message}</p>
					</div>
					<button
						onClick={onClose}
						className={`
              flex-shrink-0 rounded-full p-1 transition-colors duration-200
              hover:bg-black/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--pharmedice-blue)]
            `}
					>
						<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
							<path
								fillRule="evenodd"
								d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
								clipRule="evenodd"
							/>
						</svg>
					</button>
				</div>
			</div>
		</div>
	);
}
