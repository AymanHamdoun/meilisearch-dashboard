import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import useMeiliInstance from '../../hooks/useMeiliInstance'
import useIndex from '../../hooks/useMeiliIndex'
import { MeiliIndexAction } from "../../reducers/meiliIndexReducer";
import { useDashboardModal } from "../layouts/DashboardLayout";
import { PlusIcon } from "./SideBar";

/**
 * Navbar component that renders the logged-in Navbar.
 * @component
 * @returns {JSX.Element} The rendered contact page.
 */
const Navbar = () => {
    return <nav className="w-full bg-transparent border-b border-b-gray-200">
        <div className="px-3 py-5 lg:px-5 lg:pl-3">
            <div className="flex items-center justify-between">
                <div className="flex flex-row gap-3">
                    <InstanceDropdown />
                    <IndexDropdown />
                </div>
                <div className="flex items-center justify-start rtl:justify-end">
                    <button data-drawer-target="default-sidebar" data-drawer-toggle="default-sidebar" aria-controls="default-sidebar" type="button" className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600">
                        <span className="sr-only">Open sidebar</span>
                        <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path clipRule="evenodd" fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
                        </svg>
                    </button>
                </div>
                <div className="flex items-center gap-3">
                    <CreateIndexButton />
                    <DashboardSettingsLink />
                </div>
            </div>
        </div>
    </nav>
}

export default Navbar;

/**
 * CreateIndexButton component for creating new indexes
 * @returns {JSX.Element}
 */
const CreateIndexButton = () => {
    const { setShowIndexCreationModal } = useDashboardModal();

    return (
        <button
            onClick={() => setShowIndexCreationModal(true)}
            className="p-2 text-gray-500 hover:text-primary hover:bg-gray-50 rounded-lg transition-colors"
            title="Create New Index"
        >
            {PlusIcon}
        </button>
    );
};

/**
 * DashboardSettingsLink component — gear icon linking to dashboard settings.
 * @component
 * @returns {JSX.Element}
 */
const DashboardSettingsLink = () => {
    return (
        <Link
            to="/instance/dashboard-settings"
            className="p-2 text-gray-500 hover:text-primary hover:bg-gray-50 rounded-lg transition-colors"
            title="Dashboard Settings"
        >
            <svg xmlns="http://www.w3.org/2000/svg" width="1.25rem" height="1.25rem" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
                <circle cx="12" cy="12" r="3"/>
            </svg>
        </Link>
    );
};

/**
 * InstanceDropdown 
 * @returns {JSX.Element}
 */
const InstanceDropdown = () => {
        /**
     * The form data state.
     * @type {InstanceState}
     */
    const { instanceState } = useMeiliInstance()

    return <div className="flex flex-row gap-3 items-center justify-center">
        <label className="text-sm text-gray-500" htmlFor="">INSTANCE</label>
        <button data-modal-target="instance-modal" 
                data-modal-toggle="instance-modal" 
                type="button"
                className="px-3 py-1 border border-transparent rounded transition-all ease-in-out hover:border-primary text-primary focus:border-primary">
            {instanceState.label}
        </button>
    </div>
}

/**
 * IndexDropdown 
 * @returns {JSX.Element}
 */
const IndexDropdown = () => {
    const { meiliIndexState, dispatch } = useIndex()
    const location = useLocation();

    useEffect(() => {}, [meiliIndexState.availableIndexes, meiliIndexState.selectedIndex])

    const indexSpecificPaths = [
        "/instance/index"
    ]

    if (!indexSpecificPaths.includes(location.pathname)) {
        return <></>
    }

    const changeSelectedIndex = (indexName) => {
        dispatch({ type: MeiliIndexAction.Change, payload: indexName })
    }

    return <div className="flex flex-row gap-3 items-center">
        <label className="text-sm text-gray-500" htmlFor="">INDEX</label>
        <select name="meili_index"
            className={"text-primary"}
            value={meiliIndexState.selectedIndex}
            onChange={(e) => {
                changeSelectedIndex(e.target.value)
            }}
        >
            {meiliIndexState.availableIndexes.length === 0 ? (
                <option value="" disabled>None</option>
            ) : (
                meiliIndexState.availableIndexes.map((indexUID) => {
                    return <option key={indexUID} value={indexUID}>{indexUID}</option>
                })
            )}
        </select>
    </div>
}