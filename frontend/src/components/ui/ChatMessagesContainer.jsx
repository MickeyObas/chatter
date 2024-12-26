import ChatMessage from './ChatMessage';

export default function ChatMessagesContainer(){
    return (
        <div className='messages-container flex flex-col h-[65%] overflow-y-scroll gap-y-3.5 pr-2'>
            {Array(7).fill("_").map((chatmessage, idx) => (
                <ChatMessage key={idx}/>
            ))}           
        </div>
    )
}