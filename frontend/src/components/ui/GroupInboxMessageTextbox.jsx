import options from '../../assets/images/options.png';
import smile from '../../assets/images/smile.png';
import { 
    useState, 
    useRef,
    forwardRef,
    useEffect,
} from 'react';

import PropTypes from 'prop-types';
import { fetchWithAuth } from '../../utils';
import { BASE_URL } from '../../constants'
import { useAuth } from '../../context/AuthContext';

const GroupInboxMessageTextbox = forwardRef(({
    handleEmojiOptionClick,
    selectedEmoji,
    clearEmoji,
    groupChat,
    groupChatSocket
}, messageTextAreaRef) => {
    const [content, setContent] = useState('');
    const emojiRef = useRef(null);
    const { user } = useAuth();

    useEffect(() => {
       if(selectedEmoji){
        setContent((prev) => prev + selectedEmoji);
        clearEmoji();
       }
    }, [selectedEmoji, clearEmoji])

    const handleContentChage = (e) => {
        setContent(e.target.value);
    }

    const handleSendMessageClick = async () => {

        if(!content.trim()) return;
        if(!groupChatSocket.current) return;

        const data = {
            content: content,
            groupchat_id: groupChat.id,
            sender_id: user.id
        };

        try{
            groupChatSocket.current.send(JSON.stringify(data))
            console.log("Sending data");
        }catch(err){
            console.log(err);
        }finally{
            setContent('');
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
                    <img 
                        id="emoji" 
                        src={smile} 
                        alt="" 
                        className='h-4 cursor-pointer' 
                        onClick={handleEmojiOptionClick} ref={emojiRef}    
                        />
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

GroupInboxMessageTextbox.displayName = 'GroupInboxMessageTextbox';

GroupInboxMessageTextbox.propTypes = {
    reff: PropTypes.any,
    handleEmojiOptionClick: PropTypes.func
}

export default GroupInboxMessageTextbox;