// @ts-ignore
import React, { useState } from "react";
// @ts-ignore
import {createIndex} from "../../../../services/meilisearch/indexes.ts"
import useMeiliInstance from "../../../../hooks/useMeiliInstance";
import useIndex from "../../../../hooks/useMeiliIndex";
import { useNavigate } from "react-router-dom";
// @ts-ignore
import { InstanceState } from "../../../../contexts/InstanceContext.tsx";
import { ErrorType } from "../InstanceErrorPage";
import useModalState from "../../../../hooks/useModalState";
import { MeiliIndexAction } from "../../../../reducers/meiliIndexReducer";


interface IndexCreationModalProps {
    isVisible: boolean;
    onClose: () => void;
}

const IndexCreationModal: React.FC<IndexCreationModalProps> = ({ isVisible, onClose }) => {
    const { refreshIndexes, dispatch } = useIndex()
    const {instanceState} = useMeiliInstance()
    const navigate = useNavigate()
    const { isLoading, error, success, resetState, handleAsyncOperation } = useModalState();

    const [indexOptions, setIndexOptions] = useState({
        indexName: "",
        primaryKey: ""
    })

    const resetModal = () => {
        setIndexOptions({ indexName: "", primaryKey: "" })
        resetState()
    }

    const handleClose = () => {
        if (!isLoading) {
            resetModal();
            onClose();
        }
    };


    const performIndexCreation = async () => {
        // Validate index name
        if (!indexOptions.indexName.trim()) {
            throw new Error('Index name is required')
        }

        // Create the index
        const createIndexResponse = await createIndex({
            instance: instanceState,
            indexName: indexOptions.indexName.trim(),
            primaryKey: indexOptions.primaryKey.trim()
        })

        // Check if there's an error in the response
        if (createIndexResponse.message) {
            throw new Error(createIndexResponse.message)
        }

        // Wait a bit for index to be created
        await new Promise(resolve => setTimeout(resolve, 500))

        // Refresh the index list through the centralized mechanism
        const indexList = await refreshIndexes()

        if (indexList) {
            const newIndexExists = indexList.some((indexObj: any) =>
                indexObj.uid === indexOptions.indexName.trim()
            )

            if (newIndexExists) {
                // Index was created successfully, set it as selected and navigate to index page
                dispatch({ type: MeiliIndexAction.Change, payload: indexOptions.indexName.trim() })
                navigate("/instance/index")
            } else {
                // Index is still being created, go to tasks page
                navigate("/instance/tasks")
            }
        } else {
            // If refresh fails, assume it's still processing
            navigate("/instance/tasks")
        }
    }

    const handleIndexCreation = async () => {
        await handleAsyncOperation(
            performIndexCreation,
            resetModal, // onSuccess callback - clears inputs
            onClose, // onClose callback
            1000 // success delay
        );
    }

    if (!isVisible) return null;

    return <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
        <div className="bg-white rounded-lg shadow-xl p-6 w-96 max-w-md">
            <div className="flex items-center justify-between mb-4 border-b border-gray-200 pb-4">
                <h3 className="text-lg font-semibold text-gray-700">
                    Create New Index
                </h3>
                <button
                    type="button"
                    className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
                    onClick={handleClose}
                    disabled={isLoading}
                >
                    <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                    </svg>
                    <span className="sr-only">Close modal</span>
                </button>
            </div>
            <form>
                <div className="mb-4">
                    <label htmlFor="indexName" className="block mb-2 text-sm font-medium text-gray-700">Index Name</label>
                    <input
                        type="text"
                        id="indexName"
                        placeholder="e.g: Books"
                        value={indexOptions.indexName}
                        className="p-2 rounded border border-gray-200 focus:border-primary focus:outline-none w-full"
                        onChange={(e) => {
                            setIndexOptions({
                                ...indexOptions,
                                indexName: e.target.value
                            })
                        }}
                        disabled={isLoading}
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="primaryKey" className="block mb-2 text-sm font-medium text-gray-700">Primary Key</label>
                    <input
                        type="text"
                        id="primaryKey"
                        placeholder="e.g: objectID"
                        value={indexOptions.primaryKey}
                        className="p-2 rounded border border-gray-200 focus:border-primary focus:outline-none w-full"
                        onChange={(e) => {
                            setIndexOptions({
                                ...indexOptions,
                                primaryKey: e.target.value
                            })
                        }}
                        disabled={isLoading}
                    />
                </div>
                    {/* Error Message */}
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-sm text-red-600">{error}</p>
                        </div>
                    )}

                    {/* Success Message */}
                    {success && (
                        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                            <p className="text-sm text-green-600">Index created successfully!</p>
                        </div>
                    )}

                    <button
                            className={`w-full py-3 border rounded font-semibold transition-all ease-in-out mt-2 ${
                                isLoading
                                    ? 'border-gray-300 text-gray-400 cursor-not-allowed'
                                    : 'border-primary text-primary hover:bg-primary hover:text-white'
                            }`}
                            type="button"
                            disabled={isLoading || !indexOptions.indexName.trim()}
                            onClick={(e) => {
                                e.preventDefault();
                                handleIndexCreation()
                            }}>
                            {isLoading ? (
                                <div className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Creating...
                                </div>
                            ) : 'Create'}
                    </button>
            </form>
        </div>
    </div>
}

export default IndexCreationModal;