import React from 'react';
import { Link } from 'react-router-dom';

interface MetricsPreviewCardProps {
    metricsRaw: string | null;
}

interface SimpleMetric {
    name: string;
    help: string;
    value: string;
}

const parseKeyMetrics = (raw: string): SimpleMetric[] => {
    const metrics: SimpleMetric[] = [];
    const lines = raw.split('\n');
    let currentName = '';
    let currentHelp = '';
    let currentType = '';

    for (const line of lines) {
        if (line.startsWith('# HELP ')) {
            const rest = line.slice(7);
            const spaceIdx = rest.indexOf(' ');
            currentName = rest.slice(0, spaceIdx);
            currentHelp = rest.slice(spaceIdx + 1);
        } else if (line.startsWith('# TYPE ')) {
            const rest = line.slice(7);
            const spaceIdx = rest.indexOf(' ');
            currentType = rest.slice(spaceIdx + 1);
        } else if (line && !line.startsWith('#') && currentType === 'gauge') {
            const match = line.match(/^([^{}\s]+)\s+(.+)$/);
            if (match && metrics.length < 3) {
                metrics.push({
                    name: currentName,
                    help: currentHelp,
                    value: match[2],
                });
            }
        }
    }

    return metrics;
};

const formatValue = (value: string): string => {
    const num = parseFloat(value);
    if (isNaN(num)) return value;
    if (num >= 1e9) return (num / 1e9).toFixed(2) + 'G';
    if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
    if (num % 1 !== 0) return num.toFixed(2);
    return num.toLocaleString();
};

const MetricsPreviewCard: React.FC<MetricsPreviewCardProps> = ({ metricsRaw }) => {
    if (!metricsRaw) return null;

    const keyMetrics = parseKeyMetrics(metricsRaw);
    if (keyMetrics.length === 0) return null;

    return (
        <div className="bg-white rounded-lg shadow p-5">
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Metrics</h3>
                <Link to="/instance/features/metrics" className="text-xs text-primary hover:underline">View all</Link>
            </div>
            <div className="space-y-3">
                {keyMetrics.map(metric => (
                    <div key={metric.name} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 truncate mr-2" title={metric.help}>{metric.help}</span>
                        <span className="text-sm font-semibold text-gray-800 whitespace-nowrap">{formatValue(metric.value)}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MetricsPreviewCard;
