import React, { useState, useEffect } from 'react';
import useMeiliInstance from '../../../../../hooks/useMeiliInstance';
import { getMetrics } from '../../../../../services/meilisearch/metrics';

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

const AdvancedMetricsPage: React.FC = () => {
    const { instanceState } = useMeiliInstance();
    const [rawMetrics, setRawMetrics] = useState<string>('');
    const [parsedMetrics, setParsedMetrics] = useState<ParsedMetric[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showRaw, setShowRaw] = useState(false);

    const fetchMetrics = () => {
        if (!instanceState.isLoaded) return;
        setIsLoading(true);
        setError(null);

        getMetrics(instanceState)
            .then((data) => {
                setRawMetrics(data);
                setParsedMetrics(parsePrometheusMetrics(data));
                setIsLoading(false);
            })
            .catch((err) => {
                setError(err.message || 'Failed to load metrics');
                setIsLoading(false);
            });
    };

    useEffect(() => {
        fetchMetrics();
    }, [instanceState]);

    return (
        <div className="px-4 py-5">
            <div className="mb-8 flex items-center justify-between">
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
                <div className="flex flex-col gap-4">
                    {/* Summary cards for key metrics */}
                    {parsedMetrics.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {parsedMetrics
                                .filter(m => m.type === 'gauge' && m.values.length === 1)
                                .slice(0, 6)
                                .map(metric => (
                                    <div key={metric.name} className="bg-white rounded-lg shadow p-4">
                                        <div className="text-sm text-gray-500 mb-1 truncate" title={metric.help}>
                                            {metric.help}
                                        </div>
                                        <div className="text-2xl font-semibold text-gray-800">
                                            {formatValue(metric.values[0].value)}
                                        </div>
                                        <div className="text-xs text-gray-400 font-mono mt-1">{metric.name}</div>
                                    </div>
                                ))}
                        </div>
                    )}

                    {/* All metrics table */}
                    {parsedMetrics.map(metric => (
                        <div key={metric.name} className="bg-white rounded-lg shadow p-4">
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
                    ))}

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

export default AdvancedMetricsPage;
