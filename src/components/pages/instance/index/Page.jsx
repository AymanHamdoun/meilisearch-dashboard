import React, { useEffect, useState } from "react";

import IndexManager from "./IndexManager";
import IndexTabs from "./IndexTabs";
import { getIndexStats, getIndex } from "../../../../services/meilisearch/indexes.ts";

import useIndex from '../../../../hooks/useMeiliIndex'
import useMeiliInstance from "../../../../hooks/useMeiliInstance";

const Page = () => {
    return <div className="p-4 rounded-lg dark:border-gray-700 mt-2">
        <IndexStats />
        <IndexManager/>
        <IndexTabs/>
    </div>
}

const IndexStats = () => {
    const { meiliIndexState, refreshIndexes } = useIndex()
    const { instanceState } = useMeiliInstance()

    const [stats, setStats] = useState({})
    const [meta, setMeta] = useState(null)

    const indexName = meiliIndexState.selectedIndex

    useEffect(() => {
        if (!instanceState.isLoaded || !indexName) return;

        Promise.all([
            getIndexStats(instanceState.host, instanceState.key, indexName),
            getIndex(instanceState, indexName),
        ])
            .then(([s, m]) => {
                setStats(s);
                setMeta(m);
            })
            .catch(async (error) => {
                if (error.code === 'index_not_found') {
                    await refreshIndexes();
                    setStats({});
                    setMeta(null);
                } else {
                    console.error('Error fetching index stats:', error);
                }
            });
    }, [instanceState, indexName])

    const fieldCount = stats.fieldDistribution ? Object.keys(stats.fieldDistribution).length : null;

    const formatDate = (iso) => {
        if (!iso) return null;
        try {
            return new Date(iso).toLocaleString(undefined, {
                month: 'short', day: 'numeric', year: 'numeric',
                hour: '2-digit', minute: '2-digit',
            });
        } catch {
            return iso;
        }
    };

    return (
        <div className="mb-6">
            <div className="flex items-center gap-3 mb-3">
                <h3 className="text-3xl font-semibold">Index</h3>
                {stats.isIndexing && (
                    <span className="flex items-center gap-1.5 text-xs text-blue-600 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse inline-block" />
                        Indexing…
                    </span>
                )}
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-gray-500">
                <span>
                    <span className="font-semibold text-gray-700">{stats.numberOfDocuments !== undefined ? stats.numberOfDocuments.toLocaleString() : '—'}</span>
                    {' '}records
                </span>
                {fieldCount !== null && (
                    <span>
                        <span className="font-semibold text-gray-700">{fieldCount}</span>
                        {' '}fields
                    </span>
                )}
                {meta?.primaryKey && (
                    <span>
                        primary key: <span className="font-mono text-xs bg-gray-100 px-1 py-0.5 rounded text-gray-700">{meta.primaryKey}</span>
                    </span>
                )}
                {meta?.updatedAt && (
                    <span>updated {formatDate(meta.updatedAt)}</span>
                )}
            </div>
        </div>
    )
}

export default Page;
