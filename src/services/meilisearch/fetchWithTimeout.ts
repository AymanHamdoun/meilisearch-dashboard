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

        // If we got a response from the server, even if it's an error,
        // it means Meilisearch is reachable. Return the response and let
        // the caller handle API-level errors.
        // Only throw for specific auth errors that should redirect to error page
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

        // For all other responses (including 404, 400, 500 etc),
        // return the response as-is since the server is reachable
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