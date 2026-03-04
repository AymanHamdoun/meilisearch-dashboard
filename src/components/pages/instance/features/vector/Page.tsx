import React, { useState, useEffect } from 'react';
import useMeiliInstance from '../../../../../hooks/useMeiliInstance';
import useMeiliIndex from '../../../../../hooks/useMeiliIndex';
import { similarDocuments } from '../../../../../services/meilisearch/search';
import { getIndexSettings } from '../../../../../services/meilisearch/settings';
import { ApiSettingsEmbedder } from '../../../../../services/meilisearch/types';
import HelpPanel from '../../../../commons/HelpPanel';
import { useDocs } from '../../../../../contexts/DocsContext';

const VectorStorePage: React.FC = () => {
    const { instanceState } = useMeiliInstance();
    const { meiliIndexState } = useMeiliIndex();
    const indexName = meiliIndexState.selectedIndex;

    const [embedders, setEmbedders] = useState<Record<string, ApiSettingsEmbedder> | null>(null);
    const [docId, setDocId] = useState('');
    const [embedder, setEmbedder] = useState('');
    const [results, setResults] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!instanceState.isLoaded || !indexName) return;
        getIndexSettings({ host: instanceState.host, instanceKey: instanceState.key, indexName })
            .then((settings: any) => {
                setEmbedders(settings.embedders || null);
                if (settings.embedders) {
                    const keys = Object.keys(settings.embedders);
                    if (keys.length > 0) setEmbedder(keys[0]);
                }
            })
            .catch(() => {});
    }, [instanceState, indexName]);

    const handleSearch = async () => {
        if (!docId.trim()) return;
        setIsLoading(true);
        setError(null);
        try {
            const resp = await similarDocuments(instanceState, indexName, docId.trim(), {
                embedder: embedder || undefined,
                limit: 10
            });
            setResults(resp.hits || []);
        } catch (err: any) {
            setError(err.message || 'Failed to find similar documents');
            setResults([]);
        } finally {
            setIsLoading(false);
        }
    };

    const embedderKeys = embedders ? Object.keys(embedders) : [];
    let featureDoc = undefined;
    try { const { getFeatureDoc } = useDocs(); featureDoc = getFeatureDoc('vectorStore'); } catch {}

    return (
        <div className="px-4 py-5">
            <div className="mb-8">
                <h1 className="text-3xl font-semibold mb-2">Vector Store</h1>
                <p className="text-gray-600">Semantic search with vector embeddings</p>
            </div>

            <HelpPanel featureDoc={featureDoc} />

            {/* Embedder Status */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
                <h2 className="text-lg font-semibold mb-3">Embedder Configuration</h2>
                {!indexName ? (
                    <p className="text-gray-500">Select an index to view embedder configuration.</p>
                ) : !embedders || embedderKeys.length === 0 ? (
                    <div className="text-gray-500">
                        <p>No embedders configured for index "{indexName}".</p>
                        <p className="text-sm mt-1">Configure embedders in the index settings to enable vector search.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {embedderKeys.map(key => (
                            <div key={key} className="border border-gray-200 rounded p-3">
                                <h3 className="font-medium text-gray-800">{key}</h3>
                                <div className="text-sm text-gray-500 mt-1">
                                    <div>Source: <span className="font-mono">{embedders[key].source}</span></div>
                                    {embedders[key].model && <div>Model: <span className="font-mono">{embedders[key].model}</span></div>}
                                    {embedders[key].dimensions && <div>Dimensions: {embedders[key].dimensions}</div>}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Similar Documents Search */}
            {embedderKeys.length > 0 && (
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-lg font-semibold mb-3">Find Similar Documents</h2>
                    <div className="flex flex-col gap-3">
                        <div className="flex gap-3">
                            <input
                                type="text"
                                value={docId}
                                onChange={(e) => setDocId(e.target.value)}
                                placeholder="Document ID"
                                className="flex-1 p-2 border border-gray-300 rounded"
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            />
                            {embedderKeys.length > 1 && (
                                <select
                                    value={embedder}
                                    onChange={(e) => setEmbedder(e.target.value)}
                                    className="p-2 border border-gray-300 rounded"
                                >
                                    {embedderKeys.map(k => <option key={k} value={k}>{k}</option>)}
                                </select>
                            )}
                            <button
                                onClick={handleSearch}
                                disabled={isLoading || !docId.trim()}
                                className="px-4 py-2 bg-primary text-white rounded hover:bg-opacity-90 disabled:opacity-50"
                            >
                                {isLoading ? 'Searching...' : 'Search'}
                            </button>
                        </div>

                        {error && (
                            <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-600">{error}</div>
                        )}

                        {results.length > 0 && (
                            <div className="flex flex-col gap-3 mt-3">
                                {results.map((hit, i) => (
                                    <div key={i} className="border border-gray-200 rounded p-3">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-sm text-gray-400">#{i + 1}</span>
                                            {hit._rankingScore && (
                                                <span className="text-xs text-gray-400">Score: {hit._rankingScore.toFixed(4)}</span>
                                            )}
                                        </div>
                                        <pre className="text-xs text-gray-600 overflow-x-auto whitespace-pre-wrap">
                                            {JSON.stringify(Object.fromEntries(Object.entries(hit).filter(([k]) => !k.startsWith('_'))), null, 2)}
                                        </pre>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default VectorStorePage;
