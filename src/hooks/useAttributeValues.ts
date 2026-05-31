import { useState, useCallback } from 'react';
import { InstanceState } from '../contexts/InstanceContext';
import { facetSearch } from '../services/meilisearch/search';

interface AttrValueState {
    values: string[];
    loading: boolean;
    error: string | null;
}

export const useAttributeValues = (instance: InstanceState, indexName: string | null) => {
    const [cache, setCache] = useState<Record<string, AttrValueState>>({});

    const fetchValues = useCallback(async (attrName: string) => {
        if (cache[attrName]?.loading || (cache[attrName] && !cache[attrName].error && cache[attrName].values.length > 0)) return;
        setCache(prev => ({ ...prev, [attrName]: { values: [], loading: true, error: null } }));
        try {
            const resp = await facetSearch(instance, indexName ?? '', attrName);
            const values = (resp?.facetHits ?? []).map((h: any) => String(h.value)).slice(0, 12);
            setCache(prev => ({ ...prev, [attrName]: { values, loading: false, error: null } }));
        } catch (e: any) {
            setCache(prev => ({ ...prev, [attrName]: { values: [], loading: false, error: e.message ?? 'Failed' } }));
        }
    }, [instance, indexName, cache]);

    return { cache, fetchValues };
};
