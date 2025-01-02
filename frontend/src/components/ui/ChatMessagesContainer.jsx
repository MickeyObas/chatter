import { useEffect, useState } from 'react';
import ChatMessage from './ChatMessage';
import { fetchWithAuth } from '../../utils'
import { BASE_URL } from '../../constants';

export default function ChatMessagesContainer(){
    const [chats, setChats] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getChats = async () => {
            try {
                const response = await fetchWithAuth(`${BASE_URL}/chats/`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if(!response.ok){
                    console.log("Could not fetch chats.");
                }else{
                    const data = await response.json();
                    console.log(data);
                    setChats(data);
                }

            } catch (err){
                console.log(err);
            } finally {
                setLoading(false);
            };
        }

        getChats();

    }, []);

    if (loading) return <h1>Loading...</h1>

    return (
        <div className='messages-container flex flex-col overflow-y-scroll gap-y-3.5 pr-2 h-full'>
            {chats && chats?.map((chatmessage, idx) => (
                <ChatMessage 
                    key={idx}
                    chatmessage={chatmessage}
                />
            ))}           
        </div>
    )
}