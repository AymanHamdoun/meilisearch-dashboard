import { ErrorType } from '../../components/pages/instance/InstanceErrorPage';

export interface FetchError extends Error {
    errorType: ErrorType;
    originalError?: any;
}

const DEFAULT_TIMEOUT = 10000; // 10 seconds

export const fetchWithTimeout = async (
    url: string,
    options: RequestInit = {},
    timeout: number = DEFAULT_TIMEOUT
): Promise<Response> => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
        const response = await fetch(url, {
            ...options,
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        // Check for API key errors
        if (response.status === 401 || response.status === 403) {
            const data = await response.json();
            if (data.message?.toLowerCase().includes('api key') ||
                data.code === 'invalid_api_key' ||
                data.code === 'missing_authorization_header') {
                const error = new Error(data.message || 'Invalid API key') as FetchError;
                error.errorType = ErrorType.API_KEY;
                throw error;
            }
        }

        return response;
    } catch (error: any) {
        clearTimeout(timeoutId);

        // Already a FetchError with errorType
        if (error.errorType) {
            throw error;
        }

        // Timeout error
        if (error.name === 'AbortError') {
            const fetchError = new Error('Request timeout - Meilisearch instance is not responding') as FetchError;
            fetchError.errorType = ErrorType.TIMEOUT;
            fetchError.originalError = error;
            throw fetchError;
        }

        // Network/connection error
        if (error instanceof TypeError && (error.message.includes('fetch') || error.message.includes('Failed'))) {
            const fetchError = new Error('Failed to connect to Meilisearch instance') as FetchError;
            fetchError.errorType = ErrorType.CONNECTION;
            fetchError.originalError = error;
            throw fetchError;
        }

        // Unknown error
        const fetchError = new Error(error.message || 'Unknown error occurred') as FetchError;
        fetchError.errorType = ErrorType.UNKNOWN;
        fetchError.originalError = error;
        throw fetchError;
    }
};

// Helper function to handle API responses and navigate to error page if needed
export const handleApiResponse = async (response: Response, navigate?: (path: string, options?: any) => void) => {
    if (!response.ok) {
        const data = await response.json().catch(() => ({ message: 'Unknown error' }));

        // Check for API key errors
        if (response.status === 401 || response.status === 403) {
            if (data.message?.toLowerCase().includes('api key') ||
                data.code === 'invalid_api_key' ||
                data.code === 'missing_authorization_header') {
                if (navigate) {
                    navigate('/instance/error', { state: { errorType: ErrorType.API_KEY } });
                }
                throw new Error(data.message || 'Invalid API key');
            }
        }

        throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
};