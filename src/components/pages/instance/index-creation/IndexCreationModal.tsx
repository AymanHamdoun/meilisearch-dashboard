import React, { useState } from "react";
import {createIndex, listIndexes} from "../../../../services/meilisearch/indexes.ts"
import useMeiliInstance from "../../../../hooks/useMeiliInstance";
import useIndex from "../../../../hooks/useMeiliIndex";
import { MeiliIndexAction } from "../../../../reducers/meiliIndexReducer.js";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { InstanceState } from "../../../../contexts/InstanceContext.tsx";

type IndexCreationOptions = {
    indexName: string,
    primaryKey: string,
    dispatch: (action) => void,
    instance: InstanceState,
    navigate: NavigateFunction
}

const IndexCreationModal = () => {
    const { dispatch } = useIndex()
    const {instanceState} = useMeiliInstance()
    const navigate = useNavigate()

    const [indexOptions, setIndexOptions] = useState({
        indexName: "",
        primaryKey: ""
    })

    return <div id="index-creation-modal" 
                aria-hidden="true" 
                className="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-full max-h-full bg-black bg-opacity-60">
        <div className="relative p-4 w-full max-w-md max-h-full">
            <div className="relative bg-white rounded-lg shadow">
                <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-700">
                        Create New Index
                    </h3>
                    <button type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="index-creation-modal">
                        <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                        </svg>
                        <span className="sr-only">Close modal</span>
                    </button>
                </div>
                <form className="p-4 md:p-5">
                    <div>
                        <div className="mb-3">
                            <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-700">Index Name</label>
                            <input type="text" name="meili_host" placeholder="e.g: Books"
                                className="p-2 rounded border border-gray-200 focus:border-primary focus:outline-none w-full"
                                onChange={(e) => {
                                    setIndexOptions({
                                        ...indexOptions,
                                        indexName: e.target.value
                                    })
                                }}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="price" className="block mb-2 text-sm font-medium text-gray-700">Primary Key</label>
                            <input type="text" name="meili_host" placeholder="e.g: objectID"
                                className="p-2 rounded border border-gray-200 focus:border-primary focus:outline-none w-full"
                                onChange={(e) => {
                                    setIndexOptions({
                                        ...indexOptions,
                                        primaryKey: e.target.value
                                    })
                                }}
                            />
                        </div>
                    </div>
                    <button
                            className="w-full py-3 border border-primary rounded text-primary font-semibold transition-all ease-in-out hover:bg-primary hover:text-white mt-2"
                            type="button"
                            data-modal-hide="index-creation-modal"
                            onClick={(e) => {
                                e.preventDefault();
                                handleIndexCreation({
                                    indexName: indexOptions.indexName,
                                    primaryKey: indexOptions.primaryKey,
                                    instance: instanceState,
                                    dispatch: dispatch,
                                    navigate: navigate
                                })
                            }}>
                            Create
                    </button>
                </form>
            </div>
        </div>
    </div>     
}

export default IndexCreationModal;

const handleIndexCreation = (indexOptions: IndexCreationOptions) => {
    createIndex({
        instance: indexOptions.instance,
        indexName: indexOptions.indexName,
        primaryKey: indexOptions.primaryKey
    }).then((createIndexResponse) => {
        listIndexes(indexOptions.instance.host, indexOptions.instance.key).then((response) => {
            if (!response.results) {
                return
            }

            const newIndexFinishedCreating = response.results.filter((indexObj) => {
                return indexObj.uid === indexOptions.indexName
            }).length === 1

            if (!newIndexFinishedCreating) {
                indexOptions.navigate("/instance/tasks")
                return
            }

            // Update Index Context (to add new index to dropdown)
            indexOptions.dispatch({ type: MeiliIndexAction.SetAndDefaultTo, payload: {
                indexList: response.results,
                defaultIndexName: indexOptions.indexName
            }});
            indexOptions.navigate("/instance/index")
        });
    })
}