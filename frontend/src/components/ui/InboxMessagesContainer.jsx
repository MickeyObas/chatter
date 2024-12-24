import InboxMessage from './InboxMessage';

export default function InboxMessagesContainer(){
    return (
        <div className='flex flex-col p-4 gap-y-3.5 overflow-y-scroll mb-2'>
            {Array(9).fill("_").map((inboxMessage, idx) => (
                <InboxMessage key={idx} userIsSender={idx%2===0} />
            ))}
        </div>
    )
}