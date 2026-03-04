// @ts-ignore
import React from "react"
import DocHeader from "./DocHeader"

import useIndexSettings from "../../../../../hooks/useIndexSettings"
import { IndexSettingsActions } from "../../../../../reducers/indexSettingsReducer"

const DistinctAttribute = () => {
    const { settings, dispatch } = useIndexSettings()

    const handleChange = (value: string) => {
        dispatch({
            type: IndexSettingsActions.Update,
            payload: { distinctAttribute: value || null }
        });
    };

    return <div>
        <DocHeader
            title={"Distinct Attribute"}
            badge={"distinctAttribute"}
            description={"The field whose value is always unique in the returned documents. Default value: null"}
            link={"https://www.meilisearch.com/docs/learn/relevancy/distinct_attribute"}
        />
        <div className="flex items-center gap-2">
            <input
                type="text"
                value={settings.distinctAttribute || ""}
                onChange={(e) => handleChange(e.target.value)}
                placeholder="e.g. product_id"
                className="flex-1 border-b bg-gray-50 border-gray-200 py-1.5 px-3 focus:outline-none focus:border-b focus:border-b-primary text-gray-600"
            />
            {settings.distinctAttribute && (
                <button
                    onClick={() => handleChange("")}
                    className="border border-gray-200 rounded-sm p-2 hover:border-red-400 text-sm text-gray-500"
                >
                    Clear
                </button>
            )}
        </div>
    </div>
}

export default DistinctAttribute
