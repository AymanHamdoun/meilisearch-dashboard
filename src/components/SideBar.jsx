import React from "react";
import { Link } from "react-router-dom";

const DashboardIcon = <svg className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-primary" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 21"><path d="M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z" /><path d="M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.975a1 1 0 0 0 1-.935c.013-.188.028-.374.028-.565A8.51 8.51 0 0 0 12.5 0Z" /></svg>
const IndexIcon = <svg xmlns="http://www.w3.org/2000/svg" width="1rem" height="1rem" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-server "><rect width="20" height="8" x="2" y="2" rx="2" ry="2"></rect><rect width="20" height="8" x="2" y="14" rx="2" ry="2"></rect><line x1="6" x2="6.01" y1="6" y2="6"></line><line x1="6" x2="6.01" y1="18" y2="18"></line></svg>
const DownCaretIcon = <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" /></svg>

/**
 * @typedef {Object} SideBarLink
 * @property {string} key - The name of the user.
 * @property {string} label - The email address of the user.
 * @property {string} link - The message from the user.
 * @property {JSX.Element} icon - The message from the user.
 * @property {Array.<SideBarLink>} childen - sub menu links
 */


/**
 * The form data state.
 * @type {Array.<SideBarLink>} sideBarLinks
 */
const sideBarLinks = [
    { key: "s-1", label: "Dashboard", link: "/", icon: DashboardIcon, children: [] },
    { key: "s-2", label: "Index", link: "/", icon: IndexIcon, children: [] },
    {
        key: "s-3", label: "Parent", link: "/", icon: IndexIcon, children: [
            { key: "s-4", label: "Child", link: "/", icon: IndexIcon, children: [] },
        ]
    },
]

/**
 * SideBar component that renders the logged-in SideBar.
 * @component
 * @returns {JSX.Element} The rendered SideBar.
 */
const SideBar = () => {
    return <div>
        <aside id="default-sidebar"
            className="fixed top-0 left-0 z-40 w-64 pt-5 h-screen transition-transform -translate-x-full sm:translate-x-0 border-r border-r-gray-200" aria-label="Sidebar">
            <div className="h-full px-3 pb-4 overflow-y-auto bg-white">
                <div className="flex flex-col mb-5 pb-5 border-b border-b-gray-200">
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
    if (sideBarLink.children.length > 0) {
        const dropdownID = "sidebar-dropdown-" + sideBarLink.key
        return <li key={sideBarLink.key}>
            <button type="button"
                className="flex items-center w-full p-2 text-gray-500 hover:text-primary transition duration-75 rounded-lg group"
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
                            className="flex items-center p-2 text-gray-500 hover:text-primary rounded-lg group"
                        >
                            {childLink.icon}
                            <span className="ms-3">{childLink.label}</span>
                        </Link>
                    </li>
                })}
            </ul>
        </li>
    }

    return <li key={sideBarLink.key}>
        <Link to={sideBarLink.link}
            className="flex items-center p-2 text-gray-500 hover:text-primary rounded-lg group"
        >
            {sideBarLink.icon}
            <span className="ms-3">{sideBarLink.label}</span>
        </Link>
    </li>
}