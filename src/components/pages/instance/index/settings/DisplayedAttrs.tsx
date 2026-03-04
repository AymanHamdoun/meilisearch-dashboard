// @ts-ignore
import React from "react"
import DynamicTextBoxes from "../../../../commons/DynamicTextboxes"
import DocHeader from "./DocHeader"

import useIndexSettings from "../../../../../hooks/useIndexSettings"
import { IndexSettingsActions } from "../../../../../reducers/indexSettingsReducer"

export const DisplayedAttrs = () => {
    const { settings, dispatch } = useIndexSettings()

    const handleChange = (values: string[]) => {
        dispatch({
            type: IndexSettingsActions.Update,
            payload: { displayedAttributes: values }
        });
    };

    return <div>
        <DocHeader
            title={"Displayed Attributes"}
            badge={"displayedAttributes"}
            description={"Fields displayed in the returned documents. Default value: ['*']"}
            link={"https://www.meilisearch.com/docs/learn/relevancy/displayed_searchable_attributes#displayed-fields"}
        />
        <DynamicTextBoxes
            buttonText="+ Add a Displayed Attribute"
            initialTextboxValues={settings.displayedAttributes}
            onChange={handleChange}
        />
    </div>
}
