// @ts-ignore
import React from "react"
import DocHeader from "./DocHeader"

import useIndexSettings from "../../../../../hooks/useIndexSettings"
import { IndexSettingsActions } from "../../../../../reducers/indexSettingsReducer"

const SearchCutoffMs = () => {
    const { settings, dispatch } = useIndexSettings()

    const handleChange = (value: string) => {
        const parsed = value === "" ? null : parseInt(value);
        dispatch({
            type: IndexSettingsActions.Update,
            payload: { searchCutoffMs: parsed }
        });
    };

    return <div>
        <DocHeader
            title={"Search Cutoff (ms)"}
            badge={"searchCutoffMs"}
            description={"Maximum time in milliseconds for a search query. Default value: null (uses Meilisearch default of 1500ms)"}
            link={"https://www.meilisearch.com/docs/reference/api/settings#search-cutoff"}
        />
        <div className="flex items-center gap-2">
            <input
                type="number"
                value={settings.searchCutoffMs ?? ""}
                onChange={(e) => handleChange(e.target.value)}
                placeholder="e.g. 1500"
                min={0}
                className="flex-1 border-b bg-gray-50 border-gray-200 py-1.5 px-3 focus:outline-none focus:border-b focus:border-b-primary text-gray-600"
            />
            {settings.searchCutoffMs !== null && (
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

export default SearchCutoffMs
