// @ts-ignore
import React from "react"
import DocHeader from "./DocHeader"

import useIndexSettings from "../../../../../hooks/useIndexSettings"
import { IndexSettingsActions } from "../../../../../reducers/indexSettingsReducer"

const FacetSearchSetting = () => {
    const { settings, dispatch } = useIndexSettings()

    const handleChange = (value: string) => {
        dispatch({
            type: IndexSettingsActions.Update,
            payload: { facetSearch: value === "true" }
        });
    };

    return <div>
        <DocHeader
            title={"Facet Search"}
            badge={"facetSearch"}
            description={"Enable or disable the facet search feature. Default value: true"}
            link={"https://www.meilisearch.com/docs/reference/api/settings#facet-search"}
        />
        <select
            value={settings.facetSearch ? "true" : "false"}
            onChange={(e) => handleChange(e.target.value)}
            className="w-full p-2 stl-select-input"
        >
            <option value="true">true</option>
            <option value="false">false</option>
        </select>
    </div>
}

export default FacetSearchSetting
