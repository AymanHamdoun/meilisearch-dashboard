import React from "react";
import SearchPageContent from "./search/Page"
import SideBar from "../SideBar"
import { InstanceProvider } from "../../contexts/InstanceContext";
import { MeiliIndexProvider } from "../../contexts/MeiliIndexContext";

const AdminDashboard = () => {
    return <InstanceProvider>
        <MeiliIndexProvider>
            <SideBar />
            <SearchPageContent/>
        </MeiliIndexProvider>
    </InstanceProvider>
}

export default AdminDashboard;