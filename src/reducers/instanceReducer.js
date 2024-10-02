import {_defaultState} from "../contexts/InstanceContext.jsx";

/**
 * Enum for instance-state values.
 * @readonly
 * @enum {string}
 */
export const InstanceAction = {
    Set: 'SET',
}

/**
 * Reducer function to handle authentication state changes.
 *
 * @param {InstanceState} state - The current state of authentication.
 * @param {Object} action - An action object to determine how to update the state.
 * @param {string} action.type - The type of action to perform.
 * @param {InstanceState} [action.payload] - The payload containing meilisearch instance data.
 * @returns {InstanceState} The new state after applying the action.
 */
const instanceReducer = (state, action) => {
    switch (action.type) {
        case InstanceAction.Set: {
            /**
             * The form data state.
             * @type {InstanceState}
             */
            const instanceState = action.payload;
            localStorage.setItem("instance", JSON.stringify(instanceState));
            return instanceState;
        }
        default:
            return state;
    }
}

export default instanceReducer;