import checklist from '../../assets/images/checklist.png';

export default function SidebarLink({
    title="Link Title",
    icon=checklist,
    notificationCount=99
}){
    return (
        <div className='flex items-center justify-between'>
            <div className='flex items-center'>
                <img src={checklist} alt="" className='h-4'/>
                <h2 className='ms-2'>{title}</h2>
            </div>
            <div className='h-5 w-6 rounded-full bg-white border-[1.5px] border-slate-200 flex items-center justify-center text-[10px] px-2.5 py-1.5 text-slate-700'>{notificationCount}</div>
        </div>
    )
}
