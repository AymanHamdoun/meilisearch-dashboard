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
import PageHeader from './PageHeader';

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
            <PageHeader
                onRefresh={handleRefresh}
                onAddKey={() => setIsAddModalOpen(true)}
                isLoading={isLoading}
            />

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