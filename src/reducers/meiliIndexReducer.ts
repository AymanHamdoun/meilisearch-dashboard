export interface MeiliIndexState {
    selectedIndex: string;
    availableIndexes: string[];
}

export const MeiliIndexAction = {
    Change: 'CHANGE',
    SetFromIndexList: 'SET_FROM_INDEXES',
    SetAndDefaultTo: 'SET_FROM_AND_DEFAULT',
    RefreshIndexes: 'REFRESH_INDEXES',
} as const;

interface IndexObject {
    uid: string;
}

interface SetAndDefaultToPayload {
    indexList: IndexObject[];
    defaultIndexName: string;
}

export interface MeiliIndexReducerAction {
    type: string;
    payload?: any;
}

const meiliIndexReducer = (state: MeiliIndexState, action: MeiliIndexReducerAction): MeiliIndexState => {
    switch (action.type) {
        case MeiliIndexAction.SetAndDefaultTo: {
            const { indexList, defaultIndexName } = action.payload as SetAndDefaultToPayload;
            const newState: MeiliIndexState = {
                availableIndexes: indexList.map((o) => o.uid),
                selectedIndex: defaultIndexName,
            };
            localStorage.setItem("indexes", JSON.stringify(newState));
            return newState;
        }
        case MeiliIndexAction.SetFromIndexList: {
            const indexList = action.payload as IndexObject[];
            const availableIndexes = indexList.map((o) => o.uid);
            const currentExists = availableIndexes.includes(state.selectedIndex);
            const selectedIndex =
                currentExists && state.selectedIndex !== ""
                    ? state.selectedIndex
                    : availableIndexes[0] ?? "";
            const newState: MeiliIndexState = { availableIndexes, selectedIndex };
            localStorage.setItem("indexes", JSON.stringify(newState));
            return newState;
        }
        case MeiliIndexAction.Change: {
            const newState: MeiliIndexState = { ...state, selectedIndex: action.payload as string };
            localStorage.setItem("indexes", JSON.stringify(newState));
            return newState;
        }
        default:
            return state;
    }
}

export default meiliIndexReducer;
