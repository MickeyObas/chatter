import profile from '../../assets/images/profile.png';
import { BASE_URL } from '../../constants';
import { useChat } from '../../context/ChatContext';
import { fetchWithAuth, getProfilePicture, timeAgo } from '../../utils';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useContact } from '../../context/ContactContext';
import { useAuth } from '../../context/AuthContext';

export default function ChatMessage({ chatmessage, setUnreadMessagesCount }){
    
    const [lastMessageIsRead, setLastMessageIsRead] = useState(
        chatmessage.latest_message ? chatmessage?.latest_message?.is_read : true
    );

    const { contacts } = useContact();
    const { user } = useAuth();

    const getContact = (id) => {
        const someContact = contacts.find((contact) => contact?.contact_user?.id === id);
        return someContact;
    };

    const senderDisplay = user.id === chatmessage.latest_message.sender ? "You" : getContact(chatmessage.latest_message.sender)?.contact_user.name?.split(' ')[0];

    useEffect(() => {
        setLastMessageIsRead(chatmessage?.latest_message?.is_read);
    }, [chatmessage?.latest_message])

    const { setChatId } = useChat();

    const handleChatClick = async (inputChatId) => {
        setChatId(inputChatId);
        setUnreadMessagesCount((prev) => prev - chatmessage.unread_messages_count)
        localStorage.setItem('chatId', inputChatId);

        try {
            // Update chat message read status
            // If chat has no unread message, return
            if(lastMessageIsRead) return;
            const response = await fetchWithAuth(`${BASE_URL}/chats/${inputChatId}/set-message-read-status/`, {
                method: 'POST'
            });

            if(!response.ok){
                const error = await response.json();
                console.log(error);
            }else{
                const data = await response.json();
                setLastMessageIsRead(true);
            }
        } catch(err){
            console.error(err);
        }
    }

    return (
        <div 
            className={`w-full flex flex-col p-1 py-2.5 cursor-pointer hover:bg-slate-100 ${!lastMessageIsRead ? 'bg-slate-200' : ''}`}
            onClick={() => handleChatClick(chatmessage?.id)}
            >
            <div className='flex text-[11px] items-center'>
                <div className='h-9 w-9 flex items-center justify-center rounded-full overflow-hidden'>
                    <img src={getProfilePicture(chatmessage?.user?.profile_picture)} alt="" className='w-full h-full object-cover'/>
                </div>
                <div className='flex flex-col ms-2'>
                    <h3 className='font-medium leading-3'>{chatmessage?.user?.name}</h3>
                    <h3>@{chatmessage?.user?.email?.split('@')[0]}</h3>
                </div>
                <div className='ms-auto'>{timeAgo(
                    chatmessage.latest_message ? chatmessage?.latest_message.created_at :  chatmessage?.created_at
                    )}</div>
            </div>
            <div className='mt-2.5 ps-8 w-full'>
                <div className='flex justify-between w-full'>
                    <p className='text-[11px] leading-4 message-content-display w-[80%]'>{
                        chatmessage?.latest_message?.content ? senderDisplay + ": " + chatmessage?.latest_message.content : ''
                        }</p>
                    {!lastMessageIsRead && (
                        <div className='w-5 h-5 flex justify-center items-center rounded-[50%] bg-red-500 me-2'>
                            <p className='text-[10px] text-white'>{chatmessage.unread_messages_count}</p>
                        </div>
                    )}  
                </div>
            </div>
        </div>
    )
}


ChatMessage.propTypes = {
    chatmessage: PropTypes.object.isRequired
}