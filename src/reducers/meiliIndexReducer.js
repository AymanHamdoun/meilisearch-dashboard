
/**
 * Enum for meiliIndex-state values.
 * @readonly
 * @enum {string}
 */
export const MeiliIndexAction = {
    Change: 'CHANGE',
    SetFromIndexList: 'SET_FROM_INDEXES',
    SetAndDefaultTo: 'SET_FROM_AND_DEFAULT',
    RefreshIndexes: 'REFRESH_INDEXES',
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
        case MeiliIndexAction.SetAndDefaultTo: {
            const {indexList, defaultIndexName} = action.payload;
            const newMeiliIndexState = {
                availableIndexes: [],
                selectedIndex: ""
            }
            
            indexList.map((indexObject) => {
                newMeiliIndexState.availableIndexes.push(indexObject.uid)
            })

            newMeiliIndexState.selectedIndex = defaultIndexName;

            localStorage.setItem("indexes", JSON.stringify(newMeiliIndexState));
            return {
                ...newMeiliIndexState
            };
        }
        case MeiliIndexAction.SetFromIndexList: {
            const indexList = action.payload;

            const newMeiliIndexState = {
                availableIndexes: [],
                selectedIndex: state.selectedIndex
            }
            
            indexList.map((indexObject) => {
                newMeiliIndexState.availableIndexes.push(indexObject.uid)
            })

            // Check if the currently selected index is no longer available
            const currentIndexStillExists = newMeiliIndexState.availableIndexes.includes(state.selectedIndex);

            if (!currentIndexStillExists || state.selectedIndex === "") {
                // If current index was deleted or none selected, pick the first available
                if (newMeiliIndexState.availableIndexes.length > 0) {
                    newMeiliIndexState.selectedIndex = newMeiliIndexState.availableIndexes[0];
                } else {
                    // No indexes available
                    newMeiliIndexState.selectedIndex = "";
                }
            }

            localStorage.setItem("indexes", JSON.stringify(newMeiliIndexState));
            return {
                ...newMeiliIndexState
            };
        }
        case MeiliIndexAction.Change: {
            const newMeiliIndexState = {
                ...state,
                selectedIndex: action.payload
            };
            localStorage.setItem("indexes", JSON.stringify(newMeiliIndexState));
            return newMeiliIndexState;
        }
        default:
            return state;
    }
}

export default meiliIndexReducer;