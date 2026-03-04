// @ts-ignore
import React, { useEffect, useState } from "react"
import DynamicTextBoxes from "../../../../commons/DynamicTextboxes"
import DocHeader from "./DocHeader"

import useIndexSettings from "../../../../../hooks/useIndexSettings"
import { IndexSettingsActions } from "../../../../../reducers/indexSettingsReducer"
import { ApiSettingsLocalizedAttribute } from "../../../../../services/meilisearch/types"

const LocalizedAttributes = () => {
    const { settings, dispatch } = useIndexSettings()
    const [groups, setGroups] = useState<ApiSettingsLocalizedAttribute[]>(settings.localizedAttributes || [])

    useEffect(() => {
        setGroups(settings.localizedAttributes || [])
    }, [settings.localizedAttributes])

    const updateGroups = (newGroups: ApiSettingsLocalizedAttribute[]) => {
        setGroups(newGroups);
        dispatch({
            type: IndexSettingsActions.Update,
            payload: { localizedAttributes: newGroups.length > 0 ? newGroups : null }
        });
    }

    const handleAddGroup = () => {
        updateGroups([...groups, { attributePatterns: [], locales: [] }])
    }

    const handleRemoveGroup = (index: number) => {
        updateGroups(groups.filter((_, i) => i !== index))
    }

    const handlePatternsChange = (index: number, patterns: string[]) => {
        const newGroups = [...groups]
        newGroups[index] = { ...newGroups[index], attributePatterns: patterns }
        updateGroups(newGroups)
    }

    const handleLocalesChange = (index: number, locales: string[]) => {
        const newGroups = [...groups]
        newGroups[index] = { ...newGroups[index], locales: locales }
        updateGroups(newGroups)
    }

    return <div>
        <DocHeader
            title={"Localized Attributes"}
            badge={"localizedAttributes"}
            description={"Define locales for specific attributes to improve relevancy for multilingual content. Default value: null"}
            link={"https://www.meilisearch.com/docs/reference/api/settings#localized-attributes"}
        />
        <div className="flex flex-col gap-4">
            {groups.map((group, index) => (
                <div key={index} className="border border-gray-200 rounded p-3 bg-gray-50">
                    <div className="flex justify-between items-center mb-3">
                        <span className="text-sm font-medium text-gray-600">Rule {index + 1}</span>
                        <button
                            onClick={() => handleRemoveGroup(index)}
                            className="border border-gray-200 rounded-sm p-2 hover:border-red-400 text-sm text-gray-500"
                        >
                            Remove
                        </button>
                    </div>
                    <div className="mb-3">
                        <p className="text-xs text-gray-500 mb-1">Attribute Patterns (e.g. "*", "title_*"):</p>
                        <DynamicTextBoxes
                            buttonText="+ Add Pattern"
                            initialTextboxValues={group.attributePatterns}
                            onChange={(vals) => handlePatternsChange(index, vals)}
                        />
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 mb-1">Locales (e.g. "eng", "fra", "jpn"):</p>
                        <DynamicTextBoxes
                            buttonText="+ Add Locale"
                            initialTextboxValues={group.locales}
                            onChange={(vals) => handleLocalesChange(index, vals)}
                        />
                    </div>
                </div>
            ))}
            <button
                onClick={handleAddGroup}
                className="border border-gray-300 rounded-sm py-2 px-3 hover:bg-primary hover:text-white transition-all ease-in-out w-full"
            >
                + Add Localization Rule
            </button>
        </div>
    </div>
}

export default LocalizedAttributes
