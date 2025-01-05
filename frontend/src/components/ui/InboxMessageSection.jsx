import InboxMessagesContainer from './InboxMessagesContainer';
import InboxMessageTextbox from './InboxMessageTextbox';
import InboxHeader from './InboxHeader';

import { useEffect, useState, useRef } from 'react';
import { useChat } from '../../context/ChatContext';
import { fetchWithAuth } from '../../utils';
import { BASE_URL } from '../../constants';

// Emoji stuff
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';


export default function InboxMessageSection(){
    const ref = useRef(null);
    const messageTextAreaRef = useRef(null);
    const { chat } = useChat();
    const [loading, setLoading] = useState(false);

    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [selectedEmoji, setSelectedEmoji] = useState('');

    const handleEmojiOptionClick = () => {
        setShowEmojiPicker(true);
    };

    const handleClickOutsideEmojiBox = (e) => {
        if(showEmojiPicker && e.target.id !== 'emoji'){
            setShowEmojiPicker(false);
        }
    };

    const handleEmojiClick = (emoji) => {
        setSelectedEmoji(emoji.native);
    }

    if (!chat) return (
        <div className='flex w-[68%] justify-center items-center'>
            <p>Select a message to begin chatting.</p>
        </div>
    );
    
    return (
        <div className='h-screen pt-1 pb-4 w-[68%]'>
            <div className='flex flex-col h-full relative'>
                {/* Header */}
                <InboxHeader chat={chat}/>
                {showEmojiPicker && (
                <div className='absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2'>
                    <Picker 
                        data={data}
                        onEmojiSelect={handleEmojiClick} 
                        onClickOutside={handleClickOutsideEmojiBox}                  
                        />
                </div>
            )}
                {/* Chat Container */}
                <InboxMessagesContainer chat={chat} ref={ref} messageTextAreaRef={messageTextAreaRef}/>
                {/* Chat Textbox */}
                <InboxMessageTextbox 
                    chat={chat} 
                    reff={ref} 
                    ref={messageTextAreaRef} 
                    handleEmojiOptionClick={handleEmojiOptionClick} handleClickOutsideEmojiBox={handleClickOutsideEmojiBox}
                    selectedEmoji={selectedEmoji}
                    clearEmoji={() => setSelectedEmoji('')}
                    />
            </div>
        </div>
    )
}