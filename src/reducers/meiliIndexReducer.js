import {_defaultState} from "../contexts/MeiliIndexContext.jsx";

/**
 * Enum for meiliIndex-state values.
 * @readonly
 * @enum {string}
 */
export const MeiliIndexAction = {
    Change: 'CHANGE',
    SetFromIndexList: 'SET_FROM_INDEXES',
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
        case MeiliIndexAction.SetFromIndexList: {
            const indexList = action.payload;
            
            const newMeiliIndexState = {
                availableIndexes: [],
                selectedIndex: ""
            }
            
            indexList.map((indexObject) => {
                newMeiliIndexState.availableIndexes.push(indexObject.uid)
            })

            if (state.selectedIndex === "" && newMeiliIndexState.availableIndexes.length > 0) {
                newMeiliIndexState.selectedIndex = newMeiliIndexState.availableIndexes[0]
            }

            localStorage.setItem("indexes", JSON.stringify(newMeiliIndexState));
            return {
                ...newMeiliIndexState
            };
        }
        case MeiliIndexAction.Change: {
            /**
             * The form data state.
             * @type {MeiliIndexState}
             */
            const meiliIndexState = state;
            meiliIndexState.selectedIndex = action.payload;
            localStorage.setItem("indexes", JSON.stringify(meiliIndexState));
            return {
                ...meiliIndexState
            };
        }
        default:
            return state;
    }
}

export default meiliIndexReducer;