import { createContext, useEffect, useContext, useState } from "react"; 
import { fetchWithAuth } from "../utils";
import { BASE_URL } from "../constants";

const ChatContext = createContext();

export function ChatProvider({ children }){
    const [chatId, setChatId] = useState(
        localStorage.getItem('chatId') ? JSON.parse(localStorage.getItem('chatId')) : null
    );
    const [chat, setChat] = useState(
        localStorage.getItem('chat') ? JSON.parse(localStorage.getItem('chat')) : null
    );
    const [loading, setLoading] = useState(true);
    const [chats, setChats] = useState([]);

    useEffect(() => {
        if(!chatId) return;

        const fetchChat = async () => {
            try{
                const response = await fetchWithAuth(`${BASE_URL}/chats/${chatId}/`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if(!response.ok){
                    console.log("Couldn't fetch chat");
                }else{
                    const data = await response.json();
                    setChat(data);
                    localStorage.setItem('chat', JSON.stringify(data));
                }

            } catch(err){
                console.log(err);
            } finally {
                setLoading(false);
            }
        };

        fetchChat();

    }, [chatId]);

    useEffect(() => {
        const getChats = async () => {
            try {
                const response = await fetchWithAuth(`${BASE_URL}/chats/`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if(!response.ok){
                    console.log("Could not fetch chats.");
                }else{
                    const data = await response.json();
                    setChats(data);
                    console.log("Chatssssss, ", data)
                }

            } catch (err){
                console.log(err);
            } finally {
                setLoading(false);
            };
        };

        getChats();

    }, [chats.length]);

    return (
        <ChatContext.Provider value={{chatId, setChatId, chat, setChat, chats, setChats}}>
            {children}
        </ChatContext.Provider>
    )
};

export const useChat = () => useContext(ChatContext);