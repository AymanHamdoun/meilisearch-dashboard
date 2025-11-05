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
        <DynamicTextBoxes
            buttonText="+ Add a Ranking Attribute"
            initialTextboxValues={settings.rankingRules}
            onChange={handleRankingRulesChange}
            reorderable={true}
        />
    </div>
}

export default RankingInfo;