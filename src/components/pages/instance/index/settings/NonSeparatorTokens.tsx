// @ts-ignore
import React from "react"
import DynamicTextBoxes from "../../../../commons/DynamicTextboxes"
import DocHeader from "./DocHeader"

import useIndexSettings from "../../../../../hooks/useIndexSettings"
import { IndexSettingsActions } from "../../../../../reducers/indexSettingsReducer"

export const NonSeparatorTokens = () => {
    const { settings, dispatch } = useIndexSettings()

    const handleChange = (values: string[]) => {
        dispatch({
            type: IndexSettingsActions.Update,
            payload: { nonSeparatorTokens: values }
        });
    };

    return <div>
        <DocHeader
            title={"Non-Separator Tokens"}
            badge={"nonSeparatorTokens"}
            description={"Characters that should not be treated as word separators. Default value: []"}
            link={"https://www.meilisearch.com/docs/reference/api/settings#non-separator-tokens"}
        />
        <DynamicTextBoxes
            buttonText="+ Add a Non-Separator Token"
            initialTextboxValues={settings.nonSeparatorTokens}
            onChange={handleChange}
        />
    </div>
}
