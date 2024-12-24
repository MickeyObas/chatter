import logo from '../../assets/images/logo.png';
import profile from '../../assets/images/profile.png';
import settings from '../../assets/images/settings.png';
import notification from '../../assets/images/notification.png';
import SidebarLink from './SidebarLink';


export default function Sidebar(){
    return (
        <div className='border border-e-slate-200 py-4 px-3.5 h-screen w-[20%]'>
            <div className='flex flex-col h-full'>
                <div className='flex items-center'>
                    <img src={logo} alt="logo" className='h-6 me-2'/>
                    <h1 className='text-lg font-bold'>Chatter</h1>
                </div>
                {/* Links */}
                <div className='flex flex-col mt-6 gap-y-4 px-2 text-[12px] font-semibold h-full'>
                    {Array(7).fill("_").map((link, idx) => (
                        <SidebarLink 
                            key={idx}
                        />
                    ))}
                    <div className='mt-auto flex flex-col gap-y-4'>
                        <div className='flex items-center justify-between'>
                            <div className='flex items-center'>
                                <img src={notification} alt="" className='h-4'/>
                                <h2 className='ms-2'>Notifications</h2>
                            </div>
                            <div className='h-5 w-6 rounded-full bg-white border-[1.5px] border-slate-200 flex items-center justify-center text-[10px] px-2.5 py-1.5 text-slate-700'>
                            99
                            </div>
                        </div>
                        <div className='flex items-center justify-between'>
                            <div className='flex items-center'>
                                <img src={settings} alt="" className='h-4'/>
                                <h2 className='ms-2'>Settings</h2>
                            </div>
                            <div className='h-5 w-6 rounded-full bg-white border-[1.5px] border-slate-200 flex items-center justify-center text-[10px] px-2.5 py-1.5 text-slate-700'>
                            99
                            </div>
                        </div>
                        <div className='flex border-[1.5px] border-slate-200 p-2 rounded-md mt-3'>
                            <img src={profile} alt="" className='h-7'/>
                            <div className='flex flex-col text-[11px] ms-2.5'>
                                <h2>Mickey Brave</h2>
                                <h3>@mickey</h3>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}