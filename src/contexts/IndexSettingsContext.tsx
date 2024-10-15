import React, {createContext, useEffect, useReducer, Dispatch, ReactNode} from "react";
import PropTypes from "prop-types";
import indexSettingsReducer, { IndexSettingsActions, ReducerAction } from "../reducers/indexSettingsReducer";

import {APISettings} from "../services/meilisearch/types"
import {getIndexSettings} from "../services/meilisearch/settings"
import useIndex from "../hooks/useMeiliIndex";
import useMeiliInstance from "../hooks/useMeiliInstance";

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
    const {meiliIndexState} = useIndex()
    const {instanceState} = useMeiliInstance()

    useEffect(() => {
        // Call ping() to check if the user is authenticated
        getIndexSettings({
            instanceKey: instanceState.key,
            indexName: meiliIndexState.selectedIndex
        }).then((response) => {
            dispatch({ type: IndexSettingsActions.Set, payload: response });
        })
    }, []); // Empty dependency array ensures this runs only once on component mount


    return <IndexSettingsContext.Provider value={{settings, dispatch}}>
        {children}
    </IndexSettingsContext.Provider>;
}

export default IndexSettingsContext;