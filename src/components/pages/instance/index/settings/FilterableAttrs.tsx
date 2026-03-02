// @ts-ignore
import React from "react"
import DynamicTextBoxes from "../../../../commons/DynamicTextboxes"
import DocHeader from "./DocHeader"

import useIndexSettings from "../../../../../hooks/useIndexSettings"
import { IndexSettingsActions } from "../../../../../reducers/indexSettingsReducer"

export const FilterableAttrs = () => {
    const { settings, dispatch } = useIndexSettings()

    const handleChange = (values: string[]) => {
        dispatch({
            type: IndexSettingsActions.Update,
            payload: { filterableAttributes: values }
        });
    };

    return <div>
        <DocHeader
            title={"Filterable Attributes"}
            badge={"filterableAttributes"}
            description={"Attributes that can be used as filters and facets. Default value: []"}
            link={"https://www.meilisearch.com/docs/learn/filtering_and_sorting/search_with_filters"}
        />
        <DynamicTextBoxes
            buttonText="+ Add a Filterable Attribute"
            initialTextboxValues={settings.filterableAttributes}
            onChange={handleChange}
        />
    </div>
}
