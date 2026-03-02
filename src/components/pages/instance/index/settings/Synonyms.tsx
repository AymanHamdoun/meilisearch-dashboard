// @ts-ignore
import React, { useEffect, useState } from "react"
import DynamicTextBoxes from "../../../../commons/DynamicTextboxes"
import DocHeader from "./DocHeader"

import useIndexSettings from "../../../../../hooks/useIndexSettings"
import { IndexSettingsActions } from "../../../../../reducers/indexSettingsReducer"

const Synonyms = () => {
    const { settings, dispatch } = useIndexSettings()
    const [synonyms, setSynonyms] = useState<Record<string, string[]>>(settings.synonyms || {})

    useEffect(() => {
        setSynonyms(settings.synonyms || {})
    }, [settings.synonyms])

    const updateSynonyms = (newSynonyms: Record<string, string[]>) => {
        setSynonyms(newSynonyms);
        dispatch({
            type: IndexSettingsActions.Update,
            payload: { synonyms: newSynonyms }
        });
    }

    const entries = Object.entries(synonyms)

    const handleAddGroup = () => {
        updateSynonyms({ ...synonyms, "": [] })
    }

    const handleRemoveGroup = (key: string) => {
        const newSynonyms = { ...synonyms }
        delete newSynonyms[key]
        updateSynonyms(newSynonyms)
    }

    const handleKeyChange = (oldKey: string, newKey: string) => {
        const newSynonyms: Record<string, string[]> = {}
        for (const [k, v] of Object.entries(synonyms)) {
            if (k === oldKey) {
                newSynonyms[newKey] = v
            } else {
                newSynonyms[k] = v
            }
        }
        updateSynonyms(newSynonyms)
    }

    const handleValuesChange = (key: string, values: string[]) => {
        updateSynonyms({ ...synonyms, [key]: values })
    }

    return <div>
        <DocHeader
            title={"Synonyms"}
            badge={"synonyms"}
            description={"Words associated with each other that should be considered equivalent. Default value: {}"}
            link={"https://www.meilisearch.com/docs/learn/relevancy/synonyms"}
        />
        <div className="flex flex-col gap-4">
            {entries.map(([key, values], index) => (
                <div key={index} className="border border-gray-200 rounded p-3 bg-gray-50">
                    <div className="flex items-center gap-2 mb-3">
                        <input
                            type="text"
                            value={key}
                            onChange={(e) => handleKeyChange(key, e.target.value)}
                            placeholder="Word"
                            className="flex-1 border-b bg-white border-gray-200 py-1.5 px-3 focus:outline-none focus:border-b focus:border-b-primary text-gray-600 font-medium"
                        />
                        <button
                            onClick={() => handleRemoveGroup(key)}
                            className="border border-gray-200 rounded-sm p-2 hover:border-red-400 text-sm text-gray-500"
                        >
                            Remove
                        </button>
                    </div>
                    <div className="pl-2">
                        <p className="text-xs text-gray-400 mb-1">Synonyms for "{key}":</p>
                        <DynamicTextBoxes
                            buttonText="+ Add Synonym"
                            initialTextboxValues={values}
                            onChange={(vals) => handleValuesChange(key, vals)}
                        />
                    </div>
                </div>
            ))}
            <button
                onClick={handleAddGroup}
                className="border border-gray-300 rounded-sm py-2 px-3 hover:bg-primary hover:text-white transition-all ease-in-out w-full"
            >
                + Add Synonym Group
            </button>
        </div>
    </div>
}

export default Synonyms
