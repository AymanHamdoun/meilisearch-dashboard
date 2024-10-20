import { Outlet } from "react-router-dom"
import { InstanceProvider } from "../../contexts/InstanceContext"
import { MeiliIndexProvider } from "../../contexts/MeiliIndexContext"
import SideBar from "../commons/SideBar"
import Navbar from "../commons/Navbar"
import InstanceModal from "../commons/InstanceModal"

const DashboardLayout = () => {
    return <InstanceProvider>
        <InstanceModal/>
        <MeiliIndexProvider>
            <SideBar />
            <div className="bg-content sm:ml-64 h-full min-h-lvh">
                <Navbar />
                <Outlet />            
            </div>
        </MeiliIndexProvider>
    </InstanceProvider>
}

export default DashboardLayout;