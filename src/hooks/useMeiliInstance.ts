import { useContext } from "react";
import InstanceContext from '../contexts/InstanceContext';

const useMeiliInstance = () => {
    const context = useContext(InstanceContext);
    if (!context) {
        throw new Error('useMeiliInstance must be used within an InstanceProvider');
    }
    return context;
};

export default useMeiliInstance;
