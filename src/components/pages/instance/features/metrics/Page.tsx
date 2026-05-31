import React, { useState, useEffect, useMemo } from 'react';
import useMeiliInstance from '../../../../../hooks/useMeiliInstance';
import { getMetrics } from '../../../../../services/meilisearch/metrics';
import { getTaskTypeStats, getTaskStats, TASK_TYPES } from '../../../../../services/meilisearch/tasks';
import MetricGaugeCard from '../../../../charts/MetricGaugeCard';
import MetricBarChart from '../../../../charts/MetricBarChart';
import MetricHistogram from '../../../../charts/MetricHistogram';
import TaskTypeChart from '../../../../charts/TaskTypeChart';
import TaskTimeSeriesChart from '../../../../charts/TaskTimeSeriesChart';
import HelpPanel from '../../../../commons/HelpPanel';
import { useDocs } from '../../../../../contexts/DocsContext';

interface ParsedMetric {
    name: string;
    help: string;
    type: string;
    values: Array<{ labels: string; value: string }>;
}

const parsePrometheusMetrics = (raw: string): ParsedMetric[] => {
    const metrics: ParsedMetric[] = [];
    const lines = raw.split('\n');
    let current: ParsedMetric | null = null;

    for (const line of lines) {
        if (line.startsWith('# HELP ')) {
            const rest = line.slice(7);
            const spaceIdx = rest.indexOf(' ');
            const name = rest.slice(0, spaceIdx);
            const help = rest.slice(spaceIdx + 1);
            current = { name, help, type: '', values: [] };
            metrics.push(current);
        } else if (line.startsWith('# TYPE ')) {
            const rest = line.slice(7);
            const spaceIdx = rest.indexOf(' ');
            const type = rest.slice(spaceIdx + 1);
            if (current) current.type = type;
        } else if (line && !line.startsWith('#') && current) {
            const match = line.match(/^([^{}\s]+)(\{([^}]*)\})?\s+(.+)$/);
            if (match) {
                current.values.push({
                    labels: match[3] || '',
                    value: match[4],
                });
            }
        }
    }

    return metrics;
};

const formatValue = (value: string): string => {
    const num = parseFloat(value);
    if (isNaN(num)) return value;
    if (num >= 1e9) return (num / 1e9).toFixed(2) + ' G';
    if (num >= 1e6) return (num / 1e6).toFixed(2) + ' M';
    if (num >= 1e3) return (num / 1e3).toFixed(2) + ' K';
    if (num % 1 !== 0) return num.toFixed(4);
    return num.toLocaleString();
};

const isHistogram = (metric: ParsedMetric): boolean => {
    return metric.type === 'histogram' && metric.values.some(v => v.labels.includes('le='));
};

const getHistogramBuckets = (metric: ParsedMetric) => {
    return metric.values
        .filter(v => v.labels.includes('le=') && !v.labels.includes('le="+Inf"'))
        .map(v => {
            const leMatch = v.labels.match(/le="([^"]+)"/);
            return {
                label: leMatch ? leMatch[1] : '',
                value: parseFloat(v.value),
            };
        });
};

const hasMultipleLabels = (metric: ParsedMetric): boolean => {
    return metric.values.length > 1 && metric.values.some(v => v.labels);
};

const getBarChartData = (metric: ParsedMetric) => {
    return metric.values.map(v => ({
        label: v.labels || metric.name,
        value: parseFloat(v.value),
    }));
};

type ViewMode = 'charts' | 'table';

const AdvancedMetricsPage: React.FC = () => {
    const { instanceState } = useMeiliInstance();
    const [rawMetrics, setRawMetrics] = useState<string>('');
    const [parsedMetrics, setParsedMetrics] = useState<ParsedMetric[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showRaw, setShowRaw] = useState(false);
    const [metricViewModes, setMetricViewModes] = useState<Record<string, ViewMode>>({});
    const [taskTypeStats, setTaskTypeStats] = useState<Record<string, number> | null>(null);
    const [taskStatusStats, setTaskStatusStats] = useState<Record<string, number> | null>(null);

    const fetchMetrics = () => {
        if (!instanceState.isLoaded) return;
        setIsLoading(true);
        setError(null);

        Promise.allSettled([
            getMetrics(instanceState),
            getTaskTypeStats(instanceState),
            getTaskStats(instanceState),
        ])
            .then(([metricsResult, typeResult, statusResult]) => {
                if (metricsResult.status === 'fulfilled') {
                    setRawMetrics(metricsResult.value);
                    setParsedMetrics(parsePrometheusMetrics(metricsResult.value));
                } else {
                    setError(metricsResult.reason?.message || 'Failed to load Prometheus metrics');
                }
                if (typeResult.status === 'fulfilled') setTaskTypeStats(typeResult.value);
                if (statusResult.status === 'fulfilled') setTaskStatusStats(statusResult.value);
                setIsLoading(false);
            });
    };

    useEffect(() => {
        fetchMetrics();
    }, [instanceState.isLoaded, instanceState.host, instanceState.key]);

    const toggleMetricView = (name: string) => {
        setMetricViewModes(prev => ({
            ...prev,
            [name]: prev[name] === 'table' ? 'charts' : 'table',
        }));
    };

    const getViewMode = (name: string): ViewMode => metricViewModes[name] || 'charts';

    let featureDoc = undefined;
    try { const { getFeatureDoc } = useDocs(); featureDoc = getFeatureDoc('metrics'); } catch {}

    const gaugeMetrics = useMemo(() => parsedMetrics.filter(m => m.type === 'gauge' && m.values.length === 1), [parsedMetrics]);
    const histogramMetrics = useMemo(() => parsedMetrics.filter(m => isHistogram(m)), [parsedMetrics]);
    const counterMetrics = useMemo(() => parsedMetrics.filter(m => m.type === 'counter' && hasMultipleLabels(m)), [parsedMetrics]);
    const otherMetrics = useMemo(() => parsedMetrics.filter(m =>
        !(m.type === 'gauge' && m.values.length === 1) &&
        !isHistogram(m) &&
        !(m.type === 'counter' && hasMultipleLabels(m))
    ), [parsedMetrics]);

    return (
        <div className="px-4 py-5">
            <div className="mb-8">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-3xl font-semibold">Advanced Metrics</h1>
                            <span className="px-3 py-1 text-sm font-medium rounded-full bg-yellow-100 text-yellow-800">
                                Experimental
                            </span>
                        </div>
                        <p className="text-gray-600">Prometheus-compatible analytics and performance metrics</p>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setShowRaw(!showRaw)}
                            className="px-3 py-2 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50"
                        >
                            {showRaw ? 'Parsed View' : 'Raw View'}
                        </button>
                        <button
                            onClick={fetchMetrics}
                            disabled={isLoading}
                            className="px-3 py-2 text-sm bg-primary text-white rounded hover:bg-opacity-90 disabled:opacity-50"
                        >
                            {isLoading ? 'Refreshing...' : 'Refresh'}
                        </button>
                    </div>
                </div>
                <HelpPanel featureDoc={featureDoc} />
            </div>

            {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">{error}</div>
            )}

            {isLoading ? (
                <div className="bg-white rounded-lg shadow p-6 text-center py-12 text-gray-500">
                    Loading metrics...
                </div>
            ) : showRaw ? (
                <div className="bg-white rounded-lg shadow p-6">
                    <pre className="text-xs font-mono whitespace-pre-wrap overflow-x-auto text-gray-700 max-h-[600px] overflow-y-auto">
                        {rawMetrics}
                    </pre>
                </div>
            ) : (
                <div className="flex flex-col gap-6">
                    {/* Task Activity — always shown, no experimental feature required */}
                    <div>
                        <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Task Activity</h2>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                            {/* Write / status highlight gauges */}
                            <div className="flex flex-col gap-4">
                                <div className="bg-white rounded-lg shadow p-4">
                                    <div className="text-xs text-gray-400 uppercase tracking-wide mb-1">Document Writes</div>
                                    <div className="text-3xl font-bold text-primary">
                                        {taskTypeStats
                                            ? (taskTypeStats['documentAdditionOrUpdate'] ?? 0).toLocaleString()
                                            : '—'}
                                    </div>
                                    <div className="text-xs text-gray-400 mt-1">documentAdditionOrUpdate tasks (cumulative)</div>
                                </div>
                                <div className="bg-white rounded-lg shadow p-4">
                                    <div className="text-xs text-gray-400 uppercase tracking-wide mb-2">By Status</div>
                                    {taskStatusStats ? (
                                        <div className="flex flex-col gap-1.5">
                                            {Object.entries(taskStatusStats).filter(([, v]) => v > 0).map(([status, count]) => {
                                                const colors: Record<string, string> = {
                                                    succeeded: 'bg-green-500', failed: 'bg-red-500',
                                                    enqueued: 'bg-amber-400', processing: 'bg-blue-500', canceled: 'bg-gray-400',
                                                };
                                                const total = Object.values(taskStatusStats).reduce((a, b) => a + b, 0) || 1;
                                                return (
                                                    <div key={status} className="flex items-center gap-2 text-xs">
                                                        <span className="w-20 text-gray-500 capitalize">{status}</span>
                                                        <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                                                            <div
                                                                className={`h-full rounded-full ${colors[status] ?? 'bg-gray-400'}`}
                                                                style={{ width: `${(count / total) * 100}%` }}
                                                            />
                                                        </div>
                                                        <span className="w-16 text-right text-gray-500">{count.toLocaleString()}</span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <span className="text-gray-400 text-sm">Loading…</span>
                                    )}
                                </div>
                            </div>

                            {/* Task type breakdown bar chart */}
                            <div className="lg:col-span-2 bg-white rounded-lg shadow p-4">
                                <div className="text-xs text-gray-400 uppercase tracking-wide mb-3">Breakdown by Type</div>
                                {taskTypeStats ? (
                                    <TaskTypeChart stats={taskTypeStats} />
                                ) : (
                                    <div className="flex items-center justify-center h-32 text-gray-400 text-sm">Loading…</div>
                                )}
                            </div>
                        </div>

                        {/* Tasks over time line chart */}
                        <TaskTimeSeriesChart />
                    </div>

                    {/* Gauge metrics as cards */}
                    {gaugeMetrics.length > 0 && (
                        <div>
                            <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Gauges</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {gaugeMetrics.map(metric => (
                                    <MetricGaugeCard
                                        key={metric.name}
                                        title={metric.help}
                                        value={metric.values[0].value}
                                        metricName={metric.name}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Histogram metrics as bar charts */}
                    {histogramMetrics.length > 0 && (
                        <div>
                            <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Histograms</h2>
                            <div className={`grid gap-4 ${histogramMetrics.length === 1 ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-2'}`}>
                                {histogramMetrics.map(metric => (
                                    <div key={metric.name}>
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-xs text-gray-400 font-mono">{metric.name}</span>
                                            <button
                                                onClick={() => toggleMetricView(metric.name)}
                                                className="text-xs text-gray-400 hover:text-gray-600"
                                            >
                                                {getViewMode(metric.name) === 'charts' ? 'Table' : 'Chart'}
                                            </button>
                                        </div>
                                        {getViewMode(metric.name) === 'charts' ? (
                                            <MetricHistogram
                                                buckets={getHistogramBuckets(metric)}
                                                title={metric.help}
                                            />
                                        ) : (
                                            <MetricTable metric={metric} />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Counter metrics with multiple labels as bar charts */}
                    {counterMetrics.length > 0 && (
                        <div>
                            <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Counters</h2>
                            <div className={`grid gap-4 ${counterMetrics.length === 1 ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-2'}`}>
                                {counterMetrics.map(metric => (
                                    <div key={metric.name}>
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-xs text-gray-400 font-mono">{metric.name}</span>
                                            <button
                                                onClick={() => toggleMetricView(metric.name)}
                                                className="text-xs text-gray-400 hover:text-gray-600"
                                            >
                                                {getViewMode(metric.name) === 'charts' ? 'Table' : 'Chart'}
                                            </button>
                                        </div>
                                        {getViewMode(metric.name) === 'charts' ? (
                                            <MetricBarChart
                                                data={getBarChartData(metric)}
                                                title={metric.help}
                                                color="#3b82f6"
                                            />
                                        ) : (
                                            <MetricTable metric={metric} />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Other metrics as tables */}
                    {otherMetrics.length > 0 && (
                        <div>
                            <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Other Metrics</h2>
                            {otherMetrics.map(metric => (
                                <MetricTable key={metric.name} metric={metric} />
                            ))}
                        </div>
                    )}

                    {parsedMetrics.length === 0 && (
                        <div className="bg-white rounded-lg shadow p-6 text-center py-12">
                            <p className="text-gray-500">
                                No metrics data available. Make sure the metrics experimental feature is enabled.
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

const MetricTable: React.FC<{ metric: ParsedMetric }> = ({ metric }) => (
    <div className="bg-white rounded-lg shadow p-4 mb-4">
        <div className="flex items-center gap-2 mb-2">
            <h3 className="font-medium text-gray-800 font-mono text-sm">{metric.name}</h3>
            <span className="px-2 py-0.5 text-xs rounded bg-gray-100 text-gray-500">{metric.type}</span>
        </div>
        <p className="text-sm text-gray-500 mb-3">{metric.help}</p>
        {metric.values.length > 0 && (
            <div className="border border-gray-200 rounded overflow-hidden">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-gray-50 text-left text-gray-600">
                            {metric.values.some(v => v.labels) && (
                                <th className="py-2 px-3 font-medium">Labels</th>
                            )}
                            <th className="py-2 px-3 font-medium text-right">Value</th>
                        </tr>
                    </thead>
                    <tbody>
                        {metric.values.map((v, i) => (
                            <tr key={i} className="border-t border-gray-100">
                                {metric.values.some(v => v.labels) && (
                                    <td className="py-2 px-3 font-mono text-xs text-gray-600">{v.labels || '-'}</td>
                                )}
                                <td className="py-2 px-3 text-right font-mono">{formatValue(v.value)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )}
    </div>
);

export default AdvancedMetricsPage;
