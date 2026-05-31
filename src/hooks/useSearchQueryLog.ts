import { useState, useCallback } from 'react';

export interface QueryLogEntry {
    query: string;
    filter: string;
    sort: string;
    resultCount: number;
    processingTimeMs: number;
    timestamp: number;
}

export const useSearchQueryLog = () => {
    const [entries, setEntries] = useState<QueryLogEntry[]>([]);

    const record = useCallback((entry: QueryLogEntry) => {
        setEntries(prev => [entry, ...prev].slice(0, 50));
    }, []);

    const clear = useCallback(() => setEntries([]), []);

    return { entries, record, clear };
};
