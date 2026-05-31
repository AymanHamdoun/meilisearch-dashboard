import React, { useState } from 'react';
import { QueryLogEntry } from '../../../../../hooks/useSearchQueryLog';

interface QueryLogPanelProps {
    entries: QueryLogEntry[];
    onReplay: (entry: QueryLogEntry) => void;
    onClear: () => void;
}

const QueryLogPanel: React.FC<QueryLogPanelProps> = ({ entries, onReplay, onClear }) => {
    const [open, setOpen] = useState(false);

    if (entries.length === 0) return null;

    return (
        <div className="mt-6 border border-gray-200 rounded text-sm">
            <button
                onClick={() => setOpen(o => !o)}
                className="w-full flex items-center justify-between px-4 py-2.5 text-gray-500 hover:bg-gray-50 rounded"
            >
                <span className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Query History <span className="text-xs text-gray-400 font-normal">({entries.length})</span>
                </span>
                <span className="flex items-center gap-2">
                    <span className="text-xs text-gray-400">click row to replay</span>
                    <svg className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                </span>
            </button>

            {open && (
                <div className="border-t border-gray-100">
                    <div className="flex justify-end px-4 py-1.5 bg-gray-50 border-b border-gray-100">
                        <button onClick={onClear} className="text-xs text-gray-400 hover:text-red-500 transition-colors">
                            Clear history
                        </button>
                    </div>
                    <div className="overflow-y-auto max-h-64">
                        <table className="w-full text-xs">
                            <thead>
                                <tr className="text-gray-400 border-b border-gray-100">
                                    <th className="text-left px-4 py-2 font-medium">Query</th>
                                    <th className="text-left px-4 py-2 font-medium hidden md:table-cell">Filter</th>
                                    <th className="text-right px-4 py-2 font-medium">Results</th>
                                    <th className="text-right px-4 py-2 font-medium hidden sm:table-cell">Time</th>
                                    <th className="text-right px-4 py-2 font-medium">At</th>
                                </tr>
                            </thead>
                            <tbody>
                                {entries.map((e, i) => (
                                    <tr
                                        key={i}
                                        onClick={() => onReplay(e)}
                                        className="border-t border-gray-50 hover:bg-primary/5 cursor-pointer group"
                                    >
                                        <td className="px-4 py-2">
                                            {e.query ? (
                                                <span className="font-mono text-gray-700 group-hover:text-primary">{e.query}</span>
                                            ) : (
                                                <span className="text-gray-300 italic">empty</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-2 text-gray-400 font-mono truncate max-w-[160px] hidden md:table-cell">
                                            {e.filter || '—'}
                                        </td>
                                        <td className={`px-4 py-2 text-right font-medium ${e.resultCount === 0 ? 'text-red-400' : 'text-gray-700'}`}>
                                            {e.resultCount === 0 && (
                                                <span className="mr-1 text-red-300">⚠</span>
                                            )}
                                            {e.resultCount.toLocaleString()}
                                        </td>
                                        <td className="px-4 py-2 text-right text-gray-400 hidden sm:table-cell">
                                            {e.processingTimeMs}ms
                                        </td>
                                        <td className="px-4 py-2 text-right text-gray-400 whitespace-nowrap">
                                            {new Date(e.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default QueryLogPanel;
