import search from '../../assets/images/search.png';
import write from '../../assets/images/write.png';
import { useChat } from '../../context/ChatContext';
import ActiveUsers from './ActiveUsers';
import ChatMessagesContainer from './ChatMessagesContainer';
import { useEffect, useState } from 'react';

export default function ChatMessagesSection({ isStandalone }){
    const { chats } = useChat();

    const [unreadMessagesCount, setUnreadMessagesCount] = useState();

    useEffect(() => {
        const unreadMessagesCounter = chats.reduce((accumulator, chat) => {
            return accumulator += chat.unread_messages_count;
        }, 0);
        setUnreadMessagesCount(unreadMessagesCounter);
    }, [chats])
 
    const width = isStandalone ? 'w-[24vw]' : 'w-[32%]';

    return (
        <div className={`h-screen border-e border-e-slate-300 py-4 px-5 ${width}`}>
            <div className='flex flex-col items-center h-full w-full'>
                <div className='flex items-center border-[1.4px] px-2 py-0.5 rounded-lg w-full'>
                    <img src={search} alt="" className='h-3'/>
                    <input type="text" className='py-1 px-1.5 rounded-e-lg text-xs border-none outline-none' placeholder='Search'/>
                </div>
                <ActiveUsers />
                <div className='flex flex-col mt-3 self-start w-full h-[70%]'>
                    <div className='flex items-center w-full mb-3'>
                        <h1 className='text-[13px] font-semibold'>Chats</h1>
                        <div className='h-5 w-6 rounded-full bg-white border-[1.5px] border-slate-200 flex items-center justify-center text-[10px] px-2.5 py-1.5 text-slate-700 ms-2'>{unreadMessagesCount}</div>
                        <div className='p-1.5 border rounded-lg flex items-center justify-center ms-auto'>
                            <img src={write} alt="" className='h-4'/>
                        </div>
                    </div>
                    {/* Messages Container */}
                    <ChatMessagesContainer 
                        setUnreadMessagesCount={setUnreadMessagesCount}
                    />
                </div>
            </div>
        </div>
    )
}