import profile from '../../assets/images/profile.png';
import { useChat } from '../../context/ChatContext';
import { getProfilePicture, timeAgo } from '../../utils';
import PropTypes from 'prop-types';


export default function ChatMessage({ chatmessage }){

    const { setChatId } = useChat();

    const handleChatClick = (chatId) => {
        setChatId(chatId);
        localStorage.setItem('chatId', chatId);
    }

    return (
        <div 
            className='flex flex-col p-1'
            onClick={() => handleChatClick(chatmessage.id)}
            >
            <div className='flex text-[11px] items-center'>
                <div className='h-9 w-9 flex items-center justify-center rounded-full overflow-hidden'>
                    <img src={getProfilePicture(chatmessage.user.profile_picture)} alt="" className='w-full h-full object-cover'/>
                </div>
                <div className='flex flex-col ms-2'>
                    <h3 className='font-medium leading-3'>{chatmessage.user.name}</h3>
                    <h3>@{chatmessage.user.email.split('@')[0]}</h3>
                </div>
                <div className='ms-auto'>{timeAgo(
                    chatmessage.latest_message ? chatmessage.latest_message.created_at :  chatmessage.created_at
                    )}</div>
            </div>
            <div className='mt-2.5 ps-5'>
                <p className='text-[11px] leading-4 message-content-display'>{
                    chatmessage.latest_message?.content ? chatmessage.latest_message.content : ''
                    }</p>
            </div>
        </div>
    )
}


ChatMessage.propTypes = {
    chatmessage: PropTypes.object.isRequired
}