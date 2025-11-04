// @ts-ignore
import React, { useEffect, useState } from "react";
import DocHeader from "./DocHeader"
import DynamicTextBoxes from "../../../../commons/DynamicTextboxes"
import useIndexSettings from "../../../../../hooks/useIndexSettings"
import { IndexSettingsActions } from "../../../../../reducers/indexSettingsReducer"

const TypoTolerance = () => {
    const { settings, dispatch } = useIndexSettings()

    const [typoTolerance, setTypoTolerance] = useState(settings.typoTolerance)

    useEffect(() => {
        setTypoTolerance(settings.typoTolerance)
    }, [settings.typoTolerance])

    const updateTypoTolerance = (newTypoTolerance: any) => {
        setTypoTolerance(newTypoTolerance);
        dispatch({
            type: IndexSettingsActions.Update,
            payload: { typoTolerance: newTypoTolerance }
        });
    }
    
    return <div className="flex flex-col gap-8">
        <div>
            <DocHeader 
                title={"Typo Tolerance"}
                badge={"typoTolerance"}
                description={"Define if and how typo-tolerance is applied. Default value: true"}
                link={"https://www.meilisearch.com/docs/learn/relevancy/typo_tolerance_settings"}
            />
            <select name="typoTolerance" 
                    className="w-full p-2 stl-select-input" 
                    value={typoTolerance.enabled ? "true" : "false"}
                    onChange={(e) => {
                        updateTypoTolerance({
                            ...typoTolerance,
                            enabled: e.target.value === "true"
                        })
                    }}
                >
                <option value="true">true</option>
                <option value="false">false</option>
            </select>
        </div>
        <div>
            <DocHeader 
                title={"Min chars to accept 1 typo"}
                badge={"minWordSizeForTypos.oneTypo"}
                description={"Minimum number of characters a word in the query string must contain to accept matches with 1 typo. Default value: 4"}
                link={"https://www.meilisearch.com/docs/learn/relevancy/typo_tolerance_settings#minwordsizefortypos"}
            />
            <input  type="number" 
                    value={typoTolerance.minWordSizeForTypos.oneTypo}
                    onChange={(e) => {
                        updateTypoTolerance({
                            ...typoTolerance,
                            minWordSizeForTypos: {
                                ...typoTolerance.minWordSizeForTypos,
                                oneTypo: parseInt(e.target.value)
                            }
                        })
                    }}
                    className="w-full p-2 border border-gray-300"/>
        </div>
        <div>
            <DocHeader 
                title={"Min chars to accept 2 typos"}
                badge={"minWordSizeForTypos.twoTypos"}
                description={"Minimum number of characters a word in the query string must contain to accept matches with 2 typos. Default value: 9"}
                link={"https://www.meilisearch.com/docs/learn/relevancy/typo_tolerance_settings#minwordsizefortypos"}
            />
            <input  type="number" 
                    value={typoTolerance.minWordSizeForTypos.twoTypos}
                    onChange={(e) => {
                        updateTypoTolerance({
                            ...typoTolerance,
                            minWordSizeForTypos: {
                                ...typoTolerance.minWordSizeForTypos,
                                twoTypos: parseInt(e.target.value)
                            }
                        })
                    }}
                    className="w-full p-2 border border-gray-300"/>
        </div>
        <div>
            <DocHeader 
                title={"Disable typo tolerance on attributes"}
                badge={"disableOnAttributes"}
                description={"List of attributes on which you want to disable typo tolerance. Default value: []"}
                link={"https://www.meilisearch.com/docs/reference/api/settings#typo-tolerance-object"}
            />
            <DynamicTextBoxes
                buttonText="+ Add attribute"
                initialTextboxValues={typoTolerance.disableOnAttributes}
                onChange={(values) => {
                    updateTypoTolerance({
                        ...typoTolerance,
                        disableOnAttributes: values
                    })
                }}
            />
        </div>
        <div>
            <DocHeader 
                title={"Disable typo tolerance on words"}
                badge={"disableOnWords"}
                description={"List of words on which you want to disable typo tolerance. Default value: []"}
                link={"https://www.meilisearch.com/docs/reference/api/settings#typo-tolerance-object"}
            />
            <DynamicTextBoxes
                buttonText="+ Add attribute"
                initialTextboxValues={typoTolerance.disableOnWords}
                onChange={(values) => {
                    updateTypoTolerance({
                        ...typoTolerance,
                        disableOnWords: values
                    })
                }}
            />
        </div>
    </div>
}

export default TypoTolerance;