import React, { useState } from 'react';
import { getDifferences, formatValue } from '../../../../utils/objectUtils';
import { getIndexSettings } from '../../../../services/meilisearch/settings';
import useMeiliInstance from '../../../../hooks/useMeiliInstance';
import useIndex from '../../../../hooks/useMeiliIndex';

const IndexSchemaComparison: React.FC = () => {
    const { instanceState } = useMeiliInstance();
    const { meiliIndexState } = useIndex() as any;
    const availableIndexes: string[] = (meiliIndexState?.availableIndexes ?? []).map((idx: any) =>
        typeof idx === 'string' ? idx : idx?.uid ?? ''
    ).filter(Boolean);

    const [leftIndex, setLeftIndex] = useState('');
    const [rightIndex, setRightIndex] = useState('');
    const [comparing, setComparing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [changes, setChanges] = useState<{ field: string; original: any; modified: any }[] | null>(null);
    const [leftLabel, setLeftLabel] = useState('');
    const [rightLabel, setRightLabel] = useState('');

    const handleCompare = async () => {
        if (!leftIndex || !rightIndex || leftIndex === rightIndex) return;
        setComparing(true);
        setError(null);
        setChanges(null);
        try {
            const [left, right] = await Promise.all([
                getIndexSettings({ host: instanceState.host, instanceKey: instanceState.key, indexName: leftIndex }),
                getIndexSettings({ host: instanceState.host, instanceKey: instanceState.key, indexName: rightIndex }),
            ]);
            setChanges(getDifferences(left, right));
            setLeftLabel(leftIndex);
            setRightLabel(rightIndex);
        } catch (e: any) {
            setError(e.message ?? 'Failed to fetch settings');
        } finally {
            setComparing(false);
        }
    };

    if (availableIndexes.length < 2) {
        return (
            <div className="border border-gray-100 rounded p-4 bg-white shadow-sm">
                <h2 className="text-lg font-semibold text-gray-800 mb-1">Index Settings Diff</h2>
                <p className="text-sm text-gray-400">At least 2 indexes are required to compare settings.</p>
            </div>
        );
    }

    return (
        <div className="border border-gray-100 rounded p-4 bg-white shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800 mb-1">Index Settings Diff</h2>
            <p className="text-sm text-gray-500 mb-4">Compare the configuration of two indexes side by side.</p>

            <div className="flex flex-wrap gap-3 mb-4">
                <div className="flex flex-col gap-1 flex-1 min-w-40">
                    <label className="text-xs text-gray-500 font-medium">Left (original)</label>
                    <select
                        value={leftIndex}
                        onChange={e => setLeftIndex(e.target.value)}
                        className="px-3 py-2 border border-gray-200 rounded text-sm"
                    >
                        <option value="">Select index…</option>
                        {availableIndexes.map(idx => <option key={idx} value={idx}>{idx}</option>)}
                    </select>
                </div>
                <div className="flex flex-col gap-1 flex-1 min-w-40">
                    <label className="text-xs text-gray-500 font-medium">Right (modified)</label>
                    <select
                        value={rightIndex}
                        onChange={e => setRightIndex(e.target.value)}
                        className="px-3 py-2 border border-gray-200 rounded text-sm"
                    >
                        <option value="">Select index…</option>
                        {availableIndexes.map(idx => <option key={idx} value={idx}>{idx}</option>)}
                    </select>
                </div>
                <div className="flex items-end">
                    <button
                        onClick={handleCompare}
                        disabled={!leftIndex || !rightIndex || leftIndex === rightIndex || comparing}
                        className="px-4 py-2 bg-primary text-white rounded text-sm hover:bg-opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                        {comparing ? 'Comparing…' : 'Compare →'}
                    </button>
                </div>
            </div>

            {error && (
                <div className="text-sm text-red-600 bg-red-50 rounded p-3 mb-3">{error}</div>
            )}

            {changes !== null && (
                <>
                    {changes.length === 0 ? (
                        <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 rounded p-3">
                            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                            <strong>{leftLabel}</strong> and <strong>{rightLabel}</strong> have identical settings.
                        </div>
                    ) : (
                        <div>
                            <p className="text-sm text-gray-600 font-medium mb-3">
                                {changes.length} difference{changes.length !== 1 ? 's' : ''} found between <span className="font-mono text-gray-800">{leftLabel}</span> and <span className="font-mono text-gray-800">{rightLabel}</span>
                            </p>
                            <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                                {changes.map((change, i) => (
                                    <div key={i} className="bg-gray-50 rounded-lg p-3">
                                        <code className="font-mono text-sm font-medium text-gray-800 block mb-2">{change.field}</code>
                                        <div className="flex flex-wrap items-start gap-2 text-sm">
                                            <span className="bg-red-100 text-red-700 px-2 py-1 rounded font-mono text-xs break-all">
                                                {formatValue(change.original)}
                                            </span>
                                            <span className="text-gray-400 mt-1">→</span>
                                            <span className="bg-green-100 text-green-700 px-2 py-1 rounded font-mono text-xs break-all">
                                                {formatValue(change.modified)}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default IndexSchemaComparison;
