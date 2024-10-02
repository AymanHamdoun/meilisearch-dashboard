import { Outlet } from "react-router-dom"
import { InstanceProvider } from "../../contexts/InstanceContext"
import { MeiliIndexProvider } from "../../contexts/MeiliIndexContext"
import SideBar from "../commons/SideBar"
import Navbar from "../commons/Navbar"

const DashboardLayout = () => {
    return <InstanceProvider>
        <MeiliIndexProvider>
            <SideBar />
            <div className="bg-content p-4 sm:ml-64 h-full min-h-lvh">
                <Navbar />
                <Outlet />            
            </div>
        </MeiliIndexProvider>
    </InstanceProvider>
}

export default DashboardLayout;