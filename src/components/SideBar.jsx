import React from "react";
import { Link } from "react-router-dom";

const DashboardIcon = <svg className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-primary" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 21">
    <path d="M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z" />
    <path d="M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.975a1 1 0 0 0 1-.935c.013-.188.028-.374.028-.565A8.51 8.51 0 0 0 12.5 0Z" />
</svg>

const IndexIcon = <svg xmlns="http://www.w3.org/2000/svg" width="1rem" height="1rem" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-server "><rect width="20" height="8" x="2" y="2" rx="2" ry="2"></rect><rect width="20" height="8" x="2" y="14" rx="2" ry="2"></rect><line x1="6" x2="6.01" y1="6" y2="6"></line><line x1="6" x2="6.01" y1="18" y2="18"></line></svg>


const sideBarLinks = [
    { label: "Dashboard", link: "/", icon: DashboardIcon },
    { label: "Index", link: "/", icon: IndexIcon },
]

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
                    {sideBarLinks.map((sideBarLink) => {
                        return <DynamicSideBarLink sideBarLink={sideBarLink} />
                    })}
                    <li>
                        <button type="button" className="flex items-center w-full p-2 text-base text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700" aria-controls="dropdown-example" data-collapse-toggle="dropdown-example">
                            <svg className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 21">
                                <path d="M15 12a1 1 0 0 0 .962-.726l2-7A1 1 0 0 0 17 3H3.77L3.175.745A1 1 0 0 0 2.208 0H1a1 1 0 0 0 0 2h.438l.6 2.255v.019l2 7 .746 2.986A3 3 0 1 0 9 17a2.966 2.966 0 0 0-.184-1h2.368c-.118.32-.18.659-.184 1a3 3 0 1 0 3-3H6.78l-.5-2H15Z" />
                            </svg>
                            <span className="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap">E-commerce</span>
                            <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
                            </svg>
                        </button>
                        <ul id="dropdown-example" className="hidden py-2 space-y-2">
                            <li>
                                <a href="#" className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">Products</a>
                            </li>
                            <li>
                                <a href="#" className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">Billing</a>
                            </li>
                            <li>
                                <a href="#" className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">Invoice</a>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
        </aside>
    </div>
}

export default SideBar;

const DynamicSideBarLink = ({ sideBarLink }) => {
    return <li>
        <Link to={sideBarLink.link}
            className="flex items-center p-2 text-gray-500 hover:text-primary rounded-lg group"
        >
            {sideBarLink.icon}
            <span className="ms-3">{sideBarLink.label}</span>
        </Link>
    </li>
}