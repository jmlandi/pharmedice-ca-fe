import { useLoading } from '@/components/LoadingProvider';
import { useCallback } from 'react';

interface UseAsyncLoadingOptions {
	onSuccess?: () => void;
	onError?: (error: any) => void;
	showGlobalLoading?: boolean;
}

export function useAsyncLoading() {
	const { startLoading, stopLoading } = useLoading();

	const executeWithLoading = useCallback(
		async <T>(
			asyncFunction: () => Promise<T>,
			options: UseAsyncLoadingOptions = {}
		): Promise<T | null> => {
			const { onSuccess, onError, showGlobalLoading = true } = options;

			if (showGlobalLoading) {
				startLoading();
			}

			try {
				const result = await asyncFunction();
				onSuccess?.();
				return result;
			} catch (error) {
				onError?.(error);
				console.error('Async operation failed:', error);
				return null;
			} finally {
				if (showGlobalLoading) {
					stopLoading();
				}
			}
		},
		[startLoading, stopLoading]
	);

	return { executeWithLoading, startLoading, stopLoading };
}
