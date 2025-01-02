import InboxMessage from './InboxMessage';
import PropTypes from 'prop-types';

export default function InboxMessagesContainer({chat}){
    const user = chat.user;

    return (
        <div className='flex flex-col p-4 gap-y-3.5 overflow-y-scroll mb-2 h-full w-full overflow-x-hidden'>
            {/* {Array(9).fill("_").map((inboxMessage, idx) => (
                <InboxMessage key={idx} userIsSender={idx%2===0} />
            ))} */}
            {chat.messages.map((message, idx) => {
                return <InboxMessage key={idx} message={message} ownerIsSender={message.sender === chat.owner.id} user={user} />
            })}
        </div>
    )
}

InboxMessagesContainer.propTypes = {
    chat: PropTypes.object.isRequired
}