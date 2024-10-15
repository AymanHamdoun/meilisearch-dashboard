import {_defaultState} from "../contexts/IndexSettingsContext.jsx";
import { APISettings } from "../services/meilisearch/types.js";

export enum IndexSettingsActions {
    Update = "update",
}

export type ReducerAction = {
    type: string,
    payload: APISettings
}

const indexSettingsReducer = (state, action: ReducerAction) => {
    switch (action.type as IndexSettingsActions) {
        case IndexSettingsActions.Update: {
            return {
                ...state
            };
        }
        default:
            return state;
    }
}

export default indexSettingsReducer;