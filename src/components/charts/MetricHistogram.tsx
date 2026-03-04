import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface HistogramBucket {
    label: string;
    value: number;
}

interface MetricHistogramProps {
    buckets: HistogramBucket[];
    title: string;
    color?: string;
}

const MetricHistogram: React.FC<MetricHistogramProps> = ({ buckets, title, color = '#8b5cf6' }) => {
    if (buckets.length === 0) return null;

    return (
        <div className="bg-white rounded-lg shadow p-4">
            <h3 className="font-medium text-gray-800 text-sm mb-3">{title}</h3>
            <ResponsiveContainer width="100%" height={200}>
                <BarChart data={buckets} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                        dataKey="label"
                        tick={{ fontSize: 10, fill: '#6b7280' }}
                        tickLine={false}
                        axisLine={{ stroke: '#e5e7eb' }}
                    />
                    <YAxis
                        tick={{ fontSize: 10, fill: '#6b7280' }}
                        tickLine={false}
                        axisLine={{ stroke: '#e5e7eb' }}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#fff',
                            border: '1px solid #e5e7eb',
                            borderRadius: '0.5rem',
                            fontSize: '0.8rem'
                        }}
                    />
                    <Bar dataKey="value" fill={color} radius={[2, 2, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default MetricHistogram;
