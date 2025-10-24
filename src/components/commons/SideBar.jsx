import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { Link, useLocation } from "react-router-dom";
import { useExperimentalFeatures } from '../../contexts/ExperimentalFeaturesContext';
import { getEnabledFeatureNavItems, hasEnabledFeatures } from '../../config/experimentalFeatures';

// Better, more relevant icons for each page
const DashboardIcon = <svg className="w-5 h-5 transition duration-75" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 21"><path d="M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z" /><path d="M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.975a1 1 0 0 0 1-.935c.013-.188.028-.374.028-.565A8.51 8.51 0 0 0 12.5 0Z" /></svg>

// Database icon for Index
const IndexIcon = <svg xmlns="http://www.w3.org/2000/svg" width="1rem" height="1rem" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>

// Tasks/Activity icon
const TasksIcon = <svg xmlns="http://www.w3.org/2000/svg" width="1rem" height="1rem" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>

// Settings/Gear icon
const SettingsIcon = <svg xmlns="http://www.w3.org/2000/svg" width="1rem" height="1rem" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 1v6m0 6v6m4.22-13.22 4.24 4.24M1.54 12h6m6 0h6m-13.22 4.22 4.24 4.24"/></svg>

// Key icon for API Keys
const KeyIcon = <svg xmlns="http://www.w3.org/2000/svg" width="1rem" height="1rem" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21 2-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0 3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>

// Lab/Experimental icon
const ExperimentalIcon = <svg xmlns="http://www.w3.org/2000/svg" width="1rem" height="1rem" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 2v8L8 8l-4 4 8 8 8-8-4-4-2 2V2"/><path d="M8 2h8"/></svg>

// Features/Layers icon
const FeaturesIcon = <svg xmlns="http://www.w3.org/2000/svg" width="1rem" height="1rem" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/></svg>

// Federation/Network icon
const FederationIcon = <svg xmlns="http://www.w3.org/2000/svg" width="1rem" height="1rem" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="2"/><path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48 2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48 2.83-2.83"/></svg>

// Chat icon (already imported from config)
const ChatIcon = <svg xmlns="http://www.w3.org/2000/svg" width="1rem" height="1rem" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>

const DownCaretIcon = <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" /></svg>
export const PlusIcon = <svg xmlns="http://www.w3.org/2000/svg" width="1rem" height="1rem" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-plus"><path d="M5 12h14"/><path d="M12 5v14"/></svg>

/**
 * @typedef {Object} SideBarLink
 * @property {string} key - The unique key for the link.
 * @property {string} label - The display label.
 * @property {string} link - The route path.
 * @property {JSX.Element} icon - The icon element.
 * @property {Array.<SideBarLink>} children - Sub menu links.
 * @property {boolean} isDevelopment - Whether the item is in development.
 */

// Development badge component
const DevelopmentBadge = () => (
  <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-yellow-100 text-yellow-800">Dev</span>
);

/**
 * SideBar component that renders the logged-in SideBar.
 * @component
 * @returns {JSX.Element} The rendered SideBar.
 */
const SideBar = () => {
    const { features } = useExperimentalFeatures();

    // Build sidebar links dynamically based on enabled features
    const sideBarLinks = useMemo(() => {
        const baseLinks = [
            { key: "s-1", label: "Dashboard", link: "/instance", icon: DashboardIcon, children: [] },
            { key: "s-2", label: "Index", link: "/instance/index", icon: IndexIcon, children: [] },
            { key: "s-4", label: "Tasks", link: "/instance/tasks", icon: TasksIcon, children: [] },
        ];

        // Build Features dropdown
        const featureChildren = [
            { key: "s-3", label: "Federation", link: "/instance/search/federated", icon: FederationIcon, children: [] },
        ];

        // Add enabled experimental features dynamically
        if (features) {
            const enabledFeatureItems = getEnabledFeatureNavItems(features);
            enabledFeatureItems.forEach(item => {
                featureChildren.push({
                    key: item.key,
                    label: item.label,
                    link: item.link,
                    icon: item.icon,
                    children: [],
                    isDevelopment: item.isDevelopment
                });
            });
        }

        // Only show Features dropdown if there are items
        if (featureChildren.length > 0) {
            baseLinks.splice(2, 0, {
                key: "s-features",
                label: "Features",
                link: "#",
                icon: FeaturesIcon,
                children: featureChildren
            });
        }

        // Settings dropdown
        baseLinks.push({
            key: "s-5",
            label: "Settings",
            link: "#",
            icon: SettingsIcon,
            children: [
                { key: "s-6", label: "API Keys", link: "/instance/keys", icon: KeyIcon, children: [] },
                { key: "s-7", label: "Experimental Features", link: "/instance/experimental", icon: ExperimentalIcon, children: [] },
            ]
        });

        return baseLinks;
    }, [features]);

    return <div>
        <aside id="default-sidebar"
            className="fixed top-0 left-0 z-40 w-64 pt-5 h-screen transition-transform -translate-x-full sm:translate-x-0 border-r border-r-gray-200" aria-label="Sidebar">
            <div className="h-full px-0 pb-4 overflow-y-auto bg-white">
                <div className="flex flex-col mb-5 pb-5 pl-3 border-b border-b-gray-200">
                    <div className="flex flex-row items-center">
                        <img src="/img/meili-logo.svg" className="h-8 me-3" alt="FlowBite Logo" />
                        <span className="text-primary tracking-widest">SEARCH</span>
                    </div>
                </div>
                <ul className="space-y-2 font-medium">
                    {sideBarLinks.map((sideBarLink, i) => {
                        return <DynamicSideBarLink key={i} sideBarLink={sideBarLink} />
                    })}
                </ul>
            </div>
        </aside>
    </div>
}

export default SideBar;

/**
 * DynamicSideBarLink component that renders an individual link in the sidebar.
 * @component
 * @returns {JSX.Element} The rendered DynamicSideBarLink.
 */
const DynamicSideBarLink = ({ sideBarLink }) => {
    const location = useLocation();
    const getActiveClass = (link) => {
        let cleanLink = location.pathname
        if (cleanLink.endsWith("/") && cleanLink.length > 1) {
            cleanLink = cleanLink.substring(0, cleanLink.length - 1)
        }
        return cleanLink === link ? "text-primary " : ""
    };

    if (sideBarLink.children && sideBarLink.children.length > 0) {
        const dropdownID = "sidebar-dropdown-" + sideBarLink.key
        return <li key={sideBarLink.key}>
            <button type="button"
                className={getActiveClass(sideBarLink.link) + "px-5 flex items-center w-full py-2 text-gray-500 hover:text-primary transition duration-75 rounded-lg group"}
                aria-controls={dropdownID}
                data-collapse-toggle={dropdownID}>
                {sideBarLink.icon}
                <span className="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap">{sideBarLink.label}</span>
                {DownCaretIcon}
            </button>
            <ul id={dropdownID} className="hidden bg-gray-50 transition duration-75 py-2 space-y-2">
                {sideBarLink.children.map((childLink) => {
                    return <li key={childLink.key}>
                        <Link
                            to={childLink.link}
                            className={getActiveClass(childLink.link) + "pl-7 pr-0 flex items-center py-2 text-gray-500 hover:text-primary group"}
                        >
                            {childLink.icon}
                            <span className="ms-3 flex items-center">
                                {childLink.label}
                                {childLink.isDevelopment && <DevelopmentBadge />}
                            </span>
                        </Link>
                    </li>
                })}
            </ul>
        </li>
    }

    return <li key={sideBarLink.key}>
        <Link to={sideBarLink.link}
            className={getActiveClass(sideBarLink.link) + "flex items-center px-5 py-2 text-gray-500 hover:text-primary group"}
        >
            {sideBarLink.icon}
            <span className="ms-3">{sideBarLink.label}</span>
        </Link>
    </li>
}

DynamicSideBarLink.propTypes = {
    sideBarLink: PropTypes.shape({
        key: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        link: PropTypes.string.isRequired,
        icon: PropTypes.element.isRequired,
        isDevelopment: PropTypes.bool,
        children: PropTypes.arrayOf(PropTypes.shape({
            key: PropTypes.string.isRequired,
            label: PropTypes.string.isRequired,
            link: PropTypes.string.isRequired,
            icon: PropTypes.element.isRequired,
            isDevelopment: PropTypes.bool,
        }))
    }).isRequired
}