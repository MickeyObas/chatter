import React, { useEffect, useState, useRef } from 'react'
import GroupInboxHeader from './GroupInboxHeader'

// Emoji stuff
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import GroupInboxMessageTextbox from './GroupInboxMessageTextbox';
import GroupInboxMessagesContainer from './GroupInboxMessagesContainer';

function GroupInboxMessageSection({
    groupChat,
}) { 

    console.log(groupChat);
    const ref = useRef(null);
    const messageTextAreaRef = useRef(null);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [selectedEmoji, setSelectedEmoji] = useState('');

    const handleEmojiOptionClick = () => {
        setShowEmojiPicker(true);
    };
    
    const handleEmojiClick = (emoji) => {
        setSelectedEmoji(emoji.native);
    };

    const handleClickOutsideEmojiBox = (e) => {
        if(showEmojiPicker && e.target.id !== 'emoji'){
            setShowEmojiPicker(false);
        }
    };

  return (
    <div className='h-screen pt-1 pb-4 w-[68%] border border-r-[1.5px]'>
        <div className='flex flex-col h-full relative'>
            {/* Header */}
            <GroupInboxHeader groupChat={groupChat}/>
            {showEmojiPicker && (
            <div className='absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2'>
                <Picker 
                    data={data}
                    onEmojiSelect={handleEmojiClick} 
                    onClickOutside={handleClickOutsideEmojiBox}                  
                    />
            </div>
            )}
            {/* Group Chat Container */}
            <GroupInboxMessagesContainer groupChat={groupChat} ref={ref} messageTextAreaRef={messageTextAreaRef}/>
            {/* Group Chat Textbox */}
            <GroupInboxMessageTextbox 
                groupChat={groupChat} 
                reff={ref} 
                ref={messageTextAreaRef} 
                handleEmojiOptionClick={handleEmojiOptionClick} handleClickOutsideEmojiBox={handleClickOutsideEmojiBox}
                selectedEmoji={selectedEmoji}
                clearEmoji={() => setSelectedEmoji('')}
                // chatSocket={chatSocket}
                />
        </div>
    </div>
  )
}

export default GroupInboxMessageSection