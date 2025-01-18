import { useEffect, useState } from 'react';
import ChatMessage from './ChatMessage';
import { fetchWithAuth } from '../../utils'
import { BASE_URL } from '../../constants';
import { useChat } from '../../context/ChatContext';

export default function ChatMessagesContainer({setUnreadMessagesCount}){
    const { chats } = useChat(); 
    if (chats.length === 0){
        return (
            <div className='text-[14px] flex items-center justify-center h-full text-slate-300'>No chats yet.</div>
        )
    }

    return (
        <div className='messages-container flex flex-col overflow-y-auto pr-2 h-full'>
            {chats.length > 0 && chats?.filter((chat) => chat.latest_message !== null).map((chatmessage, idx) => (
                <ChatMessage 
                    key={idx}
                    chatmessage={chatmessage}
                    setUnreadMessagesCount={setUnreadMessagesCount}
                />
            ))} 
            <p></p>          
        </div>
    )
}