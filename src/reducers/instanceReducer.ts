import {useNavigate} from "react-router-dom";

export const InstanceAction = {
    Set: 'SET',
    Load: 'LOAD',
}

const instanceReducer = (state, action) => {
    switch (action.type) {
        case InstanceAction.Set: {
            const instanceState = action.payload;
            localStorage.setItem("instance", JSON.stringify(instanceState));
            return {
                ...instanceState,
            };
        }
        // Load JSON from local storage
        case InstanceAction.Load: {
            const localInstanceJSON = localStorage.getItem("instance");
            const info = JSON.parse(localInstanceJSON);
            if (localInstanceJSON == null || localInstanceJSON.length == 0 || !info) {
                return {
                    ...state,
                    isLoaded: true,
                }
            }

            return {
                ...info,
                isSet: true,
                isLoaded: true
            }
        }
        default:
            return state;
    }
}

export default instanceReducer;