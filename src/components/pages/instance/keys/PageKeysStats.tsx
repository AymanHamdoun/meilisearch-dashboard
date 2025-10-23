import React from 'react';
import { KeyResource } from '../../../../services/meilisearch/keys';

interface KeysStatsProps {
    keys: KeyResource[];
    total: number;
    isLoading: boolean;
    error: string | null;
}

interface StatCardProps {
    title: string;
    value: number;
}

const StatCard: React.FC<StatCardProps> = ({ title, value }) => (
    <div className="bg-white p-4 rounded-lg shadow border">
        <div className="text-2xl font-bold text-gray-900">{value}</div>
        <div className="text-sm text-gray-600">{title}</div>
    </div>
);

const PageKeysStats: React.FC<KeysStatsProps> = ({ keys, total, isLoading, error }) => {
    if (isLoading || error) {
        return null;
    }

    const expiredKeysCount = keys.filter(k =>
        k.expiresAt && new Date(k.expiresAt) < new Date()
    ).length;

    const neverExpiresCount = keys.filter(k => !k.expiresAt).length;

    return (
        <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard title="Total Keys" value={total} />
            <StatCard title="Expired Keys" value={expiredKeysCount} />
            <StatCard title="Never Expires" value={neverExpiresCount} />
        </div>
    );
};

export default PageKeysStats;