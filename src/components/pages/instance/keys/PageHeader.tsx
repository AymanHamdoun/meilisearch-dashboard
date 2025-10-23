import React from 'react';

interface PageHeaderProps {
    onRefresh: () => void;
    onAddKey: () => void;
    isLoading: boolean;
}

const PageHeader: React.FC<PageHeaderProps> = ({ onRefresh, onAddKey, isLoading }) => {
    return (
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-2">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 text-center md:text-left">API Keys</h1>
                <p className="text-gray-600 mt-1">
                    Manage API keys for your Meilisearch instance
                </p>
            </div>
            <div className="flex gap-2 flex-row">
                <button
                    onClick={onRefresh}
                    className="px-4 py-2 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary flex items-center gap-2"
                    disabled={isLoading}
                >
                    <svg className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Refresh
                </button>
                <button
                    onClick={onAddKey}
                    className="px-4 py-2 text-sm bg-primary text-white rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary flex items-center gap-2"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                    Add Key
                </button>
            </div>
        </div>
    );
};

export default PageHeader;