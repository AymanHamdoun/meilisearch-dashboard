// @ts-ignore
import React from "react"
import DocHeader from "./DocHeader"

import useIndexSettings from "../../../../../hooks/useIndexSettings"
import { IndexSettingsActions } from "../../../../../reducers/indexSettingsReducer"

const PrefixSearchSetting = () => {
    const { settings, dispatch } = useIndexSettings()

    const handleChange = (value: string) => {
        dispatch({
            type: IndexSettingsActions.Update,
            payload: { prefixSearch: value }
        });
    };

    return <div>
        <DocHeader
            title={"Prefix Search"}
            badge={"prefixSearch"}
            description={"Configure when prefix search is applied. Default value: indexingTime"}
            link={"https://www.meilisearch.com/docs/reference/api/settings#prefix-search"}
        />
        <select
            value={settings.prefixSearch}
            onChange={(e) => handleChange(e.target.value)}
            className="w-full p-2 stl-select-input"
        >
            <option value="indexingTime">indexingTime</option>
            <option value="disabled">disabled</option>
        </select>
    </div>
}

export default PrefixSearchSetting
