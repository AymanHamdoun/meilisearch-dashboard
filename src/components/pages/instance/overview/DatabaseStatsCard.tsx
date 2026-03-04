import React from 'react';

interface DatabaseStatsCardProps {
    globalStats: {
        databaseSize: number;
        lastUpdate: string;
        indexes: Record<string, { numberOfDocuments: number; isIndexing: boolean }>;
    } | null;
}

const formatBytes = (bytes: number): string => {
    if (bytes >= 1e9) return (bytes / 1e9).toFixed(2) + ' GB';
    if (bytes >= 1e6) return (bytes / 1e6).toFixed(2) + ' MB';
    if (bytes >= 1e3) return (bytes / 1e3).toFixed(2) + ' KB';
    return bytes + ' B';
};

const DatabaseStatsCard: React.FC<DatabaseStatsCardProps> = ({ globalStats }) => {
    if (!globalStats) {
        return (
            <div className="bg-white rounded-lg shadow p-5">
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Database</h3>
                <div className="text-gray-400 text-sm">Stats unavailable</div>
            </div>
        );
    }

    const totalDocs = Object.values(globalStats.indexes).reduce(
        (sum, idx) => sum + idx.numberOfDocuments, 0
    );
    const indexCount = Object.keys(globalStats.indexes).length;

    return (
        <div className="bg-white rounded-lg shadow p-5">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Database</h3>
            <div className="space-y-3">
                <div>
                    <div className="text-2xl font-bold text-gray-800">{formatBytes(globalStats.databaseSize)}</div>
                    <div className="text-xs text-gray-400">Database size</div>
                </div>
                <div className="flex gap-6">
                    <div>
                        <div className="text-lg font-semibold text-gray-700">{totalDocs.toLocaleString()}</div>
                        <div className="text-xs text-gray-400">Total documents</div>
                    </div>
                    <div>
                        <div className="text-lg font-semibold text-gray-700">{indexCount}</div>
                        <div className="text-xs text-gray-400">Indexes</div>
                    </div>
                </div>
                {globalStats.lastUpdate && (
                    <div className="text-xs text-gray-400">
                        Last update: {new Date(globalStats.lastUpdate).toLocaleString()}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DatabaseStatsCard;
