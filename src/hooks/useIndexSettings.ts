// @ts-ignore
import React from "react";
import IndexSettingsContext from '../contexts/IndexSettingsContext'

const useIndexSettings = () => {
    const context = React.useContext(IndexSettingsContext);
    if (!context) {
        throw new Error('useIndexSettings must be used within an InstanceProvider');
    }
    return context;
};

export default useIndexSettings;