'use client';

import { useEffect } from 'react';

interface ConfirmModalProps {
	isVisible: boolean;
	title?: string;
	message: string;
	confirmText?: string;
	cancelText?: string;
	onConfirm: () => void;
	onCancel: () => void;
	type?: 'info' | 'warning' | 'error';
}

export default function ConfirmModal({
	isVisible,
	title,
	message,
	confirmText = 'Confirmar',
	cancelText = 'Cancelar',
	onConfirm,
	onCancel,
	type = 'info',
}: ConfirmModalProps) {
	// Handle escape key press
	useEffect(() => {
		const handleEscape = (event: KeyboardEvent) => {
			if (event.key === 'Escape' && isVisible) {
				onCancel();
			}
		};

		if (isVisible) {
			document.addEventListener('keydown', handleEscape);
			// Prevent body scroll when modal is open
			document.body.style.overflow = 'hidden';
		}

		return () => {
			document.removeEventListener('keydown', handleEscape);
			document.body.style.overflow = 'unset';
		};
	}, [isVisible, onCancel]);

	if (!isVisible) return null;

	const getTypeStyles = () => {
		switch (type) {
			case 'warning':
				return {
					icon: (
						<svg
							className="w-6 h-6 text-yellow-600"
							fill="currentColor"
							viewBox="0 0 20 20"
						>
							<path
								fillRule="evenodd"
								d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
								clipRule="evenodd"
							/>
						</svg>
					),
					confirmButton:
						'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500',
				};
			case 'error':
				return {
					icon: (
						<svg
							className="w-6 h-6 text-red-600"
							fill="currentColor"
							viewBox="0 0 20 20"
						>
							<path
								fillRule="evenodd"
								d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
								clipRule="evenodd"
							/>
						</svg>
					),
					confirmButton: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
				};
			default:
				return {
					icon: (
						<svg
							className="w-6 h-6 text-blue-600"
							fill="currentColor"
							viewBox="0 0 20 20"
						>
							<path
								fillRule="evenodd"
								d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
								clipRule="evenodd"
							/>
						</svg>
					),
					confirmButton:
						'bg-[var(--pharmedice-blue)] hover:bg-blue-700 focus:ring-blue-500',
				};
		}
	};

	const { icon, confirmButton } = getTypeStyles();

	return (
		<div className="fixed inset-0 z-50 overflow-y-auto">
			{/* Background overlay */}
			<div
				className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
				onClick={onCancel}
			/>

			{/* Modal */}
			<div className="flex min-h-full items-center justify-center p-4">
				<div className="relative transform overflow-hidden rounded-3xl bg-[#F5F2ED] shadow-xl transition-all w-full max-w-md">
					<div className="bg-[#F5F2ED] px-6 py-6">
						<div className="flex items-start gap-4">
							<div className="flex-shrink-0 mt-1">{icon}</div>
							<div className="flex-1">
								{title && (
									<h3 className="text-lg font-semibold text-gray-900 mb-2">
										{title}
									</h3>
								)}
								<p className="text-sm text-gray-600 leading-relaxed">
									{message}
								</p>
							</div>
						</div>
					</div>

					{/* Actions */}
					<div className="bg-[#E3D9CD] px-6 py-4 flex flex-col sm:flex-row gap-3 sm:gap-2 sm:justify-end">
						<button
							type="button"
							onClick={onCancel}
							className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-gray-700 bg-[#F5F2ED] border border-gray-300 rounded-2xl hover:bg-[#E3D9CD] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--pharmedice-blue)] transition-all duration-200"
						>
							{cancelText}
						</button>
						<button
							type="button"
							onClick={onConfirm}
							className={`w-full sm:w-auto px-4 py-2 text-sm font-medium text-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 ${confirmButton}`}
						>
							{confirmText}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
