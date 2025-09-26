import { useState } from 'react';

export const useModalState = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const resetState = () => {
        setIsLoading(false);
        setError(null);
        setSuccess(false);
    };

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

            if (onSuccess) {
                onSuccess();
            }

            // Auto-close after showing success
            if (onClose) {
                setTimeout(() => {
                    onClose();
                    resetState();
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