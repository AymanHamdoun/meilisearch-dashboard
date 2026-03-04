// @ts-ignore
import React, { useEffect, useState, useCallback } from "react"
import { listDocuments } from "../../../../../services/meilisearch/indexes"
import useMeiliInstance from "../../../../../hooks/useMeiliInstance"
import useMeiliIndex from "../../../../../hooks/useMeiliIndex"
import DocumentDetailModal from "./DocumentDetailModal"
import DocumentDeleteModal from "./DocumentDeleteModal"

const DOCS_PER_PAGE = 20

const DocumentBrowser = () => {
    const { instanceState } = useMeiliInstance()
    const { meiliIndexState } = useMeiliIndex()
    const indexName = meiliIndexState.selectedIndex

    const [documents, setDocuments] = useState<Record<string, any>[]>([])
    const [total, setTotal] = useState(0)
    const [offset, setOffset] = useState(0)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const [selectedDoc, setSelectedDoc] = useState<Record<string, any> | null>(null)
    const [showDetailModal, setShowDetailModal] = useState(false)
    const [deleteTarget, setDeleteTarget] = useState<{ mode: 'single' | 'all', docId?: string } | null>(null)

    const fetchDocuments = useCallback(() => {
        if (!instanceState.isLoaded || !indexName) return
        setIsLoading(true)
        setError(null)

        listDocuments({
            instance: instanceState,
            indexName,
            offset,
            limit: DOCS_PER_PAGE
        }).then((data) => {
            setDocuments(data.results || [])
            setTotal(data.total || 0)
            setIsLoading(false)
        }).catch((err) => {
            setError(err.message || 'Failed to load documents')
            setDocuments([])
            setIsLoading(false)
        })
    }, [instanceState, indexName, offset])

    useEffect(() => {
        fetchDocuments()
    }, [fetchDocuments])

    const startItem = documents.length > 0 ? offset + 1 : 0
    const endItem = offset + documents.length

    const handleViewDoc = (doc: Record<string, any>) => {
        setSelectedDoc(doc)
        setShowDetailModal(true)
    }

    const handleDeleteDoc = (docId: string) => {
        setDeleteTarget({ mode: 'single', docId })
    }

    const handleDeleteAll = () => {
        setDeleteTarget({ mode: 'all' })
    }

    const primaryKeyField = documents.length > 0 ? Object.keys(documents[0])[0] : 'id'

    return <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500">
                {total > 0 ? `${startItem}–${endItem} of ${total} documents` : 'No documents'}
            </div>
            <div className="flex gap-2">
                <button
                    onClick={fetchDocuments}
                    className="px-3 py-1.5 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50"
                >
                    Refresh
                </button>
                {total > 0 && (
                    <button
                        onClick={handleDeleteAll}
                        className="px-3 py-1.5 text-sm text-red-500 bg-white border border-red-300 rounded hover:bg-red-50"
                    >
                        Delete All
                    </button>
                )}
            </div>
        </div>

        {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-600">
                {error}
            </div>
        )}

        {isLoading ? (
            <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">Loading documents...</div>
        ) : documents.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">No documents found</div>
        ) : (
            <div className="overflow-x-auto bg-white rounded-lg shadow">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                            {Object.keys(documents[0]).slice(0, 5).map((key) => (
                                <th key={key} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase truncate max-w-[200px]">
                                    {key}
                                </th>
                            ))}
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {documents.map((doc, i) => {
                            const keys = Object.keys(doc).slice(0, 5)
                            const docId = String(doc[primaryKeyField] ?? i)
                            return (
                                <tr key={i} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 text-sm text-gray-400">{offset + i + 1}</td>
                                    {keys.map((key) => (
                                        <td key={key} className="px-4 py-3 text-sm text-gray-600 truncate max-w-[200px]">
                                            {typeof doc[key] === 'object' ? JSON.stringify(doc[key]).substring(0, 50) + '...' : String(doc[key] ?? '').substring(0, 80)}
                                        </td>
                                    ))}
                                    <td className="px-4 py-3 text-sm">
                                        <button
                                            onClick={() => handleViewDoc(doc)}
                                            className="text-primary hover:underline mr-3"
                                        >
                                            View
                                        </button>
                                        <button
                                            onClick={() => handleDeleteDoc(docId)}
                                            className="text-red-500 hover:underline"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        )}

        {/* Pagination */}
        {total > DOCS_PER_PAGE && (
            <div className="flex justify-between items-center">
                <button
                    onClick={() => setOffset(Math.max(0, offset - DOCS_PER_PAGE))}
                    disabled={offset === 0}
                    className="px-4 py-2 text-sm bg-white border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                    Previous
                </button>
                <span className="text-sm text-gray-500">
                    Page {Math.floor(offset / DOCS_PER_PAGE) + 1} of {Math.ceil(total / DOCS_PER_PAGE)}
                </span>
                <button
                    onClick={() => setOffset(offset + DOCS_PER_PAGE)}
                    disabled={offset + DOCS_PER_PAGE >= total}
                    className="px-4 py-2 text-sm bg-white border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                    Next
                </button>
            </div>
        )}

        {/* Modals */}
        <DocumentDetailModal
            isVisible={showDetailModal}
            onClose={() => { setShowDetailModal(false); setSelectedDoc(null); }}
            document={selectedDoc}
            indexName={indexName}
            onDocumentUpdated={fetchDocuments}
        />
        <DocumentDeleteModal
            isVisible={deleteTarget !== null}
            onClose={() => setDeleteTarget(null)}
            mode={deleteTarget?.mode || 'single'}
            docId={deleteTarget?.docId}
            indexName={indexName}
            onDeleted={() => {
                setDeleteTarget(null)
                fetchDocuments()
            }}
        />
    </div>
}

export default DocumentBrowser
