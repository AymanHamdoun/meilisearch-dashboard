// @ts-ignore
import React from "react"
import DynamicTextBoxes from "../../../../commons/DynamicTextboxes"
import DocHeader from "./DocHeader"

import useIndexSettings from "../../../../../hooks/useIndexSettings"
import { IndexSettingsActions } from "../../../../../reducers/indexSettingsReducer"

export const SeparatorTokens = () => {
    const { settings, dispatch } = useIndexSettings()

    const handleChange = (values: string[]) => {
        dispatch({
            type: IndexSettingsActions.Update,
            payload: { separatorTokens: values }
        });
    };

    return <div>
        <DocHeader
            title={"Separator Tokens"}
            badge={"separatorTokens"}
            description={"Characters treated as word separators. Default value: []"}
            link={"https://www.meilisearch.com/docs/reference/api/settings#separator-tokens"}
        />
        <DynamicTextBoxes
            buttonText="+ Add a Separator Token"
            initialTextboxValues={settings.separatorTokens}
            onChange={handleChange}
        />
    </div>
}
