export class MeilisearchConnectionError extends Error {
    constructor(message: string, public originalError?: any) {
        super(message);
        this.name = 'MeilisearchConnectionError';
    }
}

export const handleApiError = (error: any, context: string = '') => {
    console.error(`API Error ${context}:`, error);

    // Check if it's a network/connection error
    if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new MeilisearchConnectionError(
            'Failed to connect to Meilisearch instance',
            error
        );
    }

    if (error.name === 'AbortError') {
        throw new MeilisearchConnectionError(
            'Connection timeout - Meilisearch instance is not responding',
            error
        );
    }

    // Re-throw the error to be caught by error boundary
    throw error;
};

export const createApiRequest = async (
    url: string,
    options: RequestInit,
    timeout: number = 10000
): Promise<Response> => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
        const response = await fetch(url, {
            ...options,
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok && response.status >= 500) {
            throw new MeilisearchConnectionError(
                `Server error: ${response.status} ${response.statusText}`
            );
        }

        return response;
    } catch (error) {
        clearTimeout(timeoutId);

        if (error instanceof TypeError || error.name === 'AbortError') {
            throw new MeilisearchConnectionError(
                'Cannot connect to Meilisearch instance',
                error
            );
        }

        throw error;
    }
};