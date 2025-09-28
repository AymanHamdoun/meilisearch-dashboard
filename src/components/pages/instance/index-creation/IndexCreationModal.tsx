import React, { useState } from "react";
import {createIndex} from "../../../../services/meilisearch/indexes"
import useMeiliInstance from "../../../../hooks/useMeiliInstance";
import useIndex from "../../../../hooks/useMeiliIndex";
import { useNavigate } from "react-router-dom";
import { InstanceState } from "../../../../contexts/InstanceContext";
import { ErrorType } from "../InstanceErrorPage";
import useModalState from "../../../../hooks/useModalState";
import { MeiliIndexAction } from "../../../../reducers/meiliIndexReducer";
import { BaseModal, ModalError, ModalSuccess, ModalButton } from "../../../commons/modal/ModalComponents";


interface IndexCreationModalProps {
    isVisible: boolean;
    onClose: () => void;
}

const IndexCreationModal: React.FC<IndexCreationModalProps> = ({ isVisible, onClose }) => {
    const { refreshIndexes, dispatch } = useIndex()
    const {instanceState} = useMeiliInstance()
    const navigate = useNavigate()

    const [indexOptions, setIndexOptions] = useState({
        indexName: "",
        primaryKey: ""
    })

    const { isLoading, error, success, resetState, handleAsyncOperation } = useModalState({
        onReset: () => {
            setIndexOptions({ indexName: "", primaryKey: "" });
        }
    });

    const handleClose = () => {
        if (!isLoading) {
            resetState();
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
            undefined, // onSuccess callback
            onClose, // onClose callback
            1000 // success delay
        );
    }

    return (
        <BaseModal
            isVisible={isVisible}
            onClose={handleClose}
            title="Create New Index"
            isLoading={isLoading}
        >
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
                <ModalError error={error} />
                <ModalSuccess success={success} message="Index created successfully!" />

                <ModalButton
                    onClick={handleIndexCreation}
                    disabled={!indexOptions.indexName.trim()}
                    isLoading={isLoading}
                    success={success}
                    loadingText="Creating..."
                    className="mt-2"
                >
                    Create
                </ModalButton>
            </form>
        </BaseModal>
    );
}

export default IndexCreationModal;