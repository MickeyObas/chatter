import { useEffect, useRef, useImperativeHandle, forwardRef, useState, useLayoutEffect } from 'react';
import InboxMessage from './InboxMessage';
import PropTypes from 'prop-types';

const InboxMessagesContainer = forwardRef(({chat}, ref) => {
    const user = chat.user;
    const messagesEndRef = useRef(null);

    useLayoutEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
    }, [chat.messages]);

    const scrollToBottom = () => {
        setTimeout(() => {
            console.log("scrolling to bottom");
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 50)
    };

    useImperativeHandle(ref, () => {
        return {
            scrollToBottom
        }
    }, []);

    return (
        <div className='flex flex-col p-4 gap-y-3.5 overflow-y-scroll mb-2 h-full w-full overflow-x-hidden'>
            {/* {Array(9).fill("_").map((inboxMessage, idx) => (
                <InboxMessage key={idx} userIsSender={idx%2===0} />
            ))} */}
            {chat.messages.map((message, idx) => {
                return (
                    <InboxMessage 
                        key={idx} 
                        message={message} 
                        ownerIsSender={message.sender === chat.owner.id} 
                        user={user}
                        scrollToBottom={scrollToBottom}
                    />)
            })}
            <div ref={messagesEndRef}></div>
        </div>
    )
}
)
InboxMessagesContainer.propTypes = {
    chat: PropTypes.object.isRequired
}

InboxMessagesContainer.displayName = "InboxMessagesContainer";

export default InboxMessagesContainer;