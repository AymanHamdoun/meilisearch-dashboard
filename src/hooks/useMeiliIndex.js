import React from "react";
import MeiliIndexContext from '../contexts/MeiliIndexContext'

const useMeiliMeiliIndex = () => {
    const context = React.useContext(MeiliIndexContext);
    if (!context) {
        throw new Error('useMeiliMeiliIndex must be used within an MeiliIndexProvider');
    }
    return context;
};

export default useMeiliMeiliIndex;