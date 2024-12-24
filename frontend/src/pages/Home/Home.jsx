import Sidebar from '../../components/ui/Sidebar';
import ChatMessagesSection from '../../components/ui/ChatMessagesSection';
import InboxMessageSection from '../../components/ui/InboxMessageSection';

export default function Home(){
    return (
        <div className='w-[80%] flex'>
            <ChatMessagesSection />
            <InboxMessageSection />
        </div>
    )
}