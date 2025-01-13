import { getProfilePicture } from "../../utils"
import v_dots from '../../assets/images/v-dots2.png';

function GroupInboxHeader({groupChat}) {
  return (
    <div className='flex flex-col'>
        <div className='py-4 border-b flex items-center'>
            <div className='h-12 w-12 rounded-full overflow-hidden'>
                {/* <img src={getProfilePicture(chat?.user?.profile_picture)} alt="" className='w-full h-full object-cover'/> */}
            </div>
            <div className='flex flex-col'>
                <div className='flex'>
                    <div className='flex flex-col'>
                        <h2 className='text-sm font-semibold'>{groupChat?.title}</h2>
                        {/* <h3 className='text-[11px]'>@{chat?.user?.email.split('@')[0]}</h3> */}
                    </div>
                    
                </div>
            </div>
            <div className='ms-auto flex gap-x-2'>
                <button className='border border-slate-300 text-[11px] py-1.5 px-2.5 rounded-lg'>Archive</button>
                <button 
                    className='text-white text-[11px] py-1.5 px-2.5 rounded-lg bg-blue-700'
                    >View Profile</button>
                <img src={v_dots} alt="" className='h-4'/>
            </div>
        </div>
    </div>
  )
}

export default GroupInboxHeader