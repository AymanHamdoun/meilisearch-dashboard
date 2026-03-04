import React, { useState, useEffect } from 'react';
import useMeiliInstance from '../../../../hooks/useMeiliInstance';
import { listIndexes } from '../../../../services/meilisearch/indexes';
import { exportBlueprint, downloadBlueprint, ExportOptions } from '../../../../services/blueprint';

const ExportSection: React.FC = () => {
    const { instanceState } = useMeiliInstance();
    const [availableIndexes, setAvailableIndexes] = useState<string[]>([]);
    const [selectedIndexes, setSelectedIndexes] = useState<Record<string, boolean>>({});
    const [includeSettings, setIncludeSettings] = useState(true);
    const [includeDocuments, setIncludeDocuments] = useState(false);
    const [includeFeatures, setIncludeFeatures] = useState(true);
    const [maxDocsPerIndex, setMaxDocsPerIndex] = useState(100);
    const [isExporting, setIsExporting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!instanceState.isLoaded) return;
        listIndexes(instanceState.host, instanceState.key)
            .then((data) => {
                const indexes = (data?.results || data || []).map((i: any) => i.uid);
                setAvailableIndexes(indexes);
                const selected: Record<string, boolean> = {};
                indexes.forEach((uid: string) => { selected[uid] = true; });
                setSelectedIndexes(selected);
            })
            .catch(() => {});
    }, [instanceState]);

    const handleSelectAll = (checked: boolean) => {
        const updated: Record<string, boolean> = {};
        availableIndexes.forEach(uid => { updated[uid] = checked; });
        setSelectedIndexes(updated);
    };

    const handleExport = async () => {
        setIsExporting(true);
        setError(null);

        try {
            const options: ExportOptions = {
                includeSettings,
                includeDocuments,
                includeExperimentalFeatures: includeFeatures,
                selectedIndexes: availableIndexes.filter(uid => selectedIndexes[uid]),
                maxDocumentsPerIndex: maxDocsPerIndex,
            };
            const blueprint = await exportBlueprint(instanceState, options);
            downloadBlueprint(blueprint);
        } catch (err: any) {
            setError(err.message || 'Export failed');
        } finally {
            setIsExporting(false);
        }
    };

    const selectedCount = availableIndexes.filter(uid => selectedIndexes[uid]).length;

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Export Blueprint</h2>

            <div className="space-y-4">
                {/* Options */}
                <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm">
                        <input type="checkbox" checked={includeSettings} onChange={e => setIncludeSettings(e.target.checked)} className="rounded" />
                        Include index settings
                    </label>
                    <label className="flex items-center gap-2 text-sm">
                        <input type="checkbox" checked={includeDocuments} onChange={e => setIncludeDocuments(e.target.checked)} className="rounded" />
                        Include documents
                    </label>
                    {includeDocuments && (
                        <div className="ml-6">
                            <label className="text-sm text-gray-600">
                                Max documents per index:
                                <input
                                    type="number"
                                    value={maxDocsPerIndex}
                                    onChange={e => setMaxDocsPerIndex(parseInt(e.target.value) || 0)}
                                    min={0}
                                    max={10000}
                                    className="ml-2 w-24 px-2 py-1 border border-gray-300 rounded text-sm"
                                />
                            </label>
                        </div>
                    )}
                    <label className="flex items-center gap-2 text-sm">
                        <input type="checkbox" checked={includeFeatures} onChange={e => setIncludeFeatures(e.target.checked)} className="rounded" />
                        Include experimental features
                    </label>
                </div>

                {/* Index selection */}
                {availableIndexes.length > 0 && (
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-sm font-medium text-gray-700">Indexes ({selectedCount}/{availableIndexes.length})</h3>
                            <div className="flex gap-2">
                                <button onClick={() => handleSelectAll(true)} className="text-xs text-primary hover:underline">Select all</button>
                                <button onClick={() => handleSelectAll(false)} className="text-xs text-gray-400 hover:underline">Select none</button>
                            </div>
                        </div>
                        <div className="border border-gray-200 rounded p-2 max-h-40 overflow-y-auto space-y-1">
                            {availableIndexes.map(uid => (
                                <label key={uid} className="flex items-center gap-2 text-sm py-0.5">
                                    <input
                                        type="checkbox"
                                        checked={selectedIndexes[uid] || false}
                                        onChange={e => setSelectedIndexes(prev => ({ ...prev, [uid]: e.target.checked }))}
                                        className="rounded"
                                    />
                                    {uid}
                                </label>
                            ))}
                        </div>
                    </div>
                )}

                {error && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-600">{error}</div>
                )}

                <button
                    onClick={handleExport}
                    disabled={isExporting || selectedCount === 0}
                    className="w-full py-2 px-4 bg-primary text-white rounded hover:bg-opacity-90 disabled:opacity-50 transition-colors"
                >
                    {isExporting ? 'Exporting...' : `Export Blueprint (${selectedCount} indexes)`}
                </button>
            </div>
        </div>
    );
};

export default ExportSection;
