import React, { useState, useEffect, useCallback } from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer,
} from 'recharts';
import { getTasks } from '../../services/meilisearch/tasks';
import useMeiliInstance from '../../hooks/useMeiliInstance';

export const TYPE_COLORS: Record<string, string> = {
    documentAdditionOrUpdate: '#5a67f2',
    documentDeletion:         '#f43f5e',
    documentDeletionByFilter: '#fb923c',
    settingsUpdate:           '#f59e0b',
    indexCreation:            '#22c55e',
    indexUpdate:              '#16a34a',
    indexDeletion:            '#ef4444',
    indexSwap:                '#06b6d4',
    taskCancelation:          '#a78bfa',
    taskDeletion:             '#6b7280',
    dumpCreation:             '#4b5563',
    snapshotCreation:         '#0ea5e9',
};

export const TYPE_LABELS: Record<string, string> = {
    documentAdditionOrUpdate: 'Doc Add/Update',
    documentDeletion:         'Doc Delete',
    documentDeletionByFilter: 'Doc Delete (Filter)',
    settingsUpdate:           'Settings Update',
    indexCreation:            'Index Create',
    indexUpdate:              'Index Update',
    indexDeletion:            'Index Delete',
    indexSwap:                'Index Swap',
    taskCancelation:          'Task Cancel',
    taskDeletion:             'Task Delete',
    dumpCreation:             'Dump Create',
    snapshotCreation:         'Snapshot Create',
};

type TimeRange = '24h' | '7d' | '30d';

const getRangeStart = (range: TimeRange): Date => {
    const now = new Date();
    if (range === '24h') return new Date(now.getTime() - 24 * 3_600_000);
    if (range === '7d')  return new Date(now.getTime() - 7  * 86_400_000);
    return new Date(now.getTime() - 30 * 86_400_000);
};

const bucketKey = (date: Date, range: TimeRange): string => {
    const m = date.getMonth() + 1;
    const d = date.getDate();
    if (range === '24h') return `${m}/${d} ${String(date.getHours()).padStart(2, '0')}:00`;
    return `${m}/${d}`;
};

const generateBuckets = (range: TimeRange): string[] => {
    const buckets: string[] = [];
    const now = new Date();
    if (range === '24h') {
        for (let i = 23; i >= 0; i--) {
            buckets.push(bucketKey(new Date(now.getTime() - i * 3_600_000), range));
        }
    } else {
        const days = range === '7d' ? 7 : 30;
        for (let i = days - 1; i >= 0; i--) {
            buckets.push(bucketKey(new Date(now.getTime() - i * 86_400_000), range));
        }
    }
    return buckets;
};

const TaskTimeSeriesChart: React.FC = () => {
    const { instanceState } = useMeiliInstance();
    const [range, setRange]           = useState<TimeRange>('7d');
    const [chartData, setChartData]   = useState<any[]>([]);
    const [presentTypes, setPresentTypes] = useState<string[]>([]);
    const [hiddenTypes, setHiddenTypes]   = useState<Set<string>>(new Set());
    const [isLoading, setIsLoading]   = useState(false);
    const [truncated, setTruncated]   = useState(false);

    const fetchData = useCallback(async () => {
        if (!instanceState.isLoaded) return;
        setIsLoading(true);
        try {
            const resp = await getTasks(instanceState, {
                limit: 1000,
                afterEnqueuedAt: getRangeStart(range).toISOString(),
            });

            setTruncated(resp.total > 1000);

            const buckets = generateBuckets(range);
            const bucketMap: Record<string, Record<string, number>> = {};
            buckets.forEach(b => { bucketMap[b] = {}; });

            const typesFound = new Set<string>();
            for (const task of resp.results) {
                const key = bucketKey(new Date(task.enqueuedAt), range);
                if (bucketMap[key] !== undefined) {
                    bucketMap[key][task.type] = (bucketMap[key][task.type] ?? 0) + 1;
                    typesFound.add(task.type);
                }
            }

            const types = Array.from(typesFound).sort();
            setPresentTypes(types);
            // preserve existing hidden selections for types that are still present
            setHiddenTypes(prev => new Set([...prev].filter(t => types.includes(t))));
            setChartData(buckets.map(b => ({ time: b, ...bucketMap[b] })));
        } catch (e) {
            console.error('Failed to fetch task time series:', e);
        } finally {
            setIsLoading(false);
        }
    }, [instanceState, range]);

    useEffect(() => { fetchData(); }, [fetchData]);

    const toggleType = (type: string) => {
        setHiddenTypes(prev => {
            const next = new Set(prev);
            next.has(type) ? next.delete(type) : next.add(type);
            return next;
        });
    };

    const isolateType = (type: string) => {
        const allOthersHidden = presentTypes.filter(t => t !== type).every(t => hiddenTypes.has(t));
        setHiddenTypes(allOthersHidden ? new Set() : new Set(presentTypes.filter(t => t !== type)));
    };

    const visibleTypes = presentTypes.filter(t => !hiddenTypes.has(t));
    const isEmpty = chartData.length === 0 || presentTypes.length === 0;

    return (
        <div className="bg-white rounded-lg shadow p-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Tasks Over Time
                </div>
                <div className="flex items-center gap-2">
                    {truncated && (
                        <span className="text-xs text-amber-500">showing first 1,000 tasks in range</span>
                    )}
                    <div className="flex rounded border border-gray-200 overflow-hidden text-xs">
                        {(['24h', '7d', '30d'] as TimeRange[]).map(r => (
                            <button
                                key={r}
                                onClick={() => setRange(r)}
                                className={`px-3 py-1.5 transition-colors ${
                                    range === r
                                        ? 'bg-primary text-white'
                                        : 'bg-white text-gray-500 hover:bg-gray-50'
                                }`}
                            >
                                {r}
                            </button>
                        ))}
                    </div>
                    <button
                        onClick={fetchData}
                        disabled={isLoading}
                        title="Refresh"
                        className="text-sm text-gray-400 hover:text-gray-600 disabled:opacity-40 px-1"
                    >
                        ↻
                    </button>
                </div>
            </div>

            {/* Type filter pills */}
            {presentTypes.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-4">
                    {presentTypes.map(type => {
                        const hidden = hiddenTypes.has(type);
                        return (
                            <button
                                key={type}
                                onClick={() => toggleType(type)}
                                onDoubleClick={() => isolateType(type)}
                                title="Click to toggle · Double-click to isolate"
                                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-all select-none ${
                                    hidden
                                        ? 'border-gray-200 bg-white text-gray-400'
                                        : 'border-transparent text-white'
                                }`}
                                style={hidden ? {} : { backgroundColor: TYPE_COLORS[type] ?? '#9ca3af' }}
                            >
                                <span
                                    className="w-2 h-2 rounded-full inline-block flex-shrink-0"
                                    style={{ backgroundColor: TYPE_COLORS[type] ?? '#9ca3af', opacity: hidden ? 0.3 : 1 }}
                                />
                                {TYPE_LABELS[type] ?? type}
                            </button>
                        );
                    })}
                </div>
            )}

            {/* Chart */}
            {isLoading ? (
                <div className="flex items-center justify-center h-56 text-gray-400 text-sm">Loading…</div>
            ) : isEmpty ? (
                <div className="flex items-center justify-center h-56 text-gray-400 text-sm">
                    No tasks in this time range
                </div>
            ) : (
                <ResponsiveContainer width="100%" height={280}>
                    <LineChart data={chartData} margin={{ top: 4, right: 16, left: 0, bottom: 4 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis
                            dataKey="time"
                            tick={{ fontSize: 10, fill: '#9ca3af' }}
                            tickLine={false}
                            axisLine={{ stroke: '#e5e7eb' }}
                            interval="preserveStartEnd"
                        />
                        <YAxis
                            tick={{ fontSize: 10, fill: '#9ca3af' }}
                            tickLine={false}
                            axisLine={{ stroke: '#e5e7eb' }}
                            allowDecimals={false}
                            width={32}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#fff',
                                border: '1px solid #e5e7eb',
                                borderRadius: '0.5rem',
                                fontSize: '0.75rem',
                            }}
                            labelStyle={{ fontWeight: 600, color: '#374151', marginBottom: 4 }}
                            formatter={(value: number, name: string) => [value, TYPE_LABELS[name] ?? name]}
                            itemSorter={(item: any) => -(item.value ?? 0)}
                        />
                        {visibleTypes.map(type => (
                            <Line
                                key={type}
                                type="monotone"
                                dataKey={type}
                                stroke={TYPE_COLORS[type] ?? '#9ca3af'}
                                strokeWidth={2}
                                dot={false}
                                activeDot={{ r: 4, strokeWidth: 0 }}
                                connectNulls={false}
                            />
                        ))}
                    </LineChart>
                </ResponsiveContainer>
            )}

            <p className="text-xs text-gray-400 mt-2">
                Click a pill to toggle · double-click to isolate
            </p>
        </div>
    );
};

export default TaskTimeSeriesChart;
