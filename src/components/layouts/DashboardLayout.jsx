import React, {useEffect} from "react";
import {Outlet, useNavigate} from "react-router-dom"
import { InstanceProvider } from "../../contexts/InstanceContext"
import { MeiliIndexProvider } from "../../contexts/MeiliIndexContext"
import SideBar from "../commons/SideBar"
import Navbar from "../commons/Navbar"
import InstanceModal from "../commons/InstanceModal"
import useMeiliInstance from "../../hooks/useMeiliInstance.js";
import IndexCreationModal from "../pages/instance/index-creation/IndexCreationModal";

const DashboardLayout = () => {
    return <InstanceProvider>
        
        <InstanceModal/>

        <MeiliIndexProvider>
            <IndexCreationModal/>
            <LayoutContent/>
        </MeiliIndexProvider>
    </InstanceProvider>
}

export default DashboardLayout;


const LayoutContent = () => {
    const {instanceState} = useMeiliInstance()
    const navigate = useNavigate();

    useEffect(() => {
        if (instanceState.isLoaded && !instanceState.isSet) {
            navigate("/instance-form")
        }
    }, [instanceState])

    if (!instanceState.isLoaded) {
        return <div>loading instance config</div>
    }

    return <>
        <SideBar />
        <div className="bg-content sm:ml-64 h-full min-h-lvh">
            <Navbar />
            <Outlet />
        </div>
    </>
}