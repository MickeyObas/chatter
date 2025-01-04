import options from '../../assets/images/options.png';
import smile from '../../assets/images/smile.png';
import { 
    useState, 
    forwardRef, 
} from 'react';
import { useChat } from '../../context/ChatContext';
import PropTypes from 'prop-types';
import { fetchWithAuth } from '../../utils';
import { BASE_URL } from '../../constants';

const InboxMessageTextbox = forwardRef(({reff}, messageTextAreaRef) => {
    const [content, setContent] = useState('');
    const { chatId, chat, setChat, chats, setChats } = useChat();

    const handleContentChage = (e) => {
        setContent(e.target.value);
    }

    const handleSendMessageClick = async () => {
        const data = {
            content: content,
            chat_id: chatId,
            recipient_id: chat.user.id
        };

        if(!content) return;

        try {
            const response = await fetchWithAuth(`${BASE_URL}/messages/`, {
               method: 'POST',
               body: JSON.stringify(data),
               headers: {
                    'Content-Type': 'application/json'
                },
            });

            if(!response.ok){
                console.log("Failed to send message");
                const error = await response.json();
                console.log(error);
            }else{
                const data = await response.json();
                setContent('');
                reff.current.scrollToBottom();
                console.log(data);
                setChat((prev) => (
                    {
                        ...prev,
                        messages: [...prev.messages, data]
                    }
                ));
                setChats((prev) => (
                    prev.map((chat) => {
                        if(chat.id === chatId){
                            return {
                                ...chat,
                                latest_message: data
                            }
                        }else{
                            return chat;
                        }
                    })
                ))
            }

        } catch(err){
            console.log(err);
        }
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault(); // Prevents a new line
            handleSendMessageClick(); // Send the message
        }
    };

    return (
        <div className='px-3.5 mt-auto'>
            <div className='border-[1.5px] flex flex-col rounded-lg'>
                <textarea 
                    ref={messageTextAreaRef}
                    name="" 
                    id="" 
                    value={content}
                    onChange={handleContentChage}
                    onKeyDown={handleKeyPress}
                    className='border-none rounded-lg w-full resize-none outline-none p-2 text-[11px]' placeholder='Send a message' 
                    rows={1}></textarea>
                <div className='flex items-center justify-end gap-x-2 me-3 mb-2.5'>
                    <img src={smile} alt="" className='h-4'/>
                    <img src={options} alt="" className='h-4'/>
                    <button 
                        className='text-white text-[11px] py-2 px-4 rounded-lg bg-blue-700 flex items-center justify-center hover:bg-blue-600'
                        onClick={handleSendMessageClick}
                        >Send</button>
                </div>
            </div>
        </div>
    )
})

InboxMessageTextbox.displayName = 'InbocMessageTextbox';

InboxMessageTextbox.propTypes = {
    reff: PropTypes.any
}

export default InboxMessageTextbox;