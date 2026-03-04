// @ts-ignore
import React from "react"
import DynamicTextBoxes from "../../../../commons/DynamicTextboxes"
import DocHeader from "./DocHeader"

import useIndexSettings from "../../../../../hooks/useIndexSettings"
import { IndexSettingsActions } from "../../../../../reducers/indexSettingsReducer"

export const Dictionary = () => {
    const { settings, dispatch } = useIndexSettings()

    const handleChange = (values: string[]) => {
        dispatch({
            type: IndexSettingsActions.Update,
            payload: { dictionary: values }
        });
    };

    return <div>
        <DocHeader
            title={"Dictionary"}
            badge={"dictionary"}
            description={"Custom dictionary words for the tokenizer. Default value: []"}
            link={"https://www.meilisearch.com/docs/reference/api/settings#dictionary"}
        />
        <DynamicTextBoxes
            buttonText="+ Add a Dictionary Word"
            initialTextboxValues={settings.dictionary}
            onChange={handleChange}
        />
    </div>
}
