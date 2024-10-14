import React from "react"
import DynamicTextBoxes from "../../../../commons/DynamicTextboxes"

export const SearchableAttrs = ({settings}) => {
    return <div>
        <DynamicTextBoxes label="Searchable Attributes" initialTextboxValues={settings.searchableAttributes}/>
    </div>
}