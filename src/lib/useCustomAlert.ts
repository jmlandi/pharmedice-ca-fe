import { useAlert } from '@/components/AlertProvider';

/**
 * Utility hook that provides convenient alert functions
 * Can be used as a drop-in replacement for browser alerts
 *
 * @example
 * // Instead of: alert('Hello World')
 * // Use: showAlert('Hello World')
 *
 * // Instead of: confirm('Are you sure?')
 * // Use: showConfirm('Are you sure?', () => { ... })
 */
export function useCustomAlert() {
	const {
		showAlert,
		showSuccess,
		showError,
		showWarning,
		showInfo,
		showConfirm,
	} = useAlert();

	/**
	 * General purpose alert - replaces browser alert()
	 */
	const showCustomAlert = (
		message: string,
		type: 'success' | 'error' | 'warning' | 'info' = 'info'
	) => {
		showAlert(message, type);
	};

	/**
	 * Custom confirmation dialog replacement for browser confirm()
	 */
	const showCustomConfirm = (
		message: string,
		onConfirm: () => void,
		options?: {
			title?: string;
			onCancel?: () => void;
			confirmText?: string;
			cancelText?: string;
			type?: 'info' | 'warning' | 'error';
		}
	) => {
		showConfirm(message, onConfirm, options);
	};

	return {
		// Direct alert methods
		showAlert: showCustomAlert,
		showSuccess,
		showError,
		showWarning,
		showInfo,

		// Utility methods
		showConfirm: showCustomConfirm,

		// Aliases for easier migration from browser alerts
		alert: showCustomAlert,
		success: showSuccess,
		error: showError,
		warning: showWarning,
		info: showInfo,
		confirm: showCustomConfirm,
	};
}
