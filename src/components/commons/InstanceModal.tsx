import React, { useEffect, useState } from "react";
import { InstanceState } from "../../contexts/InstanceContext";
import useMeiliInstance from "../../hooks/useMeiliInstance";
import { InstanceAction } from "../../reducers/instanceReducer";

const InstanceModal = () => {
    const { instanceState, dispatch } = useMeiliInstance()
    const [instance, setInstance] = useState<InstanceState>({
        label: "",
        host: "",
        key: ""
    })

    useEffect(() => {
        setInstance(instanceState)
    }, [])

    const switchInstance = () => {
        dispatch({ type: InstanceAction.Set, payload: instance })
    }

    return <div id="instance-modal"
        aria-hidden="true"
        className="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full h-full bg-black bg-opacity-40">
        <div className="relative p-4 w-full max-w-md max-h-full">
            <div className="relative bg-white rounded-lg shadow">
                <div
                    className="flex items-center justify-between p-4 md:p-5 border-b rounded-t border-gray-200">
                    <h3 className="text-xl font-semibold text-primary">
                        Switch to Meilisearch Instance
                    </h3>
                    <button type="button" className="end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="instance-modal">
                        <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                        </svg>
                        <span className="sr-only">Close modal</span>
                    </button>
                </div>
                <div className="p-4 md:p-5">
                    <form action=""
                        className="flex flex-col gap-5"
                        onSubmit={(e) => {
                            e.preventDefault()
                            switchInstance()

                        }}>
                        <div className="flex flex-col gap-2">
                            <label className="text-gray-700" htmlFor="meili_host">Instance Label</label>
                            <input type="text" name="meili_host" placeholder="Prod"
                                className="p-2 rounded border border-gray-200 w-full focus:border-primary focus:outline-none"
                                value={instance.label}
                                onChange={(e) => {
                                    setInstance({
                                        ...instance,
                                        label: e.target.value
                                    })
                                }}
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-gray-700" htmlFor="meili_host">Meilisearch Host</label>
                            <input type="text" name="meili_host" placeholder="http://localhost:7700"
                                className="p-2 rounded border border-gray-200 w-full focus:border-primary focus:outline-none"
                                value={instance.host}
                                onChange={(e) => {
                                    setInstance({
                                        ...instance,
                                        host: e.target.value
                                    })
                                }}
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-gray-700" htmlFor="meili_host">Meilisearch Key</label>
                            <input type="text" name="meili_host" placeholder="abcdefghijk.."
                                className="p-2 rounded border border-gray-200 w-full focus:border-primary focus:outline-none"
                                value={instance.key}
                                onChange={(e) => {
                                    setInstance({
                                        ...instance,
                                        key: e.target.value
                                    })
                                }}
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <button
                                className="w-full py-3 border border-primary rounded text-primary font-semibold transition-all ease-in-out hover:bg-primary hover:text-white"
                                type="submit"
                                data-modal-hide="instance-modal">
                                Switch
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
}


export default InstanceModal;