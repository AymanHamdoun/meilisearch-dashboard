import React, { useMemo, useState } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
    LineChart, Line, Legend
} from 'recharts';
import { loadFromStorage, QueryLogEntry, getStorageKey } from '../../../../../hooks/useSearchQueryLog';
import useIndex from '../../../../../hooks/useMeiliIndex';

const BUCKET_COUNT = 24;

const bucketByHour = (entries: QueryLogEntry[]) => {
    const now = Date.now();
    const buckets: { count: number; totalMs: number }[] = Array.from({ length: BUCKET_COUNT }, () => ({ count: 0, totalMs: 0 }));
    entries.forEach(e => {
        const hoursAgo = Math.floor((now - e.timestamp) / (3600 * 1000));
        if (hoursAgo < BUCKET_COUNT) {
            const b = BUCKET_COUNT - 1 - hoursAgo;
            buckets[b].count++;
            buckets[b].totalMs += e.processingTimeMs;
        }
    });
    return buckets.map((d, i) => ({
        label: i === BUCKET_COUNT - 1 ? 'now' : `-${BUCKET_COUNT - 1 - i}h`,
        queries: d.count,
        avgMs: d.count > 0 ? Math.round(d.totalMs / d.count) : 0,
    }));
};

const getTopQueries = (entries: QueryLogEntry[]) => {
    const freq: Record<string, number> = {};
    entries.forEach(e => { const q = e.query || '(empty)'; freq[q] = (freq[q] ?? 0) + 1; });
    return Object.entries(freq).sort(([, a], [, b]) => b - a).slice(0, 10).map(([query, count]) => ({ query, count }));
};

const SearchAnalyticsDashboard: React.FC = () => {
    const { meiliIndexState } = useIndex() as any;
    const indexName: string = meiliIndexState?.selectedIndex || '';
    const [refreshKey, setRefreshKey] = useState(0);

    const entries = useMemo(() => loadFromStorage(indexName), [indexName, refreshKey]);
    const topQueries = useMemo(() => getTopQueries(entries), [entries]);
    const timeSeries = useMemo(() => bucketByHour(entries), [entries]);
    const zeroResultQueries = useMemo(() => entries.filter(e => e.resultCount === 0).slice(0, 20), [entries]);

    const totalQueries = entries.length;
    const zeroResultCount = entries.filter(e => e.resultCount === 0).length;
    const avgMs = totalQueries > 0 ? Math.round(entries.reduce((s, e) => s + e.processingTimeMs, 0) / totalQueries) : 0;

    const clearHistory = () => {
        try { localStorage.removeItem(getStorageKey(indexName)); } catch {}
        setRefreshKey(k => k + 1);
    };

    if (!indexName) return null;

    if (totalQueries === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-64 gap-3 text-center py-20">
                <svg className="w-12 h-12 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <p className="text-gray-500 font-medium">No query history yet</p>
                <p className="text-sm text-gray-400">Run some searches in the Browse tab — analytics accumulate automatically.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6">
            {/* Summary row */}
            <div className="flex flex-wrap gap-4">
                {[
                    { label: 'Total queries', value: totalQueries.toLocaleString(), warn: false },
                    { label: 'Avg response time', value: `${avgMs}ms`, warn: false },
                    { label: 'Zero-result queries', value: zeroResultCount.toLocaleString(), warn: zeroResultCount > 0 },
                    { label: 'Zero-result rate', value: `${totalQueries > 0 ? Math.round(zeroResultCount / totalQueries * 100) : 0}%`, warn: zeroResultCount > totalQueries * 0.1 },
                ].map(s => (
                    <div key={s.label} className="flex-1 min-w-32 border border-gray-100 rounded p-4 bg-white shadow-sm">
                        <p className="text-xs text-gray-400 mb-1">{s.label}</p>
                        <p className={`text-2xl font-semibold ${s.warn ? 'text-amber-600' : 'text-gray-800'}`}>{s.value}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top queries */}
                <div className="border border-gray-100 rounded p-4 bg-white shadow-sm">
                    <h3 className="text-sm font-semibold text-gray-700 mb-4">Top Queries (by frequency)</h3>
                    <ResponsiveContainer width="100%" height={220}>
                        <BarChart data={topQueries} layout="vertical" margin={{ left: 8, right: 24, top: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                            <XAxis type="number" tick={{ fontSize: 11 }} />
                            <YAxis type="category" dataKey="query" width={120} tick={{ fontSize: 11 }} />
                            <Tooltip formatter={(v: any) => [`${v} searches`, 'Count']} />
                            <Bar dataKey="count" fill="var(--color-primary, #6366f1)" radius={[0, 3, 3, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Time series */}
                <div className="border border-gray-100 rounded p-4 bg-white shadow-sm">
                    <h3 className="text-sm font-semibold text-gray-700 mb-4">Last 24 Hours</h3>
                    <ResponsiveContainer width="100%" height={220}>
                        <LineChart data={timeSeries} margin={{ left: 0, right: 16, top: 4, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="label" tick={{ fontSize: 10 }} interval={3} />
                            <YAxis yAxisId="count" tick={{ fontSize: 11 }} />
                            <YAxis yAxisId="ms" orientation="right" tick={{ fontSize: 11 }} unit="ms" />
                            <Tooltip />
                            <Legend />
                            <Line yAxisId="count" type="monotone" dataKey="queries" stroke="#6366f1" strokeWidth={2} dot={false} name="Queries" />
                            <Line yAxisId="ms" type="monotone" dataKey="avgMs" stroke="#f59e0b" strokeWidth={2} dot={false} name="Avg ms" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Zero-result queries */}
            {zeroResultQueries.length > 0 && (
                <div className="border border-gray-100 rounded p-4 bg-white shadow-sm">
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">
                        Zero-Result Queries
                        <span className="ml-2 text-xs font-normal text-gray-400">— investigate these to improve relevance</span>
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {zeroResultQueries.map((e, i) => (
                            <span key={i} className="font-mono text-xs bg-red-50 text-red-700 border border-red-100 px-2 py-0.5 rounded">
                                {e.query || '(empty)'}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            <div className="flex justify-end">
                <button onClick={clearHistory} className="text-xs text-gray-400 hover:text-red-500 transition-colors">
                    Clear analytics history for this index
                </button>
            </div>
        </div>
    );
};

export default SearchAnalyticsDashboard;
