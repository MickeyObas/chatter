import InboxMessagesContainer from './InboxMessagesContainer';
import InboxMessageTextbox from './InboxMessageTextbox';
import InboxHeader from './InboxHeader';

import { useEffect, useState, useRef } from 'react';
import { useChat } from '../../context/ChatContext';
import { fetchWithAuth } from '../../utils';
import { BASE_URL } from '../../constants';
import { useAuth } from '../../context/AuthContext';

// Emoji stuff
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';


export default function InboxMessageSection(){
    const { user } = useAuth();
    const ref = useRef(null);
    const messageTextAreaRef = useRef(null);
    const { chat, setChat, setChats } = useChat();
    // TODO -> chatId =/= localstorage __ context
    let chatId = JSON.parse(localStorage.getItem('chatId'));
    const [loading, setLoading] = useState(false);

    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [selectedEmoji, setSelectedEmoji] = useState('');

    const chatSocket = useRef(null);

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

     // When chat.user changes, open ws connection to 1-1 room, or something
    useEffect(() => {

        const openConnection = async () => {
            chatSocket.current = new WebSocket(
                `ws://localhost:8000/ws/chat/${user.id}/${chat.user.id}/`
            );
    
            chatSocket.current.onmessage = (event) => {
                const data = JSON.parse(event.data);
                
                const sentMessageChatId = data['chat']['id'];

                // Update chat messages container after user sends 
                if(sentMessageChatId === chatId){
                    setChat(data['chat']);
                    localStorage.setItem('chat', JSON.stringify(data['chat']));
                    setChats((prevChats) => {
                        // Is the chat of the most recently sent message currently in the container?
                        if (!prevChats.some((chat) => chat.id === sentMessageChatId)){
                            return[...prevChats, data['chat']]
                        }else{
                            const updatedChats = prevChats.filter((chat) => chat.id !== sentMessageChatId);
                            return [data['chat'], ...updatedChats]
                        }
                    })
                }
            };
        };

        if (chat){
            openConnection();
        }

        return () => {
            if (chatSocket.current) {
                chatSocket.current.close();
            }
        };

    }, [chatId, chat, user])


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
                    chatSocket={chatSocket}
                    />
            </div>
        </div>
    )
}