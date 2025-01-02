import InboxMessagesContainer from './InboxMessagesContainer';
import InboxMessageTextbox from './InboxMessageTextbox';
import InboxHeader from './InboxHeader';

import { useEffect, useState } from 'react';
import { useChat } from '../../context/ChatContext';
import { fetchWithAuth } from '../../utils';
import { BASE_URL } from '../../constants';

export default function InboxMessageSection(){

    const { chatId } = useChat();
    const [chat, setChat] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        if(!chatId) return;

        const fetchChat = async () => {
            try{
                const response = await fetchWithAuth(`${BASE_URL}/chats/${chatId}/`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if(!response.ok){
                    console.log("Couldn't fetch chat"); 
                }else{
                    const data = await response.json();
                    setChat(data);
                }

            } catch (err){
                console.log(err);
            } finally{
                setLoading(false);
            }
        };

        fetchChat();

    }, [chatId]);

    if (loading) return <div>Loading...</div>;
    
    return (
        <div className='h-screen pt-1 pb-4 w-[68%]'>
            <div className='flex flex-col h-full'>
                {/* Header */}
                <InboxHeader chat={chat}/>
                {/* Chat Container */}
                <InboxMessagesContainer chat={chat}/>
                {/* Chat Textbox */}
                <InboxMessageTextbox chat={chat}/>
            </div>
        </div>
    )
}