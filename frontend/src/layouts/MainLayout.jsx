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
    const { setChat, setChats } = useChat();
    // TODO

    useEffect(() => {
        const openNotifcationConnection = () => {
            notificationSocket.current = new WebSocket(
                `ws://localhost:8000/ws/notifications/${user.id}/`
            );

            notificationSocket.current.onmessage = (event) => {{
                const data = JSON.parse(event.data);
                let chatId = JSON.parse(localStorage.getItem('chatId'));

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
                    console.log("chatID Prop Value -> ", chatId);
                    console.log("IncomingMessageChatID Value -> ", incomingMessageChatId);

                    if (chatId === incomingMessageChatId){
                        console.log("Viewing Currently: ", data['chat'])
                        setMessagesReadStatus().then(() => {
                            setChats((prevChats) => {
                                const updatedChats = prevChats.some((chat) => chat.id === incomingMessageChatId)
                                    ? prevChats.filter((chat) => chat.id !== incomingMessageChatId)
                                    : prevChats;

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
                            });

                            setChat((prevChat) => (
                                {
                                    ...prevChat,
                                    messages: [...prevChat.messages, data['message']]
                                }
                            ));
                        }).catch((error) => {
                            console.log("Failed to update message read status: ", error);
                        });
                    }else{
                        setChats((prevChats) => {
                            return [data['chat'], ...prevChats];
                        });
                    }

                }else if(data['type'] === 'user_came_online'){
                    console.log(data);
                }else if(data['type'] === 'user_went_offline'){
                    console.log(data);
                };
            }}

            notificationSocket.current.onclose = () => {
                console.log("Closing notification socket.");
            }
        };

        if(notificationSocket){
            openNotifcationConnection();
        };

        return () => {
            if (notificationSocket.current) {
                notificationSocket.current.close();
            }
        };

    }, [user])


    return (
        <div className='bg-white h-screen overflow-hidden select-none w-screen flex'>
            <Sidebar />
            <Outlet context={notificationSocket} />
        </div>
    )
}