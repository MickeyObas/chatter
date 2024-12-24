import InboxMessagesContainer from './InboxMessagesContainer';
import InboxMessageTextbox from './InboxMessageTextbox';
import InboxHeader from './InboxHeader';


export default function InboxMessageSection(){
    return (
        <div className='h-screen pt-1 pb-4 w-[68%]'>
            <div className='flex flex-col h-full'>
                {/* Header */}
                <InboxHeader />
                {/* Chat Container */}
                <InboxMessagesContainer />
                {/* Chat Textbox */}
                <InboxMessageTextbox />
            </div>
        </div>
    )
}