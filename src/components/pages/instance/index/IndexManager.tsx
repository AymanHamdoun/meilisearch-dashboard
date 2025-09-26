// @ts-ignore
import React, { useEffect, useState } from "react"
import ConfirmationModal from "../../../commons/ConfirmationModal"
import { deleteIndex } from "../../../../services/meilisearch/indexes"
import useIndex from "../../../../hooks/useMeiliIndex"
import useMeiliInstance from "../../../../hooks/useMeiliInstance"
import { InstanceState } from "../../../../contexts/InstanceContext"
import { NavigateFunction, useNavigate } from "react-router-dom"
import { MeiliIndexAction } from "../../../../reducers/meiliIndexReducer"
import DocIndexingModal from "./documents/DocIndexingModal"

const IndexManager = () => {
    return <div className="flex flex-col md:flex-row justify-end px-3">
        <ManageIndexDropdown/>
    </div>
}

const ManageIndexDropdown = () => {
    const { meiliIndexState, refreshIndexes } = useIndex()
    const {instanceState} = useMeiliInstance()
    const navigate = useNavigate()

    const [isDeleteConfirmationModalVisible, setIsDeleteConfirmationModalVisible] = useState(false)
    const [isDocIndexingModalVisible, setIsDocIndexingModalVisible] = useState(false)

    const indexName = meiliIndexState.selectedIndex;

    return <div className="relative flex flex-col gap-0">
        <ConfirmationModal
            isVisible={isDeleteConfirmationModalVisible}
            onClose={() => setIsDeleteConfirmationModalVisible(false)}
            onConfirm={() => handleIndexDeletion({
                indexName: indexName,
                refreshIndexes: refreshIndexes,
                instance: instanceState,
                navigate: navigate,
            })}
            message={`Delete Index '${indexName}' ?`}
            confirmButtonText="Delete"
            confirmButtonColor="red"
        />
        <DocIndexingModal
            isVisible={isDocIndexingModalVisible}
            onClose={() => setIsDocIndexingModalVisible(false)}
            onConfirm={(code: string) => {
                console.log(code);
                // @TODO upload doc to meili
                setIsDocIndexingModalVisible(false)
            }}
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
                        onClick={() => {
                            setIsDocIndexingModalVisible(true)
                        }}>Add Records</a>
                </li>
                <li>
                    <a href="#" 
                        className="block px-4 py-2 hover:bg-gray-100 text-red-500"
                        onClick={() => {
                            setIsDeleteConfirmationModalVisible(true)
                        }}>Delete</a>
                </li>
            </ul>
        </div>
    </div>
}

type IndexDeletingOptions = {
    indexName: string,
    refreshIndexes: () => Promise<any>,
    instance: InstanceState,
    navigate: NavigateFunction,
}

const handleIndexDeletion = async (options: IndexDeletingOptions) => {
    try {
        // Delete the index
        await deleteIndex({
            instance: options.instance,
            indexName: options.indexName,
        });

        // Wait a bit before checking if deletion completed
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Refresh the index list to see if deletion completed
        const indexList = await options.refreshIndexes();

        if (indexList) {
            const indexStillExists = indexList.some((indexObj: any) =>
                indexObj.uid === options.indexName
            );

            if (indexStillExists) {
                // Index is still being deleted, go to tasks page
                options.navigate("/instance/tasks");
            } else {
                // Index deleted successfully, stay on current page or go to overview
                options.navigate("/instance/index");
            }
        } else {
            // If refresh fails, assume it's still processing
            options.navigate("/instance/tasks");
        }
    } catch (error: any) {
        console.error('Index deletion failed:', error);
        // Re-throw the error so the modal can catch it
        throw new Error(error.message || 'Failed to delete index');
    }
}

export default IndexManager;