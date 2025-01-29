// @ts-ignore
import React from "react"
import DynamicTextBoxes from "../../../../commons/DynamicTextboxes"
import DocHeader from "./DocHeader"

import useIndexSettings from "../../../../../hooks/useIndexSettings"

export const SearchableAttrs = () => {
    const { settings } = useIndexSettings()
    
    return <div>
        <DocHeader 
            title={"Searchable Attributes"}
            badge={"searchableAttributes"}
            description={"The complete list of attributes that will be used for searching. Default value: ['*']"}
            link={"https://www.meilisearch.com/docs/learn/relevancy/displayed_searchable_attributes#the-searchableattributes-list"}
        />
        <DynamicTextBoxes
            buttonText="+ Add a Searchable Attribute"
            initialTextboxValues={settings.searchableAttributes}
        />
    </div>
}