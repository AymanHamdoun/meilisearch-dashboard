import React, {createContext, useEffect, useReducer, Dispatch, ReactNode} from "react";
import PropTypes from "prop-types";
import indexSettingsReducer, { ReducerAction } from "../reducers/indexSettingsReducer";

import {APISettings} from "../services/meilisearch/types"

export const _defaultState: APISettings = {
    displayedAttributes: [],
    searchableAttributes: [],
    filterableAttributes: [],
    sortableAttributes: [],
    rankingRules: [],
    stopWords: [],
    nonSeparatorTokens: [],
    separatorTokens: [],
    dictionary: [],
    synonyms: {},
    distinctAttribute: null,
    proximityPrecision: "",
    typoTolerance: {
        enabled: false,
        minWordSizeForTypos: {
            oneTypo: 0,
            twoTypos: 0
        },
        disableOnWords: [],
        disableOnAttributes: []
    },
    faceting: {
        maxValuesPerFacet: 0,
        sortFacetValuesBy: {}
    },
    pagination: {
        maxTotalHits: 0
    },
    searchCutoffMs: null,
    localizedAttributes: null
}

type ContextType = {
    settings: APISettings;
    dispatch: Dispatch<ReducerAction>;
}

// Update the Dispatch type
const IndexSettingsContext = createContext<ContextType>({
    settings: _defaultState,
    dispatch: () => undefined,
  });

export const IndexSettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [settings, dispatch] = useReducer(indexSettingsReducer, _defaultState);

    return <IndexSettingsContext.Provider value={{settings, dispatch}}>
        {children}
    </IndexSettingsContext.Provider>;
}

export default IndexSettingsContext;