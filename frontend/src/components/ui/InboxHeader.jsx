import v_dots from '../../assets/images/v-dots2.png';
import PropTypes from 'prop-types';
import { getProfilePicture } from '../../utils';
import { useNavigate } from 'react-router-dom';
import { useOnlineContacts } from '../../context/OnlineContactsContext';


export default function InboxHeader({chat}){
    const navigate = useNavigate();
    const {onlineUserz} = useOnlineContacts();

    const handledViewProfileClick = () => {
        navigate(`/profile/${chat.user.id}`);
    }

    const isOnline = onlineUserz?.includes(chat.user.id);

    return (
        <div className='flex flex-col'>
            <div className='py-4 px-3.5 border-b flex items-center'>
                <div className='h-12 w-12 rounded-full overflow-hidden'>
                    <img src={getProfilePicture(chat?.user?.profile_picture)} alt="" className='w-full h-full object-cover'/>
                </div>
                <div className='flex flex-col'>
                    <div className='flex'>
                        <div className='flex flex-col ms-3.5'>
                            <h2 className='text-sm font-semibold'>{chat?.user?.name}</h2>
                            <h3 className='text-[11px]'>@{chat?.user?.email.split('@')[0]}</h3>
                        </div>
                        <div>
                            {isOnline ? (
                                <div className='rounded-full bg-white border-[1.5px] border-slate-300 flex items-center justify-center text-[10px] px-1 text-slate-700 ms-2 gap-x-2'>
                                <div className='bg-green-600 w-1.5 h-1.5 rounded-full'></div>
                                <h2>Online</h2>
                            </div>
                            ) : (
                                <div className='rounded-full bg-white border-[1.5px] border-slate-300 flex items-center justify-center text-[10px] px-1 text-slate-700 ms-2 gap-x-2'>
                                <div className='bg-red-600 w-1.5 h-1.5 rounded-full'></div>
                                <h2>Offline</h2>
                            </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className='ms-auto flex gap-x-2'>
                    <button className='border border-slate-300 text-[11px] py-1.5 px-2.5 rounded-lg'>Archive</button>
                    <button 
                        className='text-white text-[11px] py-1.5 px-2.5 rounded-lg bg-blue-700'
                        onClick={handledViewProfileClick}
                        >View Profile</button>
                    <img src={v_dots} alt="" className='h-4'/>
                </div>
            </div>
        </div>
    )
}

InboxHeader.propTypes = {
    chat: PropTypes.object.isRequired
}