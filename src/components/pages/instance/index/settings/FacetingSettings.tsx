// @ts-ignore
import React, { useEffect, useState } from "react"
import DocHeader from "./DocHeader"

import useIndexSettings from "../../../../../hooks/useIndexSettings"
import { IndexSettingsActions } from "../../../../../reducers/indexSettingsReducer"
import { ApiSettingsFaceting } from "../../../../../services/meilisearch/types"

const FacetingSettings = () => {
    const { settings, dispatch } = useIndexSettings()
    const [faceting, setFaceting] = useState<ApiSettingsFaceting>(settings.faceting)

    useEffect(() => {
        setFaceting(settings.faceting)
    }, [settings.faceting])

    const updateFaceting = (newFaceting: ApiSettingsFaceting) => {
        setFaceting(newFaceting);
        dispatch({
            type: IndexSettingsActions.Update,
            payload: { faceting: newFaceting }
        });
    }

    const sortEntries = Object.entries(faceting.sortFacetValuesBy)

    const handleAddSortEntry = () => {
        updateFaceting({
            ...faceting,
            sortFacetValuesBy: {
                ...faceting.sortFacetValuesBy,
                "": "alpha"
            }
        })
    }

    const handleRemoveSortEntry = (key: string) => {
        const newSort = { ...faceting.sortFacetValuesBy }
        delete newSort[key]
        updateFaceting({ ...faceting, sortFacetValuesBy: newSort })
    }

    const handleSortKeyChange = (oldKey: string, newKey: string) => {
        const newSort: Record<string, string> = {}
        for (const [k, v] of Object.entries(faceting.sortFacetValuesBy)) {
            if (k === oldKey) {
                newSort[newKey] = v
            } else {
                newSort[k] = v
            }
        }
        updateFaceting({ ...faceting, sortFacetValuesBy: newSort })
    }

    const handleSortValueChange = (key: string, value: string) => {
        updateFaceting({
            ...faceting,
            sortFacetValuesBy: { ...faceting.sortFacetValuesBy, [key]: value }
        })
    }

    return <div className="flex flex-col gap-8">
        <div>
            <DocHeader
                title={"Max Values Per Facet"}
                badge={"faceting.maxValuesPerFacet"}
                description={"Maximum number of facet values returned for each facet. Default value: 100"}
                link={"https://www.meilisearch.com/docs/reference/api/settings#faceting"}
            />
            <input
                type="number"
                value={faceting.maxValuesPerFacet}
                onChange={(e) => {
                    updateFaceting({
                        ...faceting,
                        maxValuesPerFacet: parseInt(e.target.value) || 0
                    })
                }}
                min={0}
                className="w-full p-2 border border-gray-300"
            />
        </div>
        <div>
            <DocHeader
                title={"Sort Facet Values By"}
                badge={"faceting.sortFacetValuesBy"}
                description={"Define how facet values are sorted. Use '*' as a key for the default sort order. Values: 'alpha' or 'count'."}
                link={"https://www.meilisearch.com/docs/reference/api/settings#faceting"}
            />
            <div className="flex flex-col gap-2">
                {sortEntries.map(([key, value], index) => (
                    <div key={index} className="flex items-center gap-2">
                        <input
                            type="text"
                            value={key}
                            onChange={(e) => handleSortKeyChange(key, e.target.value)}
                            placeholder="attribute name or *"
                            className="flex-1 border-b bg-gray-50 border-gray-200 py-1.5 px-3 focus:outline-none focus:border-b focus:border-b-primary text-gray-600"
                        />
                        <select
                            value={value}
                            onChange={(e) => handleSortValueChange(key, e.target.value)}
                            className="p-1.5 border border-gray-200 rounded text-sm"
                        >
                            <option value="alpha">alpha</option>
                            <option value="count">count</option>
                        </select>
                        <button
                            onClick={() => handleRemoveSortEntry(key)}
                            className="border border-gray-200 rounded-sm p-2 hover:border-red-400 text-sm text-gray-500"
                        >
                            Remove
                        </button>
                    </div>
                ))}
                <button
                    onClick={handleAddSortEntry}
                    className="border border-gray-300 rounded-sm py-2 px-3 hover:bg-primary hover:text-white transition-all ease-in-out w-full"
                >
                    + Add Sort Rule
                </button>
            </div>
        </div>
    </div>
}

export default FacetingSettings
