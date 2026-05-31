import { useState, useCallback, useRef } from 'react';
import { InstanceState } from '../contexts/InstanceContext';
import { facetSearch } from '../services/meilisearch/search';

interface AttrValueState {
    values: string[];
    loading: boolean;
    error: string | null;
}

export const useAttributeValues = (instance: InstanceState, indexName: string | null) => {
    const [cache, setCache] = useState<Record<string, AttrValueState>>({});
    // Stable ref so fetchValues never needs to depend on cache state
    const cacheRef = useRef(cache);
    cacheRef.current = cache;

    const fetchValues = useCallback(async (attrName: string) => {
        const current = cacheRef.current[attrName];
        if (current?.loading || (current && !current.error && current.values.length > 0)) return;

        setCache(prev => ({ ...prev, [attrName]: { values: [], loading: true, error: null } }));
        try {
            const resp = await facetSearch(instance, indexName ?? '', attrName);
            const values = (resp?.facetHits ?? []).map((h: any) => String(h.value)).slice(0, 12);
            setCache(prev => ({ ...prev, [attrName]: { values, loading: false, error: null } }));
        } catch (e: any) {
            setCache(prev => ({ ...prev, [attrName]: { values: [], loading: false, error: e.message ?? 'Failed' } }));
        }
    // Stable: only recreated when instance or indexName change, not when cache updates
    }, [instance, indexName]);

    return { cache, fetchValues };
};
