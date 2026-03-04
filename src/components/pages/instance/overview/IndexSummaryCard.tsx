import React from 'react';
import { Link } from 'react-router-dom';

interface IndexItem {
    uid: string;
    primaryKey: string | null;
    createdAt: string;
    updatedAt: string;
}

interface IndexSummaryCardProps {
    indexes: IndexItem[] | null;
    globalStats: {
        indexes: Record<string, { numberOfDocuments: number; isIndexing: boolean }>;
    } | null;
}

const IndexSummaryCard: React.FC<IndexSummaryCardProps> = ({ indexes, globalStats }) => {
    if (!indexes) {
        return (
            <div className="bg-white rounded-lg shadow p-5">
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Indexes</h3>
                <div className="text-gray-400 text-sm">Index data unavailable</div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow p-5">
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Indexes</h3>
                <span className="text-sm font-medium text-gray-700">{indexes.length} total</span>
            </div>
            {indexes.length === 0 ? (
                <div className="text-gray-400 text-sm">No indexes created yet</div>
            ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                    {indexes.map(index => {
                        const stats = globalStats?.indexes?.[index.uid];
                        return (
                            <Link
                                key={index.uid}
                                to="/instance/index"
                                className="flex items-center justify-between p-2 rounded hover:bg-gray-50 transition-colors group"
                            >
                                <div className="flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 group-hover:text-primary">
                                        <ellipse cx="12" cy="5" rx="9" ry="3"/>
                                        <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/>
                                        <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
                                    </svg>
                                    <span className="text-sm font-medium text-gray-700 group-hover:text-primary">{index.uid}</span>
                                </div>
                                <span className="text-xs text-gray-400">
                                    {stats ? `${stats.numberOfDocuments.toLocaleString()} docs` : '-'}
                                </span>
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default IndexSummaryCard;
