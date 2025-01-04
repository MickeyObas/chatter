import logo from '../../assets/images/logo.png';
import profile from '../../assets/images/profile.png';
import SidebarLink from './SidebarLink';

import { HomeIcon } from '../../assets/icons/HomeIcon';
import { ContactIcon } from '../../assets/icons/ContactIcon';
import { GroupIcon } from '../../assets/icons/GroupIcon';
import { NotificationIcon } from '../../assets/icons/NotificationIcon';
import { HelpIcon } from '../../assets/icons/HelpIcon';

import { IoSettingsOutline } from "react-icons/io5";
import { TbLogout2 } from "react-icons/tb";
import { useAuth } from '../../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';


export default function Sidebar(){
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const sidebarLinks = [
        {
            title: "Home",
            icon: HomeIcon,
            notificationCount: 0,
            path: "/"
        },
        {
            title: "Contacts",
            icon: ContactIcon,
            notificationCount: 0,
            path: "/contacts"
        },
        {
            title: "Groups",
            icon: GroupIcon,
            notificationCount: 0,
            path: ""
        },
        {
            title: "Notifications",
            icon: NotificationIcon,
            notificationCount: 0,
            path: ""
        },
         {
             title: "Help",
             icon: HelpIcon,
             notificationCount: 0,
             path: ""
         }
    ];

    const handleLogoutClick = () => {
        logout();
        navigate('/login');
    }
    
    return (
        <div className='border border-e-slate-200 py-4 px-4 h-screen w-[20%]'>
            <div className='flex flex-col h-full'>
                <div className='flex items-center'>
                    <img src={logo} alt="logo" className='h-6 me-2'/>
                    <h1 className='text-lg font-bold'>Chatter</h1>
                </div>
                {/* Links */}
                <div className='flex flex-col mt-6 px-3 text-[12px] font-semibold h-full gap-y-1'>
                    {/* {Array(7).fill("_").map((link, idx) => (
                        <SidebarLink 
                            key={idx}
                        />
                    ))} */}
                    {sidebarLinks.map((sidebarLink, idx) => (
                        <SidebarLink 
                            key={idx}
                            title={sidebarLink.title}
                            Icon={sidebarLink.icon}
                            path={sidebarLink.path}
                            notificationCount={sidebarLink.notificationCount}
                        />
                    ))}
                    <div className='mt-auto flex flex-col'>
                        <div className='flex items-center justify-between rounded-lg py-2.5 px-1 cursor-pointer hover:bg-blue-400'>
                            <div className='flex items-center'>
                                <IoSettingsOutline size={"20px"}/>
                                <h2 className='ms-2 text-[13px]'>Settings</h2>
                            </div>
                            {/* <div className='h-5 w-6 rounded-full bg-white border-[1.5px] border-slate-200 flex items-center justify-center text-[10px] px-2.5 py-1.5 text-slate-700'>
                            99
                            </div> */}
                        </div>
                        <div 
                            className='flex items-center justify-between rounded-lg py-2.5 px-1 cursor-pointer hover:bg-blue-400'
                            onClick={handleLogoutClick}
                            >
                            <div className='flex items-center'>
                                <TbLogout2 size={"20px"} />
                                <h2 className='ms-2 text-[13px]'>Logout</h2>
                            </div>
                            {/* <div className='h-5 w-6 rounded-full bg-white border-[1.5px] border-slate-200 flex items-center justify-center text-[10px] px-2.5 py-1.5 text-slate-700'>
                            99
                            </div> */}
                        </div>
                        <div className='flex  border-[1.5px] border-slate-200 p-2 rounded-md mt-3'>
                            <img src={profile} alt="" className='h-7'/>
                            <div className='flex flex-col text-[11px] ms-2.5'>
                                <h2>{user?.first_name} {user?.last_name}</h2>
                                <h3>@{user?.email.split('@')[0]}</h3>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}