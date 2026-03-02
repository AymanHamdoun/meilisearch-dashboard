// @ts-ignore
import React, { useState } from "react"
import ConfirmationModal from "../../../commons/ConfirmationModal"
import { deleteIndex, deleteAllDocuments } from "../../../../services/meilisearch/indexes"
import useIndex from "../../../../hooks/useMeiliIndex"
import useMeiliInstance from "../../../../hooks/useMeiliInstance"
import { InstanceState } from "../../../../contexts/InstanceContext"
import DocIndexingModal from "./documents/DocIndexingModal"
import SwapIndexesModal from "./SwapIndexesModal"
import UpdateIndexModal from "./UpdateIndexModal"

const IndexManager = () => {
    return <div className="flex flex-col md:flex-row justify-end px-3">
        <ManageIndexDropdown/>
    </div>
}

const ManageIndexDropdown = () => {
    const { meiliIndexState, refreshIndexes } = useIndex()
    const {instanceState} = useMeiliInstance()

    const [isDeleteConfirmationModalVisible, setIsDeleteConfirmationModalVisible] = useState(false)
    const [isDocIndexingModalVisible, setIsDocIndexingModalVisible] = useState(false)
    const [isSwapModalVisible, setIsSwapModalVisible] = useState(false)
    const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false)
    const [isClearDocsModalVisible, setIsClearDocsModalVisible] = useState(false)

    const indexName = meiliIndexState.selectedIndex;

    return <div className="relative flex flex-col gap-0">
        <ConfirmationModal
            isVisible={isDeleteConfirmationModalVisible}
            onClose={() => setIsDeleteConfirmationModalVisible(false)}
            onConfirm={() => handleIndexDeletion({
                indexName: indexName,
                refreshIndexes: refreshIndexes,
                instance: instanceState,
            })}
            message={`Delete Index '${indexName}' ?`}
            description="This will permanently delete the index and all its documents. This action cannot be undone."
            confirmButtonText="Delete"
            confirmButtonColor="red"
        />
        <ConfirmationModal
            isVisible={isClearDocsModalVisible}
            onClose={() => setIsClearDocsModalVisible(false)}
            onConfirm={async () => {
                await deleteAllDocuments(instanceState, indexName);
                await new Promise(resolve => setTimeout(resolve, 500));
            }}
            message={`Clear all documents from '${indexName}'?`}
            description="This will delete all documents in this index. The index and its settings will remain."
            confirmButtonText="Clear"
            confirmButtonColor="red"
        />
        <DocIndexingModal
            isVisible={isDocIndexingModalVisible}
            onClose={() => setIsDocIndexingModalVisible(false)}
            indexName={indexName || ''}
        />
        <SwapIndexesModal
            isVisible={isSwapModalVisible}
            onClose={() => setIsSwapModalVisible(false)}
        />
        <UpdateIndexModal
            isVisible={isUpdateModalVisible}
            onClose={() => setIsUpdateModalVisible(false)}
            indexName={indexName || ''}
        />
        <button id="dropdownDividerButton"
            data-dropdown-toggle="dropdownDivider"
            className="flex flex-row items-center bg-white rounded border border-gray-300 px-3 py-1">
            Manage Index
            <svg className="w-2.5 h-2.5 ms-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
            </svg>
        </button>

        <div id="dropdownDivider" className="hidden bg-white w-full border border-gray-200">
            <ul className="py-2 text-sm" aria-labelledby="dropdownDividerButton">
                <li>
                    <a href="#"
                        className="block px-4 py-2 hover:bg-gray-100"
                        onClick={() => setIsDocIndexingModalVisible(true)}>Add Records</a>
                </li>
                <li>
                    <a href="#"
                        className="block px-4 py-2 hover:bg-gray-100"
                        onClick={() => setIsUpdateModalVisible(true)}>Update Primary Key</a>
                </li>
                <li>
                    <a href="#"
                        className="block px-4 py-2 hover:bg-gray-100"
                        onClick={() => setIsSwapModalVisible(true)}>Swap Indexes</a>
                </li>
                <li>
                    <a href="#"
                        className="block px-4 py-2 hover:bg-gray-100 text-orange-500"
                        onClick={() => setIsClearDocsModalVisible(true)}>Clear Documents</a>
                </li>
                <li>
                    <a href="#"
                        className="block px-4 py-2 hover:bg-gray-100 text-red-500"
                        onClick={() => setIsDeleteConfirmationModalVisible(true)}>Delete Index</a>
                </li>
            </ul>
        </div>
    </div>
}

type IndexDeletingOptions = {
    indexName: string,
    refreshIndexes: () => Promise<any>,
    instance: InstanceState,
}

const handleIndexDeletion = async (options: IndexDeletingOptions) => {
    try {
        await deleteIndex({
            instance: options.instance,
            indexName: options.indexName,
        });
        await new Promise(resolve => setTimeout(resolve, 1000));
        await options.refreshIndexes();
    } catch (error: any) {
        console.error('Index deletion failed:', error);
        throw new Error(error.message || 'Failed to delete index');
    }
}

export default IndexManager;
