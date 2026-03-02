// @ts-ignore
import React from "react"
import DynamicTextBoxes from "../../../../commons/DynamicTextboxes"
import DocHeader from "./DocHeader"

import useIndexSettings from "../../../../../hooks/useIndexSettings"
import { IndexSettingsActions } from "../../../../../reducers/indexSettingsReducer"

export const StopWords = () => {
    const { settings, dispatch } = useIndexSettings()

    const handleChange = (values: string[]) => {
        dispatch({
            type: IndexSettingsActions.Update,
            payload: { stopWords: values }
        });
    };

    return <div>
        <DocHeader
            title={"Stop Words"}
            badge={"stopWords"}
            description={"Words ignored in search queries. Default value: []"}
            link={"https://www.meilisearch.com/docs/reference/api/settings#stop-words"}
        />
        <DynamicTextBoxes
            buttonText="+ Add a Stop Word"
            initialTextboxValues={settings.stopWords}
            onChange={handleChange}
        />
    </div>
}
