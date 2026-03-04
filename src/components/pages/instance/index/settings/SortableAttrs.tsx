// @ts-ignore
import React from "react"
import DynamicTextBoxes from "../../../../commons/DynamicTextboxes"
import DocHeader from "./DocHeader"

import useIndexSettings from "../../../../../hooks/useIndexSettings"
import { IndexSettingsActions } from "../../../../../reducers/indexSettingsReducer"

export const SortableAttrs = () => {
    const { settings, dispatch } = useIndexSettings()

    const handleChange = (values: string[]) => {
        dispatch({
            type: IndexSettingsActions.Update,
            payload: { sortableAttributes: values }
        });
    };

    return <div>
        <DocHeader
            title={"Sortable Attributes"}
            badge={"sortableAttributes"}
            description={"Attributes that can be used for sorting search results. Default value: []"}
            link={"https://www.meilisearch.com/docs/learn/filtering_and_sorting/sort_search_results"}
        />
        <DynamicTextBoxes
            buttonText="+ Add a Sortable Attribute"
            initialTextboxValues={settings.sortableAttributes}
            onChange={handleChange}
        />
    </div>
}
