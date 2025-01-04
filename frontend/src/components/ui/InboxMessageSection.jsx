import InboxMessagesContainer from './InboxMessagesContainer';
import InboxMessageTextbox from './InboxMessageTextbox';
import InboxHeader from './InboxHeader';

import { useEffect, useState, useRef } from 'react';
import { useChat } from '../../context/ChatContext';
import { fetchWithAuth } from '../../utils';
import { BASE_URL } from '../../constants';

export default function InboxMessageSection(){
    const ref = useRef(null);
    const messageTextAreaRef = useRef(null);
    const { chat } = useChat();
    const [loading, setLoading] = useState(false);

    if (!chat) return (
        <div className='flex w-[68%] justify-center items-center'>
            <p>Select a message to begin chatting.</p>
        </div>
    );
    
    return (
        <div className='h-screen pt-1 pb-4 w-[68%]'>
            <div className='flex flex-col h-full'>
                {/* Header */}
                <InboxHeader chat={chat}/>
                {/* Chat Container */}
                <InboxMessagesContainer chat={chat} ref={ref} messageTextAreaRef={messageTextAreaRef}/>
                {/* Chat Textbox */}
                <InboxMessageTextbox chat={chat} reff={ref} ref={messageTextAreaRef}/>
            </div>
        </div>
    )
}