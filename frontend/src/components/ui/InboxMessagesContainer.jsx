import { useEffect, useRef, useImperativeHandle, forwardRef, useLayoutEffect } from 'react';
import InboxMessage from './InboxMessage';
import PropTypes from 'prop-types';

const InboxMessagesContainer = forwardRef(({chat, messageTextAreaRef}, ref) => {
    const user = chat.user;
    const messagesEndRef = useRef(null);

    useLayoutEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
    }, [chat.messages]);

    useEffect(() => {
        if(messageTextAreaRef.current){
            messageTextAreaRef.current.focus();
        }
    });    

    const scrollToBottom = () => {
        setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 50)
    };

    useImperativeHandle(ref, () => {
        return {
            scrollToBottom
        }
    }, []);

    return (
        <div className='flex flex-col p-4 gap-y-3.5 overflow-y-auto mb-2 h-full w-full overflow-x-hidden'>
            {chat.messages.length > 0 ? chat?.messages?.map((message, idx) => {
                return (
                    <InboxMessage 
                        key={idx} 
                        message={message} 
                        ownerIsSender={message.sender === chat.owner.id} 
                        user={user}
                        scrollToBottom={scrollToBottom}
                    />)
            }):(
                <div>
                    <p className='text-xs text-center text-slate-400'>Send a message to start the conversation.</p>   
                </div>
            )}
            <div ref={messagesEndRef}></div>
        </div>
    )
}
)
InboxMessagesContainer.propTypes = {
    chat: PropTypes.object.isRequired,
    messageTextAreaRef: PropTypes.any
}

InboxMessagesContainer.displayName = "InboxMessagesContainer";

export default InboxMessagesContainer;