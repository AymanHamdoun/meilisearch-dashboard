import React, { useState } from 'react';
import { DateTime } from 'luxon';
import { MeiliKey } from '../../../../services/meilisearch/keys';
import { getPermissionByValue } from '../../../../constants/permissions';
import { BaseModal } from '../../../commons/modal/ModalComponents';

interface ViewKeyModalProps {
    isOpen: boolean;
    onClose: () => void;
    apiKey: MeiliKey | null;
}

const ViewKeyModal: React.FC<ViewKeyModalProps> = ({ isOpen, onClose, apiKey }) => {
    const [showFullKey, setShowFullKey] = useState(false);
    const [copied, setCopied] = useState(false);

    if (!apiKey) return null;

    const formatDate = (dateString: string | null) => {
        if (!dateString) return 'Never';
        return DateTime.fromISO(dateString, { zone: 'utc' }).toFormat('yyyy-MM-dd HH:mm:ss UTC');
    };

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(apiKey.key);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const isExpired = apiKey.expiresAt && new Date(apiKey.expiresAt) < new Date();

    return (
        <BaseModal
            isVisible={isOpen}
            onClose={onClose}
            title={`API Key Details ${isExpired ? '(Expired)' : ''}`}
            width="lg"
        >
            <div className="max-h-96 overflow-y-auto">
                <div className="space-y-6">
                    {/* Basic Information */}
                    <div>
                        <h3 className="text-lg font-semibold mb-3">Basic Information</h3>
                        <dl className="grid grid-cols-1 gap-3">
                            <div className="flex flex-col">
                                <dt className="text-sm font-medium text-gray-500 mb-1">Name</dt>
                                <dd className="text-sm text-gray-900">
                                    {apiKey.name || <span className="text-gray-400">Not set</span>}
                                </dd>
                            </div>

                            <div className="flex flex-col">
                                <dt className="text-sm font-medium text-gray-500 mb-1">Description</dt>
                                <dd className="text-sm text-gray-900">
                                    {apiKey.description || <span className="text-gray-400">Not set</span>}
                                </dd>
                            </div>

                            <div className="flex flex-col">
                                <dt className="text-sm font-medium text-gray-500 mb-1">UID</dt>
                                <dd className="text-sm text-gray-900">
                                    <code className="px-2 py-1 bg-gray-100 rounded">{apiKey.uid}</code>
                                </dd>
                            </div>

                            <div className="flex flex-col">
                                <dt className="text-sm font-medium text-gray-500 mb-1">Key</dt>
                                <dd className="flex items-center gap-2">
                                    <code className="px-2 py-1 bg-gray-100 rounded text-sm flex-1">
                                        {showFullKey ? apiKey.key : `${apiKey.key.substring(0, 8)}...${apiKey.key.substring(apiKey.key.length - 8)}`}
                                    </code>
                                    <button
                                        onClick={() => setShowFullKey(!showFullKey)}
                                        className="text-sm text-primary hover:text-primary-dark"
                                    >
                                        {showFullKey ? 'Hide' : 'Show'}
                                    </button>
                                    <button
                                        onClick={copyToClipboard}
                                        className="text-sm text-primary hover:text-primary-dark flex items-center gap-1"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                        </svg>
                                        {copied ? 'Copied!' : 'Copy'}
                                    </button>
                                </dd>
                            </div>
                        </dl>
                    </div>

                    {/* Timestamps */}
                    <div>
                        <h3 className="text-lg font-semibold mb-3">Timestamps</h3>
                        <dl className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div>
                                <dt className="text-sm font-medium text-gray-500 mb-1">Created At</dt>
                                <dd className="text-sm text-gray-900">{formatDate(apiKey.createdAt)}</dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-gray-500 mb-1">Updated At</dt>
                                <dd className="text-sm text-gray-900">{formatDate(apiKey.updatedAt)}</dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-gray-500 mb-1">Expires At</dt>
                                <dd className={`text-sm ${isExpired ? 'text-red-600 font-semibold' : 'text-gray-900'}`}>
                                    {formatDate(apiKey.expiresAt)}
                                </dd>
                            </div>
                        </dl>
                    </div>

                    {/* Permissions */}
                    <div>
                        <h3 className="text-lg font-semibold mb-3">Permissions</h3>
                        {apiKey.actions.includes('*') ? (
                            <div className="px-3 py-2 bg-yellow-50 border border-yellow-200 rounded-md">
                                <span className="text-sm font-medium text-yellow-800">
                                    This key has all permissions (*)
                                </span>
                            </div>
                        ) : (
                            <div className="flex flex-wrap gap-2">
                                {apiKey.actions.map((action) => {
                                    const permission = getPermissionByValue(action);
                                    return (
                                        <div
                                            key={action}
                                            className="px-3 py-1 bg-primary-50 border border-primary-200 rounded-md"
                                            title={permission?.description}
                                        >
                                            <span className="text-sm font-medium text-primary-700">
                                                {permission?.label || action}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Authorized Indexes */}
                    <div>
                        <h3 className="text-lg font-semibold mb-3">Authorized Indexes</h3>
                        {apiKey.indexes.includes('*') ? (
                            <div className="px-3 py-2 bg-green-50 border border-green-200 rounded-md">
                                <span className="text-sm font-medium text-green-800">
                                    This key can access all indexes (*)
                                </span>
                            </div>
                        ) : apiKey.indexes.length === 0 ? (
                            <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                                <span className="text-sm text-gray-600">
                                    No specific indexes authorized
                                </span>
                            </div>
                        ) : (
                            <div className="flex flex-wrap gap-2">
                                {apiKey.indexes.map((index) => (
                                    <div
                                        key={index}
                                        className="px-3 py-1 bg-gray-100 border border-gray-300 rounded-md"
                                    >
                                        <span className="text-sm font-medium text-gray-700">
                                            {index}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className="flex justify-end mt-6 pt-4 border-t border-gray-200">
                <button
                    onClick={onClose}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                    Close
                </button>
            </div>
        </BaseModal>
    );
};

export default ViewKeyModal;