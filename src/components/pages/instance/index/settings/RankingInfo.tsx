import useIndexSettings from "../../../../../hooks/useIndexSettings";
import DynamicTextBoxes from "../../../../commons/DynamicTextboxes";
// @ts-ignore
import React from "react";
import DocHeader from "./DocHeader";

const RankingInfo = () => {
    const { settings } = useIndexSettings()

    return <div>
        <DocHeader
            title={"Ranking Rules"}
            badge={"rankingRules"}
            description={"The complete list of ranking rules used for relevancy tuning. Default value: ['*']"}
            link={"https://www.meilisearch.com/docs/learn/relevancy/ranking_rules"}
        />
        <DynamicTextBoxes
            buttonText="+ Add a Ranking Attribute"
            initialTextboxValues={settings.rankingRules}
        />
    </div>
}

export default RankingInfo;