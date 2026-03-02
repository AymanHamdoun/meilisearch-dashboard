// @ts-ignore
import React from "react"
import DocHeader from "./DocHeader"

import useIndexSettings from "../../../../../hooks/useIndexSettings"
import { IndexSettingsActions } from "../../../../../reducers/indexSettingsReducer"

const ProximityPrecision = () => {
    const { settings, dispatch } = useIndexSettings()

    const handleChange = (value: string) => {
        dispatch({
            type: IndexSettingsActions.Update,
            payload: { proximityPrecision: value }
        });
    };

    return <div>
        <DocHeader
            title={"Proximity Precision"}
            badge={"proximityPrecision"}
            description={"Precision level when calculating the proximity ranking rule. Default value: byWord"}
            link={"https://www.meilisearch.com/docs/reference/api/settings#proximity-precision"}
        />
        <select
            value={settings.proximityPrecision}
            onChange={(e) => handleChange(e.target.value)}
            className="w-full p-2 stl-select-input"
        >
            <option value="byWord">byWord</option>
            <option value="byAttribute">byAttribute</option>
        </select>
    </div>
}

export default ProximityPrecision
