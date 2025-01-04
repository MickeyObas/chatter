import profile from '../../assets/images/profile.png';
import { BASE_URL } from '../../constants';
import { useChat } from '../../context/ChatContext';
import { fetchWithAuth, getProfilePicture, timeAgo } from '../../utils';
import PropTypes from 'prop-types';
import { useState } from 'react';

export default function ChatMessage({ chatmessage }){

    const { setChatId } = useChat();
    const [hasUnread, setHasUnread] = useState(
        chatmessage.has_unread_message
    );

    const handleChatClick = async (chatId) => {
        setChatId(chatId);
        localStorage.setItem('chatId', chatId);

        // If message has no unread message, return
        if(!hasUnread){
            console.log(hasUnread);
            console.log("This message has no unread messge")
            return;
        } 
        // Set message as read
        try {
            const response = await fetchWithAuth(`${BASE_URL}/chats/${chatId}/set-last-read-message/`, {
                method: 'PATCH',
            });
            
            if(!response.ok){
                const error = await response.json();
                console.log(error);
            }else{
                setHasUnread(false);
                const data = await response.json();
                console.log(data);
            }
        }catch(err){
            console.log(err);
        }
    }

    return (
        <div 
            className={`flex flex-col p-1 py-2.5 cursor-pointer hover:bg-slate-100 ${hasUnread ? 'bg-[#F5F5F5]' : ''}`}
            onClick={() => handleChatClick(chatmessage.id)}
            >
            <div className='flex text-[11px] items-center'>
                <div className='h-9 w-9 flex items-center justify-center rounded-full overflow-hidden'>
                    <img src={getProfilePicture(chatmessage.user.profile_picture)} alt="" className='w-full h-full object-cover'/>
                </div>
                <div className='flex flex-col ms-2'>
                    <h3 className='font-medium leading-3'>{chatmessage.user.name}</h3>
                    <h3>@{chatmessage.user.email.split('@')[0]}</h3>
                </div>
                <div className='ms-auto'>{timeAgo(
                    chatmessage.latest_message ? chatmessage.latest_message.created_at :  chatmessage.created_at
                    )}</div>
            </div>
            <div className='mt-2.5 ps-5'>
                <div className='flex justify-between'>
                    <p className='text-[11px] leading-4 message-content-display'>{
                        chatmessage.latest_message?.content ? chatmessage.latest_message.content : ''
                        }</p>
                    {hasUnread && (
                        <div className='w-1.5 h-1.5 rounded-[50%] bg-green-500 me-2'></div>
                    )}    
                </div>
            </div>
        </div>
    )
}


ChatMessage.propTypes = {
    chatmessage: PropTypes.object.isRequired
}