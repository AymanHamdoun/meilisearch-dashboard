import React, { useState } from 'react';
import { DateTime, Duration } from 'luxon';
import { _api_batch_object } from "../../../../services/meilisearch/types";

interface BatchesTableProps {
    batches: _api_batch_object[];
    isLoading: boolean;
}

const BatchesTable: React.FC<BatchesTableProps> = ({ batches, isLoading }) => {
    const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());

    const toggleRowExpand = (uid: number) => {
        const newExpanded = new Set(expandedRows);
        if (newExpanded.has(uid)) {
            newExpanded.delete(uid);
        } else {
            newExpanded.add(uid);
        }
        setExpandedRows(newExpanded);
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return '-';
        return DateTime.fromISO(dateString, { zone: 'utc' }).toFormat('yyyy-MM-dd HH:mm:ss');
    };

    const formatDuration = (duration: string | null) => {
        if (!duration) return '-';
        const durationObj = Duration.fromISO(duration);
        const totalMs = durationObj.as('milliseconds');
        if (totalMs < 1000) return `${Math.round(totalMs)} ms`;
        return `${(totalMs / 1000).toFixed(3)} s`;
    };

    if (isLoading) {
        return <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">Loading batches...</div>;
    }

    if (batches.length === 0) {
        return (
            <div className="flex justify-center items-center py-12 bg-white rounded-lg shadow">
                <div className="text-gray-500">No batches found</div>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Batch</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tasks</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Started At</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Duration</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {batches.map((batch) => (
                        <React.Fragment key={batch.uid}>
                            <tr className="hover:bg-gray-50">
                                <td className="px-6 py-4 text-sm font-medium text-gray-900">#{batch.uid}</td>
                                <td className="px-6 py-4 text-sm text-gray-500">{batch.stats.totalNbTasks}</td>
                                <td className="px-6 py-4 text-sm text-gray-500">{formatDate(batch.startedAt)}</td>
                                <td className="px-6 py-4 text-sm text-gray-500">{formatDuration(batch.duration)}</td>
                                <td className="px-6 py-4 text-sm">
                                    <button
                                        className="text-primary hover:text-primary-dark"
                                        onClick={() => toggleRowExpand(batch.uid)}
                                    >
                                        {expandedRows.has(batch.uid) ? 'Hide' : 'Details'}
                                    </button>
                                </td>
                            </tr>
                            {expandedRows.has(batch.uid) && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-4 bg-gray-50">
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <span className="font-semibold">Status breakdown:</span>
                                                <div className="mt-1 flex gap-2 flex-wrap">
                                                    {Object.entries(batch.stats.status).map(([status, count]) => (
                                                        <span key={status} className="px-2 py-0.5 bg-gray-100 rounded text-xs">
                                                            {status}: {count}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                            <div>
                                                <span className="font-semibold">Types:</span>
                                                <div className="mt-1 flex gap-2 flex-wrap">
                                                    {Object.entries(batch.stats.types).map(([type, count]) => (
                                                        <span key={type} className="px-2 py-0.5 bg-gray-100 rounded text-xs">
                                                            {type}: {count}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                            <div>
                                                <span className="font-semibold">Indexes:</span>
                                                <div className="mt-1 flex gap-2 flex-wrap">
                                                    {Object.entries(batch.stats.indexUids).map(([idx, count]) => (
                                                        <span key={idx} className="px-2 py-0.5 bg-gray-100 rounded text-xs">
                                                            {idx}: {count}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                            <div>
                                                <span className="font-semibold">Finished:</span>
                                                <span className="ml-2 text-gray-600">{formatDate(batch.finishedAt)}</span>
                                            </div>
                                        </div>
                                        {batch.details && Object.keys(batch.details).length > 0 && (
                                            <div className="mt-3 bg-white p-3 rounded border border-gray-200">
                                                <span className="font-semibold text-sm">Details:</span>
                                                <pre className="mt-2 text-xs text-gray-600 overflow-x-auto">
                                                    {JSON.stringify(batch.details, null, 2)}
                                                </pre>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            )}
                        </React.Fragment>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default BatchesTable;
