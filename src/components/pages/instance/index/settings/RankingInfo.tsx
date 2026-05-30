import useIndexSettings from "../../../../../hooks/useIndexSettings";
import DynamicTextBoxes from "../../../../commons/DynamicTextboxes";
// @ts-ignore
import React from "react";
import DocHeader from "./DocHeader";
import { IndexSettingsActions } from "../../../../../reducers/indexSettingsReducer";

const RankingInfo = () => {
    const { settings, dispatch } = useIndexSettings()

    const handleRankingRulesChange = (values: string[]) => {
        dispatch({
            type: IndexSettingsActions.Update,
            payload: { rankingRules: values }
        });
    };

    return <div>
        <DocHeader
            title={"Ranking Rules"}
            badge={"rankingRules"}
            description={"The complete list of ranking rules used for relevancy tuning. Default value:"}
            link={"https://www.meilisearch.com/docs/learn/relevancy/ranking_rules"}
        />
        <div className={"mb-4"}>
            <code className={"bg-gray-100 text-sm p-1 rounded"}>[ "words", "typo", "proximity", "attribute", "sort",
                "exactness" ]</code>
        </div>
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded text-sm text-blue-800">
            <p className="font-medium mb-1">Available ranking rules:</p>
            <p><code className="bg-blue-100 px-1 rounded">words</code>, <code className="bg-blue-100 px-1 rounded">typo</code>, <code className="bg-blue-100 px-1 rounded">proximity</code>, <code className="bg-blue-100 px-1 rounded">attribute</code>, <code className="bg-blue-100 px-1 rounded">sort</code>, <code className="bg-blue-100 px-1 rounded">exactness</code></p>
            <p className="mt-1">Custom rules: <code className="bg-blue-100 px-1 rounded">attribute_name:asc</code> or <code className="bg-blue-100 px-1 rounded">attribute_name:desc</code> for sort-based ranking.</p>
        </div>
        <DynamicTextBoxes
            buttonText="+ Add a Ranking Rule"
            initialTextboxValues={settings.rankingRules}
            onChange={handleRankingRulesChange}
            reorderable={true}
        />
    </div>
}

export default RankingInfo;