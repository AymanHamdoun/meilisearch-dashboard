export const getErrorMessage = (error: Error | unknown, defaultContext: string = 'Operation'): string => {
    const errorMessage = error instanceof Error ? error.message : String(error);

    // Authentication errors
    if (errorMessage.includes('401') || errorMessage.includes('Unauthorized')) {
        return `Authentication failed. Please check your API key.`;
    }

    // Permission errors
    if (errorMessage.includes('403') || errorMessage.includes('Forbidden')) {
        return `Insufficient permissions. Please check your API key permissions.`;
    }

    // Network errors
    if (errorMessage.includes('network') || errorMessage.includes('fetch') || errorMessage.includes('ECONNREFUSED')) {
        return `Network error. Please check your connection to Meilisearch.`;
    }

    // Timeout errors
    if (errorMessage.includes('timeout') || errorMessage.includes('ETIMEDOUT')) {
        return `Request timed out. The server might be busy or unresponsive.`;
    }

    // Not found errors
    if (errorMessage.includes('404') || errorMessage.includes('Not Found')) {
        return `Resource not found. Please check if the endpoint exists.`;
    }

    // Server errors
    if (errorMessage.includes('500') || errorMessage.includes('Internal Server Error')) {
        return `Server error. Please try again later or contact support.`;
    }

    // Default message with context
    return `${defaultContext} failed: ${errorMessage}`;
};

export const isNetworkError = (error: Error | unknown): boolean => {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return errorMessage.includes('network') ||
           errorMessage.includes('fetch') ||
           errorMessage.includes('ECONNREFUSED') ||
           errorMessage.includes('ETIMEDOUT');
};

export const isAuthError = (error: Error | unknown): boolean => {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return errorMessage.includes('401') ||
           errorMessage.includes('403') ||
           errorMessage.includes('Unauthorized') ||
           errorMessage.includes('Forbidden');
};