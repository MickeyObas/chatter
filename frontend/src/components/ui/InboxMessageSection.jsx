import InboxMessagesContainer from './InboxMessagesContainer';
import InboxMessageTextbox from './InboxMessageTextbox';
import InboxHeader from './InboxHeader';

import { useEffect, useState, useRef, forwardRef} from 'react';
import { useChat } from '../../context/ChatContext';
import { fetchWithAuth } from '../../utils';
import { BASE_URL } from '../../constants';

export default function InboxMessageSection(){
    const ref = useRef(null);
    const { chat } = useChat();
    const [loading, setLoading] = useState(false);

    if (!chat) return <div>Select chat</div>;
    
    return (
        <div className='h-screen pt-1 pb-4 w-[68%]'>
            <div className='flex flex-col h-full'>
                {/* Header */}
                <InboxHeader chat={chat}/>
                {/* Chat Container */}
                <InboxMessagesContainer chat={chat} ref={ref}/>
                {/* Chat Textbox */}
                <InboxMessageTextbox chat={chat} reff={ref}/>
            </div>
        </div>
    )
}