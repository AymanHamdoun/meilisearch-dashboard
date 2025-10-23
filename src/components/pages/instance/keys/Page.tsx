import React, { useState, useEffect } from 'react';
import useMeiliInstance from '../../../../hooks/useMeiliInstance';
import { KeyResource, CreateKeyPayload, listKeys, createKey, deleteKey } from '../../../../services/meilisearch/keys';
import ConfirmationModal from '../../../commons/ConfirmationModal';
import KeysTable from './KeysTable';
import ViewKeyModal from './ViewKeyModal';
import AddKeyModal from './AddKeyModal';

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

    const totalPages = Math.ceil(pagination.total / pagination.limit);
    const currentPage = Math.floor(pagination.offset / pagination.limit) + 1;

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
            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
                    <div className="flex">
                        <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        <div className="ml-3">
                            <p className="text-sm text-red-700">{error}</p>
                            <button
                                onClick={handleRefresh}
                                className="mt-2 text-sm text-red-600 hover:text-red-500 underline"
                            >
                                Try again
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Stats */}
            {!isLoading && !error && (
                <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded-lg shadow border">
                        <div className="text-2xl font-bold text-gray-900">{pagination.total}</div>
                        <div className="text-sm text-gray-600">Total Keys</div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow border">
                        <div className="text-2xl font-bold text-gray-900">
                            {keys.filter(k => k.expiresAt && new Date(k.expiresAt) < new Date()).length}
                        </div>
                        <div className="text-sm text-gray-600">Expired Keys</div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow border">
                        <div className="text-2xl font-bold text-gray-900">
                            {keys.filter(k => !k.expiresAt).length}
                        </div>
                        <div className="text-sm text-gray-600">Never Expires</div>
                    </div>
                </div>
            )}

            {/* Keys Table */}
            <div className="mb-6">
                <KeysTable
                    keys={keys}
                    isLoading={isLoading}
                    onViewDetails={handleViewDetails}
                    onDelete={handleDeleteRequest}
                />
            </div>

            {/* Pagination */}
            {!isLoading && !error && totalPages > 1 && (
                <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-700">
                        Showing {pagination.offset + 1} to {Math.min(pagination.offset + pagination.limit, pagination.total)} of {pagination.total} results
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={prevPage}
                            disabled={pagination.offset === 0}
                            className="px-3 py-2 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Previous
                        </button>
                        <span className="px-3 py-2 text-sm text-gray-700">
                            Page {currentPage} of {totalPages}
                        </span>
                        <button
                            onClick={nextPage}
                            disabled={pagination.offset + pagination.limit >= pagination.total}
                            className="px-3 py-2 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}

            {/* Modals */}
            <AddKeyModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSubmit={handleCreateKey}
            />

            <ViewKeyModal
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