import { Outlet } from "react-router-dom";
import Sidebar from "../components/ui/Sidebar";
import { useEffect, useRef } from 'react';
import { useAuth } from "../context/AuthContext";
import { useChat } from "../context/ChatContext";

export default function MainLayout(){
    // Connect to webssocket on login 
    const notificationSocket = useRef(null);
    const { user } = useAuth();
    const { chatId, setChat, setChats } = useChat();

    useEffect(() => {
        const openNotifcationConnection = () => {
            notificationSocket.current = new WebSocket(
                `ws://localhost:8000/ws/notifications/${user.id}/`
            );

            notificationSocket.current.onmessage = (event) => {{
                const data = JSON.parse(event.data);
                console.log("Notification received: ", data['chat']);

                const incomingMessageChatId = data['chat_id'];

                // Update position of new message's chat in the chatContainer box.
                setChats((prevChats) => {
                    // Is incoming message/chat ID in exising chats?
                    if (!prevChats.some((chat) => chat.id === incomingMessageChatId)){
                        return [...prevChats, data['chat']]
                    }else{
                        console.log("Received a new message. Resetting chat to show new message obj");
                        const updatedChats = prevChats.filter((chat) => chat.id !== incomingMessageChatId);
                        return [data['chat'], ...updatedChats]
                    }
                });

                // User is currently viewing new message's chat
                if(incomingMessageChatId === chatId){
                    setChat((prevChat) => (
                        {
                            ...prevChat,
                            messages: [...prevChat.messages, data['message']]
                        }
                    ))
                    }}
                }


            notificationSocket.current.onclose = () => {
                console.log("Closing notification socket.");
            }
        };

        if(notificationSocket){
            openNotifcationConnection();
        }

    }, [])


    return (
        <div className='bg-white h-screen overflow-hidden select-none w-screen flex'>
            <Sidebar />
            <Outlet context={notificationSocket} />
        </div>
    )
}