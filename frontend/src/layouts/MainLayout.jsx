import { Outlet } from "react-router-dom";
import Sidebar from "../components/ui/Sidebar";
import { useEffect, useRef } from 'react';
import { useAuth } from "../context/AuthContext";
import { useChat } from "../context/ChatContext";
import { fetchWithAuth } from "../utils";
import { BASE_URL } from "../constants";

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

                const setMessagesReadStatus = async () => {
                    try {
                        const response = await fetchWithAuth(`${BASE_URL}/chats/${chatId}/set-message-read-status/`, {
                            method: 'POST'
                        }); 

                        if(!response.ok){
                            console.error("Something went wrong with changing messages read status");
                        }else{
                            console.log("Messagses read status updated.");
                        }
                    }catch(err){
                        console.error(err);
                    }   
                }
                
                if(data['type'] === 'new_message'){

                    const incomingMessageChatId = data['chat_id'];

                    // Update position of new message's chat in the chatContainer box.
                    setChats((prevChats) => {
                        // Is incoming message/chat ID in exising chats?
                        if (!prevChats.some((chat) => chat.id === incomingMessageChatId)){

                            // Check if user is in chat inbox when new message arrives
                            if(chatId === incomingMessageChatId){
                                setMessagesReadStatus();

                                return [
                                    {
                                        ...data['chat'],
                                        latest_message: {
                                            ...data['chat']['latest_message'],
                                            is_read: true
                                        }
                                    },
                                    ...prevChats
                                ]
                            }else{
                                return [data['chat'], ...prevChats]
                            };

                        }else{
                            console.log("Received a new message. Resetting chat to show new message obj");
                            const updatedChats = prevChats.filter((chat) => chat.id !== incomingMessageChatId);
                            // Check if user is in chat inbox when new message arrives
                            if(chatId === incomingMessageChatId){
                                setMessagesReadStatus();
                                return [
                                    {
                                        ...data['chat'],
                                        latest_message: {
                                            ...data['chat']['latest_message'],
                                            is_read: true
                                        }
                                    },
                                    ...updatedChats
                                ]
                            }else{
                                return [data['chat'], ...updatedChats]
                            }
                        }
                    });
    
                    // Update Messages in Chat Inbox
                    if(incomingMessageChatId === chatId){
                        setChat((prevChat) => (
                            {
                                ...prevChat,
                                messages: [...prevChat.messages, data['message']]
                            }
                        ))
                    }
                }else if(data['type'] === 'online_status_update'){
                    console.log(data);
                }
            }}

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