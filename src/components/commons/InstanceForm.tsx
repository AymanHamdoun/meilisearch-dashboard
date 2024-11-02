// @ts-ignore
import React, {ReactNode, useEffect} from "react";
import {InstanceState} from "../../contexts/InstanceContext";

interface InstanceFormProps {
    defaultInstance: InstanceState; // Replace InstanceType with the actual type of the 'instance' object
    formSubmitCallback: (instance: InstanceState) => void; // Adjust the argument type if necessary
    children: ReactNode
}

const InstanceForm: React.FC<InstanceFormProps> = ({ defaultInstance, formSubmitCallback, children }) => {
    const [instance, setInstance] = React.useState(defaultInstance);

    useEffect(() => {
        setInstance(defaultInstance)
    }, [defaultInstance])

    return <form action=""
                 className="w-full flex flex-col gap-5"
                 onSubmit={(e) => {
                     e.preventDefault()
                     formSubmitCallback(instance)
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
            {children}
        </div>
    </form>
}

export default InstanceForm;