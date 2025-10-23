import React, { useState, useEffect } from 'react';
import useMeiliInstance from '../../../../hooks/useMeiliInstance';
import { KeyResource, CreateKeyPayload, listKeys, createKey, deleteKey } from '../../../../services/meilisearch/keys';
import ConfirmationModal from '../../../commons/ConfirmationModal';
import PageKeysTable from './PageKeysTable';
import PageViewKeyModal from './PageViewKeyModal';
import PageAddKeyModal from './PageAddKeyModal';
import PageErrorDisplay from './PageErrorDisplay';
import PageKeysStats from './PageKeysStats';
import PagePaginationControls from './PagePaginationControls';

const KeysPage: React.FC = () => {
    const { instanceState } = useMeiliInstance();

    const [keys, setKeys] = useState<KeyResource[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Modal states
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedKey, setSelectedKey] = useState<KeyResource | null>(null);

    // Pagination state
    const [pagination, setPagination] = useState({
        offset: 0,
        limit: 20,
        total: 0
    });

    const fetchKeys = async () => {
        if (!instanceState.host || !instanceState.key) return;

        try {
            setIsLoading(true);
            setError(null);
            const response = await listKeys(instanceState.host, instanceState.key, pagination.limit, pagination.offset);
            setKeys(response.results);
            setPagination(prev => ({ ...prev, total: response.total }));
        } catch (err) {
            console.error('Failed to fetch keys:', err);
            setError(err instanceof Error ? err.message : 'Failed to fetch keys');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchKeys();
    }, [instanceState.host, instanceState.key, pagination.offset, pagination.limit]);

    const handleCreateKey = async (payload: CreateKeyPayload) => {
        if (!instanceState.host || !instanceState.key) return;

        try {
            const newKey = await createKey(instanceState.host, instanceState.key, payload);
            console.log(`API key "${newKey.name || 'Unnamed'}" created successfully`);
            await fetchKeys(); // Refresh the list
        } catch (err) {
            console.error('Failed to create key:', err);
            throw err; // Re-throw to let the modal handle it
        }
    };

    const handleViewDetails = (key: KeyResource) => {
        setSelectedKey(key);
        setIsViewModalOpen(true);
    };

    const handleDeleteRequest = (key: KeyResource) => {
        setSelectedKey(key);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!selectedKey || !instanceState.host || !instanceState.key) return;

        try {
            await deleteKey(instanceState.host, instanceState.key, selectedKey.uid);
            console.log(`API key "${selectedKey.name || 'Unnamed'}" deleted successfully`);
            setIsDeleteModalOpen(false);
            setSelectedKey(null);
            await fetchKeys(); // Refresh the list
        } catch (err) {
            console.error('Failed to delete key:', err);
        }
    };

    const handleRefresh = () => {
        fetchKeys();
    };

    const nextPage = () => {
        if (pagination.offset + pagination.limit < pagination.total) {
            setPagination(prev => ({ ...prev, offset: prev.offset + prev.limit }));
        }
    };

    const prevPage = () => {
        if (pagination.offset > 0) {
            setPagination(prev => ({ ...prev, offset: Math.max(0, prev.offset - prev.limit) }));
        }
    };

    return (
        <div className="container mx-auto px-4 py-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-2">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 text-center md:text-left">API Keys</h1>
                    <p className="text-gray-600 mt-1">
                        Manage API keys for your Meilisearch instance
                    </p>
                </div>
                <div className="flex gap-2 flex-row">
                    <button
                        onClick={handleRefresh}
                        className="px-4 py-2 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary flex items-center gap-2"
                        disabled={isLoading}
                    >
                        <svg className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Refresh
                    </button>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="px-4 py-2 text-sm bg-primary text-white rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary flex items-center gap-2"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                        </svg>
                        Add Key
                    </button>
                </div>
            </div>

            {/* Error Display */}
            {error && <PageErrorDisplay error={error} onRetry={handleRefresh} />}

            {/* Stats */}
            <PageKeysStats
                keys={keys}
                total={pagination.total}
                isLoading={isLoading}
                error={error}
            />

            {/* Keys Table */}
            <div className="mb-6">
                <PageKeysTable
                    keys={keys}
                    isLoading={isLoading}
                    onViewDetails={handleViewDetails}
                    onDelete={handleDeleteRequest}
                />
            </div>

            {/* Pagination */}
            {!isLoading && !error && (
                <PagePaginationControls
                    offset={pagination.offset}
                    limit={pagination.limit}
                    total={pagination.total}
                    onPrevPage={prevPage}
                    onNextPage={nextPage}
                />
            )}

            {/* Modals */}
            <PageAddKeyModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSubmit={handleCreateKey}
            />

            <PageViewKeyModal
                isOpen={isViewModalOpen}
                onClose={() => {
                    setIsViewModalOpen(false);
                    setSelectedKey(null);
                }}
                apiKey={selectedKey}
            />

            <ConfirmationModal
                isVisible={isDeleteModalOpen}
                onClose={() => {
                    setIsDeleteModalOpen(false);
                    setSelectedKey(null);
                }}
                onConfirm={handleConfirmDelete}
                message={`Are you sure you want to delete the API key "${selectedKey?.name || 'Unnamed'}"?`}
                description="This action cannot be undone."
                confirmButtonText="Delete"
                confirmButtonColor="red"
            />
        </div>
    );
};

export default KeysPage;