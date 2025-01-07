import { useEffect, useState } from 'react';
import ChatMessage from './ChatMessage';
import { fetchWithAuth } from '../../utils'
import { BASE_URL } from '../../constants';
import { useChat } from '../../context/ChatContext';

export default function ChatMessagesContainer(){
    const { chats } = useChat(); 
    const [loading, setLoading] = useState(true);
    const { chatId } = useChat();

    // Set currently viewed chat's last message as the last_message_read
    useEffect(() => {
        const setLastMessageRead = async (chatId) => {
            try {
                const response = await fetchWithAuth(`${BASE_URL}/chats/${chatId}/set-last-read-message/`, {
                    method: 'PATCH',
                });

                if(!response.ok){
                    const error = await response.json();
                    console.log(error);
                }else{
                    const data = await response.json();
                }
            }catch(err){
                console.log(err);
            }
        }

        if(chatId){
            setLastMessageRead(chatId);
        }
    }, [chatId]);

    if (chats.length === 0){
        return (
            <div className='text-xs flex items-center justify-center h-full'>No chats yet.</div>
        )
    }

    return (
        <div className='messages-container flex flex-col overflow-y-auto  pr-2 h-full'>
            {chats && chats?.map((chatmessage, idx) => (
                <ChatMessage 
                    key={idx}
                    chatmessage={chatmessage}
                />
            ))} 
            <p></p>          
        </div>
    )
}