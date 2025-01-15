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
    const { setChat, setChats, setGroupChats } = useChat();
    // TODO

    useEffect(() => {
        if(!user) return;
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

                    if (chatId === incomingMessageChatId){
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
                    let hi = "";
                    // PATCH request to update USER status
                }else if(data['type'] === 'user_went_offline'){
                    let hii = "ok";
                }else if(data['type'] == 'groupchat_message'){
                    setGroupChats((prev) => {
                        const updatedChats = prev.some((chat) => chat.id === data.groupchat_id)
                          ? prev.filter((chat) => chat.id !== data.groupchat_id)
                          : prev;
            
            
                          return [
                            data.groupchat,
                            ...updatedChats
                          ]
                      })
                }
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

    }, [user?.id])


    return (
        <div className='bg-white h-screen overflow-hidden select-none w-screen flex'>
            <Sidebar />
            <Outlet context={notificationSocket} />
        </div>
    )
}