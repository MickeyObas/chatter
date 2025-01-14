import PropTypes from 'prop-types';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useChat } from '../../context/ChatContext';
import { useState, useEffect } from 'react';

export default function SidebarLink({
    title="Link Title",
    Icon,
    path
}){

    const navigate = useNavigate();
    const location = useLocation();
    const isActive = location.pathname == path;
    const { chats, groupChats } = useChat();
    let notificationCount;

     const [unreadMessagesCount, setUnreadMessagesCount] = useState();
     const [unreadGCMessagesCount, setUnreadGCMessagesCount] = useState();
    
    useEffect(() => {
        const unreadMessagesCounter = chats.reduce((accumulator, chat) => {
            return accumulator += chat.unread_messages_count;
        }, 0);
        setUnreadMessagesCount(unreadMessagesCounter);
    }, [chats]);

    useEffect(() => {
        const unreadGCMessagesCounter = groupChats.reduce((accumulator, chat) => {
            return accumulator += chat.unread_messages_count;
        }, 0);
        setUnreadGCMessagesCount(unreadGCMessagesCounter);
    }, [groupChats]);



    if(title === 'Home'){
        notificationCount = unreadMessagesCount;
    }else if(title === 'Groups'){
        notificationCount = unreadGCMessagesCount;
    }else{
        notificationCount = 0;
    }

    return (
        <a       
            className={`flex items-center justify-between rounded-lg py-2.5 px-1 cursor-pointer ${isActive ? 'bg-blue-500' : 'hover:bg-blue-500'} `}
            onClick={() => navigate(path)}
            >
            <div className='flex items-center'
            >
                <Icon />
                <h2 className='ms-2 text-[13px]'>{title}</h2>
            </div>
            {notificationCount > 0 && (
                <div className={`h-[18px] w-[18px] rounded-full bg-slate-100 border-slate-200 flex items-center justify-center text-[10px] text-slate-600 ${isActive ? '' : '' }`}>{notificationCount}</div>
            )}
            
        </a>
    )
}


SidebarLink.propTypes = {
    title: PropTypes.string,
    Icon: PropTypes.any,
    notificationCount: PropTypes.number,
    path: PropTypes.string
}