import {_defaultState} from "../contexts/MeiliIndexContext.jsx";

/**
 * Enum for meiliIndex-state values.
 * @readonly
 * @enum {string}
 */
export const MeiliIndexAction = {
    Set: 'SET',
    Change: 'CHANGE',
}

/**
 * Reducer function to handle authentication state changes.
 *
 * @param {MeiliIndexState} state - The current state of authentication.
 * @param {Object} action - An action object to determine how to update the state.
 * @param {string} action.type - The type of action to perform.
 * @param {MeiliIndexState} [action.payload] - The payload containing meilisearch meiliIndex data.
 * @returns {MeiliIndexState} The new state after applying the action.
 */
const meiliIndexReducer = (state, action) => {
    switch (action.type) {
        case MeiliIndexAction.Set: {
            /**
             * The form data state.
             * @type {MeiliIndexState}
             */
            const meiliIndexState = action.payload;
            localStorage.setItem("indexes", JSON.stringify(meiliIndexState));
            return meiliIndexState;
        }
        case MeiliIndexAction.Change: {
            /**
             * The form data state.
             * @type {MeiliIndexState}
             */
            const meiliIndexState = state;
            meiliIndexState.selectedIndex = action.payload;
            localStorage.setItem("indexes", JSON.stringify(meiliIndexState));
            return meiliIndexState;
        }
        default:
            return state;
    }
}

export default meiliIndexReducer;