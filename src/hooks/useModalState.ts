import { useState, useCallback } from 'react';

interface UseModalStateOptions<T = any> {
    initialValues?: T;
    onReset?: () => void;
}

export const useModalState = <T = any>(options?: UseModalStateOptions<T>) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const resetState = useCallback(() => {
        setIsLoading(false);
        setError(null);
        setSuccess(false);
        // Call custom reset if provided
        options?.onReset?.();
    }, [options]);

    const handleAsyncOperation = async (
        operation: () => Promise<void>,
        onSuccess?: () => void,
        onClose?: () => void,
        successDelay: number = 1000
    ) => {
        setIsLoading(true);
        setError(null);
        setSuccess(false);

        try {
            await operation();
            setSuccess(true);

            // Call success callback if provided
            onSuccess?.();

            // Auto-close after showing success
            if (onClose) {
                setTimeout(() => {
                    resetState();
                    onClose();
                }, successDelay);
            }
        } catch (error: any) {
            setError(error.message || 'Operation failed');
            setIsLoading(false);
        }
    };

    return {
        isLoading,
        error,
        success,
        setError,
        resetState,
        handleAsyncOperation
    };
};

export default useModalState;