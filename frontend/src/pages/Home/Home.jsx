import Sidebar from '../../components/ui/Sidebar';
import ChatMessagesSection from '../../components/ui/ChatMessagesSection';
import InboxMessageSection from '../../components/ui/InboxMessageSection';
import { useEffect, useState } from 'react';
import { BASE_URL } from '../../constants';
import { useOutletContext  } from 'react-router-dom';

export default function Home(){

    // Connect to notifications websocket
    return (
        <div className='w-[80%] flex'>
            <ChatMessagesSection />
            <InboxMessageSection />
        </div>
    )
}