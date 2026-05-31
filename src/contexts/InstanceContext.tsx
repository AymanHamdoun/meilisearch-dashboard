import {createContext, useEffect, useMemo, useReducer} from "react";
import instanceReducer, {InstanceAction} from "../reducers/instanceReducer";

export type InstanceState = {
    label: string,
    host: string,
    key: string,
    isSet: boolean,
    isLoaded: boolean
}

export const _defaultState: InstanceState = {
    label: "Not Set",
    host: "http://localhost:7700",
    key: "",
    isSet: false,
    isLoaded: false
}

const InstanceContext = createContext({
    instanceState: _defaultState,
    dispatch: (action) => {}
});

export const InstanceProvider = ({ children }) => {
    const [instanceState, dispatch] = useReducer(instanceReducer, _defaultState);

    useEffect(() => {
        dispatch({type: InstanceAction.Load, payload: {}})
    }, [])

    const value = useMemo(() => ({ instanceState, dispatch }), [instanceState]);

    return <InstanceContext.Provider value={value}>
        {children}
    </InstanceContext.Provider>;
}

export default InstanceContext;