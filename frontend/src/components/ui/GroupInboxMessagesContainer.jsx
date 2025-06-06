import { useEffect, useRef, useImperativeHandle, forwardRef, useLayoutEffect } from 'react';
import GroupInboxMessageSection from './GroupInboxMessageSection';
import { useAuth } from '../../context/AuthContext';
import GroupInboxMessage from './GroupInboxMessage';

const GroupInboxMessagesContainer = forwardRef(({groupChat, messageTextAreaRef}, ref) => {
    
    const messagesEndRef = useRef(null);
    const { user } = useAuth();
    useLayoutEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
    }, [groupChat?.messages]);

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
            {groupChat?.messages.length > 0 ? groupChat?.messages.map((message, idx) => (
                <GroupInboxMessage 
                    key={idx}
                    message={message}
                    userIsSender={message?.sender?.id===user.id}
                    displayNameColor={groupChat?.contact_color_map[message?.sender.id]}
                />
            )) : (
                <div>
                    <p className='text-xs text-center text-slate-400'>Send a message to start the conversation.</p>
                </div>
            )}
            {/* {Array(9).fill("_").map((inboxMessage, idx) => (
                <GroupInboxMessage key={idx} ownerIsSender={idx%2==0} />
            ))} */}
            {/* {groupChat?.messages?.map((message, idx) => {
                return (
                    <InboxMessage 
                        key={idx} 
                        message={message} 
                        ownerIsSender={message.sender === groupChat.owner.id} 
                        user={user}
                        scrollToBottom={scrollToBottom}
                    />)
            })} */}
            <div ref={messagesEndRef}></div>
        </div>
    )
});

GroupInboxMessagesContainer.displayName = "GroupInboxMessagesContainer"

export default GroupInboxMessagesContainer