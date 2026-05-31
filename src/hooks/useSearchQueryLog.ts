import { useState, useCallback, useEffect } from 'react';

export interface QueryLogEntry {
    query: string;
    filter: string;
    sort: string;
    resultCount: number;
    processingTimeMs: number;
    timestamp: number;
}

const PRUNE_AFTER_MS = 30 * 24 * 60 * 60 * 1000; // 30 days
const MAX_ENTRIES = 500;

const getStorageKey = (indexName: string) => `meili-query-log-${indexName}`;

const loadFromStorage = (indexName: string): QueryLogEntry[] => {
    try {
        const raw = localStorage.getItem(getStorageKey(indexName));
        if (!raw) return [];
        const cutoff = Date.now() - PRUNE_AFTER_MS;
        return (JSON.parse(raw) as QueryLogEntry[]).filter(e => e.timestamp > cutoff);
    } catch {
        return [];
    }
};

export const useSearchQueryLog = (indexName?: string) => {
    const key = indexName || '';
    const [entries, setEntries] = useState<QueryLogEntry[]>(() => key ? loadFromStorage(key) : []);

    useEffect(() => {
        if (!key) return;
        setEntries(loadFromStorage(key));
    }, [key]);

    useEffect(() => {
        if (!key) return;
        try {
            localStorage.setItem(getStorageKey(key), JSON.stringify(entries.slice(0, MAX_ENTRIES)));
        } catch {}
    }, [entries, key]);

    const record = useCallback((entry: QueryLogEntry) => {
        setEntries(prev => [entry, ...prev].slice(0, MAX_ENTRIES));
    }, []);

    const clear = useCallback(() => {
        setEntries([]);
        if (key) {
            try { localStorage.removeItem(getStorageKey(key)); } catch {}
        }
    }, [key]);

    return { entries, record, clear };
};

export { loadFromStorage, getStorageKey };
