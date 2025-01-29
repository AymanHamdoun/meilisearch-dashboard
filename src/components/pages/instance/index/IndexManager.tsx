// @ts-ignore
import React, { useEffect, useState } from "react"
import ConfirmationModal from "../../../commons/ConfirmationModal"
import { deleteIndex, listIndexes } from "../../../../services/meilisearch/indexes"
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
    const { meiliIndexState, dispatch } = useIndex()
    const {instanceState} = useMeiliInstance()
    const navigate = useNavigate()

    const [isDeleteConfirmationModalVisible, setIsDeleteConfirmationModalVisible] = useState(false)
    const [isDocIndexingModalVisible, setIsDocIndexingModalVisible] = useState(false)

    const indexName = meiliIndexState.selectedIndex;

    return <div className="relative flex flex-col gap-0">
        <ConfirmationModal
            isVisible={isDeleteConfirmationModalVisible}
            onClose={() => setIsDeleteConfirmationModalVisible(false)}
            onConfirm={() => {
                handleIndexDeletion({
                    indexName: indexName,
                    dispatch: dispatch,
                    instance: instanceState,
                    navigate: navigate,
                })

                setIsDeleteConfirmationModalVisible(false)
            }}
            message={`Delete Index '${indexName}' ?`}
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
    dispatch: (action) => void,
    instance: InstanceState,
    navigate: NavigateFunction,
    
}

const handleIndexDeletion = (options: IndexDeletingOptions) => {
    deleteIndex({
        instance: options.instance,
        indexName: options.indexName,
    }).then((createIndexResponse) => {
        // wait 1 second just to make sure the index has been created so we end up getting it
        setTimeout(() => {
            listIndexes(options.instance.host, options.instance.key).then((response) => {
                if (!response.results) {
                    return
                }
    
                const newIndexFinishedDeleting = response.results.filter((indexObj) => {
                    return indexObj.uid === options.indexName
                }).length === 0
    
                if (!newIndexFinishedDeleting) {
                    options.navigate("/instance/tasks")
                    return
                }
    
                // Update Index Context (to add new index to dropdown)
                options.dispatch({ type: MeiliIndexAction.SetAndDefaultTo, payload: {
                    indexList: response.results,
                    defaultIndexName: options.indexName
                }});
                options.navigate("/instance/index")
            });
        }, 1000)
    })
}

export default IndexManager;