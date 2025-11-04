import {_defaultState} from "../contexts/IndexSettingsContext.jsx";
import { APISettings } from "../services/meilisearch/types.js";

export enum IndexSettingsActions {
    Set = "set",
    Update = "update",
}

export type ReducerAction = {
    type: string,
    payload: APISettings | Partial<APISettings>
}

const indexSettingsReducer = (state, action: ReducerAction) => {
    switch (action.type as IndexSettingsActions) {
        case IndexSettingsActions.Set: {
            return {
                ...action.payload
            };
        }
        case IndexSettingsActions.Update: {
            return {
                ...state,
                ...action.payload
            };
        }
        default:
            return state;
    }
}

export default indexSettingsReducer;