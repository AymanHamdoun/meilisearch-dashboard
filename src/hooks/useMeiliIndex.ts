import { useContext } from "react";
import MeiliIndexContext from '../contexts/MeiliIndexContext';

const useIndex = () => {
    const context = useContext(MeiliIndexContext);
    if (!context) {
        throw new Error('useIndex must be used within an MeiliIndexProvider');
    }
    return context;
};

export default useIndex;
