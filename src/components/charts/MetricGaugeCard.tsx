import React from 'react';

interface MetricGaugeCardProps {
    title: string;
    value: string | number;
    subtitle?: string;
    metricName?: string;
    color?: string;
}

const formatDisplayValue = (value: string | number): string => {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(num)) return String(value);
    if (num >= 1e9) return (num / 1e9).toFixed(2) + ' G';
    if (num >= 1e6) return (num / 1e6).toFixed(2) + ' M';
    if (num >= 1e3) return (num / 1e3).toFixed(2) + ' K';
    if (num % 1 !== 0) return num.toFixed(4);
    return num.toLocaleString();
};

const MetricGaugeCard: React.FC<MetricGaugeCardProps> = ({
    title,
    value,
    subtitle,
    metricName,
    color = '#5a67f2'
}) => {
    return (
        <div className="bg-white rounded-lg shadow p-4 flex flex-col justify-between">
            <div className="text-sm text-gray-500 mb-1 truncate" title={title}>
                {title}
            </div>
            <div className="flex items-end gap-2">
                <div className="text-2xl font-semibold text-gray-800">
                    {formatDisplayValue(value)}
                </div>
                <div
                    className="w-2 h-8 rounded-full mb-0.5"
                    style={{ backgroundColor: color, opacity: 0.3 }}
                />
            </div>
            {subtitle && (
                <div className="text-xs text-gray-400 mt-1">{subtitle}</div>
            )}
            {metricName && (
                <div className="text-xs text-gray-400 font-mono mt-1">{metricName}</div>
            )}
        </div>
    );
};

export default MetricGaugeCard;
