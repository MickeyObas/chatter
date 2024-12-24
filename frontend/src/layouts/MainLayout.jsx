import { Outlet } from "react-router-dom";
import Sidebar from "../components/ui/Sidebar";

export default function MainLayout(){
    return (
        <div className='bg-white h-screen overflow-hidden select-none w-screen flex'>
            <Sidebar />
            <Outlet />
        </div>
    )
}